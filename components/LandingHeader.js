import Link from "next/link";
import FinValoraLogo from "./FinValoraLogo";

export default function LandingHeader() {
  return (
    <header
      className="sticky top-0 z-50 h-16 border-b border-lavender bg-forest shadow-fv-sm"
      style={{ minHeight: "var(--nav-height)" }}
    >
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="group flex cursor-pointer items-center gap-3" aria-label="FinValora home">
          <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl ring-1 ring-white/20 transition-transform duration-[var(--duration-normal)] group-hover:scale-[1.02]">
            <FinValoraLogo size={44} className="drop-shadow-sm" />
          </div>
          <div>
            <p className="font-display text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-teal">
              FIN<span className="mx-0.5 text-white group-hover:text-teal">-</span>VALORA
            </p>
            <p className="fv-overline text-[10px] text-white/70">Smart finance</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <a href="#features" className="text-sm font-medium text-white transition-colors hover:text-teal">
            Features
          </a>
          <a href="#steps" className="text-sm font-medium text-white transition-colors hover:text-teal">
            How It Works
          </a>
          <a href="#feedback" className="text-sm font-medium text-white transition-colors hover:text-teal">
            Feedback
          </a>
          <a href="#faq" className="text-sm font-medium text-white transition-colors hover:text-teal">
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors hover:text-teal"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="inline-flex min-h-[40px] items-center justify-center rounded-full border border-lavender bg-white px-6 text-sm font-semibold text-forest shadow-md transition-all hover:border-teal hover:bg-teal hover:text-white"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
