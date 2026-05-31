import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import AppSidebar from '../../components/AppSidebar';
import { authenticatedFetch } from '../../utils/auth';

export default function OcrScannerPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [recentScans, setRecentScans] = useState([]);
  const [ocrUploading, setOcrUploading] = useState(false);
  const [ocrMessage, setOcrMessage] = useState('');
  const [selectedOcrScanId, setSelectedOcrScanId] = useState(null);
  const [ocrExpenseCategories, setOcrExpenseCategories] = useState([]);
  const [ocrCategoryId, setOcrCategoryId] = useState('');
  const [ocrAmountOverride, setOcrAmountOverride] = useState('');
  const [ocrSavingExpense, setOcrSavingExpense] = useState(false);

  const selectedOcrScan =
    recentScans.find((s) => String(s.id) === String(selectedOcrScanId)) || recentScans[0] || null;

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authenticatedFetch('/api/auth/me');
        if (!res.ok) { router.push('/login'); return; }
      } catch { router.push('/login'); return; }
      setLoading(false);
    };
    checkAuth();
  }, [router]);

  // Load scans and categories
  useEffect(() => {
    if (loading) return;
    (async () => {
      try {
        const [scansRes, catsRes] = await Promise.all([
          authenticatedFetch('/api/ocr/scans?limit=10'),
          authenticatedFetch('/api/categories?type=Expense'),
        ]);
        if (scansRes.ok) {
          const data = await scansRes.json();
          setRecentScans(data.scans || []);
        }
        if (catsRes.ok) {
          const data = await catsRes.json();
          const cats = data.categories || [];
          setOcrExpenseCategories(cats);
          if (cats.length > 0 && !ocrCategoryId) {
            setOcrCategoryId(String(cats[0].id));
          }
        }
      } catch (e) { console.error(e); }
    })();
  }, [loading]);

  // Sync amount override when scan changes
  useEffect(() => {
    if (!selectedOcrScan) return;
    const v = selectedOcrScan.extractedData?.amount?.value;
    setOcrAmountOverride(v != null && v !== '' ? String(v) : '');
  }, [selectedOcrScan?.id]);

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
            : data.message || 'Upload finished — check status below.'
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
    if (!value) return '\u2014';
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '\u2014' : d.toLocaleDateString();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-teal/25 border-t-teal rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>OCR Scanner — FinValora</title>
      </Head>
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/30 flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="px-6 py-5 border-b border-lavender/15 bg-white/60 backdrop-blur-sm shrink-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal mb-1">Automation</p>
            <h1 className="font-display text-2xl font-semibold text-void">Receipt Scanner</h1>
            <p className="text-sm text-ink-secondary mt-1">Upload receipts and extract data automatically</p>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-5xl space-y-6">

              {/* Message */}
              {ocrMessage && (
                <div className="text-sm text-forest rounded-xl border border-border-subtle bg-teal-soft/40 px-4 py-3" role="status">
                  {ocrMessage}
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
                className="hidden"
                onChange={handleOcrFile}
              />

              {/* Upload + Extracted Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Zone */}
                <div
                  className="border-2 border-dashed border-lavender/50 rounded-2xl p-8 text-center hover:border-teal/60 transition-all duration-200 cursor-pointer bg-mist/30 hover:shadow-fv-sm"
                  onClick={() => { if (!ocrUploading) fileInputRef.current?.click(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileInputRef.current?.click(); } }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload receipt file"
                >
                  <div className="flex flex-col items-center pointer-events-none">
                    <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal/10 text-forest">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </span>
                    <h4 className="text-lg font-semibold text-void mb-1">Upload receipt</h4>
                    <p className="text-sm text-ink-secondary mb-4">JPG, PNG, WebP, or PDF</p>
                    <span className="px-5 py-2.5 bg-forest text-white rounded-lg text-sm font-medium">
                      {ocrUploading ? 'Processing...' : 'Choose file'}
                    </span>
                    <p className="text-xs text-ink-muted mt-3">Processed securely on the server</p>
                  </div>
                </div>

                {/* Extracted Data Panel */}
                <div className="rounded-2xl border border-lavender/30 bg-white p-6">
                  <h4 className="text-lg font-semibold text-void mb-1">Extracted data</h4>
                  <p className="text-xs text-ink-muted mb-5">Review before adding to expenses</p>

                  {!selectedOcrScan ? (
                    <p className="text-sm text-ink-secondary">Upload a receipt or select a scan from the list below.</p>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-semibold text-forest uppercase">Status</span>
                        <span className={'text-xs font-semibold px-2 py-0.5 rounded ' +
                          (selectedOcrScan.status === 'completed'
                            ? 'bg-teal/15 text-forest'
                            : selectedOcrScan.status === 'failed'
                              ? 'bg-mist text-void'
                              : 'bg-lavender/30 text-void')
                        }>
                          {selectedOcrScan.status}
                        </span>
                      </div>

                      {selectedOcrScan.status === 'failed' && selectedOcrScan.error?.message && (
                        <p className="text-sm text-red-500 mb-3">{selectedOcrScan.error.message}</p>
                      )}

                      <div className="space-y-3">
                        <div className="flex flex-col gap-1 py-2 border-b border-lavender/30">
                          <span className="text-sm text-ink-secondary">Amount</span>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            className="w-full px-3 py-2 rounded-lg border border-lavender/50 text-void text-sm bg-white focus:ring-2 focus:ring-teal/20 focus:border-teal transition"
                            value={ocrAmountOverride}
                            onChange={(e) => setOcrAmountOverride(e.target.value)}
                            placeholder={selectedOcrScan.extractedData?.amount?.value != null
                              ? String(selectedOcrScan.extractedData.amount.value) : 'Enter amount'}
                          />
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-lavender/30">
                          <span className="text-sm text-ink-secondary">Merchant</span>
                          <span className="text-sm font-medium text-void">{selectedOcrScan.extractedData?.merchant?.value || '\u2014'}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-lavender/30">
                          <span className="text-sm text-ink-secondary">Date</span>
                          <span className="text-sm font-medium text-void">{formatOcrScanDate(selectedOcrScan.extractedData?.date?.value)}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-lavender/30">
                          <span className="text-sm text-ink-secondary">Suggested</span>
                          <span className="text-sm font-medium text-void">{selectedOcrScan.extractedData?.category?.value || '\u2014'}</span>
                        </div>
                        <div className="flex flex-col gap-1 py-2">
                          <label htmlFor="ocr-expense-category" className="text-sm text-ink-secondary">Expense category</label>
                          <select
                            id="ocr-expense-category"
                            value={ocrCategoryId}
                            onChange={(e) => setOcrCategoryId(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-lavender/50 text-void text-sm bg-white focus:ring-2 focus:ring-teal/20 focus:border-teal transition"
                          >
                            {ocrExpenseCategories.length === 0 ? (
                              <option value="">No categories</option>
                            ) : ocrExpenseCategories.map((c) => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleOcrApplyExpense}
                        disabled={ocrSavingExpense || selectedOcrScan.status !== 'completed' || selectedOcrScan.hasTransaction || !ocrCategoryId}
                        className="w-full mt-5 px-4 py-2.5 bg-forest text-white rounded-lg hover:bg-forest-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                      >
                        {selectedOcrScan.hasTransaction ? 'Already added' : ocrSavingExpense ? 'Saving...' : 'Add to Expenses'}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Recent Scans */}
              <div className="rounded-2xl border border-lavender/30 bg-white p-6">
                <h4 className="text-lg font-semibold text-void mb-1">Recent scans</h4>
                <p className="text-xs text-ink-muted mb-4">Select a scan to load extracted fields</p>

                {recentScans.length === 0 ? (
                  <div className="text-center py-10 text-ink-muted">
                    <svg className="w-8 h-8 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm">No receipts scanned yet</p>
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
                          className={'w-full text-left px-3.5 py-3 rounded-xl border transition-all ' +
                            (String(selectedOcrScanId || selectedOcrScan?.id) === String(scan.id)
                              ? 'border-teal bg-teal-soft/40 ring-1 ring-teal/15'
                              : 'border-lavender/30 hover:border-teal/40 bg-white hover:bg-mist/20')
                          }
                        >
                          <div className="flex justify-between items-start gap-2">
                            <span className="text-sm font-medium text-void truncate">{scan.filename}</span>
                            <span className={'text-xs font-semibold shrink-0 ' + (scan.status === 'completed' ? 'text-forest' : 'text-ink-muted')}>
                              {scan.status}
                            </span>
                          </div>
                          <div className="text-xs text-ink-muted mt-1">
                            {scan.hasTransaction ? 'Linked to expense' : 'Not linked'}
                            {scan.overallConfidence != null ? ` \u00b7 ${scan.overallConfidence}% confidence` : ''}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

            </div>
          </main>
        </div>
      </div>
    </>
  );
}
