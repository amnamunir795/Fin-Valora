import Head from 'next/head';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FinValoraLogo from '../../components/FinValoraLogo';

/* ─── SVG Icon System ─── */
const Icons = {
  grid: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
    </svg>
  ),
  chat: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  ),
  clock: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  users: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  star: (props) => (
    <svg {...props} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  ),
  starOutline: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
  refresh: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  ),
  logout: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
  shield: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  arrowRight: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
    </svg>
  ),
  search: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  ),
  chevronLeft: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
  ),
  chevronRight: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  ),
  trendUp: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  document: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  camera: (props) => (
    <svg {...props} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
};

/* ─── Action type config ─── */
const ACTION_TYPES = {
  transaction_created: { label: 'Transaction', color: 'bg-teal/10 text-forest border-teal/20' },
  transaction_updated: { label: 'Updated', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  transaction_deleted: { label: 'Deleted', color: 'bg-red-50 text-red-600 border-red-200' },
  budget_created: { label: 'Budget', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  budget_updated: { label: 'Budget Upd', color: 'bg-blue-50 text-blue-500 border-blue-200' },
  category_created: { label: 'Category', color: 'bg-violet-50 text-violet-600 border-violet-200' },
  category_updated: { label: 'Cat. Upd', color: 'bg-violet-50 text-violet-500 border-violet-200' },
  category_deleted: { label: 'Cat. Del', color: 'bg-red-50 text-red-500 border-red-200' },
  ocr_uploaded: { label: 'Receipt', color: 'bg-cyan-50 text-cyan-600 border-cyan-200' },
  ocr_expense_created: { label: 'OCR Exp', color: 'bg-teal/10 text-forest border-teal/20' },
  user_login: { label: 'Login', color: 'bg-gray-100 text-gray-600 border-gray-200' },
  user_signup: { label: 'Signup', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
  report_generated: { label: 'Report', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' }
};

/* ─── Utilities ─── */
function timeAgo(dateStr) {
  if (!dateStr) return '\u2014';
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
  if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
  if (seconds < 604800) return Math.floor(seconds / 86400) + 'd ago';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatDate(dateStr) {
  if (!dateStr) return '\u2014';
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

/* ─── Small components ─── */
function Avatar({ name, size = 'sm' }) {
  const sizes = { xs: 'w-5 h-5 text-[9px]', sm: 'w-7 h-7 text-[11px]', md: 'w-8 h-8 text-xs' };
  return (
    <div className={(sizes[size] || sizes.sm) + ' rounded-full bg-forest/8 flex items-center justify-center text-forest font-semibold shrink-0'}>
      {(name || 'U').charAt(0).toUpperCase()}
    </div>
  );
}

function MoodIndicator({ mood }) {
  const styles = {
    happy: { bg: 'bg-emerald-500', label: 'Happy' },
    neutral: { bg: 'bg-amber-400', label: 'Neutral' },
    sad: { bg: 'bg-red-400', label: 'Sad' }
  };
  const m = styles[mood] || styles.neutral;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-void/70">
      <span className={'w-2 h-2 rounded-full ' + m.bg} />
      {m.label}
    </span>
  );
}

function RatingStars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Icons.star key={i} className={'w-3.5 h-3.5 ' + (i <= rating ? 'text-amber-400' : 'text-gray-200')} />
      ))}
      <span className="ml-1.5 text-xs font-mono text-ink-muted">{rating}</span>
    </div>
  );
}

function StatCard({ label, value, sub, accent = 'forest' }) {
  const accents = {
    forest: 'border-l-forest',
    teal: 'border-l-teal',
    amber: 'border-l-amber-400',
    blue: 'border-l-blue-500',
  };
  return (
    <div className={'rounded-xl border border-lavender/25 bg-white p-5 shadow-fv-xs border-l-[3px] ' + (accents[accent] || accents.forest)}>
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-muted mb-1">{label}</p>
      <p className="text-2xl font-display font-bold text-void">{value}</p>
      {sub && <p className="text-xs text-ink-secondary mt-1">{sub}</p>}
    </div>
  );
}

function ActionBadge({ action }) {
  const config = ACTION_TYPES[action] || { label: action, color: 'bg-gray-100 text-gray-600 border-gray-200' };
  return (
    <span className={'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border ' + config.color}>
      {config.label}
    </span>
  );
}

function Progress({ value, max, color = 'bg-forest' }) {
  const pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div className="h-1.5 w-full rounded-full bg-mist overflow-hidden">
      <div className={'h-full rounded-full transition-all duration-500 ' + color} style={{ width: pct + '%' }} />
    </div>
  );
}

function EmptyState({ title, description }) {
  return (
    <div className="py-16 text-center">
      <div className="w-12 h-12 mx-auto rounded-xl bg-mist flex items-center justify-center mb-3">
        <Icons.document className="w-5 h-5 text-ink-muted" />
      </div>
      <p className="text-sm font-medium text-void">{title}</p>
      <p className="text-xs text-ink-muted mt-0.5">{description}</p>
    </div>
  );
}

/* ─── Sidebar Navigation Config ─── */
const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', Icon: Icons.grid },
  { id: 'feedback', label: 'Feedback', Icon: Icons.chat },
  { id: 'activity', label: 'Activity', Icon: Icons.clock },
  { id: 'users', label: 'Users', Icon: Icons.users },
];

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState('overview');
  const [admin, setAdmin] = useState(null);
  const [feedbackData, setFeedbackData] = useState(null);
  const [activityData, setActivityData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityFilter, setActivityFilter] = useState('all');
  const [feedbackPage, setFeedbackPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('finvalora_admin_token');
    if (!token) { router.replace('/admin/login'); return; }
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp * 1000 < Date.now()) {
        localStorage.removeItem('finvalora_admin_token');
        router.replace('/admin/login');
        return;
      }
      setAdmin({ username: payload.username });
    } catch {
      localStorage.removeItem('finvalora_admin_token');
      router.replace('/admin/login');
    }
  }, [router]);

  const authedFetch = useCallback(async (url) => {
    const token = localStorage.getItem('finvalora_admin_token');
    const res = await fetch(url, { headers: { 'Authorization': 'Bearer ' + token } });
    if (res.status === 401) { handleLogout(); return null; }
    return res.json();
  }, []);

  useEffect(() => { if (admin) { setLoading(true); Promise.all([loadFeedback(), loadActivity(), loadUsers()]).then(() => setLoading(false)); } }, [admin]);
  useEffect(() => { if (admin) loadActivity(); }, [activityFilter, activityPage]);
  useEffect(() => { if (admin) loadFeedback(); }, [feedbackPage]);

  async function loadFeedback() {
    const data = await authedFetch('/api/feedback?limit=20&page=' + feedbackPage);
    if (data?.success) setFeedbackData(data);
  }
  async function loadActivity() {
    const params = new URLSearchParams({ limit: '20', page: String(activityPage) });
    if (activityFilter !== 'all') params.set('action', activityFilter);
    const data = await authedFetch('/api/admin/activity?' + params);
    if (data?.success) setActivityData(data);
  }
  async function loadUsers() {
    const data = await authedFetch('/api/admin/users?limit=50');
    if (data?.success) setUserData(data);
  }
  function handleLogout() {
    localStorage.removeItem('finvalora_admin_token');
    fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin/login');
  }

  const stats = feedbackData?.stats || {};
  const actStats = activityData?.stats || {};
  const usrStats = userData?.stats || {};

  return (
    <>
      <Head><title>Admin Dashboard — FinValora</title></Head>
      <div className="min-h-screen bg-mist flex">
        {/* ── Sidebar ── */}
        <aside className="w-56 shrink-0 min-h-screen bg-forest flex flex-col">
          <div className="px-5 py-5 border-b border-white/8">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <FinValoraLogo size={30} />
              <div>
                <span className="text-sm font-bold text-white tracking-tight">FinValora</span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.15em] text-teal/70">Admin</span>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-0.5">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-all ' +
                  (tab === item.id ? 'bg-white/12 text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5')}
              >
                <item.Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="px-3 pb-4 border-t border-white/8 pt-3">
            <div className="flex items-center gap-2.5 px-3 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-white/12 flex items-center justify-center text-white text-[11px] font-bold">
                {(admin?.username || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="text-xs">
                <p className="text-white font-medium">{admin?.username || 'Admin'}</p>
                <p className="text-white/40">Administrator</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 text-[13px] font-medium transition"
            >
              <Icons.logout className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-10 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-lavender/15 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-void">
                {tab === 'overview' && 'Overview'}
                {tab === 'feedback' && 'User Feedback'}
                {tab === 'activity' && 'Activity Logs'}
                {tab === 'users' && 'Users'}
              </h1>
              <p className="text-xs text-ink-muted mt-0.5">
                {tab === 'overview' && 'System metrics and recent activity'}
                {tab === 'feedback' && 'All feedback submissions'}
                {tab === 'activity' && 'User activity across the platform'}
                {tab === 'users' && 'Registered accounts'}
              </p>
            </div>
            <button
              onClick={() => { setLoading(true); Promise.all([loadFeedback(), loadActivity(), loadUsers()]).then(() => setLoading(false)); }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-ink-secondary border border-lavender/40 rounded-lg hover:bg-mist transition"
            >
              <Icons.refresh className="w-3.5 h-3.5" />
              Refresh
            </button>
          </header>

          <main className="flex-1 p-6 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-32">
                <div className="w-8 h-8 border-2 border-teal/25 border-t-teal rounded-full animate-spin" />
              </div>
            ) : (
              <>
                {/* ═══════ OVERVIEW ═══════ */}
                {tab === 'overview' && (
                  <div className="space-y-6 max-w-6xl">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <StatCard label="Users" value={usrStats.totalUsers || 0} accent="forest" sub="Registered" />
                      <StatCard label="Feedback" value={stats.totalFeedbacks || 0} accent="teal" sub={stats.averageRating ? stats.averageRating + ' avg rating' : 'No ratings'} />
                      <StatCard label="Activities" value={actStats.totalActivities || 0} accent="blue" sub="All actions" />
                      <StatCard label="Avg Rating" value={stats.averageRating || '\u2014'} accent="amber" sub="Out of 5" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                      {/* Mood Distribution */}
                      <div className="rounded-xl border border-lavender/25 bg-white p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-4">Mood Distribution</h3>
                        {(stats.moodDistribution || []).length === 0 ? (
                          <p className="text-sm text-ink-muted text-center py-8">No feedback data</p>
                        ) : (
                          <div className="space-y-3">
                            {(stats.moodDistribution || []).map(m => {
                              const total = (stats.moodDistribution || []).reduce((s, x) => s + x.count, 0);
                              const pct = total ? Math.round((m.count / total) * 100) : 0;
                              const colors = { happy: 'bg-emerald-500', neutral: 'bg-amber-400', sad: 'bg-red-400' };
                              return (
                                <div key={m._id}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="flex items-center gap-2 text-sm text-void">
                                      <span className={'w-2 h-2 rounded-full ' + (colors[m._id] || 'bg-gray-400')} />
                                      <span className="capitalize font-medium">{m._id}</span>
                                    </span>
                                    <span className="text-xs font-mono text-ink-muted">{m.count} ({pct}%)</span>
                                  </div>
                                  <Progress value={m.count} max={total} color={colors[m._id] || 'bg-gray-400'} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Top Features */}
                      <div className="rounded-xl border border-lavender/25 bg-white p-5">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-4">Top Features</h3>
                        {(stats.featurePopularity || []).length === 0 ? (
                          <p className="text-sm text-ink-muted text-center py-8">No feature data</p>
                        ) : (
                          <div className="space-y-3">
                            {(stats.featurePopularity || []).map(f => {
                              const total = (stats.featurePopularity || []).reduce((s, x) => s + x.count, 0);
                              const pct = total ? Math.round((f.count / total) * 100) : 0;
                              const labels = { integration: 'Integration Tools', search: 'Search Function', customize: 'Customization' };
                              return (
                                <div key={f._id}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-sm font-medium text-void">{labels[f._id] || f._id}</span>
                                    <span className="text-xs font-mono text-ink-muted">{f.count} ({pct}%)</span>
                                  </div>
                                  <Progress value={f.count} max={total} />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Breakdown */}
                    <div className="rounded-xl border border-lavender/25 bg-white p-5">
                      <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted mb-4">Activity Breakdown</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5">
                        {(actStats.actionSummary || []).map(a => {
                          const cfg = ACTION_TYPES[a._id] || { label: a._id, color: 'bg-gray-100 text-gray-600 border-gray-200' };
                          return (
                            <div key={a._id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-lavender/20 bg-mist/30">
                              <span className="text-lg font-display font-bold text-void">{a.count}</span>
                              <span className="text-[11px] text-ink-muted leading-tight">{cfg.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="rounded-xl border border-lavender/25 bg-white">
                      <div className="px-5 py-3.5 border-b border-lavender/15 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Recent Activity</h3>
                        <button onClick={() => setTab('activity')} className="text-xs text-teal hover:text-forest font-medium transition flex items-center gap-1">
                          View all <Icons.arrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="divide-y divide-lavender/10">
                        {(activityData?.activities || []).slice(0, 8).map(act => (
                          <div key={act.id} className="flex items-center gap-3 px-5 py-2.5">
                            <ActionBadge action={act.action} />
                            <p className="flex-1 text-sm text-void truncate">{act.description}</p>
                            {act.user && <span className="text-xs text-ink-muted shrink-0">{act.user.name}</span>}
                            <span className="text-[11px] text-ink-muted shrink-0 font-mono">{timeAgo(act.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recent Signups */}
                    <div className="rounded-xl border border-lavender/25 bg-white">
                      <div className="px-5 py-3.5 border-b border-lavender/15 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Recent Signups</h3>
                        <button onClick={() => setTab('users')} className="text-xs text-teal hover:text-forest font-medium transition flex items-center gap-1">
                          View all <Icons.arrowRight className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="divide-y divide-lavender/10">
                        {(usrStats.recentSignups || []).map((u, i) => (
                          <div key={i} className="flex items-center gap-3 px-5 py-2.5">
                            <Avatar name={u.name} />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-void truncate">{u.name || 'User'}</p>
                              <p className="text-[11px] text-ink-muted truncate">{u.email}</p>
                            </div>
                            <span className="text-[11px] text-ink-muted font-mono shrink-0">{timeAgo(u.joinedAt)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ═══════ FEEDBACK ═══════ */}
                {tab === 'feedback' && (
                  <div className="space-y-5 max-w-6xl">
                    <div className="grid grid-cols-3 gap-4">
                      <StatCard label="Total" value={stats.totalFeedbacks || 0} accent="teal" />
                      <StatCard label="Avg Rating" value={stats.averageRating || '\u2014'} accent="amber" />
                      <StatCard label="Happy" value={(stats.moodDistribution || []).find(m => m._id === 'happy')?.count || 0} accent="forest" />
                    </div>

                    <div className="rounded-xl border border-lavender/25 bg-white overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-lavender/15 flex items-center justify-between">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">All Feedback</h3>
                        {feedbackData?.pagination && (
                          <span className="text-[11px] text-ink-muted font-mono">
                            {feedbackData.pagination.total} submissions
                          </span>
                        )}
                      </div>

                      {!feedbackData?.feedbacks?.length ? (
                        <EmptyState title="No feedback yet" description="Feedback will appear here once users submit it" />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-lavender/15 bg-mist/30">
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">User</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Mood</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Rating</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Features</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Message</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Date</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-lavender/10">
                              {feedbackData.feedbacks.map(fb => (
                                <tr key={fb._id} className="hover:bg-mist/20 transition-colors">
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                      <Avatar name={fb.userName} />
                                      <div>
                                        <p className="text-sm text-void font-medium">{fb.userName || 'Anonymous'}</p>
                                        <p className="text-[11px] text-ink-muted">{fb.userEmail || '\u2014'}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3"><MoodIndicator mood={fb.mood} /></td>
                                  <td className="px-5 py-3"><RatingStars rating={fb.rating} /></td>
                                  <td className="px-5 py-3">
                                    <div className="flex flex-wrap gap-1">
                                      {(fb.features || []).map(f => (
                                        <span key={f} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal/8 text-forest">{f}</span>
                                      ))}
                                    </div>
                                  </td>
                                  <td className="px-5 py-3">
                                    <p className="text-sm text-void/80 truncate max-w-xs">{fb.message || '\u2014'}</p>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <p className="text-[11px] text-ink-muted font-mono">{formatDate(fb.createdAt)}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {feedbackData?.pagination?.pages > 1 && (
                        <div className="px-5 py-2.5 border-t border-lavender/15 flex items-center justify-between">
                          <button onClick={() => setFeedbackPage(p => Math.max(1, p - 1))} disabled={feedbackPage <= 1}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-ink-secondary border border-lavender/30 rounded-md hover:bg-mist disabled:opacity-30 transition">
                            <Icons.chevronLeft className="w-3 h-3" /> Prev
                          </button>
                          <span className="text-[11px] text-ink-muted font-mono">{feedbackPage} / {feedbackData.pagination.pages}</span>
                          <button onClick={() => setFeedbackPage(p => p + 1)} disabled={feedbackPage >= feedbackData.pagination.pages}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-ink-secondary border border-lavender/30 rounded-md hover:bg-mist disabled:opacity-30 transition">
                            Next <Icons.chevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════ ACTIVITY ═══════ */}
                {tab === 'activity' && (
                  <div className="space-y-5 max-w-6xl">
                    <div className="flex items-center gap-3">
                      <select
                        value={activityFilter}
                        onChange={e => { setActivityFilter(e.target.value); setActivityPage(1); }}
                        className="px-3 py-1.5 text-xs font-medium border border-lavender/40 rounded-lg bg-white text-void focus:outline-none focus:ring-2 focus:ring-teal/20 cursor-pointer"
                      >
                        <option value="all">All actions</option>
                        {Object.keys(ACTION_TYPES).map(a => (
                          <option key={a} value={a}>{ACTION_TYPES[a].label}</option>
                        ))}
                      </select>
                      {activityData?.pagination && (
                        <span className="text-[11px] text-ink-muted font-mono">{activityData.pagination.total} total</span>
                      )}
                    </div>

                    <div className="rounded-xl border border-lavender/25 bg-white overflow-hidden">
                      {!activityData?.activities?.length ? (
                        <EmptyState title="No activity found" description="Activity logs will appear here" />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-lavender/15 bg-mist/30">
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">User</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Action</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Description</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Amount</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Category</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Time</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-lavender/10">
                              {activityData.activities.map(act => (
                                <tr key={act.id} className="hover:bg-mist/20 transition-colors">
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2">
                                      <Avatar name={act.user?.name} />
                                      <div>
                                        <p className="text-sm text-void font-medium">{act.user?.name || 'Unknown'}</p>
                                        <p className="text-[11px] text-ink-muted">{act.user?.email || ''}</p>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3"><ActionBadge action={act.action} /></td>
                                  <td className="px-5 py-3"><p className="text-sm text-void/80 truncate max-w-sm">{act.description}</p></td>
                                  <td className="px-5 py-3 text-right">
                                    {act.amount != null ? (
                                      <span className="text-sm font-mono font-semibold text-forest">{act.currency || ''}{act.amount.toLocaleString()}</span>
                                    ) : <span className="text-xs text-ink-muted">\u2014</span>}
                                  </td>
                                  <td className="px-5 py-3">
                                    {act.category ? <span className="text-[11px] font-medium text-ink-secondary bg-mist/50 px-1.5 py-0.5 rounded">{act.category}</span> : <span className="text-xs text-ink-muted">\u2014</span>}
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <p className="text-[11px] text-ink-muted font-mono">{timeAgo(act.createdAt)}</p>
                                    <p className="text-[10px] text-ink-muted/50 font-mono mt-0.5">{formatDate(act.createdAt)}</p>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {activityData?.pagination?.pages > 1 && (
                        <div className="px-5 py-2.5 border-t border-lavender/15 flex items-center justify-between">
                          <button onClick={() => setActivityPage(p => Math.max(1, p - 1))} disabled={activityPage <= 1}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-ink-secondary border border-lavender/30 rounded-md hover:bg-mist disabled:opacity-30 transition">
                            <Icons.chevronLeft className="w-3 h-3" /> Prev
                          </button>
                          <span className="text-[11px] text-ink-muted font-mono">{activityPage} / {activityData.pagination.pages}</span>
                          <button onClick={() => setActivityPage(p => p + 1)} disabled={activityPage >= activityData.pagination.pages}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-ink-secondary border border-lavender/30 rounded-md hover:bg-mist disabled:opacity-30 transition">
                            Next <Icons.chevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ═══════ USERS ═══════ */}
                {tab === 'users' && (
                  <div className="space-y-5 max-w-6xl">
                    <div className="grid grid-cols-2 gap-4">
                      <StatCard label="Total Users" value={usrStats.totalUsers || 0} accent="forest" />
                      <StatCard label="Feedbacks" value={usrStats.totalFeedback || 0} accent="teal" />
                    </div>

                    <div className="rounded-xl border border-lavender/25 bg-white overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-lavender/15">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-ink-muted">All Users</h3>
                      </div>

                      {!userData?.users?.length ? (
                        <EmptyState title="No users" description="Registered users will appear here" />
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-lavender/15 bg-mist/30">
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">User</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Email</th>
                                <th className="text-left text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Currency</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Activities</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Last Active</th>
                                <th className="text-right text-[11px] font-semibold uppercase tracking-wide text-ink-muted px-5 py-2.5">Joined</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-lavender/10">
                              {userData.users.map(u => (
                                <tr key={u.id} className="hover:bg-mist/20 transition-colors">
                                  <td className="px-5 py-3">
                                    <div className="flex items-center gap-2.5">
                                      <Avatar name={u.name} size="md" />
                                      <span className="text-sm font-medium text-void">{u.name || 'Unknown'}</span>
                                    </div>
                                  </td>
                                  <td className="px-5 py-3"><span className="text-sm text-ink-secondary">{u.email}</span></td>
                                  <td className="px-5 py-3">
                                    <span className="text-[11px] font-medium text-ink-secondary bg-mist/50 px-1.5 py-0.5 rounded">{u.currency || '\u2014'}</span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="text-sm font-mono font-semibold text-forest">{u.activityCount}</span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="text-[11px] text-ink-muted font-mono">{timeAgo(u.lastActivity)}</span>
                                  </td>
                                  <td className="px-5 py-3 text-right">
                                    <span className="text-[11px] text-ink-muted font-mono">{formatDate(u.joinedAt)}</span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </>
  );
}
