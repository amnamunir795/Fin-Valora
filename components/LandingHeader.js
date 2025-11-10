import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-[#78B9B5] to-[#0F828C] rounded-xl flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#78B9B5] to-[#0F828C] bg-clip-text text-transparent">
              FinValora
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-600 hover:text-[#78B9B5] font-medium transition-colors">
              Features
            </a>
            <a href="#about" className="text-gray-600 hover:text-[#78B9B5] font-medium transition-colors">
              About
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-[#78B9B5] font-medium transition-colors">
              Pricing
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-[#0F828C] hover:text-[#065084] font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-gradient-to-r from-[#78B9B5] to-[#0F828C] text-white px-6 py-2 rounded-lg font-semibold hover:from-[#0F828C] hover:to-[#065084] transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}