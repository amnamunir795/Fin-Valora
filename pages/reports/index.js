import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';
import { formatCurrencyAmount } from '../../utils/formatMoney';

function toYmd(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function currentMonthBounds() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startDate: toYmd(start), endDate: toYmd(end) };
}

function aggregateTransactions(transactions) {
  let totalIncome = 0;
  let totalExpenses = 0;
  const incomeByCategory = {};
  const expenseByCategory = {};

  for (const t of transactions) {
    const amt = Number(t.amount);
    if (Number.isNaN(amt)) continue;
    const name = t.category?.name || 'Uncategorized';
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
    .map(([name, v]) => ({ name, value: v }));
  const expenseRows = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([name, v]) => ({ name, value: v }));
  const topExpenseRows = expenseRows.slice(0, 10);

  return {
    totalIncome,
    totalExpenses,
    netSavings,
    incomeRows,
    expenseRows,
    topExpenseRows,
  };
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  );
}

function DownloadIcon({ className }) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function BreakdownList({ rows, formatAmount, maxBar, barClass }) {
  if (!rows.length) {
    return (
      <div className="rounded-xl border border-dashed border-lavender/50 bg-mist/40 px-4 py-10 text-center">
        <p className="text-sm text-ink-secondary">No transactions in this period for this breakdown.</p>
      </div>
    );
  }
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.name}>
          <div className="flex justify-between gap-3 text-sm mb-1">
            <span className="font-medium text-void truncate min-w-0">{r.name}</span>
            <span className="tabular-nums font-semibold text-ink-secondary shrink-0">{formatAmount(r.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-mist overflow-hidden">
            <div
              className={`h-full rounded-full transition-[width] duration-300 ${barClass}`}
              style={{ width: `${Math.min(100, (r.value / maxBar) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [reportLoading, setReportLoading] = useState(false);
  const [error, setError] = useState('');
  const [reportSuccess, setReportSuccess] = useState(false);

  const currencyCode = user?.currency || 'PKR';

  useEffect(() => {
    const b = currentMonthBounds();
    setStartDate(b.startDate);
    setEndDate(b.endDate);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await authenticatedFetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (!cancelled) setUser(data.user);
      } catch {
        if (!cancelled) router.push('/login');
      } finally {
        if (!cancelled) setUserLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const formatAmount = useCallback(
    (value) => formatCurrencyAmount(value, currencyCode),
    [currencyCode],
  );

  const derived = useMemo(() => aggregateTransactions(transactions), [transactions]);

  const maxIncomeBar = useMemo(
    () => Math.max(...derived.incomeRows.map((r) => r.value), 1),
    [derived.incomeRows],
  );
  const maxExpenseBar = useMemo(
    () => Math.max(...derived.expenseRows.map((r) => r.value), 1),
    [derived.expenseRows],
  );
  const maxTopExpenseBar = useMemo(
    () => Math.max(...derived.topExpenseRows.map((r) => r.value), 1),
    [derived.topExpenseRows],
  );

  const datesValid = Boolean(startDate && endDate) && startDate <= endDate;

  const handleGenerate = async () => {
    if (!datesValid) return;
    setError('');
    setReportSuccess(false);
    setReportLoading(true);
    try {
      const qs = new URLSearchParams({
        startDate,
        endDate,
        limit: '500',
        page: '1',
      });
      const res = await authenticatedFetch(`/api/transactions?${qs.toString()}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.message || 'Failed to load transactions');
        setTransactions([]);
        return;
      }
      setTransactions(data.transactions || []);
      setReportSuccess(true);
    } catch {
      setError('Network error');
      setTransactions([]);
    } finally {
      setReportLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!reportSuccess || !user) return;
    const { exportReportPdf } = await import('../../utils/reportPdf');
    const periodLabel = `${startDate} – ${endDate}`;
    const userName =
      user.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ').trim() || user.email || '';

    const summaryBody = [
      ['Total Income', formatAmount(derived.totalIncome)],
      ['Total Expenses', formatAmount(derived.totalExpenses)],
      ['Net Savings', formatAmount(derived.netSavings)],
    ];
    const cashFlowBody = [
      ['Inflow (Income)', formatAmount(derived.totalIncome)],
      ['Outflow (Expenses)', formatAmount(derived.totalExpenses)],
      ['Net Flow', formatAmount(derived.netSavings)],
    ];
    const tables = [
      { title: 'Income by Source', body: derived.incomeRows.map((r) => [r.name, formatAmount(r.value)]) },
      { title: 'Expenses by Category', body: derived.expenseRows.map((r) => [r.name, formatAmount(r.value)]) },
      { title: 'Top Expense Categories', body: derived.topExpenseRows.map((r) => [r.name, formatAmount(r.value)]) },
    ];
    const dayStamp = new Date().toISOString().slice(0, 10);
    exportReportPdf({
      title: 'FinValora Finance Report',
      periodLabel,
      userName,
      summaryBody,
      cashFlowBody,
      tables,
      filename: `finvalora-report-${dayStamp}.pdf`,
    });
  };

  const dateInputClass =
    'w-full pl-11 pr-3 py-3 rounded-xl border border-lavender/70 bg-surface text-void text-sm shadow-(--shadow-fv-xs) transition-all hover:border-teal/50 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/25';

  if (userLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/40 flex flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 rounded-full border-2 border-teal/30 border-t-teal animate-spin" aria-hidden />
        <p className="text-sm text-ink-secondary">Loading reports…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-x-auto">
        <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-1">Analytics</p>
              <h1 className="font-display text-3xl font-semibold text-white tracking-tight">Reports</h1>
              <p className="text-sm text-white/80 mt-1.5 max-w-2xl leading-relaxed">
                Summarize income and expenses for any date range. Export a PDF for your records.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="report-filters-panel"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-sm font-semibold text-white shadow-(--shadow-fv-sm) transition-all hover:bg-teal/25 hover:border-teal/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              <CalendarIcon className="w-4 h-4 opacity-90" />
              {filtersOpen ? 'Hide date range' : 'Date range & generate'}
            </button>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          <div aria-live="polite" className="sr-only">
            {reportSuccess ? 'Report loaded' : ''}
          </div>

          {error ? (
            <div
              className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-error shadow-(--shadow-fv-xs)"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          {filtersOpen ? (
            <section
              id="report-filters-panel"
              role="region"
              aria-label="Report date filters"
              className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">Period</p>
                  <h2 className="font-display text-xl font-semibold text-void mt-0.5">Choose dates</h2>
                  <p className="text-sm text-ink-secondary mt-1">We include all transactions between these dates (up to 500 loaded).</p>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-5 flex-1">
                  <div className="flex flex-col gap-2 min-w-[200px] flex-1 sm:max-w-xs">
                    <label htmlFor="report-start-date" className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                      Start date
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-teal/70 pointer-events-none" aria-hidden>
                        <CalendarIcon className="w-5 h-5" />
                      </span>
                      <input
                        id="report-start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={dateInputClass}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 min-w-[200px] flex-1 sm:max-w-xs">
                    <label htmlFor="report-end-date" className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">
                      End date
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3.5 text-teal/70 pointer-events-none" aria-hidden>
                        <CalendarIcon className="w-5 h-5" />
                      </span>
                      <input
                        id="report-end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={dateInputClass}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-stretch lg:justify-end lg:shrink-0">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!datesValid || reportLoading}
                    title={!datesValid ? 'Set start and end dates first' : undefined}
                    className="w-full lg:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-linear-to-br from-teal to-forest text-white text-sm font-semibold shadow-(--shadow-fv-sm) hover:from-forest hover:to-void disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 transition-all duration-200"
                  >
                    {reportLoading ? 'Generating…' : 'Generate report'}
                  </button>
                </div>
              </div>
              {!datesValid && startDate && endDate ? (
                <p className="text-sm text-error mt-4">End date must be on or after start date.</p>
              ) : null}
            </section>
          ) : (
            <div className="rounded-2xl border border-dashed border-lavender/60 bg-teal-soft/20 px-5 py-6 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-4">
              <p className="text-sm text-ink-secondary">
                <span className="font-medium text-forest">Date range is hidden.</span> Open filters to change period or run a new report.
              </p>
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="mt-3 sm:mt-0 shrink-0 rounded-xl border border-lavender bg-surface px-4 py-2.5 text-sm font-semibold text-forest hover:bg-teal-soft/50 transition-colors"
              >
                Show filters
              </button>
            </div>
          )}

          {reportLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-label="Loading report">
              <div className="h-10 w-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin" />
              <p className="text-sm text-ink-secondary">Building your report…</p>
            </div>
          ) : null}

          {reportSuccess && !reportLoading ? (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-lavender/35 bg-linear-to-r from-mist/50 to-teal-soft/20 px-5 py-4 ring-1 ring-forest/4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Active period</p>
                  <p className="font-medium text-void tabular-nums mt-0.5">
                    {startDate} <span className="text-ink-muted">→</span> {endDate}
                  </p>
                  <p className="text-xs text-ink-secondary mt-1">
                    {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'} in range
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-teal to-forest px-5 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) hover:from-forest hover:to-void focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 transition-all shrink-0"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              <section aria-label="Summary totals" className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <article className="rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow hover:shadow-(--shadow-fv-md)">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Income</p>
                    <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-[10px] font-semibold text-forest">Inflow</span>
                  </div>
                  <p className="font-display text-3xl font-semibold tabular-nums text-teal">{formatAmount(derived.totalIncome)}</p>
                </article>
                <article className="rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow hover:shadow-(--shadow-fv-md)">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Expenses</p>
                    <span className="rounded-full bg-mist px-2.5 py-0.5 text-[10px] font-semibold text-void">Outflow</span>
                  </div>
                  <p className="font-display text-3xl font-semibold tabular-nums text-void">{formatAmount(derived.totalExpenses)}</p>
                </article>
                <article className="rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow hover:shadow-(--shadow-fv-md)">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Net</p>
                    <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[10px] font-semibold text-forest">Balance</span>
                  </div>
                  <p
                    className={`font-display text-3xl font-semibold tabular-nums ${
                      derived.netSavings >= 0 ? 'text-teal' : 'text-error'
                    }`}
                  >
                    {formatAmount(derived.netSavings)}
                  </p>
                </article>
              </section>

              <section
                className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4"
                aria-labelledby="heading-income-source"
              >
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Breakdown</p>
                    <h2 id="heading-income-source" className="font-display text-xl font-semibold text-void mt-0.5">
                      Income by source
                    </h2>
                    <p className="text-sm text-ink-secondary mt-1">Totals by category for the selected period.</p>
                  </div>
                </div>
                <BreakdownList
                  rows={derived.incomeRows}
                  formatAmount={formatAmount}
                  maxBar={maxIncomeBar}
                  barClass="bg-linear-to-r from-teal to-forest"
                />
              </section>

              <section
                className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4"
                aria-labelledby="heading-expenses-cat"
              >
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Breakdown</p>
                  <h2 id="heading-expenses-cat" className="font-display text-xl font-semibold text-void mt-0.5">
                    Expenses by category
                  </h2>
                  <p className="text-sm text-ink-secondary mt-1">Full list sorted by amount.</p>
                </div>
                <BreakdownList
                  rows={derived.expenseRows}
                  formatAmount={formatAmount}
                  maxBar={maxExpenseBar}
                  barClass="bg-linear-to-r from-void/80 to-forest/90"
                />
              </section>

              <section
                className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4"
                aria-labelledby="heading-top-expense"
              >
                <div className="mb-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Highlight</p>
                  <h2 id="heading-top-expense" className="font-display text-xl font-semibold text-void mt-0.5">
                    Top expense categories
                  </h2>
                  <p className="text-sm text-ink-secondary mt-1">Up to ten largest expense categories.</p>
                </div>
                <BreakdownList
                  rows={derived.topExpenseRows}
                  formatAmount={formatAmount}
                  maxBar={maxTopExpenseBar}
                  barClass="bg-linear-to-r from-teal/90 to-forest"
                />
              </section>

              <section
                aria-labelledby="cash-flow-heading"
                className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4"
              >
                <h2 id="cash-flow-heading" className="font-display text-xl font-semibold text-void mb-1">
                  Cash flow summary
                </h2>
                <p className="text-sm text-ink-secondary mb-6">Quick view of inflow, outflow, and net for this report.</p>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-teal-soft/40 border border-border-subtle">
                    <span className="text-sm font-semibold text-forest">Inflow (income)</span>
                    <span className="text-base font-display font-semibold tabular-nums text-teal">{formatAmount(derived.totalIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-mist/80 border border-border-subtle">
                    <span className="text-sm font-semibold text-void">Outflow (expenses)</span>
                    <span className="text-base font-display font-semibold tabular-nums text-void">{formatAmount(derived.totalExpenses)}</span>
                  </div>
                  <div
                    className={`flex items-center justify-between gap-4 px-5 py-4 rounded-xl border-2 ${
                      derived.netSavings >= 0
                        ? 'bg-linear-to-r from-teal-soft/50 to-transparent border-teal/30'
                        : 'bg-red-50/80 border-error/20'
                    }`}
                  >
                    <span className="text-sm font-semibold text-forest">Net flow</span>
                    <span
                      className={`text-base font-display font-semibold tabular-nums ${
                        derived.netSavings >= 0 ? 'text-forest' : 'text-error'
                      }`}
                    >
                      {formatAmount(derived.netSavings)}
                    </span>
                  </div>
                </div>
              </section>
            </>
          ) : null}
        </main>
      </div>
    </div>
  );
}
