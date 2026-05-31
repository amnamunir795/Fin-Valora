import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../utils/auth';
import FinValoraLogo from './FinValoraLogo';

const NAV_ACTIVE =
  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg bg-white/15 text-white font-semibold backdrop-blur-sm';
const NAV_IDLE =
  'flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/60 transition-all duration-200 hover:text-white hover:bg-white/8';

function navClass(pathname, href) {
  return pathname === href ? NAV_ACTIVE : NAV_IDLE;
}

const NAV_ICON_CLASS = 'w-[18px] h-[18px] shrink-0';

export default function AppSidebar() {
  const { pathname } = useRouter();

  return (
    <div className="relative min-h-screen w-56 shrink-0 flex flex-col bg-gradient-to-b from-[#023d33] via-[#022f28] to-[#011f1b]">
      {/* Subtle texture overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '20px 20px' }} />

      {/* Brand */}
      <div className="relative px-5 py-5 border-b border-white/8">
        <Link href="/dashboard" className="group flex items-center gap-2.5" aria-label="FinValora home">
          <FinValoraLogo size={32} className="drop-shadow-sm transition-transform group-hover:scale-105" />
          <span className="text-base font-bold text-white tracking-tight">
            FinValora
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="relative flex-1 px-3 py-4 space-y-0.5" aria-label="Main navigation">
        <Link href="/dashboard" className={navClass(pathname, '/dashboard')} aria-current={pathname === '/dashboard' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
          </svg>
          Dashboard
        </Link>

        <Link href="/categories" className={navClass(pathname, '/categories')} aria-current={pathname === '/categories' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </Link>

        <Link href="/income" className={navClass(pathname, '/income')} aria-current={pathname === '/income' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Income
        </Link>

        <Link href="/expenses" className={navClass(pathname, '/expenses')} aria-current={pathname === '/expenses' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
          Expenses
        </Link>

        <Link href="/reports" className={navClass(pathname, '/reports')} aria-current={pathname === '/reports' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Reports
        </Link>

        <Link href="/ocr-scanner" className={navClass(pathname, '/ocr-scanner')} aria-current={pathname === '/ocr-scanner' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          OCR Scanner
        </Link>

        <Link href="/activity" className={navClass(pathname, '/activity')} aria-current={pathname === '/activity' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Activity Log
        </Link>

        <Link href="/ai-chat" className={navClass(pathname, '/ai-chat')} aria-current={pathname === '/ai-chat' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          AI Chat
        </Link>

        <Link href="/settings" className={navClass(pathname, '/settings')} aria-current={pathname === '/settings' ? 'page' : undefined}>
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Settings
        </Link>
      </nav>

      {/* Bottom actions */}
      <div className="relative px-3 pb-4 space-y-1.5">
        <button
          type="button"
          onClick={() => logout()}
          aria-label="Log out"
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm font-medium transition-all"
        >
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Log out
        </button>
        <Link
          href="/"
          className="flex w-full items-center gap-3 px-3.5 py-2.5 rounded-lg text-white/50 hover:text-white hover:bg-white/8 text-sm font-medium transition-all"
        >
          <svg className={NAV_ICON_CLASS} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Home
        </Link>
      </div>
    </div>
  );
}
