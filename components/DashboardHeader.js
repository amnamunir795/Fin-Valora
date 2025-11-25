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
    <header className="bg-gradient-to-r from-white via-[#C4C4DB]/10 to-white shadow-lg border-b-2 border-[#8ABFB2]/30 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center group cursor-pointer relative">
            <div className="relative w-12 h-12 mr-3">
              {/* Diamond rotating border */}
              <div className="absolute inset-0 rotate-45 group-hover:rotate-[225deg] transition-all duration-1000 ease-in-out">
                <div className="w-full h-full border-2 border-[#8ABFB2]/40 group-hover:border-[#8ABFB2] rounded-sm"></div>
              </div>
              
              {/* Pulsing glow effect */}
              <div className="absolute inset-0 bg-[#8ABFB2] rounded-xl blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-pulse"></div>
              
              {/* Main background - Rounded square */}
              <div className="absolute inset-1 bg-gradient-to-br from-[#251B28] via-[#01332B] to-[#8ABFB2] rounded-xl shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 overflow-hidden">
                {/* Diagonal shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/20 to-transparent -translate-x-full -translate-y-full group-hover:translate-x-full group-hover:translate-y-full transition-transform duration-1000"></div>
              </div>
              
              {/* Dashboard Logo - Speedometer/Gauge Design */}
              <svg className="relative w-12 h-12 p-2" viewBox="0 0 48 48" fill="none">
                {/* Speedometer Arc Background */}
                <path d="M8 30 A16 16 0 0 1 40 30" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.3"/>
                
                {/* Speedometer Arc - Colored Segments */}
                <path d="M8 30 A16 16 0 0 1 18 14" stroke="#8ABFB2" strokeWidth="3" strokeLinecap="round" opacity="0.9" className="group-hover:opacity-100 transition-opacity duration-300"/>
                <path d="M18 14 A16 16 0 0 1 30 14" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.8" className="group-hover:opacity-100 transition-opacity duration-300"/>
                <path d="M30 14 A16 16 0 0 1 40 30" stroke="#8ABFB2" strokeWidth="3" strokeLinecap="round" opacity="0.7" className="group-hover:opacity-100 transition-opacity duration-300"/>
                
                {/* Center hub */}
                <circle cx="24" cy="30" r="3" fill="white" opacity="0.9"/>
                <circle cx="24" cy="30" r="1.5" fill="#01332B" className="group-hover:fill-[#8ABFB2] transition-colors duration-300"/>
                
                {/* Speedometer Needle - Animated */}
                <g className="group-hover:rotate-45 transition-transform duration-500" style={{transformOrigin: '24px 30px'}}>
                  <line x1="24" y1="30" x2="24" y2="16" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="24" cy="16" r="2" fill="white" opacity="0.8">
                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
                  </circle>
                </g>
                
                {/* Tick marks */}
                <g opacity="0.6" className="group-hover:opacity-100 transition-opacity duration-300">
                  <line x1="10" y1="28" x2="12" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="15" y1="18" x2="17" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="24" y1="14" x2="24" y2="17" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="33" y1="18" x2="31" y2="19" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                  <line x1="38" y1="28" x2="36" y2="26" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </g>
                
                {/* Bottom display panel */}
                <rect x="14" y="34" width="20" height="8" rx="2" fill="white" opacity="0.2"/>
                <rect x="15" y="35" width="18" height="6" rx="1.5" fill="white" opacity="0.9" className="group-hover:fill-[#8ABFB2] transition-colors duration-300"/>
                
                {/* Mini bars in display */}
                <g opacity="0.8">
                  <rect x="17" y="38" width="2" height="2" rx="0.5" fill="#01332B"/>
                  <rect x="21" y="37" width="2" height="3" rx="0.5" fill="#01332B"/>
                  <rect x="25" y="36.5" width="2" height="3.5" rx="0.5" fill="#01332B"/>
                  <rect x="29" y="37.5" width="2" height="2.5" rx="0.5" fill="#01332B"/>
                </g>
                
                {/* Floating indicators */}
                <circle cx="10" cy="10" r="1.5" fill="#8ABFB2" opacity="0.8">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite"/>
                </circle>
                <circle cx="38" cy="10" r="1.5" fill="white" opacity="0.8">
                  <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.7s"/>
                </circle>
              </svg>
            </div>
            
            <div className="relative overflow-hidden">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#251B28] via-[#01332B] to-[#8ABFB2] bg-clip-text text-transparent group-hover:from-[#8ABFB2] group-hover:via-[#01332B] group-hover:to-[#251B28] transition-all duration-500 tracking-tight">
                FIN-VALORA
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-[#8ABFB2] via-[#01332B] to-transparent w-0 group-hover:w-full transition-all duration-500 rounded-full"></div>
              <p className="text-[10px] text-[#8ABFB2]/70 group-hover:text-[#01332B] font-semibold tracking-wide transition-all duration-300">
                DASHBOARD
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link href="/" className="relative px-4 py-2 text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-all duration-300 rounded-lg hover:bg-[#C4C4DB]/30 group">
              <span className="relative z-10">Home</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8ABFB2]/0 via-[#8ABFB2]/10 to-[#8ABFB2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
            <Link href="/dashboard" className="relative px-4 py-2 text-[#8ABFB2] font-semibold transition-all duration-300 rounded-lg bg-[#8ABFB2]/10 border border-[#8ABFB2]/30">
              <span className="relative z-10">Dashboard</span>
            </Link>
            <Link href="/budget-setup?edit=true" className="relative px-4 py-2 text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-all duration-300 rounded-lg hover:bg-[#C4C4DB]/30 group">
              <span className="relative z-10">Budget</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8ABFB2]/0 via-[#8ABFB2]/10 to-[#8ABFB2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
            <Link href="#" className="relative px-4 py-2 text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-all duration-300 rounded-lg hover:bg-[#C4C4DB]/30 group">
              <span className="relative z-10">Transactions</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8ABFB2]/0 via-[#8ABFB2]/10 to-[#8ABFB2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
            <Link href="#" className="relative px-4 py-2 text-[#251B28]/80 hover:text-[#8ABFB2] font-medium transition-all duration-300 rounded-lg hover:bg-[#C4C4DB]/30 group">
              <span className="relative z-10">Reports</span>
              <span className="absolute inset-0 bg-gradient-to-r from-[#8ABFB2]/0 via-[#8ABFB2]/10 to-[#8ABFB2]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user && (
              <>
                <div className="hidden md:flex items-center bg-gradient-to-r from-[#C4C4DB]/40 to-[#C4C4DB]/20 px-4 py-2 rounded-xl border border-[#8ABFB2]/20 hover:border-[#8ABFB2]/40 transition-all duration-300 hover:shadow-md group cursor-pointer">
                  <div className="w-9 h-9 bg-gradient-to-br from-[#8ABFB2] via-[#01332B] to-[#251B28] rounded-full flex items-center justify-center mr-3 shadow-md group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/50">
                    <span className="text-white font-bold text-sm">
                      {user.firstName[0]}{user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#251B28] group-hover:text-[#01332B] transition-colors duration-300">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs text-[#8ABFB2] font-semibold">
                      {getFormattedCurrency(user.currency)}
                    </p>
                  </div>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="lg:hidden p-2 rounded-lg text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]/30 transition-all duration-300"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                <button
                  onClick={handleLogout}
                  className="hidden md:flex items-center bg-gradient-to-r from-[#01332B] to-[#251B28] text-white px-5 py-2 rounded-xl font-semibold hover:from-[#8ABFB2] hover:to-[#01332B] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105 group"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden border-t border-[#8ABFB2]/30 py-4 bg-gradient-to-b from-[#C4C4DB]/10 to-transparent animate-fade-in">
            <div className="flex flex-col space-y-2">
              {/* User info on mobile */}
              <div className="flex items-center bg-gradient-to-r from-[#C4C4DB]/40 to-[#C4C4DB]/20 px-4 py-3 rounded-xl border border-[#8ABFB2]/20 mb-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8ABFB2] via-[#01332B] to-[#251B28] rounded-full flex items-center justify-center mr-3 shadow-md ring-2 ring-white/50">
                  <span className="text-white font-bold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#251B28]">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-[#8ABFB2] font-semibold">
                    {getFormattedCurrency(user.currency)}
                  </p>
                </div>
              </div>

              <Link href="/" className="px-4 py-3 text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]/30 font-medium rounded-lg transition-all duration-300">
                Home
              </Link>
              <Link href="/dashboard" className="px-4 py-3 text-[#8ABFB2] bg-[#8ABFB2]/10 border border-[#8ABFB2]/30 font-semibold rounded-lg">
                Dashboard
              </Link>
              <Link href="/budget-setup?edit=true" className="px-4 py-3 text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]/30 font-medium rounded-lg transition-all duration-300">
                Budget
              </Link>
              <Link href="#" className="px-4 py-3 text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]/30 font-medium rounded-lg transition-all duration-300">
                Transactions
              </Link>
              <Link href="#" className="px-4 py-3 text-[#251B28]/80 hover:text-[#8ABFB2] hover:bg-[#C4C4DB]/30 font-medium rounded-lg transition-all duration-300">
                Reports
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-gradient-to-r from-[#01332B] to-[#251B28] text-white px-4 py-3 rounded-lg font-semibold hover:from-[#8ABFB2] hover:to-[#01332B] transition-all duration-300 shadow-md mt-2"
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