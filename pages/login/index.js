import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login, isAuthenticated } from '../../utils/auth';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await fetch('/api/auth/me');
          if (response.ok) {
            // User is authenticated, redirect to dashboard
            router.push('/dashboard');
          }
        } catch (error) {
          console.error('Auth check error:', error);
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login form submitted with data:', { email: formData.email, hasPassword: !!formData.password });

    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      console.log('Calling login function...');
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (result.success) {
        // Success - check if user has active budget
        console.log('Login successful:', result.user);
        
        try {
          const budgetResponse = await fetch('/api/budget/current');
          if (budgetResponse.ok) {
            // User has active budget, go to dashboard
            router.push('/dashboard?login=success');
          } else {
            // No active budget, go to budget setup
            router.push('/budget-setup?login=success');
          }
        } catch (error) {
          // Default to budget setup if there's an error
          router.push('/budget-setup?login=success');
        }
      } else {
        console.log('Login failed:', result.message);
        setErrors({ submit: result.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ submit: 'Network error. Please check your connection and try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#C4C4DB] via-[#C4C4DB]/90 to-[#8ABFB2]/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#8ABFB2] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#01332B] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#251B28] rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>
      
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scaleIn 0.5s ease-out forwards;
        }
      `}</style>
      
      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-[#8ABFB2]/30 p-8 relative z-10 animate-scale-in" style={{boxShadow: '0 25px 50px -12px rgba(1, 51, 43, 0.25), 0 0 0 1px rgba(138, 191, 178, 0.2)'}}>
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#251B28] via-[#01332B] to-[#8ABFB2] bg-clip-text text-transparent mb-2">Welcome Back</h1>
          <p className="text-[#251B28]/70 text-sm">Sign in to continue your financial journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-fade-in-up" style={{animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards'}}>
            <label htmlFor="email" className="block text-sm font-semibold text-[#251B28] mb-2 flex items-center group">
              <svg className="w-4 h-4 mr-2 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8ABFB2] focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                errors.email ? 'border-red-400 bg-red-50' : 'border-[#8ABFB2]/30 hover:border-[#8ABFB2]'
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.email}</p>
            )}
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'}}>
            <label htmlFor="password" className="block text-sm font-semibold text-[#251B28] mb-2 flex items-center group">
              <svg className="w-4 h-4 mr-2 text-[#8ABFB2] group-hover:text-[#01332B] transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8ABFB2] focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                  errors.password ? 'border-red-400 bg-red-50' : 'border-[#8ABFB2]/30 hover:border-[#8ABFB2]'
                }`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8ABFB2] hover:text-[#01332B] transition-all duration-300 hover:scale-110"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 animate-fade-in">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between animate-fade-in-up" style={{animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards'}}>
            <div className="flex items-center group">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-5 w-5 text-[#8ABFB2] focus:ring-[#8ABFB2] border-[#8ABFB2]/30 rounded-md transition-all duration-300 cursor-pointer hover:scale-110"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-[#251B28] cursor-pointer group-hover:text-[#01332B] transition-colors duration-300">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="text-[#8ABFB2] hover:text-[#01332B] font-semibold transition-all duration-300 flex items-center group">
                <svg className="w-4 h-4 mr-1 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Forgot password?
              </a>
            </div>
          </div>

          {errors.submit && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-lg p-4 shadow-md animate-fade-in">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-medium text-red-700">{errors.submit}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#01332B] via-[#8ABFB2] to-[#01332B] bg-size-200 bg-pos-0 hover:bg-pos-100 text-white py-4 px-6 rounded-xl font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#8ABFB2] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-500 shadow-lg hover:shadow-2xl animate-fade-in-up"
            style={{
              animationDelay: '0.4s',
              opacity: 0,
              animationFillMode: 'forwards',
              boxShadow: '0 10px 25px -3px rgba(1, 51, 43, 0.4), 0 4px 6px -2px rgba(138, 191, 178, 0.3)',
              backgroundSize: '200% 100%'
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center justify-center group">
                <svg className="w-5 h-5 mr-2 group-hover:translate-x-[-4px] transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </div>
            )}
          </button>
        </form>

        <div className="mt-8 text-center animate-fade-in-up" style={{animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards'}}>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#8ABFB2]/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/95 text-[#251B28]/70">Don't have an account?</span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 border-2 border-[#8ABFB2] text-[#01332B] font-semibold rounded-xl hover:bg-[#01332B] hover:text-white hover:border-[#01332B] transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 shadow-md hover:shadow-xl group"
            >
              <svg className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}