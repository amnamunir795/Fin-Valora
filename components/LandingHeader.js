import Link from "next/link";

export default function LandingHeader() {
  return (
    <header
      className="sticky top-0 z-50 h-16 border-b border-lavender/40 bg-nav-surface backdrop-blur-[16px] shadow-fv-xs"
      style={{ minHeight: "var(--nav-height)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex cursor-pointer items-center gap-3">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-full bg-teal-soft ring-1 ring-teal/40 transition-transform duration-[var(--duration-normal)] group-hover:scale-[1.02]">
            <svg className="h-8 w-8" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <ellipse cx="16" cy="32" rx="8" ry="3" fill="currentColor" className="text-forest/20" />
              <ellipse cx="16" cy="29" rx="8" ry="3" fill="currentColor" className="text-forest/30" />
              <ellipse cx="16" cy="26" rx="8" ry="3" fill="currentColor" className="text-forest/50" />
              <ellipse cx="16" cy="23" rx="8" ry="3" fill="currentColor" className="text-forest" />
              <text x="16" y="25" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold">
                $
              </text>
              <path
                d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-teal"
              />
            </svg>
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-forest transition-colors group-hover:text-teal">
              FIN<span className="mx-0.5 text-teal">-</span>VALORA
            </p>
            <p className="fv-overline text-[10px] text-ink-secondary">Smart finance</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <a href="#features" className="text-sm font-medium text-void transition-colors hover:text-forest">
            Features
          </a>
          <a href="#steps" className="text-sm font-medium text-void transition-colors hover:text-forest">
            How It Works
          </a>
          <a href="#feedback" className="text-sm font-medium text-void transition-colors hover:text-forest">
            Feedback
          </a>
          <a href="#faq" className="text-sm font-medium text-void transition-colors hover:text-forest">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link href="/login" className="fv-btn-ghost text-sm text-forest">
            Sign In
          </Link>
          <Link href="/signup" className="fv-btn-primary px-6 text-sm">
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
