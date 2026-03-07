import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { CURRENCY_OPTIONS } from '../../constants/currencies';
import { logout } from '../../utils/auth';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [budget, setBudget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('December');
  const [showMonthFilter, setShowMonthFilter] = useState(false);
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
      <div className="min-h-screen bg-[#C4C4DB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8ABFB2]"></div>
      </div>
    );
  }

  if (!budget) {
    return (
      <div className="min-h-screen bg-[#C4C4DB] flex items-center justify-center">
        <div className="max-w-md mx-auto bg-[#FFFFFF] rounded-2xl shadow-xl border border-[#C4C4DB]/40 p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full mb-4 shadow-lg">
            <svg className="w-8 h-8 text-[#FFFFFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#251B28] mb-4">No Budget Found</h1>
          <p className="text-[#01332B] mb-6">Let's set up your first budget to get started!</p>
          <button
            onClick={() => router.push('/budget-setup')}
            className="w-full bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] py-3 px-6 rounded-xl font-semibold hover:from-[#01332B] hover:to-[#251B28] transition-all duration-200 shadow-lg"
          >
            Set Up Budget
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#C4C4DB] flex">
      {/* Sidebar */}
      <div className="w-64 bg-[#FFFFFF] shadow-xl border-r border-[#C4C4DB]/40">
        {/* Logo */}
        <div className="p-6 border-b border-[#C4C4DB]/30 bg-gradient-to-r from-[#FFFFFF] to-[#C4C4DB]/10">
          <div className="flex items-center group cursor-pointer">
            <div className="relative w-10 h-10 mr-3">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* Main circular background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ABFB2] via-[#01332B] to-[#251B28] rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 overflow-hidden">
                {/* Animated shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              
              {/* Logo icon - Finance themed */}
              <svg className="relative w-10 h-10 p-1.5" viewBox="0 0 48 48" fill="none">
                {/* Coin stack */}
                <g className="group-hover:translate-y-[-1px] transition-transform duration-300">
                  <ellipse cx="16" cy="38" rx="8" ry="3" fill="white" opacity="0.6"/>
                  <ellipse cx="16" cy="35" rx="8" ry="3" fill="white" opacity="0.7"/>
                  <ellipse cx="16" cy="32" rx="8" ry="3" fill="white" opacity="0.8"/>
                  <ellipse cx="16" cy="29" rx="8" ry="3" fill="white"/>
                  <text x="16" y="31" textAnchor="middle" fill="#01332B" fontSize="6" fontWeight="bold">$</text>
                </g>
                
                {/* Growth chart */}
                <g className="group-hover:scale-105 transition-transform duration-300">
                  <rect x="28" y="32" width="3" height="8" rx="1.5" fill="white" opacity="0.7" className="group-hover:opacity-100 transition-opacity duration-300"/>
                  <rect x="33" y="28" width="3" height="12" rx="1.5" fill="white" opacity="0.8" className="group-hover:opacity-100 transition-opacity duration-300"/>
                  <rect x="38" y="24" width="3" height="16" rx="1.5" fill="white" className="group-hover:opacity-100 transition-opacity duration-300"/>
                </g>
                
                {/* Upward arrow */}
                <g className="group-hover:translate-x-[1px] group-hover:translate-y-[-1px] transition-transform duration-300">
                  <path d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12" stroke="#8ABFB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"/>
                </g>
                
                {/* Currency symbols floating */}
                <g className="animate-pulse" style={{animationDuration: '2s'}}>
                  <text x="8" y="12" fill="#8ABFB2" fontSize="6" fontWeight="bold" opacity="0.8">$</text>
                  <text x="38" y="14" fill="#01332B" fontSize="5" fontWeight="bold" opacity="0.7">€</text>
                  <text x="6" y="22" fill="#01332B" fontSize="5" fontWeight="bold" opacity="0.6">£</text>
                </g>
                
                {/* Sparkle effects */}
                <circle cx="42" cy="10" r="1.5" fill="#8ABFB2" className="animate-ping" style={{animationDuration: '2s'}}/>
                <circle cx="10" cy="38" r="1" fill="#01332B" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}/>
              </svg>
            </div>
            <span className="text-xl font-bold text-[#251B28] group-hover:text-[#01332B] transition-colors duration-300">FinValora</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <a href="#" className="flex items-center px-4 py-3 text-[#FFFFFF] bg-gradient-to-r from-[#8ABFB2] to-[#01332B] rounded-lg shadow-md">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
              </svg>
              Dashboard
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Income
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Expenses
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reports
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              AI Chat
            </a>
            <a href="#" className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Setting
            </a>
          </div>
        </nav>

        {/* Logout */}
        <div className="absolute bottom-6 left-6">
          <button 
            onClick={async () => {
              await logout();
            }}
            className="flex items-center px-4 py-3 text-[#251B28] hover:bg-[#C4C4DB]/30 hover:text-[#01332B] rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FFFFFF] to-[#C4C4DB]/20 shadow-lg border-b border-[#C4C4DB]/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-[#251B28]">Dashboard</h1>
            <div className="flex items-center space-x-4">
              {/* Month Selector Dropdown */}
              <select 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-[#C4C4DB] rounded-lg text-[#251B28] bg-[#FFFFFF] hover:border-[#8ABFB2] focus:ring-2 focus:ring-[#8ABFB2] focus:border-transparent transition-all duration-200"
              >
                <option>January</option>
                <option>February</option>
                <option>March</option>
                <option>April</option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>

              {/* Filter Data Button with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowMonthFilter(!showMonthFilter)}
                  className="px-4 py-2 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] rounded-lg hover:from-[#01332B] hover:to-[#251B28] flex items-center font-medium shadow-md transition-all duration-200"
                >
                  Filter Data
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showMonthFilter && (
                  <div className="absolute right-0 mt-2 w-56 bg-[#FFFFFF] rounded-lg shadow-xl border border-[#C4C4DB]/40 z-10">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm font-medium text-[#251B28] border-b border-[#C4C4DB]/30">Filter Options</div>
                      
                      {/* Date Range Filter */}
                      <div className="px-4 py-3 border-b border-[#C4C4DB]/30">
                        <label className="block text-xs font-medium text-[#251B28] mb-2">Date Range</label>
                        <div className="space-y-2">
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">Last 7 days</button>
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">Last 30 days</button>
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">This Quarter</button>
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">This Year</button>
                        </div>
                      </div>

                      {/* Transaction Type Filter */}
                      <div className="px-4 py-3 border-b border-[#C4C4DB]/30">
                        <label className="block text-xs font-medium text-[#251B28] mb-2">Transaction Type</label>
                        <div className="space-y-2">
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">All Transactions</button>
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">Income Only</button>
                          <button className="w-full text-left px-3 py-2 text-sm text-[#251B28] hover:bg-[#C4C4DB]/30 rounded">Expenses Only</button>
                        </div>
                      </div>

                      {/* Apply/Reset Buttons */}
                      <div className="px-4 py-3 flex space-x-2">
                        <button 
                          onClick={() => setShowMonthFilter(false)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] text-sm rounded hover:from-[#01332B] hover:to-[#251B28] transition-all duration-200"
                        >
                          Apply Filters
                        </button>
                        <button 
                          onClick={() => setShowMonthFilter(false)}
                          className="px-3 py-2 border border-[#C4C4DB] text-[#251B28] text-sm rounded hover:bg-[#C4C4DB]/30 transition-all duration-200"
                        >
                          Reset
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <main className="p-6 space-y-6">
          {/* Success Messages */}
          {showSuccess && (
            <div className="bg-gradient-to-r from-[#8ABFB2]/20 to-[#01332B]/20 border border-[#8ABFB2]/40 rounded-lg p-4 shadow-md">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-[#01332B] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="text-sm font-medium text-[#251B28]">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-[#C4C4DB]/20 via-[#FFFFFF] to-[#8ABFB2]/20 rounded-xl p-6 border border-[#C4C4DB]/40 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-[#251B28] mb-2">
                  Welcome back! 👋
                </h1>
                <p className="text-[#01332B]">Here's your financial overview for {selectedMonth}</p>
              </div>
              <div className="hidden md:block">
                <div className="w-16 h-16 bg-gradient-to-br from-[#8ABFB2]/30 to-[#01332B]/30 rounded-full flex items-center justify-center shadow-md">
                  <svg className="w-8 h-8 text-[#01332B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Top Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-[#01332B] mb-2">Total Income</h3>
              <p className="text-2xl font-bold text-[#8ABFB2]">Rs.{budget.totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-[#01332B] mb-2">Total Expenses</h3>
              <p className="text-2xl font-bold text-[#251B28]">Rs.{budget.currentSpent.toLocaleString()}</p>
            </div>
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md hover:shadow-lg transition-shadow duration-200">
              <h3 className="text-sm font-medium text-[#01332B] mb-2">Net Balance</h3>
              <p className="text-2xl font-bold text-[#01332B]">Rs.{(budget.totalIncome - budget.currentSpent).toLocaleString()}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#251B28] mb-4">Expenses</h3>
              <div className="h-64 flex items-center justify-center text-[#01332B]">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p>Chart will be displayed here</p>
                </div>
              </div>
            </div>
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#251B28] mb-4">Expenses Breakdown</h3>
              <div className="h-64 flex items-center justify-center text-[#01332B]">
                <div className="text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md">
              <h3 className="text-lg font-semibold text-[#251B28] mb-6">Categories Breakdown</h3>
              
              <div className="space-y-6">
                {/* Expenses Section */}
                <div>
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-[#01332B] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                    <span className="text-sm font-medium text-[#01332B]">Expenses (0)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#C4C4DB]/20 to-[#C4C4DB]/10 rounded-lg p-8 text-center border border-[#C4C4DB]/30">
                    <span className="text-2xl font-bold text-[#8ABFB2]">N/A</span>
                  </div>
                </div>

                {/* Incomes Section */}
                <div>
                  <div className="flex items-center mb-3">
                    <svg className="w-5 h-5 text-[#01332B] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span className="text-sm font-medium text-[#01332B]">Incomes (0)</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#C4C4DB]/20 to-[#C4C4DB]/10 rounded-lg p-8 text-center border border-[#C4C4DB]/30">
                    <span className="text-2xl font-bold text-[#8ABFB2]">N/A</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FinValora AI Assistant */}
            <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 shadow-md">
              <div className="h-full flex flex-col">
                {/* AI Chat Interface */}
                <div className="flex-1 bg-gradient-to-br from-[#C4C4DB]/20 to-[#C4C4DB]/10 rounded-lg p-4 mb-4 border border-[#C4C4DB]/30">
                  <div className="space-y-3">
                    {/* AI Message Bubbles */}
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full flex items-center justify-center text-[#FFFFFF] text-sm font-medium shadow-md">
                        AI
                      </div>
                      <div className="bg-gradient-to-r from-[#01332B] to-[#251B28] text-[#FFFFFF] rounded-lg px-3 py-2 max-w-xs shadow-md">
                        <p className="text-sm">Hello! How can I help you manage your finances today?</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full flex items-center justify-center text-[#FFFFFF] text-sm font-medium shadow-md">
                        AI
                      </div>
                      <div className="bg-gradient-to-r from-[#01332B] to-[#251B28] text-[#FFFFFF] rounded-lg px-3 py-2 max-w-xs shadow-md">
                        <p className="text-sm">I can analyze your spending patterns and provide insights.</p>
                      </div>
                    </div>

                    {/* User Input Area */}
                    <div className="flex justify-end">
                      <div className="bg-[#C4C4DB]/40 rounded-lg px-3 py-2 max-w-xs border border-[#C4C4DB]/50">
                        <p className="text-sm text-[#251B28]">Type a message...</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Assistant Info */}
                <div>
                  <h4 className="text-lg font-bold text-[#251B28] mb-2">FinValora AI</h4>
                  <p className="text-sm text-[#01332B]">Get assistance with managing your expenses and income.</p>
                </div>
              </div>
            </div>
          </div>

          {/* OCR Tool Section */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-6 mb-6 shadow-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-[#251B28] mb-2">OCR Receipt Scanner</h3>
                <p className="text-sm text-[#01332B]">Upload receipts and bills to automatically extract transaction data</p>
              </div>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#8ABFB2]/30 to-[#01332B]/30 rounded-lg shadow-md">
                <svg className="w-6 h-6 text-[#01332B]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-[#C4C4DB] rounded-lg p-6 text-center hover:border-[#8ABFB2] transition-colors cursor-pointer bg-gradient-to-br from-[#C4C4DB]/10 to-transparent">
                <div className="flex flex-col items-center">
                  <svg className="w-12 h-12 text-[#8ABFB2] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h4 className="text-lg font-medium text-[#251B28] mb-2">Upload Receipt</h4>
                  <p className="text-sm text-[#01332B] mb-4">Drag and drop your receipt or click to browse</p>
                  <button className="px-4 py-2 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] rounded-lg hover:from-[#01332B] hover:to-[#251B28] transition-all duration-200 shadow-md">
                    Choose File
                  </button>
                  <p className="text-xs text-[#01332B]/70 mt-2">Supports JPG, PNG, PDF files</p>
                </div>
              </div>

              {/* OCR Results */}
              <div className="bg-gradient-to-br from-[#C4C4DB]/20 to-[#C4C4DB]/10 rounded-lg p-6 border border-[#C4C4DB]/30">
                <h4 className="text-lg font-medium text-[#251B28] mb-4">Extracted Data</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-[#C4C4DB]/40">
                    <span className="text-sm text-[#01332B]">Amount:</span>
                    <span className="text-sm font-medium text-[#251B28]">--</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#C4C4DB]/40">
                    <span className="text-sm text-[#01332B]">Merchant:</span>
                    <span className="text-sm font-medium text-[#251B28]">--</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#C4C4DB]/40">
                    <span className="text-sm text-[#01332B]">Date:</span>
                    <span className="text-sm font-medium text-[#251B28]">--</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm text-[#01332B]">Category:</span>
                    <span className="text-sm font-medium text-[#251B28]">--</span>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] rounded-lg hover:from-[#01332B] hover:to-[#251B28] transition-all duration-200 disabled:bg-[#C4C4DB]/50 disabled:cursor-not-allowed shadow-md" disabled>
                  Add to Expenses
                </button>
              </div>
            </div>

            {/* Recent Scans */}
            <div className="mt-6">
              <h4 className="text-lg font-medium text-[#251B28] mb-4">Recent Scans</h4>
              <div className="bg-gradient-to-br from-[#C4C4DB]/20 to-[#C4C4DB]/10 rounded-lg p-4 border border-[#C4C4DB]/30">
                <div className="text-center text-[#01332B]">
                  <svg className="w-8 h-8 mx-auto mb-2 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm">No receipts scanned yet</p>
                  <p className="text-xs text-[#01332B]/70">Upload your first receipt to get started</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gradient-to-r from-[#FFFFFF] via-[#C4C4DB]/20 to-[#FFFFFF] rounded-lg border border-[#C4C4DB]/40 p-8 shadow-lg">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#251B28] mb-4">Unlock Your Financial Insights</h2>
              <p className="text-[#01332B] mb-6">Get a deeper understanding of your financial performance with our detailed reports.</p>
              <button 
                onClick={() => router.push('/budget-setup?edit=true')}
                className="px-6 py-3 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] text-[#FFFFFF] rounded-lg hover:from-[#01332B] hover:to-[#251B28] transition-all duration-200 shadow-md hover:shadow-lg"
              >
                View Detailed Reports
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}