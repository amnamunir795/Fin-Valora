import { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/auth';

const ACTION_ICONS = {
  transaction_created: { icon: '💰', color: 'from-teal to-forest' },
  transaction_updated: { icon: '✏️', color: 'from-yellow-400 to-yellow-600' },
  transaction_deleted: { icon: '🗑️', color: 'from-red-400 to-red-600' },
  budget_created: { icon: '📊', color: 'from-blue-400 to-blue-600' },
  budget_updated: { icon: '📊', color: 'from-blue-300 to-blue-500' },
  category_created: { icon: '🏷️', color: 'from-purple-400 to-purple-600' },
  category_updated: { icon: '🏷️', color: 'from-purple-300 to-purple-500' },
  category_deleted: { icon: '🏷️', color: 'from-red-300 to-red-500' },
  ocr_uploaded: { icon: '📸', color: 'from-cyan-400 to-cyan-600' },
  ocr_expense_created: { icon: '🧾', color: 'from-teal to-forest' },
  user_login: { icon: '🔐', color: 'from-gray-400 to-gray-600' },
  user_signup: { icon: '🎉', color: 'from-green-400 to-green-600' },
  report_generated: { icon: '📄', color: 'from-indigo-400 to-indigo-600' }
};

function timeAgo(dateStr) {
  const now = new Date();
  const date = new Date(dateStr);
  const seconds = Math.floor((now - date) / 1000);

  if (seconds < 60) return 'Just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getActionLabel(action) {
  const labels = {
    transaction_created: 'Transaction Added',
    transaction_updated: 'Transaction Updated',
    transaction_deleted: 'Transaction Removed',
    budget_created: 'Budget Created',
    budget_updated: 'Budget Updated',
    category_created: 'Category Created',
    category_updated: 'Category Updated',
    category_deleted: 'Category Removed',
    ocr_uploaded: 'Receipt Uploaded',
    ocr_expense_created: 'Receipt Expense',
    user_login: 'Signed In',
    user_signup: 'Account Created',
    report_generated: 'Report Generated'
  };
  return labels[action] || action;
}

export default function ActivityLog({ currency = '₨', limit = 15 }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      setLoading(true);
      const res = await authenticatedFetch(`/api/activity?limit=${showAll ? 50 : limit}`);
      if (res.ok) {
        const data = await res.json();
        setActivities(data.activities || []);
      } else {
        setError('Failed to load activity');
      }
    } catch (err) {
      setError('Could not connect to server');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-lavender/60 bg-white/90 p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-forest flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-void">Activity Log</h3>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-lavender/40" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-lavender/40 rounded w-3/4" />
                <div className="h-2 bg-lavender/30 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-lavender/60 bg-white/90 p-6 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-forest flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-void">Activity Log</h3>
        </div>
        <p className="text-sm text-void/60">{error}</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-lavender/60 bg-white/90 p-6 shadow-md">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-forest flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-void">Activity Log</h3>
        </div>
        <button
          onClick={fetchActivities}
          className="text-xs font-medium text-teal hover:text-forest transition-colors"
        >
          Refresh
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-teal-soft/50 flex items-center justify-center">
            <svg className="w-6 h-6 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm text-void/60">No activity yet</p>
          <p className="text-xs text-void/40 mt-1">Start by adding a transaction or setting up your budget</p>
        </div>
      ) : (
        <div className="space-y-1">
          {activities.map((activity, idx) => {
            const style = ACTION_ICONS[activity.action] || { icon: '📌', color: 'from-gray-400 to-gray-600' };
            return (
              <div
                key={activity.id || idx}
                className="group flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors duration-200 hover:bg-teal-soft/30"
              >
                {/* Icon */}
                <div className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${style.color} text-sm text-white shadow-sm`}>
                  {style.icon}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-void truncate">
                      {getActionLabel(activity.action)}
                    </span>
                    {activity.amount != null && (
                      <span className="text-xs font-mono font-semibold text-forest">
                        {currency}{activity.amount.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-void/60 truncate mt-0.5">
                    {activity.description}
                  </p>
                </div>

                {/* Time */}
                <span className="shrink-0 text-[11px] text-void/40 font-medium mt-0.5">
                  {timeAgo(activity.createdAt)}
                </span>
              </div>
            );
          })}

          {activities.length >= limit && (
            <button
              onClick={() => { setShowAll(true); fetchActivities(); }}
              className="w-full mt-2 py-2 text-xs font-medium text-teal hover:text-forest transition-colors"
            >
              View all activity →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
