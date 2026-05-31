import Head from 'next/head';
import Link from 'next/link';
import FinValoraLogo from "../../components/FinValoraLogo";

export default function About() {
  return (
    <>
      <Head>
        <title>About — FinValora</title>
      </Head>
      <div className="min-h-screen bg-mist px-4 py-16 text-void">
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-6 flex justify-center">
            <FinValoraLogo size={56} className="drop-shadow-md" />
          </div>
          <p className="fv-overline mb-3 text-ink-secondary">Company</p>
          <h1 className="font-display text-4xl font-semibold text-forest md:text-5xl">About FinValora</h1>
          <p className="mx-auto mt-6 max-w-prose text-lg text-ink-secondary">
            We help you plan, track, and grow with a calm, trustworthy experience built for everyday financial
            confidence.
          </p>

          <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
            <div className="rounded-2xl border border-lavender/35 bg-white/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-forest mb-2">Our Mission</h3>
              <p className="text-sm text-void/70">Make personal finance simple, visual, and accessible for everyone.</p>
            </div>
            <div className="rounded-2xl border border-lavender/35 bg-white/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-forest mb-2">Privacy First</h3>
              <p className="text-sm text-void/70">Your financial data stays yours. No selling, no sharing, no ads.</p>
            </div>
            <div className="rounded-2xl border border-lavender/35 bg-white/80 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-forest mb-2">Built for You</h3>
              <p className="text-sm text-void/70">Designed for individuals who want clarity without complexity.</p>
            </div>
          </div>

          <Link href="/" className="fv-btn-primary mt-10 inline-flex">
            Back to home
          </Link>
        </div>
      </div>
    </>
  );
}
