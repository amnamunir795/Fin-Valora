import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { authenticatedFetch } from "../../utils/auth";
import AppSidebar from "../../components/AppSidebar";

const SUGGESTION_PROMPTS = [
  "What expense categories do I have?",
  "Summarize my spending this month.",
  "What is my current budget status?",
  "Show my recent income transactions.",
];

function SendIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M22 2L11 13" />
      <path d="M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

function SparkleIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2l1.09 3.26L16.36 6.5l-3.27 1.24L12 11l-1.09-3.26L7.64 6.5l3.27-1.24L12 2zm0 13l1.09 3.26 3.27 1.24-3.27 1.24L12 22l-1.09-3.26-3.27-1.24 3.27-1.24L12 15z" />
    </svg>
  );
}

export default function AiChat() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const listEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authenticatedFetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) router.push("/login");
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const scrollToBottom = useCallback(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || sending) return;

    setError("");
    const userMsg = { role: "user", content: text };
    const historyForApi = [...messages, userMsg];
    setMessages(historyForApi);
    setInput("");
    setSending(true);

    try {
      const res = await authenticatedFetch("/api/ai/chat", {
        method: "POST",
        body: JSON.stringify({ messages: historyForApi }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.message || "Something went wrong. Try again.");
        return;
      }

      if (data.success && typeof data.reply === "string") {
        setMessages([...historyForApi, { role: "assistant", content: data.reply }]);
      } else {
        setError(data.message || "Unexpected response from the assistant.");
      }
    } catch {
      setError("Network error. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const applySuggestion = (text) => {
    setInput(text);
    textareaRef.current?.focus();
  };

  const userInitial =
    user?.email && typeof user.email === "string"
      ? user.email.trim().charAt(0).toUpperCase() || "?"
      : "?";

  if (userLoading) {
    return (
      <div className="min-h-screen bg-mist flex flex-col items-center justify-center gap-4">
        <div
          className="h-11 w-11 rounded-full border-2 border-teal/30 border-t-teal animate-spin"
          aria-hidden
        />
        <p className="text-sm text-ink-secondary">Loading assistant…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-linear-to-br from-mist via-surface to-teal-soft/50">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-h-screen min-w-0">
        <header className="fv-app-page-header px-6 py-5 shrink-0">
          <div className="max-w-4xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-1.5">
                Assistant
              </p>
              <h1 className="font-display text-3xl font-semibold text-white tracking-tight">
                FinValora AI
              </h1>
              <p className="text-sm text-white/85 mt-1.5 max-w-xl leading-relaxed">
                Ask about categories, income, expenses, budget, and reports—answers use your
                signed-in data.
              </p>
            </div>
            <span className="inline-flex items-center self-start rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-medium text-white/95 backdrop-blur-sm">
              Private to your account
            </span>
          </div>
        </header>

        <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 min-h-0">
          <div
            className="flex flex-col flex-1 min-h-[min(70vh,640px)] max-w-4xl w-full mx-auto overflow-hidden rounded-2xl border border-lavender/35 bg-surface shadow-(--shadow-fv-lg) ring-1 ring-forest/4"
            role="region"
            aria-label="Chat with FinValora AI"
          >
            <div className="px-4 py-3 sm:px-5 border-b border-border-subtle bg-teal-soft/50 flex gap-3 items-start">
              <span className="mt-0.5 shrink-0 text-forest/80" aria-hidden>
                <SparkleIcon className="h-4 w-4" />
              </span>
              <p className="text-xs text-ink-secondary leading-relaxed">
                <span className="font-medium text-forest">Notice.</span> AI outputs are informational
                summaries from your FinValora data, not financial advice.
                {user?.currency ? (
                  <span className="text-forest"> Currency: {user.currency}.</span>
                ) : null}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 space-y-6 bg-linear-to-b from-mist/40 to-transparent">
              {messages.length === 0 && (
                <div className="rounded-2xl border border-lavender/40 bg-linear-to-br from-surface to-teal-soft/30 p-6 sm:p-8 shadow-(--shadow-fv-xs)">
                  <h2 className="font-display text-xl font-semibold text-void mb-1">
                    Start a conversation
                  </h2>
                  <p className="text-sm text-ink-secondary mb-5 max-w-md">
                    Choose a prompt below or type your own question. Press{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-mist text-void text-xs font-mono border border-border-subtle">
                      Enter
                    </kbd>{" "}
                    to send;{" "}
                    <kbd className="px-1.5 py-0.5 rounded bg-mist text-void text-xs font-mono border border-border-subtle">
                      Shift+Enter
                    </kbd>{" "}
                    for a new line.
                  </p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-muted mb-3">
                    Suggested prompts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTION_PROMPTS.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        onClick={() => applySuggestion(prompt)}
                        className="text-left text-sm px-4 py-2.5 rounded-xl border border-lavender/50 bg-surface text-forest hover:border-teal hover:bg-teal-soft/60 hover:shadow-(--shadow-fv-xs) transition-all duration-200 max-w-full sm:max-w-[calc(50%-0.25rem)]"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse justify-start" : "justify-start"}`}
                >
                  <div
                    className={`shrink-0 h-9 w-9 rounded-full flex items-center justify-center text-xs font-semibold shadow-(--shadow-fv-xs) ${
                      m.role === "user"
                        ? "bg-linear-to-br from-teal to-forest text-white"
                        : "bg-forest text-teal border border-teal/30"
                    }`}
                    aria-hidden
                  >
                    {m.role === "user" ? userInitial : "FV"}
                  </div>
                  <div
                    className={`min-w-0 max-w-[min(100%,36rem)] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-linear-to-br from-teal to-forest text-white rounded-tr-md shadow-(--shadow-fv-sm)"
                        : "bg-surface border border-border-subtle text-void rounded-tl-md shadow-(--shadow-fv-xs)"
                    }`}
                  >
                    <p className="whitespace-pre-wrap wrap-break-word">{m.content}</p>
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex gap-3 justify-start">
                  <div
                    className="shrink-0 h-9 w-9 rounded-full bg-forest text-teal border border-teal/30 flex items-center justify-center text-xs font-semibold shadow-(--shadow-fv-xs)"
                    aria-hidden
                  >
                    FV
                  </div>
                  <div
                    className="rounded-2xl rounded-tl-md px-4 py-3 bg-surface border border-border-subtle shadow-(--shadow-fv-xs) flex items-center gap-3"
                    aria-live="polite"
                    aria-busy="true"
                  >
                    <span className="text-sm text-ink-secondary">Thinking</span>
                    <span className="flex gap-1" aria-hidden>
                      <span className="h-1.5 w-1.5 rounded-full bg-teal animate-bounce [animation-duration:0.7s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-teal animate-bounce [animation-duration:0.7s] [animation-delay:0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-teal animate-bounce [animation-duration:0.7s] [animation-delay:0.3s]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={listEndRef} />
            </div>

            {error && (
              <div className="px-4 sm:px-5 pb-2" role="alert" aria-live="assertive">
                <p className="text-sm text-error bg-red-50 border border-red-100/80 rounded-xl px-4 py-3">
                  {error}
                </p>
              </div>
            )}

            <div className="p-4 sm:p-5 border-t border-border-subtle bg-mist/30">
              <div className="flex gap-2 items-end rounded-2xl border border-lavender/45 bg-surface pl-4 pr-2 py-2 shadow-(--shadow-fv-xs) focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/25 transition-[border-color,box-shadow] duration-200">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Message FinValora AI…"
                  rows={2}
                  disabled={sending}
                  className="flex-1 resize-none border-0 bg-transparent py-2.5 text-void placeholder:text-ink-muted focus:ring-0 text-[15px] leading-relaxed disabled:opacity-60 min-h-[44px] max-h-40"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={sending || !input.trim()}
                  className="shrink-0 h-11 w-11 rounded-xl bg-linear-to-br from-teal to-forest text-white flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-(--shadow-fv-sm) disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                  aria-label={sending ? "Sending message" : "Send message"}
                >
                  <SendIcon className="h-5 w-5 -translate-x-px translate-y-px" />
                </button>
              </div>
              <p className="text-[11px] text-ink-muted mt-2.5 text-center sm:text-left">
                FinValora AI may make mistakes. Verify important figures in your dashboard.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
