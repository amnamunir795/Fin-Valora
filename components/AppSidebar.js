import Link from 'next/link';
import { useRouter } from 'next/router';
import { logout } from '../utils/auth';

const NAV_ACTIVE =
  'flex items-center px-4 py-3 text-white bg-gradient-to-r from-teal to-forest rounded-lg shadow-md';
const NAV_IDLE =
  'flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200';

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
    <div className="w-64 bg-surface shadow-xl border-r border-lavender/40 relative min-h-screen shrink-0">
      <div className="p-6 border-b border-lavender/30 bg-gradient-to-r from-surface to-mist/10">
        {featuredLogo ? (
          <Link href="/dashboard" className="flex items-center group cursor-pointer">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-forest rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-teal via-forest to-void rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <svg className="relative w-10 h-10 p-1.5" viewBox="0 0 48 48" fill="none">
                <g className="group-hover:translate-y-[-1px] transition-transform duration-300">
                  <ellipse cx="16" cy="38" rx="8" ry="3" fill="white" opacity="0.6" />
                  <ellipse cx="16" cy="35" rx="8" ry="3" fill="white" opacity="0.7" />
                  <ellipse cx="16" cy="32" rx="8" ry="3" fill="white" opacity="0.8" />
                  <ellipse cx="16" cy="29" rx="8" ry="3" fill="white" />
                  <text x="16" y="31" textAnchor="middle" fill="var(--color-forest)" fontSize="6" fontWeight="bold">
                    $
                  </text>
                </g>
                <g className="group-hover:scale-105 transition-transform duration-300">
                  <rect x="28" y="32" width="3" height="8" rx="1.5" fill="white" opacity="0.7" />
                  <rect x="33" y="28" width="3" height="12" rx="1.5" fill="white" opacity="0.8" />
                  <rect x="38" y="24" width="3" height="16" rx="1.5" fill="white" />
                </g>
                <g className="group-hover:translate-x-[1px] group-hover:translate-y-[-1px] transition-transform duration-300">
                  <path
                    d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12"
                    stroke="var(--color-teal)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:stroke-white transition-colors duration-300"
                  />
                </g>
                <g className="animate-pulse" style={{ animationDuration: '2s' }}>
                  <text x="8" y="12" fill="var(--color-teal)" fontSize="6" fontWeight="bold" opacity="0.8">
                    $
                  </text>
                  <text x="38" y="14" fill="var(--color-forest)" fontSize="5" fontWeight="bold" opacity="0.7">
                    €
                  </text>
                  <text x="6" y="22" fill="var(--color-forest)" fontSize="5" fontWeight="bold" opacity="0.6">
                    £
                  </text>
                </g>
                <circle cx="42" cy="10" r="1.5" fill="var(--color-teal)" className="animate-ping" style={{ animationDuration: '2s' }} />
                <circle cx="10" cy="38" r="1" fill="var(--color-forest)" className="animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }} />
              </svg>
            </div>
            <span className="text-xl font-bold text-void group-hover:text-forest transition-colors duration-300">FinValora</span>
          </Link>
        ) : (
          <Link href="/dashboard" className="flex items-center group cursor-pointer">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-forest rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="absolute inset-0 bg-gradient-to-br from-teal via-forest to-void rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              <svg className="relative w-10 h-10 p-1.5" viewBox="0 0 48 48" fill="none">
                <ellipse cx="16" cy="29" rx="8" ry="3" fill="white" />
                <rect x="28" y="24" width="3" height="16" rx="1.5" fill="white" />
                <path
                  d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  className="text-teal"
                />
              </svg>
            </div>
            <span className="text-xl font-bold text-void group-hover:text-forest transition-colors duration-300">FinValora</span>
          </Link>
        )}
      </div>

      <nav className="mt-6 px-4 space-y-2" aria-label="Main navigation">
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

      <div className="absolute bottom-6 left-6">
        <button
          type="button"
          onClick={() => logout()}
          className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200"
        >
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}
