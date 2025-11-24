import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardHeader from '../../components/DashboardHeader';
import { CURRENCY_OPTIONS } from '../../constants/currencies';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : "$";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#C4C4DB]">
        <DashboardHeader user={user} budget={null} />
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ABFB2]"></div>
        </div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-[#C4C4DB]">
        <DashboardHeader user={user} budget={null} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg border p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#251B28] mb-4">No Budget Found</h1>
            <p className="text-[#251B28]/80 mb-6">Let's set up your first budget to get started!</p>
            <button
              onClick={() => router.push('/budget-setup')}
              className="w-full bg-[#01332B] text-white py-3 px-6 rounded-xl font-semibold hover:bg-[#01332B]/90 transition-all duration-200 shadow-lg"
            >
              Set Up Budget
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C4C4DB]">
      <DashboardHeader user={user} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess && (
          <div className="bg-gradient-to-r from-[#8ABFB2]/20 to-[#8ABFB2]/30 border-l-4 border-[#8ABFB2] rounded-lg p-4 mb-8 shadow-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#01332B] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-[#251B28]">{successMessage}</p>
            </div>
          </div>
        )}

        {router.query.setup === 'success' && (
          <div className="bg-gradient-to-r from-[#8ABFB2]/20 to-[#8ABFB2]/30 border-l-4 border-[#8ABFB2] rounded-lg p-4 mb-8 shadow-md">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-[#01332B] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm font-medium text-[#251B28]">Budget setup completed successfully! 🎉</p>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="bg-white rounded-2xl shadow-lg border p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#251B28]">
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p className="text-[#251B28]/80 mt-2">
                Here's your budget overview for this month
                {user && (
                  <span className="ml-2 px-2 py-1 bg-[#C4C4DB] rounded text-xs font-medium text-[#251B28]">
                    {getCurrencySymbol(user.currency)} {user.currency}
                  </span>
                )}
              </p>
            </div>
            <button
              onClick={() => router.push('/budget-setup?edit=true')}
              className="bg-[#01332B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#01332B]/90 transition-all duration-200 shadow-md"
            >
              Edit Budget
            </button>
          </div>
        </div>

        {/* Budget Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#8ABFB2]/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8ABFB2] text-sm font-semibold">Monthly Income</p>
                <p className="text-2xl font-bold text-[#251B28]">{getCurrencySymbol(user.currency)}{budget.totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-[#8ABFB2]/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#251B28]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#251B28] text-sm font-semibold">Spent This Month</p>
                <p className="text-2xl font-bold text-[#251B28]">{getCurrencySymbol(user.currency)}{budget.currentSpent.toLocaleString()}</p>
                <p className="text-xs text-[#251B28]/70">{budget.spendingProgress.toFixed(1)}% of limit</p>
              </div>
              <div className="w-12 h-12 bg-[#251B28]/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#251B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#8ABFB2]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#01332B] text-sm font-semibold">Saved This Month</p>
                <p className="text-2xl font-bold text-[#251B28]">{getCurrencySymbol(user.currency)}{budget.currentSaved.toLocaleString()}</p>
                <p className="text-xs text-[#01332B]/70">{budget.savingsProgress.toFixed(1)}% of goal</p>
              </div>
              <div className="w-12 h-12 bg-[#8ABFB2]/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#01332B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-[#8ABFB2]/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8ABFB2] text-sm font-semibold">Remaining Budget</p>
                <p className="text-2xl font-bold text-[#251B28]">{getCurrencySymbol(user.currency)}{budget.remainingBudget.toLocaleString()}</p>
                <p className="text-xs text-[#8ABFB2]/70">Available to spend</p>
              </div>
              <div className="w-12 h-12 bg-[#8ABFB2]/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-[#251B28] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => router.push('/budget-setup?edit=true')}
                className="w-full text-left p-3 rounded-lg border border-[#251B28]/25 hover:border-[#8ABFB2] hover:bg-[#C4C4DB] transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[#8ABFB2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="font-medium text-[#251B28]">Edit Budget</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-[#251B28]/25 hover:border-[#8ABFB2] hover:bg-[#C4C4DB] transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[#8ABFB2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="font-medium text-[#251B28]">Add Transaction</span>
                </div>
              </button>
              <button className="w-full text-left p-3 rounded-lg border border-[#251B28]/25 hover:border-[#8ABFB2] hover:bg-[#C4C4DB] transition-colors">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-[#8ABFB2] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="font-medium text-[#251B28]">View Reports</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-[#251B28] mb-4">Recent Activity</h3>
            <div className="text-center py-8 text-[#251B28]/70">
              <svg className="w-12 h-12 mx-auto mb-4 text-[#251B28]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">No transactions yet</p>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border">
            <h3 className="text-lg font-semibold text-[#251B28] mb-4">Insights</h3>
            <div className="text-center py-8 text-[#251B28]/70">
              <svg className="w-12 h-12 mx-auto mb-4 text-[#251B28]/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p className="text-sm">Coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}