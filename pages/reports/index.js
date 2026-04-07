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

export default function ReportsPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
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

  const datesValid =
    Boolean(startDate && endDate) && startDate <= endDate;

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

  if (userLoading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <p className="text-forest">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist flex">
      <AppSidebar />

      <div className="flex-1 min-w-0 overflow-x-auto">
        <div className="bg-gradient-to-r from-surface to-mist/20 shadow-lg border-b border-lavender/40 px-6 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-bold text-void">Report</h1>
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              aria-controls="report-filters-panel"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-teal to-forest text-white text-sm font-semibold shadow-md hover:from-forest hover:to-void focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 transition-all duration-200 w-full sm:w-auto"
            >
              Filter Data
            </button>
          </div>
        </div>

        <main className="p-6 max-w-6xl">
          <div aria-live="polite" className="sr-only">{reportSuccess ? 'Report loaded' : ''}</div>
          {error ? (
            <div
              className="mb-4 rounded-xl border border-lavender/40 bg-surface border-l-4 border-l-teal px-4 py-3 text-sm text-void shadow-sm"
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
              className="mb-8 rounded-xl border border-lavender/40 bg-surface p-4 sm:p-5 shadow-sm"
            >
              <p className="text-sm text-forest mb-4">Choose a start and end date, then generate the report.</p>
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 flex-1">
                  <div className="flex flex-col gap-1.5 min-w-[200px]">
                    <label htmlFor="report-start-date" className="text-xs font-semibold text-forest uppercase tracking-wide">
                      Start date
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-teal/60 pointer-events-none" aria-hidden>
                        <CalendarIcon className="w-5 h-5" />
                      </span>
                      <input
                        id="report-start-date"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full pl-11 pr-3 py-2.5 rounded-lg border border-lavender bg-white text-void text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 min-w-[200px]">
                    <label htmlFor="report-end-date" className="text-xs font-semibold text-forest uppercase tracking-wide">
                      End date
                    </label>
                    <div className="relative flex items-center">
                      <span className="absolute left-3 text-teal/60 pointer-events-none" aria-hidden>
                        <CalendarIcon className="w-5 h-5" />
                      </span>
                      <input
                        id="report-end-date"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full pl-11 pr-3 py-2.5 rounded-lg border border-lavender bg-white text-void text-sm shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end lg:shrink-0">
                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={!datesValid || reportLoading}
                    title={!datesValid ? 'Set start and end dates first' : undefined}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-gradient-to-r from-teal to-forest text-white text-sm font-semibold shadow-md hover:from-forest hover:to-void disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 transition-all duration-200"
                  >
                    {reportLoading ? 'Generating…' : 'Generate Report'}
                  </button>
                </div>
              </div>
              {!datesValid && startDate && endDate ? (
                <p className="text-sm text-forest mt-3">End date must be on or after start date.</p>
              ) : null}
            </section>
          ) : (
            <p className="text-forest text-sm mb-6">Click <strong className="text-void">Filter Data</strong> to set dates and generate your report.</p>
          )}

          {reportLoading ? (
            <div className="flex justify-center py-12" role="status" aria-label="Loading report">
              <div className="h-10 w-10 rounded-full border-2 border-lavender/50 border-t-teal animate-spin" />
            </div>
          ) : null}

          {reportSuccess && !reportLoading ? (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <article className="rounded-2xl bg-surface border border-lavender/40 shadow-sm p-5 sm:p-6">
                  <p className="text-xs font-semibold text-forest uppercase tracking-wide mb-2">Total Income</p>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-teal">{formatAmount(derived.totalIncome)}</p>
                </article>
                <article className="rounded-2xl bg-surface border border-lavender/40 shadow-sm p-5 sm:p-6">
                  <p className="text-xs font-semibold text-forest uppercase tracking-wide mb-2">Total Expenses</p>
                  <p className="text-2xl sm:text-3xl font-bold tabular-nums text-void">{formatAmount(derived.totalExpenses)}</p>
                </article>
                <article className="rounded-2xl bg-surface border border-lavender/40 shadow-sm p-5 sm:p-6">
                  <p className="text-xs font-semibold text-forest uppercase tracking-wide mb-2">Net Savings</p>
                  <p
                    className={`text-2xl sm:text-3xl font-bold tabular-nums ${
                      derived.netSavings >= 0 ? 'text-teal' : 'text-void'
                    }`}
                  >
                    {formatAmount(derived.netSavings)}
                  </p>
                </article>
              </div>

              {/* Download PDF */}
              <div className="mb-8">
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-gradient-to-r from-teal to-forest text-white text-sm font-semibold shadow-md hover:from-forest hover:to-void focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 transition-all duration-200"
                >
                  <DownloadIcon className="w-5 h-5" />
                  Download PDF
                </button>
              </div>

              {/* Chart placeholder sections */}
              <section className="mb-6 rounded-2xl border border-lavender/40 bg-surface shadow-sm p-5 sm:p-6" aria-labelledby="heading-income-source">
                <h2 id="heading-income-source" className="text-lg font-bold text-void mb-4">
                  Income by Source
                </h2>
                <div className="min-h-[200px] rounded-xl bg-mist/50 border border-dashed border-lavender/50 flex items-center justify-center">
                  <p className="text-sm text-forest/70 text-center px-4">Space for chart or graph</p>
                </div>
              </section>

              <section className="mb-6 rounded-2xl border border-lavender/40 bg-surface shadow-sm p-5 sm:p-6" aria-labelledby="heading-expenses-cat">
                <h2 id="heading-expenses-cat" className="text-lg font-bold text-void mb-4">
                  Expenses by Category
                </h2>
                <div className="min-h-[200px] rounded-xl bg-mist/50 border border-dashed border-lavender/50 flex items-center justify-center">
                  <p className="text-sm text-forest/70 text-center px-4">Space for chart or graph</p>
                </div>
              </section>

              <section className="mb-6 rounded-2xl border border-lavender/40 bg-surface shadow-sm p-5 sm:p-6" aria-labelledby="heading-top-expense">
                <h2 id="heading-top-expense" className="text-lg font-bold text-void mb-4">
                  Top Expense Categories
                </h2>
                <div className="min-h-[200px] rounded-xl bg-mist/50 border border-dashed border-lavender/50 flex items-center justify-center">
                  <p className="text-sm text-forest/70 text-center px-4">Space for chart or graph</p>
                </div>
              </section>

              {/* Cash Flow Summary */}
              <section aria-labelledby="cash-flow-heading">
                <h2 id="cash-flow-heading" className="text-lg font-bold text-void mb-4">
                  Cash Flow Summary
                </h2>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface border border-lavender/40 shadow-sm">
                    <span className="text-sm font-medium text-forest">Inflow (Income)</span>
                    <span className="text-sm font-semibold tabular-nums text-teal">{formatAmount(derived.totalIncome)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface border border-lavender/40 shadow-sm">
                    <span className="text-sm font-medium text-forest">Outflow (Expenses)</span>
                    <span className="text-sm font-semibold tabular-nums text-void">{formatAmount(derived.totalExpenses)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl bg-surface border border-lavender/40 shadow-sm">
                    <span className="text-sm font-medium text-forest">Net Flow</span>
                    <span
                      className={`text-sm font-semibold tabular-nums ${
                        derived.netSavings >= 0 ? 'text-teal' : 'text-void'
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
