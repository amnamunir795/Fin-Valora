import OpenAI from 'openai';
import connectDB from '../../../lib/mongodb';
import { verifyRequestAuth } from '../../../middleware/auth';
import { runFinvaloraTool } from '../../../lib/ai/tools';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '256kb',
    },
  },
};

const MAX_MESSAGES = 40;
const MAX_CONTENT_LEN = 4000;
const MAX_TOOL_ROUNDS = 5;
const DEFAULT_MODEL = 'gpt-4o-mini';

const TOOLS = [
  {
    type: 'function',
    function: {
      name: 'get_current_budget',
      description:
        'Get the signed-in user active budget for the current calendar month: income limit, spending limit, amount spent so far, savings goal, progress, currency.',
      parameters: { type: 'object', properties: {} },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_categories',
      description:
        'List the user income and/or expense categories (names, types, ids).',
      parameters: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: ['Income', 'Expense'],
            description: 'If set, only categories of this type; omit for all.',
          },
        },
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'query_transactions',
      description:
        'List transactions in a date range with optional Income/Expense filter. Use for detailed line items.',
      parameters: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Range start as ISO 8601 date/datetime',
          },
          endDate: {
            type: 'string',
            description: 'Range end as ISO 8601 date/datetime',
          },
          type: {
            type: 'string',
            enum: ['Income', 'Expense'],
            description: 'Optional filter by transaction type',
          },
          limit: {
            type: 'integer',
            description: 'Max rows (capped at 100 server-side)',
          },
        },
        required: ['startDate', 'endDate'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_period_report',
      description:
        'Aggregated report for a date range: total income, total expenses, net, and breakdown by category (like the Reports page).',
      parameters: {
        type: 'object',
        properties: {
          startDate: {
            type: 'string',
            description: 'Range start as ISO 8601 date/datetime',
          },
          endDate: {
            type: 'string',
            description: 'Range end as ISO 8601 date/datetime',
          },
        },
        required: ['startDate', 'endDate'],
      },
    },
  },
];

function buildSystemPrompt(user) {
  const today = new Date().toISOString().split('T')[0];
  const currency = user.currency || 'USD';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || 'there';
  return `You are FinValora AI, a concise assistant for personal budgeting in the FinValora app.
Use the tools to load real data: categories, transactions, the current-month budget, and period summaries. Never invent amounts, counts, or category names—only state what tools return.
User: ${name}. Preferred currency code for labels: ${currency}.
Reference date (UTC): ${today}.

You summarize and explain their data clearly. You are not a financial advisor; do not give investment, tax, or legal advice.`;
}

function sanitizeMessages(raw) {
  if (!Array.isArray(raw)) return [];
  const out = [];
  for (const m of raw) {
    if (!m || typeof m !== 'object') continue;
    const role = m.role;
    if (role !== 'user' && role !== 'assistant') continue;
    let content = m.content;
    if (typeof content !== 'string') content = String(content ?? '');
    if (content.length > MAX_CONTENT_LEN) {
      content = content.slice(0, MAX_CONTENT_LEN);
    }
    out.push({ role, content });
  }
  return out.slice(-MAX_MESSAGES);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  await connectDB();

  const authResult = await verifyRequestAuth(req);
  if (!authResult.success) {
    return res.status(401).json({ success: false, message: authResult.message });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(503).json({
      success: false,
      message:
        'AI chat is not configured. Set OPENAI_API_KEY on the server (e.g. in .env.local).',
    });
  }

  const { messages: rawMessages } = req.body || {};
  const messages = sanitizeMessages(rawMessages);
  if (messages.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'messages array with at least one user or assistant entry is required',
    });
  }

  const user = authResult.user;
  const userId = user.id;
  const systemPrompt = buildSystemPrompt(user);

  const openai = new OpenAI({
    apiKey,
    baseURL: process.env.OPENAI_BASE_URL || undefined,
  });
  const model = process.env.OPENAI_MODEL || DEFAULT_MODEL;

  const chatMessages = [
    { role: 'system', content: systemPrompt },
    ...messages,
  ];

  try {
    let round = 0;
    while (round < MAX_TOOL_ROUNDS) {
      round += 1;
      const completion = await openai.chat.completions.create({
        model,
        messages: chatMessages,
        tools: TOOLS,
        tool_choice: 'auto',
        extra_body: {
          thinking: { type: 'disabled' },
        },
      });

      const choice = completion.choices[0];
      if (!choice) {
        return res.status(502).json({
          success: false,
          message: 'No response from the language model',
        });
      }

      const msg = choice.message;

      if (msg.tool_calls && msg.tool_calls.length > 0) {
        chatMessages.push({
          role: 'assistant',
          content: msg.content ?? null,
          tool_calls: msg.tool_calls,
        });

        for (const tc of msg.tool_calls) {
          const fn = tc.function;
          const name = fn?.name;
          let args = {};
          try {
            args = fn?.arguments ? JSON.parse(fn.arguments) : {};
          } catch {
            args = {};
          }
          const result = await runFinvaloraTool(userId, name, args);
          chatMessages.push({
            role: 'tool',
            tool_call_id: tc.id,
            content: JSON.stringify(result),
          });
        }
        continue;
      }

      const reply =
        typeof msg.content === 'string' ? msg.content : msg.content ?? '';
      return res.status(200).json({
        success: true,
        reply: reply.trim() || 'I could not generate a reply. Try rephrasing your question.',
      });
    }

    return res.status(502).json({
      success: false,
      message: 'Too many tool rounds; try a simpler question.',
    });
  } catch (err) {
    console.error('OpenAI chat error:', err);
    const msg =
      err?.message ||
      (typeof err === 'string' ? err : 'The AI service failed. Try again later.');
    return res.status(502).json({ success: false, message: msg });
  }
}
