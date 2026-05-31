import { useState } from 'react';
import Link from 'next/link';
import { logout } from '../utils/auth';
import FinValoraLogo from './FinValoraLogo';
import { getFormattedCurrency } from '../utils/currency';
import { CURRENCY_OPTIONS } from '../constants/currencies';

export default function DashboardHeader({ user }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : '$';
  };

  const navLink =
    'group relative px-4 py-2 font-medium text-white transition-colors duration-300 rounded-lg hover:text-teal';
  const navLinkHoverBg = 'absolute inset-0 rounded-lg bg-transparent transition-colors group-hover:bg-white/10';

  return (
    <header className="sticky top-0 z-50 border-b border-lavender bg-forest shadow-fv-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3">
          <Link href="/dashboard" className="group relative flex cursor-pointer items-center" aria-label="FinValora dashboard">
            <div className="relative mr-3 h-12 w-12 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-teal/20 opacity-0 blur-md transition-opacity group-hover:opacity-100" />
              <FinValoraLogo size={48} className="relative drop-shadow-md transition-transform group-hover:scale-[1.03]" />
            </div>

            <div className="relative overflow-hidden">
              <h1 className="text-2xl font-bold tracking-tight text-white transition-colors group-hover:text-teal">
                FIN-VALORA
              </h1>
              <div className="h-0.5 w-0 rounded-full bg-gradient-to-r from-teal to-white transition-all duration-500 group-hover:w-full" />
              <p className="text-[10px] font-semibold tracking-wide text-white/80 transition-colors group-hover:text-teal">
                DASHBOARD
              </p>
            </div>
          </Link>

          <nav className="hidden items-center space-x-1 lg:flex">
            <Link href="/" className={navLink}>
              <span className={navLinkHoverBg} />
              <span className="relative z-10">Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="relative rounded-lg border border-lavender bg-white/10 px-4 py-2 font-semibold text-teal"
            >
              Dashboard
            </Link>
            <Link href="/budget-setup?edit=true" className={navLink}>
              <span className={navLinkHoverBg} />
              <span className="relative z-10">Budget</span>
            </Link>
            <Link href="#" className={navLink}>
              <span className={navLinkHoverBg} />
              <span className="relative z-10">Transactions</span>
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            {user && (
              <>
                <div className="group hidden cursor-pointer items-center rounded-xl border border-lavender bg-white/10 px-4 py-2 transition-all duration-300 hover:border-teal md:flex">
                  <div className="mr-3 flex h-9 w-9 items-center justify-center rounded-full bg-teal shadow-md ring-2 ring-white/40 transition-transform duration-300 group-hover:scale-110">
                    <span className="text-sm font-bold text-white">
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white transition-colors group-hover:text-teal">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-xs font-semibold text-teal">{getFormattedCurrency(user.currency)}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 hover:text-teal lg:hidden"
                  aria-expanded={isMenuOpen}
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out of your account"
                  className="group hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-forest shadow-md ring-2 ring-white/90 transition-all duration-200 hover:scale-[1.02] hover:bg-teal hover:text-white hover:shadow-lg hover:ring-teal md:inline-flex"
                >
                  <svg
                    className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Log out
                </button>
              </>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="animate-fade-in border-t border-lavender bg-forest py-4 lg:hidden">
            <div className="flex flex-col space-y-2">
              <div className="mb-3 flex items-center rounded-xl border border-lavender bg-white/10 px-4 py-3">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-teal shadow-md ring-2 ring-white/40">
                  <span className="text-sm font-bold text-white">
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs font-semibold text-teal">{getFormattedCurrency(user.currency)}</p>
                </div>
              </div>

              <Link href="/" className="rounded-lg px-4 py-3 font-medium text-white transition-colors hover:bg-white/10 hover:text-teal">
                Home
              </Link>
              <Link href="/dashboard" className="rounded-lg border border-lavender bg-white/10 px-4 py-3 font-semibold text-teal">
                Dashboard
              </Link>
              <Link href="/budget-setup?edit=true" className="rounded-lg px-4 py-3 font-medium text-white transition-colors hover:bg-white/10 hover:text-teal">
                Budget
              </Link>
              <Link href="#" className="rounded-lg px-4 py-3 font-medium text-white transition-colors hover:bg-white/10 hover:text-teal">
                Transactions
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out of your account"
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-base font-bold text-forest shadow-lg ring-2 ring-white/50 transition-all hover:bg-teal hover:text-white hover:shadow-xl hover:ring-teal"
              >
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
