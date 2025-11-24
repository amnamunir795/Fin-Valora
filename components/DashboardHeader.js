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
    <header className="bg-white shadow-sm border-b border-[#251B28]/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center group cursor-pointer relative">
            <div className="relative w-14 h-14 mr-3">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#8ABFB2]/30 group-hover:border-[#8ABFB2] group-hover:rotate-180 transition-all duration-700"></div>
              
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-slow"></div>
              
              {/* Main circular background with gradient */}
              <div className="absolute inset-1 bg-gradient-to-br from-[#8ABFB2] via-[#01332B] to-[#251B28] rounded-full shadow-xl group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 overflow-hidden">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              
              {/* Logo icon with animations */}
              <svg className="relative w-14 h-14 p-3" viewBox="0 0 32 32" fill="none">
                {/* Rising bars with stagger animation */}
                <g>
                  <rect x="3" y="20" width="4" height="9" rx="2" fill="white" opacity="0.6" className="group-hover:opacity-100 group-hover:translate-y-[-3px] transition-all duration-300"/>
                  <rect x="9" y="15" width="4" height="14" rx="2" fill="white" opacity="0.7" className="group-hover:opacity-100 group-hover:translate-y-[-3px] transition-all duration-300 delay-75"/>
                  <rect x="15" y="10" width="4" height="19" rx="2" fill="white" opacity="0.8" className="group-hover:opacity-100 group-hover:translate-y-[-3px] transition-all duration-300 delay-150"/>
                </g>
                
                {/* Dynamic upward arrow */}
                <g className="group-hover:translate-x-[3px] group-hover:translate-y-[-3px] transition-transform duration-500">
                  <path d="M21 20 L25 16 L29 18" stroke="#8ABFB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"/>
                  <path d="M25 16 L25 26" stroke="#8ABFB2" strokeWidth="2.5" strokeLinecap="round" className="group-hover:stroke-white transition-colors duration-300"/>
                  <path d="M21 16 L25 12 L29 16" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="white" className="group-hover:fill-[#8ABFB2] transition-all duration-300"/>
                </g>
                
                {/* Animated sparkles */}
                <circle cx="5" cy="8" r="1.5" fill="#8ABFB2" className="animate-ping-slow opacity-75">
                  <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="28" cy="5" r="1.5" fill="white" className="animate-ping-slow opacity-75" style={{animationDelay: '0.7s'}}>
                  <animate attributeName="r" values="1;2;1" dur="2s" repeatCount="indefinite" begin="0.7s"/>
                </circle>
              </svg>
            </div>
            
            <div className="relative overflow-hidden">
              <h1 className="text-2xl font-bold text-[#251B28] tracking-tight group-hover:text-[#8ABFB2] transition-all duration-300 group-hover:tracking-wider relative">
                FIN-VALORA
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#8ABFB2]/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-[#8ABFB2] via-[#01332B] to-transparent w-0 group-hover:w-full transition-all duration-700 rounded-full"></div>
              <p className="text-xs text-[#8ABFB2]/60 group-hover:text-[#8ABFB2] -mt-0.5 transition-all duration-300 group-hover:tracking-wider font-medium">
                Smart Finance Solutions
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-colors">
              Home
            </Link>
            <Link href="/dashboard" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/budget-setup?edit=true" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-colors">
              Budget
            </Link>
            <Link href="#" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-colors">
              Transactions
            </Link>
            <Link href="#" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-colors">
              Reports
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="hidden md:flex items-center bg-[#C4C4DB] px-4 py-2 rounded-lg">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">
                      {user.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#251B28]">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#251B28]/70">
                      {getFormattedCurrency(user.currency)}
                    </p>
                  </div>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center bg-[#01332B] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#01332B]/90 transition-all duration-200 shadow-md hover:shadow-lg"
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
          <div className="md:hidden border-t border-[#251B28]/25 py-4">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium">
                Home
              </Link>
              <Link href="/dashboard" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium">
                Dashboard
              </Link>
              <Link href="/budget-setup?edit=true" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium">
                Budget
              </Link>
              <Link href="#" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium">
                Transactions
              </Link>
              <Link href="#" className="text-[#251B28]/80 hover:text-[#8ABFB2] font-medium">
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