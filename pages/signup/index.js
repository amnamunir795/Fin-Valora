import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { signup, isAuthenticated } from "../../utils/auth";
import { CURRENCY_OPTIONS, DEFAULT_CURRENCY } from "../../constants/currencies";

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
    <div className="min-h-screen bg-[#E7EFC7] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#E7EFC7] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#E7EFC7] rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E7EFC7] rounded-full mix-blend-multiply filter blur-2xl opacity-5 animate-pulse delay-500"></div>
      </div>

      <div
        className="max-w-md w-full bg-white backdrop-blur-md rounded-2xl shadow-2xl drop-shadow-2xl border border-[#3B3B1A]/20 p-8 relative z-10 transform hover:scale-105 transition-all duration-300"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(59, 59, 26, 0.15), 0 0 0 1px rgba(59, 59, 26, 0.2)",
        }}
      >
        {/* Create Account Heading with Avatar */}
        <div className="text-center mb-8">
          {/* Avatar Upload Section */}
          <div className="mb-6">
            <div className="relative inline-block">
              {/* Circular Avatar */}
              <div
                className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-[#8A784E] to-[#796944] shadow-lg drop-shadow-lg flex items-center justify-center border-2 border-[#3B3B1A]/20"
                style={{
                  boxShadow:
                    "0 10px 25px -3px rgba(121, 105, 68, 0.3), 0 4px 6px -2px rgba(121, 105, 68, 0.2)",
                }}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-16 h-16 text-[#3B3B1A]"
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
                )}
              </div>

              {/* Upload/Remove Button Overlay */}
              {imagePreview ? (
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute bottom-0 right-0 w-10 h-10 bg-red-500 hover:bg-red-600 text-[#3B3B1A] rounded-full shadow-lg flex items-center justify-center transition-all duration-200 transform hover:scale-110"
                  title="Remove image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              ) : (
                <label
                  htmlFor="avatarUpload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-[#796944] hover:bg-[#6E603E] text-[#3B3B1A] rounded-full shadow-lg flex items-center justify-center cursor-pointer transition-all duration-200 transform hover:scale-110"
                  title="Upload image"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
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
            <p className="text-xs text-[#3B3B1A]/70 mt-3">
              {imagePreview
                ? "Profile picture selected"
                : "Click + to add profile picture (optional)"}
            </p>

            {errors.profileImage && (
              <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
            )}
          </div>

          <h1 className="text-3xl font-bold text-[#3B3B1A] mb-2">Create Account</h1>
          <p className="text-[#3B3B1A]/80 text-sm">
            Join us today and get started on your financial journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-[#3B3B1A]"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] placeholder-[#3B3B1A]/50 shadow-sm hover:shadow-md focus:shadow-lg ${
                  errors.firstName
                    ? "border-red-400 bg-red-50"
                    : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
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
                className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-[#3B3B1A]"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] placeholder-[#3B3B1A]/50 shadow-sm hover:shadow-md focus:shadow-lg ${
                  errors.lastName
                    ? "border-red-400 bg-red-50"
                    : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
                }`}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="currency"
              className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#3B3B1A]"
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] cursor-pointer shadow-sm hover:shadow-md focus:shadow-lg ${
                errors.currency
                  ? "border-red-400 bg-red-50"
                  : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
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

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#3B3B1A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] placeholder-[#3B3B1A]/50 shadow-sm hover:shadow-md focus:shadow-lg ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
              }`}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#3B3B1A]"
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
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] placeholder-[#3B3B1A]/50 shadow-sm hover:shadow-md focus:shadow-lg ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#3B3B1A]/60 hover:text-[#3B3B1A] transition-colors duration-200"
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
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
              className="block text-sm font-semibold text-[#3B3B1A] mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#3B3B1A]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8A784E] focus:border-transparent transition-all duration-200 bg-[#E7EFC7] hover:bg-[#E7EFC7] text-[#3B3B1A] placeholder-[#3B3B1A]/50 shadow-sm hover:shadow-md focus:shadow-lg ${
                  errors.confirmPassword
                    ? "border-red-400 bg-red-50"
                    : "border-[#3B3B1A]/25 hover:border-[#8A784E]"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#3B3B1A]/60 hover:text-[#3B3B1A] transition-colors duration-200"
              >
                {showConfirmPassword ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.submit && (
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-lg p-4 shadow-md drop-shadow-sm">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-400 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <p className="text-sm font-medium text-red-700">
                  {errors.submit}
                </p>
              </div>
            </div>
          )}

          {/* Terms and Conditions Checkbox */}
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => {
                    setAcceptedTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: "" }));
                    }
                  }}
                  className="w-5 h-5 border-2 border-[#3B3B1A]/25 rounded bg-[#E7EFC7] text-[#3B3B1A] focus:ring-2 focus:ring-[#8A784E] focus:ring-offset-0 cursor-pointer transition-all"
                />
              </div>
              <div className="ml-3">
                <label
                  htmlFor="terms"
                  className="text-sm text-[#3B3B1A]/90 cursor-pointer"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#3B3B1A] hover:text-[#3B3B1A] underline font-medium transition-colors"
                    target="_blank"
                  >
                    Terms and Conditions
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-[#3B3B1A] hover:text-[#3B3B1A] underline font-medium transition-colors"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-400 ml-8">{errors.terms}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading || !acceptedTerms}
            className="w-full bg-[#796944] text-[#3B3B1A] py-4 px-6 rounded-xl font-semibold text-lg hover:bg-[#6E603E] focus:outline-none focus:ring-2 focus:ring-[#8A784E] disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl drop-shadow-lg"
            style={{
              boxShadow:
                "0 10px 25px -3px rgba(121, 105, 68, 0.4), 0 4px 6px -2px rgba(121, 105, 68, 0.3)",
            }}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#3B3B1A]"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                  />
                </svg>
                Create Account
              </div>
            )}
          </button>

          {/* Consent Text Below Button */}
          <p className="text-xs text-[#3B3B1A]/60 text-center mt-4">
            By signing up, you agree to our Terms of Service and Privacy Policy.
            We'll use your information to provide and improve our services.
          </p>
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#3B3B1A]/25"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-[#3B3B1A]/80">
                Already have an account?
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border-2 border-[#D174D2] text-[#3B3B1A] font-semibold rounded-xl hover:bg-[#D174D2] hover:border-[#8A784E] transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Sign In Instead
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
