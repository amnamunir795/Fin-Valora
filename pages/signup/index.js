import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signup, isAuthenticated } from "../../utils/auth";
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from "../../constants/currencies";
import FinValoraLogo from "../../components/FinValoraLogo";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    currency: DEFAULT_CURRENCY,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = async () => {
      if (isAuthenticated()) {
        try {
          const response = await fetch("/api/auth/me");
          if (response.ok) {
            // User is authenticated, redirect to dashboard
            router.push("/dashboard");
          }
        } catch (error) {
          console.error("Auth check error:", error);
        }
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Image size should be less than 2MB",
        }));
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "Please select a valid image file",
        }));
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      // Clear error
      if (errors.profileImage) {
        setErrors((prev) => ({
          ...prev,
          profileImage: "",
        }));
      }
    }
  };

  const removeImage = () => {
    setProfileImage(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.currency) {
      newErrors.currency = "Please select a currency";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptedTerms) {
      newErrors.terms = "You must accept the Terms and Conditions to continue";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({}); // Clear any previous errors

    try {
      const result = await signup(formData);

      if (result.success) {
        // Success - redirect to budget setup page
        console.log("User created successfully:", result.user);
        router.push("/budget-setup?signup=success");
      } else {
        // Handle API errors
        if (result.errors && Array.isArray(result.errors)) {
          setErrors({ submit: result.errors.join(", ") });
        } else {
          setErrors({
            submit: result.message || "Something went wrong. Please try again.",
          });
        }
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <><Head><title>Create Account — FinValora</title></Head>
    <div className="min-h-screen bg-gradient-to-br from-mist via-mist/90 to-teal/20 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-teal rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-forest rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-void rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
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

      <div
        className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-teal/30 p-8 relative z-10 animate-scale-in"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(1, 51, 43, 0.25), 0 0 0 1px rgba(138, 191, 178, 0.2)",
        }}
      >
        {/* Create Account Heading with Avatar */}
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="mb-5 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-teal/20 blur-xl scale-110" aria-hidden />
              <FinValoraLogo size={56} className="relative drop-shadow-lg" />
            </div>
          </div>
          {/* Avatar Upload Section */}
          <div className="mb-4">
            <div className="relative inline-block group">
              {/* Circular Avatar with gradient border */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-teal via-forest to-void p-[3px] group-hover:p-[4px] transition-all duration-300">
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>
              <div
                className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-mist/30 to-teal/20 flex items-center justify-center transition-all duration-300 group-hover:scale-105"
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-12 h-12 text-teal group-hover:text-forest transition-colors duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>

              {/* Upload/Remove Button Overlay */}
              {imagePreview ? (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 hover:rotate-90 ring-2 ring-white"
                  title="Remove image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <label
                  htmlFor="avatarUpload"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-br from-teal to-forest hover:from-forest hover:to-void text-white rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-110 hover:rotate-90 ring-2 ring-white"
                  title="Upload image"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <input
                    type="file"
                    id="avatarUpload"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Upload Instructions */}
            <p className="text-xs text-teal/80 mt-2 font-medium">
              {imagePreview
                ? "✓ Profile picture added"
                : "Optional: Add profile picture"}
            </p>

            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
            )}
          </div>

          <h1 className="text-3xl font-bold bg-gradient-to-r from-void via-forest to-teal bg-clip-text text-transparent mb-1">
            Create Your Account
          </h1>
          <p className="text-void/60 text-sm">
            Start your financial journey in minutes
          </p>
        </div>

        {/* Progress indicator */}
        <div className="mb-6 animate-fade-in-up" style={{animationDelay: '0.05s', opacity: 0, animationFillMode: 'forwards'}}>
          <div className="flex items-center justify-center space-x-2">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal to-forest flex items-center justify-center text-white text-xs font-bold shadow-md">1</div>
              <span className="ml-2 text-xs font-semibold text-forest">Account</span>
            </div>
            <div className="w-8 h-0.5 bg-mist"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center text-void/50 text-xs font-bold">2</div>
              <span className="ml-2 text-xs font-medium text-void/50">Budget</span>
            </div>
            <div className="w-8 h-0.5 bg-mist"></div>
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-mist flex items-center justify-center text-void/50 text-xs font-bold">3</div>
              <span className="ml-2 text-xs font-medium text-void/50">Start</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{animationDelay: '0.1s', opacity: 0, animationFillMode: 'forwards'}}>
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-void mb-2 flex items-center group"
              >
                <svg
                  className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void placeholder-void/50 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                  errors.firstName
                    ? "border-red-400 bg-red-50"
                    : "border-teal/30 hover:border-teal"
                }`}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-void mb-2 flex items-center group"
              >
                <svg
                  className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void placeholder-void/50 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                  errors.lastName
                    ? "border-red-400 bg-red-50"
                    : "border-teal/30 hover:border-teal"
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.2s', opacity: 0, animationFillMode: 'forwards'}}>
            <label
              htmlFor="currency"
              className="block text-sm font-semibold text-void mb-2 flex items-center group"
            >
              <svg
                className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
              Preferred Currency
            </label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void cursor-pointer shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                errors.currency
                  ? "border-red-400 bg-red-50"
                  : "border-teal/30 hover:border-teal"
              }`}
            >
              <option value="">Select Currency</option>
              {CURRENCY_OPTIONS.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.country} ({currency.symbol})
                </option>
              ))}
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
            )}
          </div>

          <div className="animate-fade-in-up" style={{animationDelay: '0.3s', opacity: 0, animationFillMode: 'forwards'}}>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-void mb-2 flex items-center group"
            >
              <svg
                className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void placeholder-void/50 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-teal/30 hover:border-teal"
              }`}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 animate-fade-in-up" style={{animationDelay: '0.4s', opacity: 0, animationFillMode: 'forwards'}}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-void mb-2 flex items-center group"
              >
                <svg
                  className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void placeholder-void/50 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] pr-10 ${
                    errors.password
                      ? "border-red-400 bg-red-50"
                      : "border-teal/30 hover:border-teal"
                  }`}
                  placeholder="Min 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal/60 hover:text-teal"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-void mb-2 flex items-center group"
              >
                <svg
                  className="w-4 h-4 mr-2 text-teal group-hover:text-forest transition-colors duration-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-300 bg-white/50 hover:bg-white text-void placeholder-void/50 shadow-sm hover:shadow-md focus:shadow-lg transform hover:scale-[1.02] pr-10 ${
                    errors.confirmPassword
                      ? "border-red-400 bg-red-50"
                      : "border-teal/30 hover:border-teal"
                  }`}
                  placeholder="Re-enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal/60 hover:text-teal"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.5s', opacity: 0, animationFillMode: 'forwards'}}>
            <div className="flex items-start space-x-3">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="w-4 h-4 border-2 border-teal/30 rounded bg-white text-teal focus:ring-2 focus:ring-teal focus:ring-offset-0 cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="terms" className="text-sm text-void/80 cursor-pointer select-none">
                  I agree to the{" "}
                  <Link href="/privacy" className="text-teal hover:text-forest font-semibold transition-colors underline">
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 animate-fade-in" role="alert">
              {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <div className="animate-fade-in-up" style={{animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards'}}>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-6 bg-gradient-to-br from-teal to-forest text-white font-semibold rounded-xl shadow-lg hover:from-forest hover:to-void focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Login Link */}
          <div className="text-center animate-fade-in-up" style={{animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards'}}>
            <p className="text-sm text-void/60">
              Already have an account?{" "}
              <Link href="/login" className="text-teal hover:text-forest font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </>
  );
}
