import { useState, useEffect, useRef, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';
import ActivityLog from '../../components/ActivityLog';
import FinValoraLogo from '../../components/FinValoraLogo';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/** Same prompts as `/ai-chat` — dashboard chips link to the full assistant. */
const DASHBOARD_AI_SUGGESTIONS = [
  'What expense categories do I have?',
  'Summarize my spending this month.',
  'What is my current budget status?',
  'Show my recent income transactions.',
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(() => MONTHS[new Date().getMonth()]);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [transactionFilter, setTransactionFilter] = useState('all');
  const [loadingTx, setLoadingTx] = useState(false);
  const [recentScans, setRecentScans] = useState([]);
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState('');
  const [selectedOcrScanId, setSelectedOcrScanId] = useState(null);
  const [ocrExpenseCategories, setOcrExpenseCategories] = useState([]);
  const [ocrCategoryId, setOcrCategoryId] = useState('');
  const [ocrAmountOverride, setOcrAmountOverride] = useState('');
  const [ocrSavingExpense, setOcrSavingExpense] = useState(false);
  const fileInputRef = useRef(null);
  const filterPanelRef = useRef(null);
  const router = useRouter();

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : "$";
  };

  const scrollToOCR = () => {
    const ocrSection = document.getElementById('ocr-scanner-section');
    if (ocrSection) {
      ocrSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    // Check for success messages
    if (router.query.login === 'success') {
      setShowSuccess(true);
      setSuccessMessage('Welcome back! You have successfully logged in.');
      router.replace('/dashboard', undefined, { shallow: true });
      setTimeout(() => setShowSuccess(false), 5000);
    }

    const fetchData = async () => {
      try {
        // Get user info
        const userResponse = await authenticatedFetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Get current budget
        const budgetResponse = await authenticatedFetch('/api/budget/current');
        if (budgetResponse.ok) {
          const budgetData = await budgetResponse.json();
          setBudget(budgetData.budget);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [router]);

  useEffect(() => {
    if (!budget) return;

    const loadMonthData = async () => {
      setLoadingTx(true);
      try {
        const year = new Date().getFullYear();
        const monthIndex = MONTHS.indexOf(selectedMonth);
        const safeMonthIndex = monthIndex >= 0 ? monthIndex : new Date().getMonth();
        const start = new Date(year, safeMonthIndex, 1).toISOString();
        const end = new Date(year, safeMonthIndex + 1, 0, 23, 59, 59).toISOString();
        let url = `/api/transactions?startDate=${encodeURIComponent(start)}&endDate=${encodeURIComponent(end)}&limit=500`;
        if (transactionFilter !== 'all') {
          url += `&type=${transactionFilter}`;
        }
        const res = await authenticatedFetch(url);
        if (res.ok) {
          const data = await res.json();
          setMonthTransactions(data.transactions || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingTx(false);
      }
    };

    loadMonthData();
  }, [budget, selectedMonth, transactionFilter]);

  useEffect(() => {
    if (!showMonthFilter) return;
    const onPointerDown = (e) => {
      if (filterPanelRef.current && !filterPanelRef.current.contains(e.target)) {
        setShowMonthFilter(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, [showMonthFilter]);

  useEffect(() => {
    if (!budget) return;

    const loadScans = async () => {
      try {
        const res = await authenticatedFetch('/api/ocr/scans?limit=10');
        if (res.ok) {
          const data = await res.json();
          setRecentScans(data.scans || []);
        }
      } catch (e) {
        console.error(e);
      }
    };

    loadScans();
  }, [budget]);

  useEffect(() => {
    if (!budget) return;
    (async () => {
      try {
        const res = await authenticatedFetch('/api/categories?type=Expense');
        if (!res.ok) return;
        const data = await res.json();
        const cats = data.categories || [];
        setOcrExpenseCategories(cats);
        setOcrCategoryId((prev) => {
          if (prev) return prev;
          const first = cats[0];
          return first ? String(first.id) : '';
        });
      } catch (e) {
        console.error(e);
      }
    })();
  }, [budget]);

  const selectedOcrScan =
    recentScans.find((s) => String(s.id) === String(selectedOcrScanId)) || recentScans[0] || null;

  useEffect(() => {
    if (!selectedOcrScan) return;
    const v = selectedOcrScan.extractedData?.amount?.value;
    setOcrAmountOverride(v != null && v !== '' ? String(v) : '');
  }, [selectedOcrScan?.id]);

  const incomeRecorded = monthTransactions
    .filter((t) => t.type === 'Income')
    .reduce((s, t) => s + (t.amount || 0), 0);
  const expenseRecorded = monthTransactions
    .filter((t) => t.type === 'Expense')
    .reduce((s, t) => s + (t.amount || 0), 0);
  const netRecorded = incomeRecorded - expenseRecorded;

  const breakdownSource = monthTransactions;
  const expenseByCategory = breakdownSource
    .filter((t) => t.type === 'Expense')
    .reduce((acc, t) => {
      const name = t.category?.name || 'Uncategorized';
      acc[name] = (acc[name] || 0) + (t.amount || 0);
      return acc;
    }, {});
  const incomeByCategory = breakdownSource
    .filter((t) => t.type === 'Income')
    .reduce((acc, t) => {
      const name = t.category?.name || 'Uncategorized';
      acc[name] = (acc[name] || 0) + (t.amount || 0);
      return acc;
    }, {});
  const expenseCategoryRows = Object.entries(expenseByCategory).sort((a, b) => b[1] - a[1]);
  const incomeCategoryRows = Object.entries(incomeByCategory).sort((a, b) => b[1] - a[1]);
  const maxExpenseBar = Math.max(...expenseCategoryRows.map(([, v]) => v), 1);
  const maxIncomeBar = Math.max(...incomeCategoryRows.map(([, v]) => v), 1);

  const currencySym = getCurrencySymbol(user?.currency);

  /* ── ECharts: Expense Trend (daily line chart) ── */
  const expenseTrendOption = useMemo(() => {
    const expenses = monthTransactions.filter(t => t.type === 'Expense');
    if (expenses.length === 0) return null;

    // Group by day
    const dailyMap = {};
    expenses.forEach(t => {
      const d = new Date(t.date || t.createdAt);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      dailyMap[key] = (dailyMap[key] || 0) + (t.amount || 0);
    });

    // Sort by actual date
    const sorted = Object.entries(dailyMap).sort((a, b) => {
      const da = new Date(a[0] + ', ' + new Date().getFullYear());
      const db = new Date(b[0] + ', ' + new Date().getFullYear());
      return da - db;
    });

    const dates = sorted.map(([d]) => d);
    const amounts = sorted.map(([, v]) => v);

    // Cumulative
    const cumulative = [];
    let running = 0;
    amounts.forEach(a => { running += a; cumulative.push(Math.round(running * 100) / 100); });

    return {
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderColor: '#e5e5ef',
        textStyle: { color: '#251b28', fontSize: 12 },
        axisPointer: { type: 'cross', crossStyle: { color: '#c4c4db' } }
      },
      legend: {
        data: ['Daily', 'Cumulative'],
        bottom: 0,
        textStyle: { color: '#5a5468', fontSize: 11 },
        itemWidth: 12,
        itemHeight: 8
      },
      grid: { top: 10, right: 16, bottom: 36, left: 12, containLabel: true },
      xAxis: {
        type: 'category',
        data: dates,
        axisLine: { lineStyle: { color: '#e5e5ef' } },
        axisLabel: { color: '#9b96a8', fontSize: 10, rotate: dates.length > 10 ? 30 : 0 },
        axisTick: { show: false }
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: '#9b96a8', fontSize: 10 },
        splitLine: { lineStyle: { color: '#f4f4f8', type: 'dashed' } }
      },
      series: [
        {
          name: 'Daily',
          type: 'bar',
          data: amounts,
          barMaxWidth: 24,
          itemStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8abfb2' },
                { offset: 1, color: '#01332b' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: 'Cumulative',
          type: 'line',
          data: cumulative,
          smooth: true,
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: { color: '#01332b', width: 2 },
          itemStyle: { color: '#01332b', borderColor: '#fff', borderWidth: 2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(138,191,178,0.25)' },
                { offset: 1, color: 'rgba(138,191,178,0)' }
              ]
            }
          }
        }
      ]
    };
  }, [monthTransactions]);

  /* ── ECharts: Category Split (pie chart) ── */
  const categoryPieOption = useMemo(() => {
    if (expenseCategoryRows.length === 0) return null;

    const colors = ['#01332b', '#8abfb2', '#c4c4db', '#2d9e6b', '#d97706', '#dc2626', '#6366f1', '#8b5cf6', '#06b6d4', '#f59e0b'];

    return {
      tooltip: {
        trigger: 'item',
        backgroundColor: '#fff',
        borderColor: '#e5e5ef',
        textStyle: { color: '#251b28', fontSize: 12 },
        formatter: (p) => `<b>${p.name}</b><br/>${currencySym}${p.value.toLocaleString()} (${p.percent}%)`
      },
      legend: {
        orient: 'vertical',
        right: 0,
        top: 'center',
        textStyle: { color: '#5a5468', fontSize: 11 },
        itemWidth: 10,
        itemHeight: 10,
        itemGap: 8
      },
      color: colors,
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: true,
        label: { show: false },
        emphasis: {
          label: { show: true, fontSize: 13, fontWeight: '600', color: '#251b28' },
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(1,51,43,0.15)' }
        },
        labelLine: { show: false },
        data: expenseCategoryRows.map(([name, value], i) => ({
          name,
          value: Math.round(value * 100) / 100,
          itemStyle: { borderColor: '#fff', borderWidth: 2 }
        }))
      }]
    };
  }, [expenseCategoryRows, currencySym]);

  const handleOcrFile = async (e) => {
    const file = e.target?.files?.[0];
    if (!file) return;
    setOcrMessage('');
    setOcrUploading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('finvalora_token') : null;
      const formData = new FormData();
      formData.append('receipt', file);
      const res = await fetch('/api/ocr/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOcrMessage(
          data.scan?.status === 'completed'
            ? 'Receipt processed. Review extracted data below.'
            : data.message || 'Upload finished — check status below.',
        );
        if (data.scan?.id) {
          setSelectedOcrScanId(String(data.scan.id));
          const v = data.scan.extractedData?.amount?.value;
          setOcrAmountOverride(v != null && v !== '' ? String(v) : '');
        }
        const listRes = await authenticatedFetch('/api/ocr/scans?limit=10');
        if (listRes.ok) {
          const listData = await listRes.json();
          setRecentScans(listData.scans || []);
        }
      } else {
        setOcrMessage(data.message || 'Upload failed');
      }
    } catch (err) {
      setOcrMessage('Upload failed');
      console.error(err);
    } finally {
      setOcrUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const formatOcrScanDate = (value) => {
    if (!value) return '—';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString();
  };

  const handleOcrApplyExpense = async () => {
    if (!selectedOcrScan?.id || selectedOcrScan.status !== 'completed') return;
    if (selectedOcrScan.hasTransaction) {
      setOcrMessage('This receipt is already linked to an expense.');
      return;
    }
    if (!ocrCategoryId) {
      setOcrMessage('Choose an expense category.');
      return;
    }
    setOcrSavingExpense(true);
    setOcrMessage('');
    try {
      const body = {
        categoryId: ocrCategoryId,
        ...(ocrAmountOverride.trim() !== '' ? { amount: parseFloat(ocrAmountOverride) } : {}),
      };
      const res = await authenticatedFetch(`/api/ocr/scan/${selectedOcrScan.id}/apply-expense`, {
        method: 'POST',
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setOcrMessage('Expense added from receipt.');
        const listRes = await authenticatedFetch('/api/ocr/scans?limit=10');
        if (listRes.ok) {
          const listData = await listRes.json();
          setRecentScans(listData.scans || []);
        }
      } else {
        setOcrMessage(data.message || 'Could not add expense');
      }
    } catch (err) {
      setOcrMessage('Could not add expense');
      console.error(err);
    } finally {
      setOcrSavingExpense(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/40 flex flex-col items-center justify-center gap-4">
        <div
          className="h-12 w-12 rounded-full border-2 border-teal/30 border-t-teal animate-spin"
          aria-hidden
        />
        <p className="text-sm text-ink-secondary">Loading your dashboard…</p>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/40 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface rounded-2xl border border-lavender/35 p-8 sm:p-10 text-center shadow-(--shadow-fv-lg) ring-1 ring-forest/4">
          <div className="flex justify-center mb-5">
            <FinValoraLogo size={64} className="drop-shadow-md" />
          </div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal mb-2">Get started</p>
          <h1 className="font-display text-2xl font-semibold text-void mb-3">No budget yet</h1>
          <p className="text-sm text-ink-secondary mb-8 leading-relaxed">
            Create your first budget to unlock the dashboard, transactions, and insights.
          </p>
          <button
            type="button"
            onClick={() => router.push('/budget-setup')}
            className="w-full bg-linear-to-br from-teal to-forest text-white py-3.5 px-6 rounded-xl font-semibold hover:from-forest hover:to-void transition-all duration-200 shadow-(--shadow-fv-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
          >
            Set up budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
      <AppSidebar featuredLogo />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-1">Overview</p>
              <h1 className="font-display text-3xl font-semibold text-white tracking-tight">Dashboard</h1>
              <p className="text-sm text-white/80 mt-1.5 max-w-xl">
                {user?.email ? (
                  <span className="text-white/90">{user.email}</span>
                ) : (
                  <span>Signed in</span>
                )}
                <span className="text-white/60"> · </span>
                <span>{selectedMonth}</span>
              </p>
            </div>
            <div ref={filterPanelRef} className="relative flex items-center self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setShowMonthFilter((open) => !open)}
                className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm font-medium text-white shadow-(--shadow-fv-sm) transition-all duration-200 hover:bg-teal/25 hover:border-teal/40"
                aria-expanded={showMonthFilter}
                aria-haspopup="dialog"
              >
                <span>Filters</span>
                <span className="text-xs font-normal text-white/85 hidden sm:inline">
                  {selectedMonth} · {transactionFilter === 'all' ? 'all types' : transactionFilter}
                </span>
                <svg className="w-4 h-4 shrink-0 opacity-90" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMonthFilter && (
                <div
                  className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-surface rounded-2xl shadow-(--shadow-fv-lg) border border-lavender/40 z-50 py-4 ring-1 ring-forest/5"
                  role="dialog"
                  aria-label="Dashboard filters"
                >
                  <div className="px-4 pb-4 border-b border-border-subtle">
                    <label htmlFor="dashboard-month" className="block text-xs font-semibold text-forest uppercase tracking-wide mb-2">
                      Month
                    </label>
                    <select
                      id="dashboard-month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-3 py-2.5 border border-lavender rounded-xl text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal/30 focus:border-teal text-sm transition-colors"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-4 pt-4">
                    <p className="text-xs font-semibold text-forest uppercase tracking-wide mb-2">Transaction type</p>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('all')}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${transactionFilter === 'all' ? 'bg-teal-soft text-forest font-semibold ring-1 ring-teal/25' : 'text-void hover:bg-mist/80'}`}
                      >
                        All transactions
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('Income')}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${transactionFilter === 'Income' ? 'bg-teal-soft text-forest font-semibold ring-1 ring-teal/25' : 'text-void hover:bg-mist/80'}`}
                      >
                        Income only
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('Expense')}
                        className={`w-full text-left px-3 py-2.5 text-sm rounded-xl transition-colors ${transactionFilter === 'Expense' ? 'bg-teal-soft text-forest font-semibold ring-1 ring-teal/25' : 'text-void hover:bg-mist/80'}`}
                      >
                        Expenses only
                      </button>
                    </div>
                  </div>
                  <div className="px-4 pt-4 mt-2 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => setShowMonthFilter(false)}
                      className="w-full px-3 py-2.5 text-sm font-medium text-forest border border-lavender rounded-xl hover:bg-mist/80 transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
          {/* Success Messages */}
          {showSuccess && (
            <div
              className="rounded-2xl border border-teal/35 bg-teal-soft/60 px-5 py-4 shadow-(--shadow-fv-sm) flex items-start gap-3"
              role="status"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </span>
              <p className="text-sm font-medium text-void leading-relaxed pt-1">{successMessage}</p>
            </div>
          )}

          <section className="rounded-2xl border border-lavender/35 bg-linear-to-br from-surface via-mist/30 to-teal-soft/25 p-6 sm:p-8 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal mb-2">Welcome back</p>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-void tracking-tight">
                  Your financial snapshot
                </h2>
                <p className="text-sm text-ink-secondary mt-2 max-w-xl leading-relaxed">
                  {loadingTx
                    ? 'Loading transactions for the selected period…'
                    : `Recorded activity for ${selectedMonth} (${transactionFilter === 'all' ? 'all types' : transactionFilter}).`}
                </p>
              </div>
              <div className="shrink-0 flex items-center gap-3">
                <div className="hidden sm:flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-teal/35 to-forest/25 text-forest shadow-(--shadow-fv-xs) ring-1 ring-lavender/30">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <section aria-label="Monthly totals">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="group rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow duration-200 hover:shadow-(--shadow-fv-md)">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Income</h3>
                  <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-[11px] font-semibold text-forest">Recorded</span>
                </div>
                <p className="font-display text-3xl font-semibold text-teal tabular-nums">
                  {currencySym}
                  {incomeRecorded.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Budget plan{' '}
                  <span className="font-medium text-ink-secondary">
                    {currencySym}
                    {budget.totalIncome?.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="group rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow duration-200 hover:shadow-(--shadow-fv-md)">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Expenses</h3>
                  <span className="rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-semibold text-void">Recorded</span>
                </div>
                <p className="font-display text-3xl font-semibold text-void tabular-nums">
                  {currencySym}
                  {expenseRecorded.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Tracked in budget{' '}
                  <span className="font-medium text-ink-secondary">
                    {currencySym}
                    {budget.currentSpent?.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="group rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow duration-200 hover:shadow-(--shadow-fv-md)">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Net</h3>
                  <span className="rounded-full bg-forest/10 px-2.5 py-0.5 text-[11px] font-semibold text-forest">Recorded</span>
                </div>
                <p className="font-display text-3xl font-semibold text-forest tabular-nums">
                  {currencySym}
                  {netRecorded.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Plan net{' '}
                  <span className="font-medium text-ink-secondary">
                    {currencySym}
                    {(budget.totalIncome - budget.currentSpent).toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </section>

          <section aria-label="Charts" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Expense Trend Chart */}
            <div className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Visualization</p>
                  <h3 className="font-display text-xl font-semibold text-void mt-0.5">Expense trend</h3>
                </div>
              </div>
              {expenseTrendOption ? (
                <ReactECharts option={expenseTrendOption} style={{ height: 260 }} opts={{ renderer: 'svg' }} />
              ) : (
                <div className="h-64 flex items-center justify-center rounded-xl border border-dashed border-lavender/50 bg-mist/30 text-ink-secondary">
                  <div className="text-center">
                    <p className="text-sm font-medium text-void">No expense data</p>
                    <p className="text-xs mt-1 text-ink-muted">Add expenses to see the trend</p>
                  </div>
                </div>
              )}
            </div>

            {/* Category Split Pie Chart */}
            <div className="rounded-2xl border border-lavender/35 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Visualization</p>
                  <h3 className="font-display text-xl font-semibold text-void mt-0.5">Category split</h3>
                </div>
              </div>
              {categoryPieOption ? (
                <ReactECharts option={categoryPieOption} style={{ height: 260 }} opts={{ renderer: 'svg' }} />
              ) : (
                <div className="h-64 flex items-center justify-center rounded-xl border border-dashed border-lavender/50 bg-mist/30 text-ink-secondary">
                  <div className="text-center">
                    <p className="text-sm font-medium text-void">No expense data</p>
                    <p className="text-xs mt-1 text-ink-muted">Add expenses to see the split</p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Categories Breakdown and AI Assistant Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="rounded-2xl border border-lavender/35 bg-surface shadow-(--shadow-fv-md) ring-1 ring-forest/4 flex flex-col h-full min-h-0 overflow-hidden">
              <div className="px-6 pt-6 pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">Breakdown</p>
                <h3 className="font-display text-xl font-semibold text-void mt-0.5">Categories</h3>
                <p className="text-xs text-ink-muted mt-1">
                  {selectedMonth} · {transactionFilter === 'all' ? 'all types' : transactionFilter}
                </p>
              </div>

              <div className="flex-1 overflow-y-auto">
                {/* Expense Table */}
                <div className="px-6 pb-2">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-forest/10">
                      <svg className="w-3 h-3 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </span>
                    <span className="text-xs font-semibold text-void uppercase tracking-wide">Expenses</span>
                    <span className="ml-auto text-xs font-mono text-ink-muted">{currencySym}{expenseRecorded.toLocaleString()}</span>
                  </div>

                  {expenseCategoryRows.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-lavender/40 bg-mist/30 px-4 py-6 text-center mb-4">
                      <p className="text-xs text-ink-muted">No expenses this period</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-lavender/25 overflow-hidden mb-4">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-mist/40">
                            <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2">Category</th>
                            <th className="text-right text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2">Amount</th>
                            <th className="text-right text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2 w-16">%</th>
                            <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2 w-24">Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-lavender/10">
                          {expenseCategoryRows.map(([name, amt]) => {
                            const pct = expenseRecorded ? Math.round((amt / expenseRecorded) * 100) : 0;
                            return (
                              <tr key={name} className="hover:bg-mist/20 transition-colors">
                                <td className="px-3 py-2 text-sm font-medium text-void">{name}</td>
                                <td className="px-3 py-2 text-sm font-mono text-void text-right">{currencySym}{amt.toLocaleString()}</td>
                                <td className="px-3 py-2 text-xs font-mono text-ink-muted text-right">{pct}%</td>
                                <td className="px-3 py-2">
                                  <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                                    <div className="h-full rounded-full bg-linear-to-r from-teal to-forest" style={{ width: pct + '%' }} />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Income Table */}
                <div className="px-6 pb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-teal-soft">
                      <svg className="w-3 h-3 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                    </span>
                    <span className="text-xs font-semibold text-void uppercase tracking-wide">Income</span>
                    <span className="ml-auto text-xs font-mono text-ink-muted">{currencySym}{incomeRecorded.toLocaleString()}</span>
                  </div>

                  {incomeCategoryRows.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-lavender/40 bg-mist/30 px-4 py-6 text-center">
                      <p className="text-xs text-ink-muted">No income this period</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-lavender/25 overflow-hidden">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-mist/40">
                            <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2">Category</th>
                            <th className="text-right text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2">Amount</th>
                            <th className="text-right text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2 w-16">%</th>
                            <th className="text-left text-[10px] font-semibold uppercase tracking-wide text-ink-muted px-3 py-2 w-24">Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-lavender/10">
                          {incomeCategoryRows.map(([name, amt]) => {
                            const pct = incomeRecorded ? Math.round((amt / incomeRecorded) * 100) : 0;
                            return (
                              <tr key={name} className="hover:bg-mist/20 transition-colors">
                                <td className="px-3 py-2 text-sm font-medium text-void">{name}</td>
                                <td className="px-3 py-2 text-sm font-mono text-void text-right">{currencySym}{amt.toLocaleString()}</td>
                                <td className="px-3 py-2 text-xs font-mono text-ink-muted text-right">{pct}%</td>
                                <td className="px-3 py-2">
                                  <div className="h-1.5 rounded-full bg-mist overflow-hidden">
                                    <div className="h-full rounded-full bg-teal" style={{ width: pct + '%' }} />
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* FinValora AI — preview aligned with /ai-chat */}
            <div className="bg-surface rounded-2xl border border-lavender/35 overflow-hidden shadow-(--shadow-fv-lg) ring-1 ring-forest/4 flex flex-col h-full min-h-[340px]">
              <div className="px-4 py-3 border-b border-border-subtle bg-teal-soft/50 flex gap-2 items-start shrink-0">
                <svg
                  className="h-4 w-4 shrink-0 text-forest/80 mt-0.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden
                >
                  <path d="M12 2l1.09 3.26L16.36 6.5l-3.27 1.24L12 11l-1.09-3.26L7.64 6.5l3.27-1.24L12 2zm0 13l1.09 3.26 3.27 1.24-3.27 1.24L12 22l-1.09-3.26-3.27-1.24 3.27-1.24L12 15z" />
                </svg>
                <p className="text-xs text-ink-secondary leading-relaxed">
                  <span className="font-medium text-forest">Notice.</span> AI outputs are informational
                  summaries from your FinValora data, not financial advice.
                </p>
              </div>

              <div className="flex-1 flex flex-col p-5 sm:p-6 bg-linear-to-b from-mist/40 to-transparent min-h-0">
                <div className="shrink-0 mb-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Assistant</p>
                  <h3 className="font-display text-xl font-semibold text-void tracking-tight">FinValora AI</h3>
                  <p className="text-sm text-ink-secondary mt-1 leading-relaxed">
                    Ask about categories, income, expenses, budget, and reports—answers use your signed-in data.
                  </p>
                </div>

                <div className="flex-1 space-y-4 mb-5 min-h-0 overflow-hidden">
                  <div className="flex gap-3 justify-start">
                    <div
                      className="shrink-0 h-9 w-9 rounded-full bg-forest text-teal border border-teal/30 flex items-center justify-center text-xs font-semibold shadow-(--shadow-fv-xs)"
                      aria-hidden
                    >
                      FV
                    </div>
                    <div className="min-w-0 max-w-[min(100%,18rem)] rounded-2xl rounded-tl-md px-3.5 py-2.5 bg-surface border border-border-subtle text-void text-sm leading-relaxed shadow-(--shadow-fv-xs)">
                      <p>Hello! How can I help you manage your finances today?</p>
                    </div>
                  </div>

                  <div className="flex gap-3 justify-start">
                    <div
                      className="shrink-0 h-9 w-9 rounded-full bg-forest text-teal border border-teal/30 flex items-center justify-center text-xs font-semibold shadow-(--shadow-fv-xs)"
                      aria-hidden
                    >
                      FV
                    </div>
                    <div className="min-w-0 max-w-[min(100%,18rem)] rounded-2xl rounded-tl-md px-3.5 py-2.5 bg-surface border border-border-subtle text-void text-sm leading-relaxed shadow-(--shadow-fv-xs)">
                      <p>I can analyze your spending patterns and summarize your budget.</p>
                    </div>
                  </div>

                  <div className="flex gap-3 flex-row-reverse justify-start">
                    <div
                      className="shrink-0 h-9 w-9 rounded-full bg-linear-to-br from-teal to-forest text-white flex items-center justify-center text-xs font-semibold shadow-(--shadow-fv-xs)"
                      aria-hidden
                    >
                      {(user?.email && String(user.email).trim().charAt(0).toUpperCase()) || '?'}
                    </div>
                    <div className="min-w-0 max-w-[min(100%,18rem)] rounded-2xl rounded-tr-md px-3.5 py-2.5 bg-linear-to-br from-teal to-forest text-white text-sm leading-relaxed shadow-(--shadow-fv-sm)">
                      <p>Type a message in the assistant…</p>
                    </div>
                  </div>
                </div>

                <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-muted mb-2 shrink-0">
                  Suggested prompts
                </p>
                <div className="flex flex-wrap gap-2 mb-5 shrink-0">
                  {DASHBOARD_AI_SUGGESTIONS.map((prompt) => (
                    <Link
                      key={prompt}
                      href="/ai-chat"
                      className="text-left text-xs sm:text-sm px-3 py-2 rounded-xl border border-lavender/50 bg-surface text-forest hover:border-teal hover:bg-teal-soft/60 hover:shadow-(--shadow-fv-xs) transition-all duration-200 max-w-full"
                    >
                      {prompt}
                    </Link>
                  ))}
                </div>

                <Link
                  href="/ai-chat"
                  className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-br from-teal to-forest text-white text-sm font-semibold px-5 py-3 shadow-(--shadow-fv-sm) hover:from-forest hover:to-void transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  Open FinValora AI
                  <svg
                    className="h-4 w-4 -translate-x-px translate-y-px"
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
                </Link>

                <p className="text-[11px] text-ink-muted mt-3 text-center sm:text-left shrink-0">
                  FinValora AI may make mistakes. Verify important figures on this dashboard.
                </p>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-lavender/35 bg-linear-to-br from-forest to-forest-hover px-6 py-10 sm:px-10 sm:py-12 text-center shadow-(--shadow-fv-lg) ring-1 ring-white/10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-2">Next step</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white tracking-tight mb-3">
              Refine your plan
            </h2>
            <p className="text-sm text-white/85 max-w-lg mx-auto mb-8 leading-relaxed">
              Update your budget and categories so recorded activity matches how you actually spend and earn.
            </p>
            <button
              type="button"
              onClick={() => router.push('/budget-setup?edit=true')}
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-white text-forest text-sm font-semibold shadow-(--shadow-fv-md) hover:bg-teal-soft transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-forest"
            >
              Review budget setup
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}