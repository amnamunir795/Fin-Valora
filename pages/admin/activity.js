import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';

const ACTION_ICONS = {
  transaction_created: { icon: '💰', label: 'Transaction Added', color: 'bg-teal-soft text-forest' },
  transaction_updated: { icon: '✏️', label: 'Transaction Updated', color: 'bg-yellow-50 text-yellow-700' },
  transaction_deleted: { icon: '🗑️', label: 'Transaction Removed', color: 'bg-red-50 text-red-600' },
  budget_created: { icon: '📊', label: 'Budget Created', color: 'bg-blue-50 text-blue-600' },
  budget_updated: { icon: '📊', label: 'Budget Updated', color: 'bg-blue-50 text-blue-500' },
  category_created: { icon: '🏷️', label: 'Category Created', color: 'bg-purple-50 text-purple-600' },
  category_updated: { icon: '🏷️', label: 'Category Updated', color: 'bg-purple-50 text-purple-500' },
  category_deleted: { icon: '🏷️', label: 'Category Removed', color: 'bg-red-50 text-red-500' },
  ocr_uploaded: { icon: '📸', label: 'Receipt Uploaded', color: 'bg-cyan-50 text-cyan-600' },
  ocr_expense_created: { icon: '🧾', label: 'Receipt Expense', color: 'bg-teal-soft text-forest' },
  user_login: { icon: '🔐', label: 'Signed In', color: 'bg-gray-100 text-gray-600' },
  user_signup: { icon: '🎉', label: 'Account Created', color: 'bg-green-50 text-green-600' },
  report_generated: { icon: '📄', label: 'Report Generated', color: 'bg-indigo-50 text-indigo-600' }
};

const ACTION_TYPES = Object.keys(ACTION_ICONS);

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

export default function AdminActivity() {
  const router = useRouter();
  const [activities, setActivities] = useState([]);
  const [summary, setSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [limit, setLimit] = useState(50);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, [filter, limit]);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({ limit: String(limit) });
      if (filter !== 'all') params.set('action', filter);

      const [actRes, sumRes] = await Promise.all([
        authenticatedFetch(`/api/activity?${params}`),
        authenticatedFetch('/api/activity?summary=true&days=30')
      ]);

      if (actRes.ok) {
        const data = await actRes.json();
        setActivities(data.activities || []);
      } else {
        setError('Failed to load activity');
      }

      if (sumRes.ok) {
        const data = await sumRes.json();
        setSummary(data.summary || []);
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  const filtered = activities.filter(a => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.description?.toLowerCase().includes(q) ||
      a.action?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  });

  const totalActions = summary.reduce((acc, s) => acc + s.count, 0);

  return (
    <>
      <Head>
        <title>Activity Log — FinValora Admin</title>
      </Head>
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-teal mb-1">Admin</p>
                <h1 className="font-display text-2xl font-semibold text-void">Activity Log</h1>
              </div>
              <button
                onClick={loadData}
                className="fv-btn-secondary min-h-[36px] px-4 text-sm"
              >
                Refresh
              </button>
            </div>
          </header>

          <main className="flex-1 p-5 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">

            {/* Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-lavender/35 bg-white/90 p-4 shadow-sm">
                <p className="text-xs text-void/50 font-medium">Total Actions (30d)</p>
                <p className="text-2xl font-bold text-void mt-1">{totalActions}</p>
              </div>
              <div className="rounded-xl border border-lavender/35 bg-white/90 p-4 shadow-sm">
                <p className="text-xs text-void/50 font-medium">Transactions</p>
                <p className="text-2xl font-bold text-teal mt-1">
                  {summary.filter(s => s._id?.startsWith('transaction')).reduce((a, s) => a + s.count, 0)}
                </p>
              </div>
              <div className="rounded-xl border border-lavender/35 bg-white/90 p-4 shadow-sm">
                <p className="text-xs text-void/50 font-medium">Receipts Scanned</p>
                <p className="text-2xl font-bold text-forest mt-1">
                  {summary.filter(s => s._id?.startsWith('ocr')).reduce((a, s) => a + s.count, 0)}
                </p>
              </div>
              <div className="rounded-xl border border-lavender/35 bg-white/90 p-4 shadow-sm">
                <p className="text-xs text-void/50 font-medium">Budget Changes</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {summary.filter(s => s._id?.startsWith('budget')).reduce((a, s) => a + s.count, 0)}
                </p>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1 max-w-sm">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-void/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search activity..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm border border-lavender/60 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal"
                />
              </div>

              <select
                value={filter}
                onChange={e => setFilter(e.target.value)}
                className="px-4 py-2.5 text-sm border border-lavender/60 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
              >
                <option value="all">All actions</option>
                {ACTION_TYPES.map(a => (
                  <option key={a} value={a}>{ACTION_ICONS[a].label}</option>
                ))}
              </select>

              <select
                value={limit}
                onChange={e => setLimit(Number(e.target.value))}
                className="px-4 py-2.5 text-sm border border-lavender/60 rounded-xl bg-white/80 focus:outline-none focus:ring-2 focus:ring-teal/30 cursor-pointer"
              >
                <option value={20}>Last 20</option>
                <option value={50}>Last 50</option>
                <option value={100}>Last 100</option>
              </select>
            </div>

            {/* Activity Table */}
            <div className="rounded-2xl border border-lavender/35 bg-white/90 shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-8 h-8 mx-auto border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
                  <p className="text-sm text-void/50 mt-3">Loading activity...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-sm text-void/50">No activity found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-lavender/30 bg-mist/30">
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-void/50 px-5 py-3">Action</th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-void/50 px-5 py-3">Description</th>
                        <th className="text-right text-xs font-semibold uppercase tracking-wide text-void/50 px-5 py-3">Amount</th>
                        <th className="text-left text-xs font-semibold uppercase tracking-wide text-void/50 px-5 py-3">Category</th>
                        <th className="text-right text-xs font-semibold uppercase tracking-wide text-void/50 px-5 py-3">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-lavender/20">
                      {filtered.map((activity) => {
                        const style = ACTION_ICONS[activity.action] || { icon: '📌', label: activity.action, color: 'bg-gray-100 text-gray-600' };
                        return (
                          <tr key={activity.id} className="hover:bg-teal-soft/20 transition-colors">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${style.color}`}>
                                  {style.icon} {style.label}
                                </span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5">
                              <p className="text-sm text-void truncate max-w-md">{activity.description}</p>
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              {activity.amount != null ? (
                                <span className="text-sm font-mono font-semibold text-forest">
                                  {activity.currency || ''}{activity.amount.toLocaleString()}
                                </span>
                              ) : (
                                <span className="text-xs text-void/30">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              {activity.category ? (
                                <span className="text-xs font-medium text-void/70 bg-mist/60 px-2 py-0.5 rounded-full">
                                  {activity.category}
                                </span>
                              ) : (
                                <span className="text-xs text-void/30">—</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5 text-right">
                              <p className="text-xs text-void/50 font-medium">{timeAgo(activity.createdAt)}</p>
                              <p className="text-[11px] text-void/30 mt-0.5">{formatDateTime(activity.createdAt)}</p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Activity Breakdown */}
            {summary.length > 0 && (
              <div className="rounded-2xl border border-lavender/35 bg-white/90 p-6 shadow-sm">
                <h3 className="text-sm font-semibold text-void mb-4">30-Day Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {summary.map(s => {
                    const style = ACTION_ICONS[s._id] || { icon: '📌', label: s._id, color: 'bg-gray-100 text-gray-600' };
                    return (
                      <div key={s._id} className="flex items-center gap-3 rounded-xl border border-lavender/30 px-3 py-2.5">
                        <span className="text-lg">{style.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-void">{s.count}</p>
                          <p className="text-[11px] text-void/50">{style.label}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </>
  );
}
