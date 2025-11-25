import Link from 'next/link';

export default function LandingHeader() {
  return (
    <header className="bg-[#01332B] shadow-sm border-b border-[#8ABFB2]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <Link href="/" className="flex items-center group cursor-pointer relative">
            <div className="relative w-14 h-14 mr-3">
              {/* Animated glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ABFB2] to-[#01332B] rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              
              {/* Main circular background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#8ABFB2] via-[#01332B] to-[#251B28] rounded-full shadow-2xl group-hover:shadow-[0_20px_50px_rgba(138,191,178,0.5)] transition-all duration-500 transform group-hover:scale-110 overflow-hidden">
                {/* Animated shine overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              
              {/* Logo icon - Finance themed */}
              <svg className="relative w-14 h-14 p-2.5" viewBox="0 0 48 48" fill="none">
                {/* Coin stack */}
                <g className="group-hover:translate-y-[-2px] transition-transform duration-300">
                  {/* Bottom coin */}
                  <ellipse cx="16" cy="38" rx="8" ry="3" fill="white" opacity="0.6"/>
                  <ellipse cx="16" cy="35" rx="8" ry="3" fill="white" opacity="0.7"/>
                  <ellipse cx="16" cy="32" rx="8" ry="3" fill="white" opacity="0.8"/>
                  <ellipse cx="16" cy="29" rx="8" ry="3" fill="white"/>
                  <text x="16" y="31" textAnchor="middle" fill="#01332B" fontSize="6" fontWeight="bold">$</text>
                </g>
                
                {/* Growth chart */}
                <g className="group-hover:scale-105 transition-transform duration-300">
                  {/* Chart bars */}
                  <rect x="28" y="32" width="3" height="8" rx="1.5" fill="white" opacity="0.7" className="group-hover:opacity-100 transition-opacity duration-300"/>
                  <rect x="33" y="28" width="3" height="12" rx="1.5" fill="white" opacity="0.8" className="group-hover:opacity-100 transition-opacity duration-300"/>
                  <rect x="38" y="24" width="3" height="16" rx="1.5" fill="white" className="group-hover:opacity-100 transition-opacity duration-300"/>
                </g>
                
                {/* Upward arrow */}
                <g className="group-hover:translate-x-[2px] group-hover:translate-y-[-2px] transition-transform duration-300">
                  <path d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12" stroke="#8ABFB2" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-white transition-colors duration-300"/>
                </g>
                
                {/* Currency symbols floating */}
                <g className="animate-pulse" style={{animationDuration: '2s'}}>
                  <text x="8" y="12" fill="#8ABFB2" fontSize="6" fontWeight="bold" opacity="0.8">$</text>
                  <text x="38" y="14" fill="white" fontSize="5" fontWeight="bold" opacity="0.7">€</text>
                  <text x="6" y="22" fill="white" fontSize="5" fontWeight="bold" opacity="0.6">£</text>
                </g>
                
                {/* Sparkle effects */}
                <circle cx="42" cy="10" r="1.5" fill="white" className="animate-ping" style={{animationDuration: '2s'}}/>
                <circle cx="10" cy="38" r="1" fill="#8ABFB2" className="animate-ping" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}/>
              </svg>
            </div>
            
            <div className="relative overflow-hidden">
              <h1 className="text-2xl font-bold text-white tracking-tight group-hover:text-[#8ABFB2] transition-all duration-300 relative">
                <span className="inline-block group-hover:scale-105 transition-transform duration-300">FIN</span>
                <span className="text-[#8ABFB2] mx-0.5">-</span>
                <span className="inline-block group-hover:scale-105 transition-transform duration-300">VALORA</span>
                {/* Shimmer effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              </h1>
              <div className="h-0.5 bg-gradient-to-r from-[#8ABFB2] via-white to-transparent w-0 group-hover:w-full transition-all duration-700 rounded-full mt-0.5"></div>
              <p className="text-xs text-[#8ABFB2]/70 group-hover:text-[#8ABFB2] transition-all duration-300 font-medium mt-0.5 tracking-wide">
                Smart Finance Solutions
              </p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-white hover:text-[#8ABFB2] font-medium transition-colors">
              Features
            </a>
            <a href="#steps" className="text-white hover:text-[#8ABFB2] font-medium transition-colors">
              How It Works
            </a>
            <a href="#feedback" className="text-white hover:text-[#8ABFB2] font-medium transition-colors">
              Feedback
            </a>
            <a href="#faq" className="text-white hover:text-[#8ABFB2] font-medium transition-colors">
              FAQ
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white hover:text-[#8ABFB2] font-semibold px-4 py-2 rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-[#8ABFB2] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#8ABFB2]/80 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}