import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    currency: "INR",
    avatar: {
      backgroundColor: "#B5BFC8",
      textColor: "#FFFFFF",
      style: "initials"
    },
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  // Avatar options
  const avatarBackgrounds = [
    "#B5BFC8", "#F0D3C7", "#E8C5B5", "#A8B5C8", "#C8B5A8",
    "#B5C8A8", "#C8A8B5", "#A8C8B5", "#B8A8C5", "#C5B8A8"
  ];

  const avatarStyles = [
    { id: "initials", name: "Initials", icon: "👤" },
    { id: "geometric", name: "Geometric", icon: "🔷" },
    { id: "abstract", name: "Abstract", icon: "🎨" }
  ];

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

  const handleAvatarChange = (property, value) => {
    setFormData((prev) => ({
      ...prev,
      avatar: {
        ...prev.avatar,
        [property]: value
      }
    }));
  };

  const generateInitials = () => {
    const first = formData.firstName.charAt(0).toUpperCase();
    const last = formData.lastName.charAt(0).toUpperCase();
    return first + last || "??";
  };

  const renderAvatarPreview = () => {
    const { backgroundColor, textColor, style } = formData.avatar;
    const initials = generateInitials();

    if (style === "initials") {
      return (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center text-2xl font-bold"
          style={{ backgroundColor, color: textColor }}
        >
          {initials}
        </div>
      );
    } else if (style === "geometric") {
      return (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rotate-45 border-4" style={{ borderColor: textColor }}></div>
            <div className="w-4 h-4 rounded-full absolute" style={{ backgroundColor: textColor }}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div 
          className="w-full h-full rounded-full flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor }}
        >
          <div className="absolute inset-0">
            <div className="w-6 h-6 rounded-full absolute top-2 left-3" style={{ backgroundColor: textColor, opacity: 0.7 }}></div>
            <div className="w-4 h-4 rounded-full absolute bottom-3 right-2" style={{ backgroundColor: textColor, opacity: 0.5 }}></div>
            <div className="w-3 h-3 rounded-full absolute top-1/2 right-1/3" style={{ backgroundColor: textColor, opacity: 0.8 }}></div>
          </div>
        </div>
      );
    }
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
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle API errors
        if (data.errors && Array.isArray(data.errors)) {
          // Handle validation errors from mongoose
          setErrors({ submit: data.errors.join(", ") });
        } else {
          setErrors({
            submit: data.message || "Something went wrong. Please try again.",
          });
        }
        return;
      }

      // Success - redirect to home page or show success message
      console.log("User created successfully:", data.user);
      router.push("/?signup=success");
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
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6D8] via-[#F0D3C7] to-[#E8C5B5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B5BFC8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F0D3C7] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F2E6D8] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 relative z-10 transform hover:scale-105 transition-all duration-300">
        {/* Avatar Creator - Before Heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4">
            <div className="w-24 h-24 rounded-full border-4 border-[#B5BFC8] shadow-lg overflow-hidden">
              {renderAvatarPreview()}
            </div>
          </div>

          <div className="w-full max-w-xs space-y-4">
            {/* Avatar Style Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                Avatar Style
              </label>
              <div className="flex justify-center space-x-2">
                {avatarStyles.map((style) => (
                  <button
                    key={style.id}
                    type="button"
                    onClick={() => handleAvatarChange('style', style.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                      formData.avatar.style === style.id
                        ? 'bg-[#B5BFC8] text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="mr-1">{style.icon}</span>
                    {style.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 text-center">
                Background Color
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {avatarBackgrounds.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleAvatarChange('backgroundColor', color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      formData.avatar.backgroundColor === color
                        ? 'border-gray-800 scale-110 shadow-lg'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Text Color Toggle */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleAvatarChange('textColor', formData.avatar.textColor === '#FFFFFF' ? '#000000' : '#FFFFFF')}
                className="inline-flex items-center px-4 py-2 border-2 border-[#B5BFC8] text-[#B5BFC8] font-medium rounded-lg hover:bg-[#B5BFC8] hover:text-white transition-all duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5H9m12 0v12a4 4 0 01-4 4H9" />
                </svg>
                {formData.avatar.textColor === '#FFFFFF' ? 'Light Text' : 'Dark Text'}
              </button>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mt-3">
            Customize your avatar appearance
          </p>
        </div>

        {/* Create Account Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] bg-clip-text text-transparent mb-2">
            Create Account
          </h1>
          <p className="text-gray-600 text-sm">
            Join us today and get started on your financial journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                  errors.firstName
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-[#B5BFC8]"
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
                className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
              >
                <svg
                  className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                  errors.lastName
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-[#B5BFC8]"
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
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white cursor-pointer ${
                errors.currency
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 hover:border-[#B5BFC8]"
              }`}
            >
              <option value="">Select Currency</option>
              <option value="INR">₹ INR - Indian Rupee</option>
              <option value="CNY">¥ CNY - Chinese Yuan</option>
              <option value="JPY">¥ JPY - Japanese Yen</option>
              <option value="KRW">₩ KRW - South Korean Won</option>
              <option value="SGD">S$ SGD - Singapore Dollar</option>
              <option value="HKD">HK$ HKD - Hong Kong Dollar</option>
              <option value="THB">฿ THB - Thai Baht</option>
              <option value="MYR">RM MYR - Malaysian Ringgit</option>
              <option value="IDR">Rp IDR - Indonesian Rupiah</option>
              <option value="PHP">₱ PHP - Philippine Peso</option>
              <option value="VND">₫ VND - Vietnamese Dong</option>
              <option value="TWD">NT$ TWD - Taiwan Dollar</option>
              <option value="PKR">₨ PKR - Pakistani Rupee</option>
              <option value="BDT">৳ BDT - Bangladeshi Taka</option>
              <option value="LKR">Rs LKR - Sri Lankan Rupee</option>
              <option value="NPR">Rs NPR - Nepalese Rupee</option>
              <option value="MMK">K MMK - Myanmar Kyat</option>
              <option value="KHR">៛ KHR - Cambodian Riel</option>
              <option value="LAK">₭ LAK - Lao Kip</option>
              <option value="BND">B$ BND - Brunei Dollar</option>
            </select>
            {errors.currency && (
              <p className="mt-1 text-sm text-red-600">{errors.currency}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
              className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                errors.email
                  ? "border-red-400 bg-red-50"
                  : "border-gray-200 hover:border-[#B5BFC8]"
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
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                  errors.password
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-[#B5BFC8]"
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#B5BFC8] transition-colors duration-200"
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
              className="block text-sm font-semibold text-gray-700 mb-2 flex items-center"
            >
              <svg
                className="w-4 h-4 mr-2 text-[#B5BFC8]"
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
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white ${
                  errors.confirmPassword
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-[#B5BFC8]"
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#B5BFC8] transition-colors duration-200"
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
            <div className="bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-lg p-4 shadow-sm">
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#9FAAB5] hover:to-[#8A95A2] focus:outline-none focus:ring-4 focus:ring-[#B5BFC8]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
        </form>

        <div className="mt-8 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">
                Already have an account?
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/login"
              className="inline-flex items-center px-6 py-3 border-2 border-[#B5BFC8] text-[#B5BFC8] font-semibold rounded-xl hover:bg-[#B5BFC8] hover:text-white transition-all duration-200 transform hover:scale-105"
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
