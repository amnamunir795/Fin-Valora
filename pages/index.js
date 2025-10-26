import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getFormattedCurrency } from "../utils/currency";

export default function Home() {
  const MyName = "Amna";
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for success messages
    if (router.query.signup === "success") {
      setShowSuccess(true);
      setSuccessMessage('Account created successfully! Welcome to FinValora.');
      // Remove the query parameter from URL
      router.replace("/", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (router.query.login === "success") {
      setShowSuccess(true);
      setSuccessMessage('Welcome back! You have successfully logged in.');
      // Remove the query parameter from URL
      router.replace("/", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }

    // Check for logged in user
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      setUser(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6D8] via-[#F0D3C7] to-[#E8C5B5] p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B5BFC8] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F0D3C7] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#F2E6D8] rounded-full mix-blend-multiply filter blur-2xl opacity-15 animate-pulse delay-500"></div>
      </div>

      {showSuccess && (
        <div className="max-w-md mx-auto mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm relative z-10 transform animate-bounce">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <svg
                  className="h-6 w-6 text-white"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-semibold text-green-800">
                {successMessage}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Navigation Bar */}
        <nav className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-xl flex items-center justify-center mr-3 shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] bg-clip-text text-transparent">FinValora</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <div className="hidden md:flex items-center bg-gradient-to-r from-[#F0D3C7] to-[#F2E6D8] px-4 py-2 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">{user.firstName[0]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-700">Welcome, {user.firstName}!</p>
                      <p className="text-xs text-gray-500">{getFormattedCurrency(user.currency)}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#9FAAB5] hover:to-[#8A95A2] transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <a
                    href="/login"
                    className="text-[#B5BFC8] hover:text-[#9FAAB5] font-semibold px-6 py-3 rounded-xl transition-all duration-200 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </a>
                  <a
                    href="/signup"
                    className="bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white px-6 py-3 rounded-xl font-semibold hover:from-[#9FAAB5] hover:to-[#8A95A2] transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Sign Up
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Welcome Section */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-[#F0D3C7] to-[#E8C5B5] rounded-2xl p-8 shadow-xl border border-white/20 backdrop-blur-sm">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-xl flex items-center justify-center mr-4 shadow-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-[#B5BFC8]">
                  Welcome to Your Financial Dashboard
                </h2>
              </div>
              
              {user ? (
                <div className="space-y-4">
                  <p className="text-lg text-gray-700 mb-6">
                    Hello <span className="font-semibold text-[#B5BFC8]">{user.firstName}</span>! 
                    Ready to manage your finances in <span className="font-semibold">{getFormattedCurrency(user.currency)}</span>?
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-[#B5BFC8] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        <h4 className="font-semibold text-gray-800">Portfolio</h4>
                      </div>
                      <p className="text-sm text-gray-600">Track your investments</p>
                    </div>
                    
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-white/30">
                      <div className="flex items-center mb-2">
                        <svg className="w-5 h-5 text-[#B5BFC8] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                        <h4 className="font-semibold text-gray-800">Analytics</h4>
                      </div>
                      <p className="text-sm text-gray-600">View detailed reports</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="w-16 h-16 text-[#B5BFC8] mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <p className="text-lg text-gray-600 mb-6">
                    Please login or create an account to access your financial dashboard.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a
                      href="/login"
                      className="inline-flex items-center px-6 py-3 border-2 border-[#B5BFC8] text-[#B5BFC8] font-semibold rounded-xl hover:bg-[#B5BFC8] hover:text-white transition-all duration-200"
                    >
                      Login
                    </a>
                    <a
                      href="/signup"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white font-semibold rounded-xl hover:from-[#9FAAB5] hover:to-[#8A95A2] transition-all duration-200 shadow-lg"
                    >
                      Get Started
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Profile/Stats Sidebar */}
          <div className="space-y-6">
            {user && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white font-bold text-xl">{user.firstName[0]}{user.lastName[0]}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">{user.fullName}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                <div className="space-y-3 border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Currency:</span>
                    <span className="text-sm font-semibold text-[#B5BFC8]">{getFormattedCurrency(user.currency)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Member since:</span>
                    <span className="text-sm font-semibold text-gray-700">{new Date(user.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            )}
            
            {/* Quick Stats */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/20">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[#B5BFC8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#F0D3C7] to-[#F2E6D8] rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Total Users</span>
                  <span className="text-lg font-bold text-[#B5BFC8]">1,234</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#F2E6D8] to-[#F0D3C7] rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Active Today</span>
                  <span className="text-lg font-bold text-[#B5BFC8]">89</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
