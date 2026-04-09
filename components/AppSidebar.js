import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../utils/auth';
import FinValoraLogo from './FinValoraLogo';

/* Sidebar: bg #8ABFB2, text #01332B, active #FFFFFF, hover #C4C4DB */
const NAV_ACTIVE =
  'flex items-center px-4 py-3 rounded-lg bg-white text-forest shadow-md font-semibold';
const NAV_IDLE =
  'flex items-center px-4 py-3 rounded-lg text-forest transition-all duration-200 hover:bg-lavender';

function navClass(pathname, href) {
  return pathname === href ? NAV_ACTIVE : NAV_IDLE;
}

/**
 * @param {object} props
 * @param {boolean} [props.featuredLogo] - Dashboard-style animated logo
 * @param {() => void} [props.onOcrClick] - Shows OCR row (dashboard only)
 */
export default function AppSidebar({ featuredLogo = false, onOcrClick }) {
  const { pathname } = useRouter();

  return (
    <div className="relative min-h-screen w-64 shrink-0 border-r border-forest/15 bg-teal shadow-xl">
      <div className="border-b border-forest/20 p-6">
        <Link href="/dashboard" className="group flex cursor-pointer items-center" aria-label="FinValora home">
          <div className="relative mr-3 h-10 w-10 shrink-0">
            {featuredLogo ? (
              <div className="absolute inset-0 rounded-xl bg-white/25 blur-md transition-opacity group-hover:opacity-100" />
            ) : null}
            <div className="relative">
              <FinValoraLogo size={40} animated={Boolean(featuredLogo)} className="drop-shadow-sm transition-transform group-hover:scale-[1.03]" />
            </div>
          </div>
          <span className="text-xl font-bold text-forest transition-colors duration-300 group-hover:text-forest/90">
            FinValora
          </span>
        </Link>
      </div>

      <nav className="mt-6 space-y-2 px-4 pb-40" aria-label="Main navigation">
        <Link
          href="/dashboard"
          className={navClass(pathname, '/dashboard')}
          aria-current={pathname === '/dashboard' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
          </svg>
          Dashboard
        </Link>
        <Link
          href="/categories"
          className={navClass(pathname, '/categories')}
          aria-current={pathname === '/categories' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </Link>
        <Link
          href="/income"
          className={navClass(pathname, '/income')}
          aria-current={pathname === '/income' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Income
        </Link>
        <Link
          href="/expenses"
          className={navClass(pathname, '/expenses')}
          aria-current={pathname === '/expenses' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Expenses
        </Link>
        <Link
          href="/reports"
          className={navClass(pathname, '/reports')}
          aria-current={pathname === '/reports' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Report
        </Link>
        {typeof onOcrClick === 'function' ? (
          <button
            type="button"
            onClick={onOcrClick}
            className={`w-full text-left ${NAV_IDLE}`}
          >
            <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            OCR Scanner
          </button>
        ) : null}
        <Link
          href="/ai-chat"
          className={navClass(pathname, '/ai-chat')}
          aria-current={pathname === '/ai-chat' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          AI Chat
        </Link>
        <Link
          href="/settings"
          className={navClass(pathname, '/settings')}
          aria-current={pathname === '/settings' ? 'page' : undefined}
        >
          <svg className="w-5 h-5 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </nav>

      <div className="absolute bottom-6 left-4 right-4 flex flex-col gap-2.5">
        <button
          type="button"
          onClick={() => logout()}
          aria-label="Log out of your account"
          className="group flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-forest to-forest-hover px-4 py-3.5 text-sm font-semibold text-white shadow-fv-md ring-1 ring-white/15 transition-all duration-200 hover:brightness-110 hover:shadow-fv-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
        >
          <svg
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
        <Link
          href="/"
          className="group flex w-full items-center justify-center gap-2 rounded-xl border-2 border-forest/35 bg-white px-4 py-3 text-sm font-semibold text-forest shadow-sm transition-all duration-200 hover:border-forest hover:bg-lavender focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
        >
          <svg
            className="h-5 w-5 shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Go back to home
        </Link>
      </div>
    </div>
  );
}
