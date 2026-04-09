import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import FeaturesSection from '@/components/FeaturesSection';

function RoadmapStepCard({ step, title, description, delay, children, className = '' }) {
  return (
    <div
      className={`group flex w-full max-w-[168px] flex-col items-center text-center animate-fade-in-up ${className}`}
      style={{ animationDelay: delay }}
    >
      <span className="mb-3 inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full bg-gradient-to-br from-forest to-void px-2 text-xs font-bold tabular-nums text-white shadow-md ring-2 ring-white">
        {String(step).padStart(2, '0')}
      </span>
      <div className="relative mb-4 flex h-[7.25rem] w-[7.25rem] items-center justify-center rounded-2xl border border-lavender/50 bg-gradient-to-b from-white to-teal-soft/50 shadow-md ring-1 ring-teal/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:border-teal/50 group-hover:shadow-lg md:h-[7.75rem] md:w-[7.75rem]">
        {children}
      </div>
      <h3 className="mb-1.5 text-sm font-semibold leading-snug text-void transition-colors duration-300 group-hover:text-forest">
        {title}
      </h3>
      <p className="px-0.5 text-xs leading-relaxed text-void/55">{description}</p>
    </div>
  );
}

function RoadmapArrowRight({ delay, className = '' }) {
  return (
    <div
      className={`hidden items-start justify-center pt-10 md:flex animate-fade-in-up ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <svg
        className="h-8 w-8 text-teal/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  );
}

function RoadmapArrowLeft({ delay, className = '' }) {
  return (
    <div
      className={`hidden items-start justify-center pt-10 md:flex animate-fade-in-up ${className}`}
      style={{ animationDelay: delay }}
      aria-hidden
    >
      <svg
        className="h-8 w-8 rotate-180 text-teal/45"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
      </svg>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFAQ, setOpenFAQ] = useState(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    // Check for success messages
    if (router.query.signup === "success") {
      setShowSuccess(true);
      setSuccessMessage("Account created successfully! Welcome to FinValora.");
      router.replace("/", undefined, { shallow: true });
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (router.query.login === "success") {
      setShowSuccess(true);
      setSuccessMessage("Welcome back! You have successfully logged in.");
      router.replace("/", undefined, { shallow: true });
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-surface via-mist to-lavender/30">
      <LandingHeader />

      {showSuccess && (
        <div className="border-b border-lavender/80 bg-gradient-to-r from-teal/20 via-lavender/30 to-teal/25">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 rounded-2xl border border-white/60 bg-white/70 px-4 py-3 shadow-sm shadow-forest/5 backdrop-blur-sm md:px-5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal/40 to-forest/90 text-white shadow-md ring-2 ring-white">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium leading-snug text-forest">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-surface via-teal-soft/90 to-lavender/35 py-20 lg:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.75)_0%,transparent_35%,transparent_100%)]"
          aria-hidden
        />
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute right-10 top-20 h-72 w-72 rounded-full bg-teal/25 blur-3xl" />
          <div className="absolute bottom-20 left-10 h-96 w-96 rounded-full bg-void/8 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lavender/25 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
            {/* Left Content */}
            <div className="space-y-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-forest/85">
                Personal finance, simplified
              </p>
              <h1 className="font-display text-4xl font-bold leading-[1.12] text-void md:text-5xl lg:text-[3.25rem]">
                Master Your{" "}
                <span className="italic text-forest">Money,</span>
                <span className="mt-2 block text-void">
                  Shape Your <span className="italic text-forest">Future</span>
                </span>
              </h1>
              <div className="h-px w-16 bg-gradient-to-r from-teal to-transparent" aria-hidden />
              <p className="max-w-xl text-lg leading-relaxed text-void/75">
                Take control of your financial journey with intelligent budgeting, real-time insights, and
                guidance tuned to your goals—without the spreadsheet overload.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-3 pt-1">
                {['Smart budgeting', 'Real-time tracking', 'Bank-grade privacy'].map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-lavender/70 bg-white/80 px-4 py-2 text-sm font-medium text-void/85 shadow-sm shadow-forest/5 backdrop-blur-sm"
                  >
                    <svg className="h-4 w-4 shrink-0 text-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="fv-btn-primary group relative min-h-[52px] overflow-hidden px-8 text-lg shadow-fv-md transition-all duration-300 hover:shadow-fv-lg"
                >
                  <span className="relative z-10 flex items-center">
                    Get Started Free
                    <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </Link>
                <Link
                  href="/login"
                  className="fv-btn-secondary min-h-[52px] border-2 px-8 text-lg hover:shadow-fv-sm"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right — dashboard preview */}
            <div className="relative lg:pl-4">
              <div className="absolute inset-0 rotate-6 transform rounded-3xl bg-gradient-to-br from-teal/25 to-forest/15 blur-3xl" aria-hidden />
              <div className="group relative overflow-hidden rounded-2xl border-2 border-lavender/60 shadow-2xl shadow-forest/10 ring-2 ring-teal/25 backdrop-blur-sm">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                  alt="Financial analytics and data visualization"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-forest/10 via-transparent to-teal/10"></div>
                
                {/* Floating Stats Cards */}
                <div className="animate-float absolute left-6 top-6 rounded-xl border border-lavender bg-white/95 p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-teal to-forest rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-void/60 font-medium">Total Savings</div>
                      <div className="text-xl font-bold text-forest">$12,450</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs font-semibold text-forest">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +12.5% this month
                  </div>
                </div>
                
                <div className="animate-float absolute bottom-6 right-6 rounded-xl border border-lavender bg-white/95 p-4 shadow-xl backdrop-blur-md" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-teal to-forest">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-void/60 font-medium">Growth Rate</div>
                      <div className="text-xl font-bold text-forest">+24.5%</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-xs font-semibold text-forest">
                    <svg className="mr-1 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    Above target
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-teal rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-forest rounded-full animate-ping opacity-60" style={{animationDelay: '0.7s'}}></div>
              </div>

              {/* Additional decorative elements */}
              <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-teal to-forest opacity-25 blur-2xl"></div>
              <div className="absolute -left-4 -top-4 h-32 w-32 rounded-full bg-gradient-to-br from-void/40 to-teal/30 opacity-40 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap — 8-step journey */}
      <section id="steps" className="relative overflow-hidden bg-gradient-to-b from-lavender/35 via-mist to-surface py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(138,191,178,0.18),transparent_55%)]" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center animate-fade-in-up md:mb-16">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-forest/80">
              How it works
            </p>
            <h2 className="font-display text-4xl font-semibold leading-tight text-void md:text-5xl">
              Your Roadmap to Financial
              <span className="mt-2 block bg-gradient-to-r from-teal via-forest to-void bg-clip-text text-transparent">
                Empowerment
              </span>
            </h2>
            <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-teal to-transparent" aria-hidden />
            <p className="mt-6 text-lg leading-relaxed text-void/70">
              Eight clear stages—from account setup to full visibility—so you always know what comes next
              on the path to confident money management.
            </p>
          </div>

          <div
            className="animate-fade-in-up rounded-[1.75rem] bg-gradient-to-br from-teal/45 via-lavender/55 to-void/25 p-px shadow-[0_24px_60px_-12px_rgba(1,51,43,0.15)]"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="relative overflow-hidden rounded-[1.7rem] bg-gradient-to-br from-surface via-teal-soft/45 to-lavender/20 px-5 py-10 ring-1 ring-white/80 md:px-10 md:py-14">
              <div
                className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-teal/10 blur-3xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-lavender/30 blur-3xl"
                aria-hidden
              />

              {/* Phase 1 */}
              <div className="mb-8 text-center md:mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-void/45">
                  Phase 1
                </p>
                <p className="mt-1 text-sm font-medium text-forest">Foundation — capture &amp; automate</p>
              </div>

              <div className="grid grid-cols-1 items-start justify-items-center gap-y-12 md:grid-cols-7 md:gap-y-0 md:gap-x-1">
                <RoadmapStepCard
                  step={1}
                  title="Signup / Login"
                  description="Create your secure account"
                  delay="0.15s"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowRight delay="0.2s" />
                <RoadmapStepCard
                  step={2}
                  title="Budget Setup"
                  description="Define goals and limits"
                  delay="0.22s"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowRight delay="0.26s" />
                <RoadmapStepCard
                  step={3}
                  title="Add Income & Expense"
                  description="Track cash flow in real time"
                  delay="0.28s"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowRight delay="0.32s" />
                <RoadmapStepCard
                  step={4}
                  title="OCR Integration"
                  description="Digitize receipts instantly"
                  delay="0.34s"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z" />
                  </svg>
                </RoadmapStepCard>
              </div>

              {/* Connector */}
              <div className="my-10 flex flex-col items-center gap-2 md:my-12">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-void/40">
                  Continue
                </span>
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-lavender/60 bg-white/90 shadow-sm">
                  <svg
                    className="h-5 w-5 text-teal"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="mb-8 text-center md:mb-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-void/45">
                  Phase 2
                </p>
                <p className="mt-1 text-sm font-medium text-forest">Optimization — organize &amp; insight</p>
              </div>

              <div className="grid grid-cols-1 items-start justify-items-center gap-y-12 md:grid-cols-7 md:gap-y-0 md:gap-x-1">
                <RoadmapStepCard
                  step={5}
                  title="Categorize Items"
                  description="Organize transactions cleanly"
                  delay="0.4s"
                  className="md:order-1"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowLeft delay="0.42s" className="md:order-2" />
                <RoadmapStepCard
                  step={6}
                  title="Ask AI"
                  description="Guidance tailored to you"
                  delay="0.44s"
                  className="md:order-3"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowLeft delay="0.46s" className="md:order-4" />
                <RoadmapStepCard
                  step={7}
                  title="Recurring Transaction"
                  description="Automate recurring entries"
                  delay="0.48s"
                  className="md:order-5"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z" />
                  </svg>
                </RoadmapStepCard>
                <RoadmapArrowLeft delay="0.5s" className="md:order-6" />
                <RoadmapStepCard
                  step={8}
                  title="Financial overview"
                  description="One view of your full picture"
                  delay="0.52s"
                  className="md:order-7"
                >
                  <svg
                    className="h-12 w-12 text-teal transition-transform duration-300 group-hover:scale-105 group-hover:text-forest"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                  </svg>
                </RoadmapStepCard>
              </div>
            </div>
          </div>
        </div>
      </section>

    <FeaturesSection />

      {/* Feedback Section */}
      <section
        id="feedback"
        className="relative overflow-hidden bg-gradient-to-b from-teal-soft/80 via-lavender/30 to-mist py-24 md:py-28"
      >
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_0%,rgba(196,196,219,0.35),transparent_60%)]"
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest/80">We&apos;re listening</p>
            <h2 className="font-display text-4xl font-semibold text-void md:text-[2.35rem]">
              Share Your Feedback
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-teal to-transparent" />
            <p className="mt-5 text-lg text-void/70">
              Help us improve FinValora with your ideas, issues, and suggestions.
            </p>
          </div>

          <div
            className="animate-fade-in-up rounded-[1.75rem] bg-gradient-to-br from-teal/35 via-lavender/45 to-void/20 p-px shadow-xl shadow-forest/10"
            style={{ animationDelay: '0.08s' }}
          >
            <div className="rounded-[1.7rem] border border-white/80 bg-white/95 p-8 shadow-inner shadow-white/40 md:p-12">
            <form className="space-y-6">
            {/* Feedback Type */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="feedbackType" className="block text-base font-semibold text-void mb-2">
                Feedback Type <span className="text-red-500 animate-pulse">*</span>
              </label>
              <select
                id="feedbackType"
                className="w-full rounded-lg border-2 border-lavender bg-white px-4 py-3 text-void transition-all duration-300 hover:border-teal focus:border-forest focus:outline-none focus:ring-2 focus:ring-teal/20"
              >
                <option value="">Select feedback type</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="improvement">Improvement Suggestion</option>
                <option value="general">General Feedback</option>
              </select>
            </div>

            {/* Rating */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label className="block text-base font-semibold text-void mb-3">
                Rate Your Experience <span className="text-red-500 animate-pulse">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className={`transition-all duration-300 focus:outline-none transform hover:scale-125 hover:rotate-12 ${
                      star <= rating
                        ? 'text-forest scale-110'
                        : star <= hoveredRating
                        ? 'text-teal'
                        : 'text-lavender'
                    }`}
                  >
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="subject" className="block text-base font-semibold text-void mb-2">
                Subject <span className="text-red-500 animate-pulse">*</span>
              </label>
              <input
                type="text"
                id="subject"
                className="w-full rounded-lg border-2 border-lavender px-4 py-3 text-void transition-all duration-300 hover:border-teal hover:shadow-md focus:border-forest focus:outline-none focus:ring-2 focus:ring-teal/20"
                placeholder="Brief summary of your feedback"
              />
            </div>

            {/* Feedback Message */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="feedback" className="block text-base font-semibold text-void mb-2">
                Your Feedback <span className="text-red-500 animate-pulse">*</span>
              </label>
              <textarea
                id="feedback"
                rows="6"
                className="w-full resize-none rounded-lg border-2 border-lavender px-4 py-3 text-void transition-all duration-300 hover:border-teal hover:shadow-md focus:border-forest focus:outline-none focus:ring-2 focus:ring-teal/20"
                placeholder="Share your thoughts, suggestions, or report issues..."
              ></textarea>
            </div>

            {/* Checkbox */}
            <div className="flex items-start transform transition-all duration-300 hover:translate-x-1">
              <input
                type="checkbox"
                id="updates"
                className="mt-0.5 h-5 w-5 rounded border-2 border-lavender text-forest transition-all duration-300 focus:ring-2 focus:ring-forest focus:ring-offset-0"
              />
              <label htmlFor="updates" className="ml-3 cursor-pointer text-base text-void/60 transition-colors duration-300 hover:text-void">
                I agree to receive product updates from FinValora
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="group w-full rounded-xl bg-gradient-to-r from-forest to-void py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:from-forest-hover hover:to-void hover:shadow-2xl active:scale-[0.99]"
            >
              <span className="flex items-center justify-center">
                Submit Feedback
                <svg
                  className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section
        id="faq"
        className="relative overflow-hidden bg-gradient-to-b from-surface via-mist to-teal-soft/45 py-24 md:py-28"
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-lavender/15 to-transparent"
          aria-hidden
        />
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 animate-fade-in-up text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-forest/80">Support</p>
            <h2 className="font-display text-4xl font-semibold text-void md:text-[2.35rem]">
              Frequently <span className="text-forest">Asked Questions</span>
            </h2>
            <div className="mx-auto mt-5 h-px w-20 bg-gradient-to-r from-transparent via-teal to-transparent" />
            <p className="mt-5 text-lg text-void/70">
              Quick answers about FinValora—before you even open a ticket.
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'bg-forest text-white shadow-lg scale-105'
                  : 'border border-lavender/60 bg-white/90 text-void shadow-sm hover:border-teal hover:bg-lavender/35 hover:shadow-md'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('Getting Started')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Getting Started'
                  ? 'bg-forest text-white shadow-lg scale-105'
                  : 'border border-lavender/60 bg-white/90 text-void shadow-sm hover:border-teal hover:bg-lavender/35 hover:shadow-md'
              }`}
            >
              Getting Started
            </button>
            <button
              onClick={() => setActiveCategory('Features')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Features'
                  ? 'bg-forest text-white shadow-lg scale-105'
                  : 'border border-lavender/60 bg-white/90 text-void shadow-sm hover:border-teal hover:bg-lavender/35 hover:shadow-md'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveCategory('Technical')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Technical'
                  ? 'bg-forest text-white shadow-lg scale-105'
                  : 'border border-lavender/60 bg-white/90 text-void shadow-sm hover:border-teal hover:bg-lavender/35 hover:shadow-md'
              }`}
            >
              Technical
            </button>
          </div>

          {/* FAQ Items */}
          <div className="space-y-6">
            {/* Category: Getting Started */}
            {(activeCategory === 'All' || activeCategory === 'Getting Started') && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-void mb-4 flex items-center animate-slide-in-left">
                <span className="mr-3 h-6 w-1 rounded-full bg-gradient-to-b from-teal to-forest" />
                Getting Started
              </h3>
              <div className="space-y-3">
                {/* FAQ 1 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                      How do I track my expenses?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 1 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>You can track your expenses by logging into your account and navigating to the Expenses section. Simply click "Add Expense" and enter the details including amount, category, and date. The system will automatically categorize and track your spending patterns.</p>
                </div>
              )}
            </div>

                {/* FAQ 2 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                      Can I categorize my transactions?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 2 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 2 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Yes! FinValora offers comprehensive categorization features. You can create custom categories, assign transactions to specific categories, and even set up automatic categorization rules based on merchant names or transaction patterns.</p>
                </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                      How do I set a budget?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 3 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Setting a budget is easy! Go to the Budget section, click "Create New Budget", and specify your monthly income and spending limits for different categories. The system will track your progress and send alerts when you're approaching your limits.</p>
                </div>
              )}
                </div>
              </div>
            </div>
            )}

            {/* Category: Features */}
            {(activeCategory === 'All' || activeCategory === 'Features') && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-void mb-4 flex items-center animate-slide-in-left">
                <span className="mr-3 h-6 w-1 rounded-full bg-gradient-to-b from-teal to-forest" />
                Features
              </h3>
              <div className="space-y-3">
                {/* FAQ 4 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                  Can I export my financial data?
                </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 4 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 4 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Absolutely! You can export your financial data in multiple formats including CSV, Excel, and PDF. Go to Settings &gt; Export Data, select your date range and format, and download your complete financial records for backup or analysis purposes.</p>
                </div>
              )}
            </div>
              </div>
            </div>
            )}

            {/* Category: Technical */}
            {(activeCategory === 'All' || activeCategory === 'Technical') && (
            <div className="animate-fade-in-up">
              <h3 className="text-xl font-bold text-void mb-4 flex items-center animate-slide-in-left">
                <span className="mr-3 h-6 w-1 rounded-full bg-gradient-to-b from-teal to-forest" />
                Technical
              </h3>
              <div className="space-y-3">
                {/* FAQ 5 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 5 ? null : 5)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                  Is my financial data secure?
                </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 5 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 5 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Yes, absolutely. We use bank-level 256-bit encryption to protect your data. Your information is stored securely and never shared with third parties without your consent. We comply with industry-standard security protocols and regularly audit our systems to ensure your financial data remains private and protected.</p>
                </div>
              )}
            </div>

                {/* FAQ 6 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 6 ? null : 6)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                  How does the OCR feature work?
                </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 6 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 6 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Our OCR (Optical Character Recognition) feature allows you to scan receipts and bills using your device's camera or by uploading images. The system automatically extracts transaction details like amount, date, merchant name, and category, saving you time on manual data entry and ensuring accuracy in your financial records.</p>
                </div>
              )}
            </div>

                {/* FAQ 7 */}
                <div className="bg-white/90 backdrop-blur rounded-2xl overflow-hidden border border-lavender/50 shadow-lg hover:border-teal/40 hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.01] animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 7 ? null : 7)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-void group-hover:text-teal transition-colors duration-300">
                  How does the AI assistant help with my finances?
                </span>
                <div className={`w-10 h-10 rounded-full bg-forest flex items-center justify-center transition-all duration-300 group-hover:bg-teal group-hover:scale-110 ${openFAQ === 7 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 7 && (
                <div className="px-6 pb-5 text-void/70 animate-fade-in">
                  <p>Our AI-powered assistant analyzes your spending patterns, income trends, and financial goals to provide personalized recommendations. It can answer questions about your finances, suggest budget optimizations, identify unusual spending patterns, predict future expenses, and help you make informed financial decisions 24/7.</p>
                </div>
              )}
            </div>
              </div>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden border-t border-lavender/30 bg-gradient-to-br from-void via-forest to-void py-24 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(138,191,178,0.22),transparent_55%)]" aria-hidden />
        <div className="absolute inset-0 opacity-25">
          <div className="absolute left-10 top-10 h-32 w-32 rounded-full bg-teal/35 blur-2xl" />
          <div className="absolute bottom-10 right-10 h-40 w-40 rounded-full bg-lavender/30 blur-2xl" style={{ animationDelay: '1s' }} />
          <div className="absolute left-1/4 top-1/2 h-24 w-24 rounded-full bg-white/10 blur-xl" style={{ animationDelay: '0.5s' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 animate-fade-in-up text-xs font-semibold uppercase tracking-[0.22em] text-teal/90">
            Start today
          </p>
          <h2 className="animate-fade-in-up font-display text-3xl font-semibold text-white md:text-4xl lg:text-[2.75rem]">
            Ready to take control of your finances?
          </h2>
          <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          <p
            className="mx-auto mb-10 mt-6 max-w-2xl animate-fade-in-up text-lg text-white/88"
            style={{ animationDelay: '0.15s' }}
          >
            Join others who use FinValora to budget smarter, see the full picture, and move forward with
            confidence.
          </p>
          <Link
            href="/signup"
            className="group relative inline-flex min-h-[52px] animate-fade-in-up items-center justify-center overflow-hidden rounded-full border border-white/15 bg-surface px-10 text-lg font-semibold text-forest shadow-fv-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-teal hover:text-forest hover:shadow-fv-xl"
            style={{ animationDelay: '0.3s' }}
          >
            <span className="relative z-10 flex items-center justify-center">
              Get started for free
              <svg
                className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
          </Link>

          <div
            className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-4 animate-fade-in-up"
            style={{ animationDelay: '0.45s' }}
          >
            {[
              { label: 'Free to start', sub: 'Core tools included' },
              { label: 'No credit card', sub: 'Upgrade when you want' },
              { label: 'Quick setup', sub: 'Live in minutes' },
            ].map((item) => (
              <div
                key={item.label}
                className="flex min-w-[10rem] flex-col rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-left backdrop-blur-sm transition-colors duration-300 hover:border-teal/40 hover:bg-white/10"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-white">
                  <svg className="h-4 w-4 shrink-0 text-teal" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {item.label}
                </span>
                <span className="mt-0.5 text-xs text-white/65">{item.sub}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}