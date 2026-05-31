import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';
import ActivityLog from '../../components/ActivityLog';
import FinValoraLogo from '../../components/FinValoraLogo';

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
    return currency ? currency.symbol : "₨";
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
  const maxIncomeBar = Math.max(...incomeCategoryRows.map(([, v]) => v), 1);

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
    <><Head><title>Dashboard — FinValora</title></Head>
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/40 flex flex-col items-center justify-center gap-4">
        <div
          className="h-12 w-12 rounded-full border-2 border-teal/30 border-t-teal animate-spin"
          aria-hidden
        />
        <p className="text-sm text-ink-secondary">Loading your dashboard…</p>
      </div>
                <p className="font-display text-3xl font-semibold text-forest tabular-nums">
                  {currencySym}
                  {expenseRecorded.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Limit{' '}
                  <span className="font-medium text-ink-secondary">
                    {currencySym}
                    {budget.spendingLimit?.toLocaleString()}
                  </span>
                </p>
              </div>
              <div className="group rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 transition-shadow duration-200 hover:shadow-(--shadow-fv-md)">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-secondary">Net Balance</h3>
                  <span className="rounded-full bg-teal-soft px-2.5 py-0.5 text-[11px] font-semibold text-forest">Live</span>
                </div>
                <p className="font-display text-3xl font-semibold text-void tabular-nums">
                  {currencySym}
                  {(incomeRecorded - expenseRecorded).toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted mt-3 leading-relaxed">
                  Savings goal{' '}
                  <span className="font-medium text-ink-secondary">
                    {currencySym}
                    {budget.savingGoal?.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* Activity Log */}
          <section aria-label="Activity Log">
            <ActivityLog currency={currencySym} limit={15} />
          </section>

          {/* OCR Scanner Section */}
          <section id="ocr-scanner-section" aria-label="Receipt Scanner" className="rounded-2xl border border-lavender/35 bg-linear-to-br from-surface via-mist/30 to-teal-soft/25 p-6 sm:p-8 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal mb-2">Receipt Scanner</p>
                <h2 className="font-display text-xl sm:text-2xl font-semibold text-void tracking-tight">
                  Upload & Scan Receipts
                </h2>
                <p className="text-sm text-ink-secondary mt-2 max-w-xl leading-relaxed">
                  Upload a receipt image or PDF to extract transaction details automatically.
                </p>
              </div>
            </div>

            {/* Upload area */}
            <div className="mt-6">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*,application/pdf"
                onChange={handleOcrUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={ocrUploading}
                className="fv-btn-primary min-h-[44px] px-6 text-sm"
              >
                {ocrUploading ? 'Uploading...' : 'Upload Receipt'}
              </button>
              {ocrMessage && (
                <p className="mt-2 text-sm text-forest">{ocrMessage}</p>
              )}
            </div>

            {/* Recent scans */}
            {recentScans.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="text-sm font-semibold text-void">Recent Scans</h4>
                {recentScans.map(scan => (
                  <div key={scan.id} className="flex items-center justify-between rounded-xl border border-lavender/35 bg-white/60 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-teal-soft flex items-center justify-center text-sm">📸</div>
                      <div>
                        <p className="text-sm font-medium text-void">{scan.filename || 'Receipt'}</p>
                        <p className="text-xs text-void/50">{scan.status} • {new Date(scan.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    {scan.extractedData?.amount?.value && (
                      <span className="text-sm font-mono font-semibold text-forest">
                        {currencySym}{scan.extractedData.amount.value.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* AI Chat Suggestions */}
          <section aria-label="AI Assistant" className="rounded-2xl border border-lavender/35 bg-linear-to-br from-surface via-mist/30 to-teal-soft/25 p-6 sm:p-8 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-forest flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-void">AI Assistant</h3>
                <p className="text-xs text-void/50">Ask questions about your finances</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {DASHBOARD_AI_SUGGESTIONS.map(prompt => (
                <Link
                  key={prompt}
                  href="/ai-chat"
                  className="inline-flex items-center gap-2 rounded-full border border-lavender/60 bg-white/80 px-4 py-2 text-sm font-medium text-void/80 hover:border-teal hover:text-forest transition-colors"
                >
                  {prompt}
                </Link>
              ))}
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}