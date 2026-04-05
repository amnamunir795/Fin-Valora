import Link from "next/link";

export default function About() {
  return (
    <div className="min-h-screen bg-mist px-4 py-16 text-void">
      <div className="mx-auto max-w-[760px] text-center">
        <p className="fv-overline mb-3 text-ink-secondary">Company</p>
        <h1 className="font-display text-4xl font-semibold text-forest md:text-5xl">About FinValora</h1>
        <p className="mx-auto mt-6 max-w-prose text-lg text-ink-secondary">
          We help you plan, track, and grow with a calm, trustworthy experience built for everyday financial
          confidence.
        </p>
        <Link href="/" className="fv-btn-primary mt-10 inline-flex">
          Back to home
        </Link>
      </div>
    </div>
  );
}
