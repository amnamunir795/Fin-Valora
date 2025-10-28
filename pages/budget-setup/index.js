import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CURRENCY_OPTIONS } from "../../constants/currencies";

export default function BudgetSetup() {
  const [formData, setFormData] = useState({
    monthlyIncome: "",
    startDate: "",
    spendingLimit: "",
    savingGoal: "",
    currency: "USD",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check for success messages
    if (router.query.signup === "success") {
      setShowSuccess(true);
      setSuccessMessage(
        "Account created successfully! Now let's set up your budget."
      );
      // Remove the query parameter from URL
      router.replace("/budget-setup", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (router.query.login === "success") {
      setShowSuccess(true);
      setSuccessMessage("Welcome back! Let's manage your budget.");
      // Remove the query parameter from URL
      router.replace("/budget-setup", undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }

    // Get user info and set default currency
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setFormData((prev) => ({
            ...prev,
            currency: userData.user.currency || "USD",
          }));
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  // Set default start date to first day of current month
  useEffect(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const defaultDate = firstDay.toISOString().split("T")[0];
    setFormData((prev) => ({
      ...prev,
      startDate: defaultDate,
    }));
  }, []);

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      newErrors.monthlyIncome = "Please enter a valid monthly income";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Please select a start date";
    }

    if (!formData.spendingLimit || parseFloat(formData.spendingLimit) <= 0) {
      newErrors.spendingLimit = "Please enter a valid spending limit";
    }

    if (!formData.savingGoal || parseFloat(formData.savingGoal) < 0) {
      newErrors.savingGoal = "Please enter a valid saving goal";
    }

    // Check if spending limit + saving goal doesn't exceed income
    const income = parseFloat(formData.monthlyIncome) || 0;
    const spending = parseFloat(formData.spendingLimit) || 0;
    const saving = parseFloat(formData.savingGoal) || 0;

    if (spending + saving > income) {
      newErrors.submit =
        "Your spending limit and saving goal cannot exceed your monthly income";
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
    setErrors({});

    try {
      const response = await fetch("/api/budget/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthlyIncome: parseFloat(formData.monthlyIncome),
          startDate: formData.startDate,
          spendingLimit: parseFloat(formData.spendingLimit),
          savingGoal: parseFloat(formData.savingGoal),
          currency: formData.currency,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Budget setup successful:", result);
        router.push("/dashboard?setup=success");
      } else {
        setErrors({
          submit: result.message || "Failed to setup budget. Please try again.",
        });
      }
    } catch (error) {
      console.error("Budget setup error:", error);
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrencySymbol = (currencyCode) => {
    const currency = CURRENCY_OPTIONS.find((c) => c.code === currencyCode);
    return currency ? currency.symbol : "$";
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#F2E6D8] via-[#F0D3C7] to-[#E8C5B5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#B5BFC8]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2E6D8] via-[#F0D3C7] to-[#E8C5B5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#B5BFC8] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F0D3C7] rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#F2E6D8] rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-500"></div>
      </div>

      <div
        className="max-w-2xl w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl drop-shadow-2xl border border-white/20 p-8 relative z-10 transform hover:scale-105 transition-all duration-300"
        style={{
          boxShadow:
            "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        }}
      >
        {showSuccess && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-lg backdrop-blur-sm transform animate-bounce">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                  <svg
                    className="h-6 w-6 text-white"
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
              </div>
              <div className="ml-4">
                <p className="text-sm font-semibold text-green-800">
                  {successMessage}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <a
            href="/"
            className="inline-flex items-center text-[#B5BFC8] hover:text-[#9FAAB5] font-semibold transition-colors duration-200"
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
          <div className="text-sm text-gray-500">
            Logged in as{" "}
            <span className="font-semibold text-[#B5BFC8]">
              {user?.firstName}
            </span>
          </div>
        </div>

        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#B5BFC8] to-[#9FAAB5] rounded-full mb-6 shadow-lg drop-shadow-lg"
            style={{
              boxShadow:
                "0 10px 25px -3px rgba(181, 191, 200, 0.4), 0 4px 6px -2px rgba(181, 191, 200, 0.2)",
            }}
          >
            <svg
              className="w-10 h-10 text-white"
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
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] bg-clip-text text-transparent mb-4">
            Hey there! 👋
          </h1>
          <div className="bg-gradient-to-r from-[#F2E6D8]/50 to-[#F0D3C7]/50 rounded-xl p-6 mb-6 shadow-md">
            <p className="text-gray-700 text-lg leading-relaxed">
              <span className="font-semibold text-[#B5BFC8]">
                Welcome to your Budget Settings
              </span>{" "}
              — the best place to plan your money smartly every month!
            </p>
          </div>

          <div className="text-left bg-white/50 rounded-xl p-6 mb-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#B5BFC8] mb-4">
              Here's what you can do:
            </h2>
            <div className="space-y-3 text-gray-700">
              <div className="flex items-start">
                <span className="text-2xl mr-3">💵</span>
                <div>
                  <span className="font-semibold">Add Your Monthly Income</span>{" "}
                  — Enter your total income for this month. You only need to do
                  this once.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">📅</span>
                <div>
                  <span className="font-semibold">Pick a Start Date</span> —
                  Choose when your budget should begin, like the first day of
                  the month.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">💸</span>
                <div>
                  <span className="font-semibold">Set Your Spending Limit</span>{" "}
                  — Decide how much you want to spend so you can stay on track.
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-2xl mr-3">🏦</span>
                <div>
                  <span className="font-semibold">Add a Saving Goal</span> —
                  Write down how much you'd love to save by the end of the
                  month.
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#B5BFC8]/10 to-[#9FAAB5]/10 rounded-xl p-4 mb-6">
            <p className="text-gray-600 text-sm">
              Once you save your plan, you'll be able to see how your money is
              being used — what's spent, what's left, and how close you are to
              your savings goal.
            </p>
            <p className="text-[#B5BFC8] font-semibold mt-2">
              ✨ Stay organized, spend wisely, and watch your savings grow — one
              month at a time!
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="monthlyIncome"
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
                Monthly Income 💵
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
                    errors.monthlyIncome
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-[#B5BFC8]"
                  }`}
                  placeholder="5000.00"
                />
              </div>
              {errors.monthlyIncome && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.monthlyIncome}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="startDate"
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Start Date 📅
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
                  errors.startDate
                    ? "border-red-400 bg-red-50"
                    : "border-gray-200 hover:border-[#B5BFC8]"
                }`}
              />
              {errors.startDate && (
                <p className="mt-1 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="spendingLimit"
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
                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Spending Limit 💸
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  id="spendingLimit"
                  name="spendingLimit"
                  value={formData.spendingLimit}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
                    errors.spendingLimit
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-[#B5BFC8]"
                  }`}
                  placeholder="3000.00"
                />
              </div>
              {errors.spendingLimit && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.spendingLimit}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="savingGoal"
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                Saving Goal 🏦
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                  {getCurrencySymbol(formData.currency)}
                </span>
                <input
                  type="number"
                  id="savingGoal"
                  name="savingGoal"
                  value={formData.savingGoal}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`w-full pl-8 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B5BFC8] focus:border-transparent transition-all duration-200 bg-gray-50/50 hover:bg-white shadow-sm hover:shadow-md focus:shadow-lg ${
                    errors.savingGoal
                      ? "border-red-400 bg-red-50"
                      : "border-gray-200 hover:border-[#B5BFC8]"
                  }`}
                  placeholder="1000.00"
                />
              </div>
              {errors.savingGoal && (
                <p className="mt-1 text-sm text-red-600">{errors.savingGoal}</p>
              )}
            </div>
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-[#B5BFC8] to-[#9FAAB5] text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-[#9FAAB5] hover:to-[#8A95A2] focus:outline-none focus:ring-4 focus:ring-[#B5BFC8]/30 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-2xl drop-shadow-lg"
            style={{
              boxShadow:
                "0 10px 25px -3px rgba(181, 191, 200, 0.5), 0 4px 6px -2px rgba(181, 191, 200, 0.3)",
            }}
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
                Setting Up Your Budget...
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save My Budget Plan
              </div>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
