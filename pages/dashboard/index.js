import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';
import FinValoraLogo from '../../components/FinValoraLogo';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
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
        const userResponse = await fetch('/api/auth/me');
        if (!userResponse.ok) {
          router.push('/login');
          return;
        }
        const userData = await userResponse.json();
        setUser(userData.user);

        // Get current budget
        const budgetResponse = await fetch('/api/budget/current');
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
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal"></div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="max-w-md mx-auto bg-surface rounded-2xl shadow-xl border border-lavender/40 p-8 text-center">
          <div className="flex justify-center mb-4">
            <FinValoraLogo size={64} className="drop-shadow-lg" />
          </div>
          <h1 className="text-2xl font-bold text-void mb-4">No Budget Found</h1>
          <p className="text-forest mb-6">Let's set up your first budget to get started!</p>
          <button
            onClick={() => router.push('/budget-setup')}
            className="w-full bg-gradient-to-r from-teal to-forest text-white py-3 px-6 rounded-xl font-semibold hover:from-forest hover:to-void transition-all duration-200 shadow-lg"
          >
            Set Up Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mist flex">
      <AppSidebar featuredLogo onOcrClick={scrollToOCR} />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="fv-app-page-header px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <div ref={filterPanelRef} className="relative flex items-center">
              <button
                type="button"
                onClick={() => setShowMonthFilter((open) => !open)}
                className="flex items-center gap-2 rounded-lg border border-lavender bg-white/10 px-4 py-2 font-medium text-white shadow-md transition-all duration-200 hover:bg-teal/20 hover:text-teal"
                aria-expanded={showMonthFilter}
                aria-haspopup="dialog"
              >
                <span>Filters</span>
                <span className="text-sm font-normal opacity-90 hidden sm:inline">
                  {selectedMonth} · {transactionFilter === 'all' ? 'all types' : transactionFilter}
                </span>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showMonthFilter && (
                <div
                  className="absolute right-0 top-full mt-2 w-72 bg-surface rounded-lg shadow-xl border border-lavender/40 z-50 py-3"
                  role="dialog"
                  aria-label="Dashboard filters"
                >
                  <div className="px-4 pb-3 border-b border-lavender/30">
                    <label htmlFor="dashboard-month" className="block text-xs font-semibold text-forest mb-2">
                      Month
                    </label>
                    <select
                      id="dashboard-month"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      className="w-full px-3 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent text-sm"
                    >
                      {MONTHS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="px-4 pt-3">
                    <p className="text-xs font-semibold text-forest mb-2">Transaction type</p>
                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('all')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-mist/30 ${transactionFilter === 'all' ? 'bg-teal/20 text-forest font-medium' : 'text-void'}`}
                      >
                        All transactions
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('Income')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-mist/30 ${transactionFilter === 'Income' ? 'bg-teal/20 text-forest font-medium' : 'text-void'}`}
                      >
                        Income only
                      </button>
                      <button
                        type="button"
                        onClick={() => setTransactionFilter('Expense')}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-mist/30 ${transactionFilter === 'Expense' ? 'bg-teal/20 text-forest font-medium' : 'text-void'}`}
                      >
                        Expenses only
                      </button>
                    </div>
                  </div>
                  <div className="px-4 pt-3 mt-2 border-t border-lavender/30">
                    <button
                      type="button"
                      onClick={() => setShowMonthFilter(false)}
                      className="w-full px-3 py-2 text-sm text-forest border border-lavender rounded-lg hover:bg-mist/30"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <main className="p-6 space-y-6">
          {/* Success Messages */}
          {showSuccess && (
            <div className="bg-gradient-to-r from-teal/20 to-forest/20 border border-teal/40 rounded-lg p-4 shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-forest mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-void">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-mist/20 via-surface to-teal/20 rounded-xl p-6 border border-lavender/40 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-void mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-forest">
                  {loadingTx ? 'Loading transactions…' : `Recorded activity for ${selectedMonth} (${transactionFilter === 'all' ? 'all types' : transactionFilter})`}
                </p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-teal/30 to-forest/30 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top Stats Cards — transaction totals for selected month; budget plan shown as reference */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-forest mb-2">Income (recorded)</h3>
              <p className="text-2xl font-bold text-teal">
                {getCurrencySymbol(user?.currency)}{incomeRecorded.toLocaleString()}
              </p>
              <p className="text-xs text-forest/80 mt-2">Budget plan: {getCurrencySymbol(user?.currency)}{budget.totalIncome?.toLocaleString()}</p>
            </div>
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-forest mb-2">Expenses (recorded)</h3>
              <p className="text-2xl font-bold text-void">
                {getCurrencySymbol(user?.currency)}{expenseRecorded.toLocaleString()}
              </p>
              <p className="text-xs text-forest/80 mt-2">Tracked in budget: {getCurrencySymbol(user?.currency)}{budget.currentSpent?.toLocaleString()}</p>
            </div>
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-forest mb-2">Net (recorded)</h3>
              <p className="text-2xl font-bold text-forest">
                {getCurrencySymbol(user?.currency)}{netRecorded.toLocaleString()}
              </p>
              <p className="text-xs text-forest/80 mt-2">Plan net: {getCurrencySymbol(user?.currency)}{(budget.totalIncome - budget.currentSpent).toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-void mb-4">Expenses</h3>
              <div className="h-64 flex items-center justify-center text-forest">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Chart will be displayed here</p>
                </div>
              </div>
            </div>
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-void mb-4">Expenses Breakdown</h3>
              <div className="h-64 flex items-center justify-center text-forest">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  <p>Pie chart will be displayed here</p>
                </div>
              </div>
            </div>
          </div>

          {/* Categories Breakdown and AI Assistant Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Categories Breakdown */}
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-void mb-6">Categories Breakdown</h3>
              
              <div className="space-y-6">
                {/* Expenses Section */}
                <div>
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-forest mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-sm font-medium text-forest">Expenses (0)</span>
                  </div>
                  <div className="bg-gradient-to-r from-mist/20 to-mist/10 rounded-lg p-8 text-center border border-lavender/30">
                    <span className="text-2xl font-bold text-teal">N/A</span>
                  </div>
                </div>

                {/* Incomes Section */}
                <div>
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-forest mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium text-forest">Incomes (0)</span>
                  </div>
                  <div className="bg-gradient-to-r from-mist/20 to-mist/10 rounded-lg p-8 text-center border border-lavender/30">
                    <span className="text-2xl font-bold text-teal">N/A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FinValora AI Assistant */}
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <div className="h-full flex flex-col">
                {/* AI Chat Interface */}
                <div className="flex-1 bg-gradient-to-br from-mist/20 to-mist/10 rounded-lg p-4 mb-4 border border-lavender/30">
                  <div className="space-y-3">
                    {/* AI Message Bubbles */}
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal to-forest rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                        AI
                      </div>
                      <div className="bg-gradient-to-r from-forest to-void text-white rounded-lg px-3 py-2 max-w-xs shadow-md">
                        <p className="text-sm">Hello! How can I help you manage your finances today?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal to-forest rounded-full flex items-center justify-center text-white text-sm font-medium shadow-md">
                        AI
                      </div>
                      <div className="bg-gradient-to-r from-forest to-void text-white rounded-lg px-3 py-2 max-w-xs shadow-md">
                        <p className="text-sm">I can analyze your spending patterns and provide insights.</p>
                      </div>
                    </div>

                    {/* User Input Area */}
                    <div className="flex justify-end">
                      <div className="bg-mist/40 rounded-lg px-3 py-2 max-w-xs border border-lavender/50">
                        <p className="text-sm text-void">Type a message...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Info */}
                <div>
                  <h4 className="text-lg font-bold text-void mb-2">FinValora AI</h4>
                  <p className="text-sm text-forest">Get assistance with managing your expenses and income.</p>
                </div>
              </div>
            </div>
          </div>

          {/* OCR Tool Section */}
          <div id="ocr-scanner-section" className="bg-surface rounded-lg border border-lavender/40 p-6 mb-6 shadow-md scroll-mt-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-void mb-2">OCR Receipt Scanner</h3>
                <p className="text-sm text-forest">Upload receipts and bills to automatically extract transaction data</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal/30 to-forest/30 rounded-lg shadow-md">
                <svg className="w-6 h-6 text-forest" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              className="hidden"
              onChange={handleOcrFile}
            />

            {ocrMessage ? (
              <p className="text-sm text-forest mb-4 rounded-lg border border-lavender/40 bg-mist/30 px-3 py-2" role="status">
                {ocrMessage}
              </p>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="border-2 border-dashed border-lavender rounded-lg p-6 text-center hover:border-teal transition-colors cursor-pointer bg-gradient-to-br from-mist/10 to-transparent"
                onClick={() => {
                  if (ocrUploading) return;
                  fileInputRef.current?.click();
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label="Upload receipt file"
              >
                <div className="flex flex-col items-center pointer-events-none">
                  <svg className="w-12 h-12 text-teal mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h4 className="text-lg font-medium text-void mb-2">Upload Receipt</h4>
                  <p className="text-sm text-forest mb-4">Click to browse (JPG, PNG, WebP, PDF)</p>
                  <span className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg shadow-md text-sm font-semibold inline-block">
                    {ocrUploading ? 'Processing…' : 'Choose File'}
                  </span>
                  <p className="text-xs text-forest/70 mt-2">OCR runs on the server after upload</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-mist/20 to-mist/10 rounded-lg p-6 border border-lavender/30">
                <h4 className="text-lg font-medium text-void mb-4">Extracted Data</h4>
                {!selectedOcrScan ? (
                  <p className="text-sm text-forest">Upload a receipt or select a scan from the list below.</p>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-forest uppercase">Status</span>
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          selectedOcrScan.status === 'completed'
                            ? 'bg-teal/20 text-forest'
                            : selectedOcrScan.status === 'failed'
                              ? 'bg-mist text-void'
                              : 'bg-lavender/30 text-void'
                        }`}
                      >
                        {selectedOcrScan.status}
                      </span>
                    </div>
                    {selectedOcrScan.status === 'failed' && selectedOcrScan.error?.message ? (
                      <p className="text-sm text-forest mb-3">{selectedOcrScan.error.message}</p>
                    ) : null}
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1 py-2 border-b border-lavender/40">
                        <span className="text-sm text-forest">Amount</span>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          className="w-full px-3 py-2 rounded-lg border border-lavender text-void text-sm bg-white"
                          value={ocrAmountOverride}
                          onChange={(e) => setOcrAmountOverride(e.target.value)}
                          placeholder={
                            selectedOcrScan.extractedData?.amount?.value != null
                              ? String(selectedOcrScan.extractedData.amount.value)
                              : 'Enter amount'
                          }
                        />
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-lavender/40 gap-2">
                        <span className="text-sm text-forest shrink-0">Merchant</span>
                        <span className="text-sm font-medium text-void text-right truncate">
                          {selectedOcrScan.extractedData?.merchant?.value || '—'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-lavender/40">
                        <span className="text-sm text-forest">Date</span>
                        <span className="text-sm font-medium text-void">
                          {formatOcrScanDate(selectedOcrScan.extractedData?.date?.value)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-lavender/40">
                        <span className="text-sm text-forest">Suggested category</span>
                        <span className="text-sm font-medium text-void text-right">
                          {selectedOcrScan.extractedData?.category?.value || '—'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 py-2">
                        <label htmlFor="ocr-expense-category" className="text-sm text-forest">
                          Expense category
                        </label>
                        <select
                          id="ocr-expense-category"
                          value={ocrCategoryId}
                          onChange={(e) => setOcrCategoryId(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-lavender text-void text-sm bg-white"
                        >
                          {ocrExpenseCategories.length === 0 ? (
                            <option value="">No categories — add in Categories</option>
                          ) : (
                            ocrExpenseCategories.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.name}
                              </option>
                            ))
                          )}
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleOcrApplyExpense}
                      disabled={
                        ocrSavingExpense ||
                        selectedOcrScan.status !== 'completed' ||
                        selectedOcrScan.hasTransaction ||
                        !ocrCategoryId
                      }
                      className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md font-semibold text-sm"
                    >
                      {selectedOcrScan.hasTransaction
                        ? 'Already added'
                        : ocrSavingExpense
                          ? 'Saving…'
                          : 'Add to Expenses'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-medium text-void mb-4">Recent Scans</h4>
              <div className="bg-gradient-to-br from-mist/20 to-mist/10 rounded-lg p-4 border border-lavender/30">
                {recentScans.length === 0 ? (
                  <div className="text-center text-forest">
                    <svg className="w-8 h-8 mx-auto mb-2 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No receipts scanned yet</p>
                    <p className="text-xs text-forest/70">Upload your first receipt to get started</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {recentScans.map((scan) => (
                      <li key={String(scan.id)}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedOcrScanId(String(scan.id));
                            const v = scan.extractedData?.amount?.value;
                            setOcrAmountOverride(v != null && v !== '' ? String(v) : '');
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                            String(selectedOcrScanId || selectedOcrScan?.id) === String(scan.id)
                              ? 'border-teal bg-teal/10'
                              : 'border-lavender/40 hover:border-teal/50 bg-surface/80'
                          }`}
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-medium text-void truncate">{scan.filename}</span>
                            <span className="text-xs font-semibold text-forest shrink-0">{scan.status}</span>
                          </div>
                          <div className="text-xs text-forest/80 mt-1">
                            {scan.hasTransaction ? 'Linked to expense' : 'Not linked'}
                            {scan.overallConfidence != null ? ` · ${scan.overallConfidence}% confidence` : ''}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gradient-to-r from-surface via-mist/20 to-surface rounded-lg border border-lavender/40 p-8 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-void mb-4">Unlock Your Financial Insights</h2>
              <p className="text-forest mb-6">Fine-tune your budget and categories to get a clearer picture of income and spending.</p>
              <button 
                onClick={() => router.push('/budget-setup?edit=true')}
                className="px-6 py-3 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Review budget setup
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}