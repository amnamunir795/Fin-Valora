import mongoose from 'mongoose';
import Budget from '../../models/Budget';
import Category from '../../models/Category';
import Transaction from '../../models/Transaction';

function toObjectId(userId) {
  if (!userId) return null;
  const s = String(userId);
  if (!mongoose.Types.ObjectId.isValid(s)) return null;
  return new mongoose.Types.ObjectId(s);
}

function aggregateTransactions(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeByCategory = {};
  const expenseByCategory = {};

  for (const t of transactions) {
    const amt = Number(t.amount);
    if (Number.isNaN(amt)) continue;
    const name = t.categoryId?.name || 'Uncategorized';
    if (t.type === 'Income') {
      totalIncome += amt;
      incomeByCategory[name] = (incomeByCategory[name] || 0) + amt;
    } else if (t.type === 'Expense') {
      totalExpenses += amt;
      expenseByCategory[name] = (expenseByCategory[name] || 0) + amt;
    }
  }

  const netSavings = totalIncome - totalExpenses;
  const incomeRows = Object.entries(incomeByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));
  const expenseRows = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name, value }));

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    incomeByCategory: incomeRows,
    expenseByCategory: expenseRows,
    topExpenseCategories: expenseRows.slice(0, 10),
  };
}

export async function toolGetCurrentBudget(userId) {
  const id = toObjectId(userId);
  if (!id) return { ok: false, error: 'Invalid user' };

  const b = await Budget.findCurrentBudget(id);
  if (!b) {
    return {
      ok: false,
      message: 'No active budget found for the current calendar month',
    };
  }

  return {
    ok: true,
    budget: {
      ...b.getSummary(),
      budgetMonth: b.budgetMonth,
      budgetYear: b.budgetYear,
    },
  };
}

export async function toolListCategories(userId, { type } = {}) {
  const id = toObjectId(userId);
  if (!id) return { ok: false, error: 'Invalid user' };

  let categories;
  if (type && ['Income', 'Expense'].includes(type)) {
    categories = await Category.findByType(id, type);
  } else {
    categories = await Category.findUserCategories(id);
  }

  return {
    ok: true,
    categories: categories.map((c) => c.getSummary()),
  };
}

const MAX_TX_LIMIT = 100;
const MAX_REPORT_TX = 2000;

export async function toolQueryTransactions(userId, args) {
  const id = toObjectId(userId);
  if (!id) return { ok: false, error: 'Invalid user' };

  const { startDate, endDate, type, limit = 50 } = args || {};
  if (!startDate || !endDate) {
    return { ok: false, error: 'startDate and endDate are required (ISO date strings)' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: 'Invalid startDate or endDate' };
  }

  let lim = parseInt(String(limit), 10);
  if (Number.isNaN(lim) || lim < 1) lim = 50;
  lim = Math.min(lim, MAX_TX_LIMIT);

  const query = {
    userId: id,
    date: { $gte: start, $lte: end },
  };
  if (type && ['Income', 'Expense'].includes(type)) {
    query.type = type;
  }

  const rows = await Transaction.find(query)
    .populate('categoryId', 'name type color')
    .sort({ date: -1 })
    .limit(lim);

  return {
    ok: true,
    count: rows.length,
    limit: lim,
    transactions: rows.map((t) => ({
      id: t._id,
      amount: t.amount,
      description: t.description,
      type: t.type,
      date: t.date,
      currency: t.currency,
      category: t.categoryId
        ? { name: t.categoryId.name, type: t.categoryId.type }
        : null,
    })),
  };
}

export async function toolGetPeriodReport(userId, args) {
  const id = toObjectId(userId);
  if (!id) return { ok: false, error: 'Invalid user' };

  const { startDate, endDate } = args || {};
  if (!startDate || !endDate) {
    return { ok: false, error: 'startDate and endDate are required (ISO date strings)' };
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return { ok: false, error: 'Invalid startDate or endDate' };
  }

  const rows = await Transaction.find({
    userId: id,
    date: { $gte: start, $lte: end },
  })
    .populate('categoryId', 'name type')
    .sort({ date: -1 })
    .limit(MAX_REPORT_TX);

  const agg = aggregateTransactions(rows);
  return {
    ok: true,
    transactionCountIncluded: rows.length,
    cappedAt: MAX_REPORT_TX,
    period: { startDate: start.toISOString(), endDate: end.toISOString() },
    ...agg,
  };
}

export async function runFinvaloraTool(userId, name, rawArgs) {
  let args = {};
  if (rawArgs && typeof rawArgs === 'string') {
    try {
      args = JSON.parse(rawArgs || '{}');
    } catch {
      return { ok: false, error: 'Invalid tool arguments JSON' };
    }
  } else if (rawArgs && typeof rawArgs === 'object') {
    args = rawArgs;
  }

  switch (name) {
    case 'get_current_budget':
      return toolGetCurrentBudget(userId);
    case 'list_categories':
      return toolListCategories(userId, args);
    case 'query_transactions':
      return toolQueryTransactions(userId, args);
    case 'get_period_report':
      return toolGetPeriodReport(userId, args);
    default:
      return { ok: false, error: `Unknown tool: ${name}` };
  }
}
