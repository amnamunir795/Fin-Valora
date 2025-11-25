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
      <section className="relative py-20 lg:py-32 bg-[#C4C4DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#01332B] mb-6">
                Smart Financial Solutions for Your Future
              </h1>
              <p className="text-lg text-[#251B28]/70 mb-8 max-w-xl">
                Take control of your finances with our innovative tools and expert guidance. Build wealth, save smart, and achieve your financial goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/login"
                  className="border-2 border-[#01332B] text-[#01332B] px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#01332B] hover:text-white transition-all duration-200"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="bg-[#251B28] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#251B28]/90 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Right Animated Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
                  alt="Financial analytics and data visualization"
                  className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Animated gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#8ABFB2]/20 via-transparent to-[#01332B]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                {/* Floating animated particles */}
                <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[#8ABFB2] rounded-full animate-ping opacity-75"></div>
                <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[#FF6B35] rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-[#8ABFB2] rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
                
                {/* Floating Cards with enhanced animations */}
                <div className="absolute top-8 left-8 bg-white rounded-lg shadow-lg p-4 animate-float transform hover:scale-105 transition-transform cursor-pointer">
                  <div className="text-sm text-[#251B28]/60 mb-1">Monthly Savings</div>
                  <div className="text-2xl font-bold text-[#01332B] animate-pulse">$12,450</div>
                  <div className="mt-2 flex items-center text-green-600 text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="animate-pulse">+12.5%</span>
                  </div>
                </div>
                
                <div className="absolute bottom-8 right-8 bg-white rounded-lg shadow-lg p-4 animate-float transform hover:scale-105 transition-transform cursor-pointer" style={{animationDelay: '1s'}}>
                  <div className="text-sm text-[#251B28]/60 mb-1">Investment Growth</div>
                  <div className="text-2xl font-bold text-[#01332B] animate-pulse" style={{animationDelay: '0.5s'}}>24.5%</div>
                  <div className="mt-2 flex items-center text-green-600 text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                    <span className="animate-pulse" style={{animationDelay: '0.3s'}}>+8.2%</span>
                  </div>
                </div>
                
                {/* Animated dollar signs */}
                <div className="absolute top-16 right-16 text-4xl animate-bounce opacity-60" style={{animationDelay: '0.2s'}}>💰</div>
                <div className="absolute bottom-24 left-16 text-3xl animate-bounce opacity-60" style={{animationDelay: '0.8s'}}>📈</div>
              </div>
            </div>
          </div>
        </div>
      </section>

    <FeaturesSection />

      {/* Simple Steps to Financial Freedom */}
      <section id="steps" className="py-20 bg-[#C4C4DB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#251B28] text-center mb-6 animate-fade-in-up hover:text-[#8ABFB2] transition-colors duration-300">
            How the Process Flows
          </h2>
          <p className="text-lg text-[#251B28]/70 text-center max-w-4xl mx-auto mb-16 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
            Our platform makes it very easy for you to keep track of your money. You can quickly record your expenses, set your budget, and clearly see where your money is going. The system can also read information from your receipts automatically using OCR, and our smart AI chatbot is always there to guide you with helpful financial advice.
          </p>
          
          {/* Steps Container Box */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-[#8ABFB2]/20 animate-fade-in-up hover:shadow-3xl hover:border-[#8ABFB2]/40 transition-all duration-500" style={{animationDelay: '0.2s'}}>
            {/* Steps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative">
            {/* Step 1: Signup/Login */}
            <div className="flex flex-col items-center text-center relative group animate-fade-in-up" style={{animationDelay: '0.3s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Signup / Login</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Create account or login to access personalized financial dashboard
              </p>
              {/* Arrow to next step - visible on desktop */}
              <div className="hidden md:block absolute top-16 -right-4 transform translate-x-1/2 animate-pulse">
                <svg className="w-8 h-8 text-[#251B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 2: Add Income & Expense */}
            <div className="flex flex-col items-center text-center relative group animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Add Income & Expense</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Easily record income sources and track all expenses in one place
              </p>
              {/* Arrow to next step - visible on desktop */}
              <div className="hidden md:block absolute top-16 -right-4 transform translate-x-1/2 animate-pulse">
                <svg className="w-8 h-8 text-[#251B28]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 3: Categorize Items */}
            <div className="flex flex-col items-center text-center relative group animate-fade-in-up" style={{animationDelay: '0.5s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Categorize Items</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Categorize transactions for better financial insights
              </p>
            </div>
          </div>

          {/* Connecting Arrow between rows */}
          <div className="flex justify-end mb-12 pr-8 md:pr-16 animate-bounce">
            <svg className="w-8 h-8 text-[#251B28] rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 4: Ask AI */}
            <div className="flex flex-col items-center text-center relative md:order-3 group animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 9V7c0-1.1-.9-2-2-2h-3c0-1.66-1.34-3-3-3S9 3.34 9 5H6c-1.1 0-2 .9-2 2v2c-1.66 0-3 1.34-3 3s1.34 3 3 3v4c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-4c1.66 0 3-1.34 3-3s-1.34-3-3-3zM7.5 11.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5S9.83 13 9 13s-1.5-.67-1.5-1.5zM16 17H8v-2h8v2zm-1-4c-.83 0-1.5-.67-1.5-1.5S14.17 10 15 10s1.5.67 1.5 1.5S15.83 13 15 13z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Ask AI</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Get personalized financial advice from AI assistant
              </p>
              {/* Arrow to next step - visible on desktop */}
              <div className="hidden md:block absolute top-16 -left-4 transform -translate-x-1/2 animate-pulse">
                <svg className="w-8 h-8 text-[#251B28] rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 5: Recurring Transaction */}
            <div className="flex flex-col items-center text-center relative md:order-2 group animate-fade-in-up" style={{animationDelay: '0.7s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 6v3l4-4-4-4v3c-4.42 0-8 3.58-8 8 0 1.57.46 3.03 1.24 4.26L6.7 14.8c-.45-.83-.7-1.79-.7-2.8 0-3.31 2.69-6 6-6zm6.76 1.74L17.3 9.2c.44.84.7 1.79.7 2.8 0 3.31-2.69 6-6 6v-3l-4 4 4 4v-3c4.42 0 8-3.58 8-8 0-1.57-.46-3.03-1.24-4.26z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Recurring Transaction</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Set up and manage recurring transactions for better planning
              </p>
              {/* Arrow to next step - visible on desktop */}
              <div className="hidden md:block absolute top-16 -left-4 transform -translate-x-1/2 animate-pulse">
                <svg className="w-8 h-8 text-[#251B28] rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>

            {/* Step 6: Report Generating */}
            <div className="flex flex-col items-center text-center relative md:order-1 group animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-110 hover:rotate-6 group-hover:bg-[#C4C4DB]/20">
                <svg className="w-16 h-16 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-[#251B28] mb-3 group-hover:text-[#8ABFB2] transition-colors duration-300">Report Generating</h3>
              <p className="text-[#251B28]/70 group-hover:text-[#251B28] transition-colors duration-300">
                Generate detailed reports to analyze your financial health
              </p>
            </div>
          </div>
          </div>
        </div>
      </section>

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

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-8 px-4">
            {['All', 'Getting Started', 'Features', 'Technical'].map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium text-sm sm:text-base transition-all duration-200 whitespace-nowrap ${
                  activeCategory === category
                    ? 'bg-[#01332B] text-white shadow-lg'
                    : 'bg-white text-[#251B28] hover:bg-[#01332B] hover:text-white shadow-md'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
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

            {/* FAQ 4 */}
            <div className="bg-white/80 backdrop-blur rounded-2xl overflow-hidden shadow-lg">
              <button
                onClick={() => setOpenFAQ(openFAQ === 4 ? null : 4)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
              >
                <span className="text-lg font-semibold text-[#251B28]">
                  Can I export my financial data?
                </span>
                <div className={`w-10 h-10 rounded-full bg-[#01332B] flex items-center justify-center transition-transform ${openFAQ === 4 ? 'rotate-180' : ''}`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              {openFAQ === 4 && (
                <div className="px-6 pb-5 text-[#251B28]/70">
                  <p>Absolutely! You can export your financial data in multiple formats including CSV, Excel, and PDF. Go to Settings &gt; Export Data, select your date range and format, and download your complete financial records for backup or analysis purposes.</p>
                </div>
              )}
            </div>
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