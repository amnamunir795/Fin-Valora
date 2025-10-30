import { useState } from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';
import { getFormattedCurrency } from '../utils/currency';
import { CURRENCY_OPTIONS } from '../constants/currencies';

export default function DashboardHeader({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : "$";
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-lg flex items-center justify-center mr-3 shadow-md">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] bg-clip-text text-transparent">
              FinValora
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/dashboard" className="text-gray-600 hover:text-[#B5BFC8] font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/budget-setup?edit=true" className="text-gray-600 hover:text-[#B5BFC8] font-medium transition-colors">
              Budget
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#B5BFC8] font-medium transition-colors">
              Transactions
            </Link>
            <Link href="#" className="text-gray-600 hover:text-[#B5BFC8] font-medium transition-colors">
              Reports
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-700">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {getFormattedCurrency(user.currency)}
                    </p>
                  </div>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#B5BFC8] hover:bg-gray-50"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white px-4 py-2 rounded-lg font-semibold hover:from-[#9FAAB5] hover:to-[#8A95A2] transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/dashboard" className="text-gray-600 hover:text-[#B5BFC8] font-medium">
                Dashboard
              </Link>
              <Link href="/budget-setup?edit=true" className="text-gray-600 hover:text-[#B5BFC8] font-medium">
                Budget
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#B5BFC8] font-medium">
                Transactions
              </Link>
              <Link href="#" className="text-gray-600 hover:text-[#B5BFC8] font-medium">
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}