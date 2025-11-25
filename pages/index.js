import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import LandingHeader from '../components/LandingHeader';
import LandingFooter from '../components/LandingFooter';
import FeaturesSection from '@/components/FeaturesSection';

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
    <div className="min-h-screen bg-[#C4C4DB]">
      <LandingHeader />

      {showSuccess && (
        <div className="bg-[#8ABFB2]/20 border-b border-[#8ABFB2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-[#01332B]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-[#01332B]">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-[#C4C4DB] via-[#C4C4DB]/95 to-[#8ABFB2]/10 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-[#8ABFB2]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#01332B]/5 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#251B28] leading-tight">
                Master Your Money,
                <span className="block bg-gradient-to-r from-[#01332B] via-[#8ABFB2] to-[#01332B] bg-clip-text text-transparent mt-2">
                  Shape Your Future
                </span>
              </h1>
              
              <p className="text-lg text-[#251B28]/70 max-w-xl leading-relaxed">
                Take control of your financial journey with intelligent budgeting tools, real-time insights, and personalized guidance designed for your success.
              </p>

              {/* Feature highlights */}
              <div className="flex flex-wrap gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[#251B28]/80">Smart Budgeting</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[#251B28]/80">Real-time Tracking</span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-[#8ABFB2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-[#251B28]/80">Secure & Private</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  href="/signup"
                  className="group relative inline-flex items-center justify-center bg-gradient-to-r from-[#01332B] via-[#8ABFB2] to-[#01332B] text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
                  style={{backgroundSize: '200% 100%'}}
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
                  className="inline-flex items-center justify-center border-2 border-[#8ABFB2] text-[#01332B] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#8ABFB2] hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Animated Dashboard Preview */}
            <div className="relative lg:pl-8">
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ABFB2]/20 to-[#01332B]/20 rounded-3xl blur-3xl transform rotate-6"></div>
              
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-white/50 backdrop-blur-sm group">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                  alt="Financial analytics and data visualization"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#01332B]/10 via-transparent to-[#8ABFB2]/10"></div>
                
                {/* Floating Stats Cards */}
                <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 animate-float border border-[#8ABFB2]/20">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[#251B28]/60 font-medium">Total Savings</div>
                      <div className="text-xl font-bold text-[#01332B]">$12,450</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-green-600 text-xs font-semibold">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    +12.5% this month
                  </div>
                </div>
                
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md rounded-xl shadow-xl p-4 animate-float border border-[#8ABFB2]/20" style={{animationDelay: '1s'}}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-[#251B28]/60 font-medium">Growth Rate</div>
                      <div className="text-xl font-bold text-[#01332B]">+24.5%</div>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center text-green-600 text-xs font-semibold">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    Above target
                  </div>
                </div>

                {/* Floating particles */}
                <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-[#8ABFB2] rounded-full animate-ping opacity-60"></div>
                <div className="absolute bottom-1/3 left-1/4 w-2 h-2 bg-[#01332B] rounded-full animate-ping opacity-60" style={{animationDelay: '0.7s'}}></div>
              </div>

              {/* Additional decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-gradient-to-br from-[#01332B] to-[#251B28] rounded-full opacity-10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Simple Steps to Financial Freedom */}
      <section className="py-20 bg-[#C4C4DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-[#251B28] mb-6 leading-tight">
              Your Roadmap to Financial
              <span className="block bg-gradient-to-r from-[#8ABFB2] to-[#01332B] bg-clip-text text-transparent mt-2">
                Empowerment
              </span>
            </h2>
            <p className="text-lg text-[#251B28]/70 max-w-3xl mx-auto leading-relaxed">
              Transform your financial future with our comprehensive 8-step process. From setup to insights, 
              we guide you every step of the way to achieve complete financial clarity and control.
            </p>
          </div>

          {/* Steps Flow Container with Box */}
          <div className="relative max-w-7xl mx-auto bg-gradient-to-br from-[#FFFFFF] to-[#C4C4DB]/20 rounded-3xl shadow-2xl p-12 md:p-16 animate-fade-in-up hover:shadow-3xl transition-all duration-500 border border-[#8ABFB2]/20" style={{animationDelay: '0.2s'}}>
            {/* Top Row - Steps 1-4 */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mb-8 items-center">
              {/* Step 1: Signup/Login */}
              <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Signup / Login</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Create your account
                </p>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex items-start justify-center pt-8 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 2: Budget Setup */}
              <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.45s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Budget Setup</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Set your budget goals
                </p>
              </div>

              {/* Arrow 2 */}
              <div className="hidden md:flex items-start justify-center pt-8 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 3: Add Income & Expense */}
              <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.55s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Add Income & Expense</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Track your finances
                </p>
              </div>

              {/* Arrow 3 */}
              <div className="hidden md:flex items-start justify-center pt-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 4: OCR Integration */}
              <div className="flex flex-col items-center text-center animate-fade-in-up" style={{animationDelay: '0.65s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 5v6.59l-3-3.01-4 4.01-4-4-4 4-3-3.01V5c0-1.1.9-2 2-2h14c1.1 0 2 .9 2 2zm-3 6.42l3 3.01V19c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2v-6.58l3 2.99 4-4 4 4 4-3.99z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">OCR Integration</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Scan receipts automatically
                </p>
              </div>
            </div>

            {/* Down Arrow - positioned to the right */}
            <div className="flex justify-end mb-8 pr-16 animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <svg className="w-12 h-12 text-[#251B28]/60 animate-bounce" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
              </svg>
            </div>

            {/* Bottom Row - Steps 8-5 (Reversed) */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
              {/* Step 8: Report Generating */}
              <div className="flex flex-col items-center text-center md:order-7 animate-fade-in-up" style={{animationDelay: '1.0s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Report Generating</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Generate detailed reports
                </p>
              </div>

              {/* Arrow 4 (Left pointing) */}
              <div className="hidden md:flex items-start justify-center pt-8 md:order-6 animate-fade-in-up" style={{animationDelay: '0.95s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 rotate-180 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 7: Recurring Transaction */}
              <div className="flex flex-col items-center text-center md:order-5 animate-fade-in-up" style={{animationDelay: '0.9s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Recurring Transaction</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Manage recurring payments
                </p>
              </div>

              {/* Arrow 5 (Left pointing) */}
              <div className="hidden md:flex items-start justify-center pt-8 md:order-4 animate-fade-in-up" style={{animationDelay: '0.85s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 rotate-180 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 6: Ask AI */}
              <div className="flex flex-col items-center text-center md:order-3 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Ask AI</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Get AI financial advice
                </p>
              </div>

              {/* Arrow 6 (Left pointing) */}
              <div className="hidden md:flex items-start justify-center pt-8 md:order-2 animate-fade-in-up" style={{animationDelay: '0.75s'}}>
                <svg className="w-12 h-12 text-[#251B28]/60 rotate-180 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>

              {/* Step 5: Categorize Items */}
              <div className="flex flex-col items-center text-center md:order-1 animate-fade-in-up" style={{animationDelay: '0.75s'}}>
                <div className="w-40 h-40 bg-[#FFFFFF] rounded-full shadow-lg flex items-center justify-center mb-6 hover:scale-110 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group border-2 border-[#8ABFB2]/30 hover:border-[#8ABFB2]">
                  <svg className="w-14 h-14 text-[#8ABFB2] group-hover:scale-110 group-hover:text-[#01332B] transition-all duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                  </svg>
                </div>
                <h3 className="text-base font-bold text-[#251B28] mb-2 group-hover:text-[#01332B] transition-colors duration-300">Categorize Items</h3>
                <p className="text-[#251B28]/60 text-xs leading-relaxed px-2">
                  Organize transactions
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    <FeaturesSection />

      {/* Feedback Section */}
      <section id="feedback" className="py-20 bg-[#C4C4DB]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-[#251B28] mb-4 hover:text-[#8ABFB2] transition-colors duration-300">
              Share Your Feedback
            </h2>
            <p className="text-[#251B28]/60 text-lg">
              Help us improve FinValora with your valuable insights
            </p>
          </div>

          {/* Feedback Form Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#8ABFB2]/20 animate-fade-in-up hover:shadow-3xl hover:border-[#8ABFB2]/40 transition-all duration-500">
            <form className="space-y-6">
            {/* Feedback Type */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="feedbackType" className="block text-base font-semibold text-[#251B28] mb-2">
                Feedback Type <span className="text-red-500 animate-pulse">*</span>
              </label>
              <select
                id="feedbackType"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#01332B] focus:ring-2 focus:ring-[#8ABFB2]/20 text-[#251B28] bg-white transition-all duration-300 hover:border-[#8ABFB2]"
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
              <label className="block text-base font-semibold text-[#251B28] mb-3">
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
                        ? 'text-[#01332B] scale-110'
                        : star <= hoveredRating
                        ? 'text-[#8ABFB2]'
                        : 'text-[#C4C4DB]'
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
              <label htmlFor="subject" className="block text-base font-semibold text-[#251B28] mb-2">
                Subject <span className="text-red-500 animate-pulse">*</span>
              </label>
              <input
                type="text"
                id="subject"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#01332B] focus:ring-2 focus:ring-[#8ABFB2]/20 text-[#251B28] transition-all duration-300 hover:border-[#8ABFB2] hover:shadow-md"
                placeholder="Brief summary of your feedback"
              />
            </div>

            {/* Feedback Message */}
            <div className="transform transition-all duration-300 hover:translate-x-1">
              <label htmlFor="feedback" className="block text-base font-semibold text-[#251B28] mb-2">
                Your Feedback <span className="text-red-500 animate-pulse">*</span>
              </label>
              <textarea
                id="feedback"
                rows="6"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#01332B] focus:ring-2 focus:ring-[#8ABFB2]/20 text-[#251B28] resize-none transition-all duration-300 hover:border-[#8ABFB2] hover:shadow-md"
                placeholder="Share your thoughts, suggestions, or report issues..."
              ></textarea>
            </div>

            {/* Checkbox */}
            <div className="flex items-start transform transition-all duration-300 hover:translate-x-1">
              <input
                type="checkbox"
                id="updates"
                className="w-5 h-5 mt-0.5 border-2 border-gray-300 rounded text-[#01332B] focus:ring-2 focus:ring-[#01332B] focus:ring-offset-0 transition-all duration-300"
              />
              <label htmlFor="updates" className="ml-3 text-base text-[#251B28]/60 hover:text-[#251B28] transition-colors duration-300 cursor-pointer">
                I agree to receive updates about FinanceFlow
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#01332B] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#01332B]/90 transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 active:scale-95"
            >
              <span className="flex items-center justify-center">
                Submit Feedback
                <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>
          </form>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-gradient-to-br from-[#C4C4DB] to-[#8ABFB2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-bold text-[#251B28] mb-4 hover:scale-105 transition-transform duration-300">
              Frequently <span className="text-[#01332B]">Asked Questions</span>
            </h2>
            <p className="text-[#251B28]/70 text-lg">
              Find answers to common questions about FIN-VALORA
            </p>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveCategory('All')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'All'
                  ? 'bg-[#01332B] text-white shadow-lg scale-105'
                  : 'bg-white/80 text-[#251B28] hover:bg-white hover:shadow-md'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveCategory('Getting Started')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Getting Started'
                  ? 'bg-[#01332B] text-white shadow-lg scale-105'
                  : 'bg-white/80 text-[#251B28] hover:bg-white hover:shadow-md'
              }`}
            >
              Getting Started
            </button>
            <button
              onClick={() => setActiveCategory('Features')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Features'
                  ? 'bg-[#01332B] text-white shadow-lg scale-105'
                  : 'bg-white/80 text-[#251B28] hover:bg-white hover:shadow-md'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => setActiveCategory('Technical')}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === 'Technical'
                  ? 'bg-[#01332B] text-white shadow-lg scale-105'
                  : 'bg-white/80 text-[#251B28] hover:bg-white hover:shadow-md'
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
              <h3 className="text-xl font-bold text-[#251B28] mb-4 flex items-center animate-slide-in-left">
                <span className="w-1 h-6 bg-[#8ABFB2] rounded-full mr-3 animate-pulse"></span>
                Getting Started
              </h3>
              <div className="space-y-3">
                {/* FAQ 1 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 1 ? null : 1)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                      How do I track my expenses?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 1 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 1 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
                  <p>You can track your expenses by logging into your account and navigating to the Expenses section. Simply click "Add Expense" and enter the details including amount, category, and date. The system will automatically categorize and track your spending patterns.</p>
                </div>
              )}
            </div>

                {/* FAQ 2 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 2 ? null : 2)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                      Can I categorize my transactions?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 2 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 2 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
                  <p>Yes! FinValora offers comprehensive categorization features. You can create custom categories, assign transactions to specific categories, and even set up automatic categorization rules based on merchant names or transaction patterns.</p>
                </div>
                  )}
                </div>

                {/* FAQ 3 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
                  <button
                    onClick={() => setOpenFAQ(openFAQ === 3 ? null : 3)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
                  >
                    <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                      How do I set a budget?
                    </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 3 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 3 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
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
              <h3 className="text-xl font-bold text-[#251B28] mb-4 flex items-center animate-slide-in-left">
                <span className="w-1 h-6 bg-[#8ABFB2] rounded-full mr-3 animate-pulse"></span>
                Features
              </h3>
              <div className="space-y-3">
                {/* FAQ 4 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                  Can I export my financial data?
                </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 4 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 4 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
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
              <h3 className="text-xl font-bold text-[#251B28] mb-4 flex items-center animate-slide-in-left">
                <span className="w-1 h-6 bg-[#8ABFB2] rounded-full mr-3 animate-pulse"></span>
                Technical
              </h3>
              <div className="space-y-3">
                {/* FAQ 5 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 5 ? null : 5)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                  Is my financial data secure?
                </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 5 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 5 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
                  <p>Yes, absolutely. We use bank-level 256-bit encryption to protect your data. Your information is stored securely and never shared with third parties without your consent. We comply with industry-standard security protocols and regularly audit our systems to ensure your financial data remains private and protected.</p>
                </div>
              )}
            </div>

                {/* FAQ 6 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 6 ? null : 6)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                  How does the OCR feature work?
                </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 6 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 6 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
                  <p>Our OCR (Optical Character Recognition) feature allows you to scan receipts and bills using your device's camera or by uploading images. The system automatically extracts transaction details like amount, date, merchant name, and category, saving you time on manual data entry and ensuring accuracy in your financial records.</p>
                </div>
              )}
            </div>

                {/* FAQ 7 */}
                <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <button
                onClick={() => setOpenFAQ(openFAQ === 7 ? null : 7)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-all duration-300 group"
              >
                <span className="text-lg font-semibold text-[#251B28] group-hover:text-[#8ABFB2] transition-colors duration-300">
                  How does the AI assistant help with my finances?
                </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-all duration-300 group-hover:bg-[#8ABFB2] group-hover:scale-110 ${openFAQ === 7 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 7 && (
                <div className="px-6 pb-5 text-[#251B28]/70 animate-fade-in">
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
      <section className="py-20 bg-gradient-to-r from-[#8ABFB2] to-[#01332B] relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 animate-fade-in-up hover:scale-105 transition-transform duration-300">
            Ready to take control of your finances?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Join thousands of users who are already managing their money smarter
            with FinValora.
          </p>
          <Link
            href="/signup"
            className="bg-white text-[#01332B] px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8ABFB2] hover:text-white transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-110 hover:-translate-y-2 inline-block animate-fade-in-up group relative overflow-hidden"
            style={{animationDelay: '0.4s'}}
          >
            <span className="relative z-10 flex items-center justify-center">
              Get Started for Free
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            {/* Animated shine effect */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
          </Link>
          
          {/* Floating icons */}
          <div className="mt-12 flex justify-center gap-8 animate-fade-in-up" style={{animationDelay: '0.6s'}}>
            <div className="flex items-center text-white/80 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 mr-2 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Free Forever</span>
            </div>
            <div className="flex items-center text-white/80 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 mr-2 animate-bounce" style={{animationDelay: '0.2s'}} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">No Credit Card</span>
            </div>
            <div className="flex items-center text-white/80 hover:text-white transition-colors duration-300 transform hover:scale-110">
              <svg className="w-6 h-6 mr-2 animate-bounce" style={{animationDelay: '0.4s'}} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-medium">Setup in 2 Minutes</span>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}