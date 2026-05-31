import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { CURRENCY_OPTIONS } from "../../constants/currencies";
import { authenticatedFetch } from "../../utils/auth";
import FinValoraLogo from "../../components/FinValoraLogo";

const inputBase =
  "w-full rounded-xl border px-4 py-3 text-void bg-surface transition-all duration-200 placeholder:text-ink-muted " +
  "hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25";

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
    if (router.query.signup === "success") {
      setShowSuccess(true);
      setSuccessMessage("Account created successfully! Now let's set up your budget.");
      router.replace("/budget-setup", undefined, { shallow: true });
      setTimeout(() => setShowSuccess(false), 5000);
    } else if (router.query.login === "success") {
      setShowSuccess(true);
      setSuccessMessage("Welcome back! Let's manage your budget.");
      router.replace("/budget-setup", undefined, { shallow: true });
      setTimeout(() => setShowSuccess(false), 5000);
    }

    const fetchUserAndBudget = async () => {
      try {
        const response = await fetch("/api/auth/me");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
          setFormData((prev) => ({
            ...prev,
            currency: userData.user.currency || "USD",
          }));

          const budgetResponse = await fetch("/api/budget/current");
          if (budgetResponse.ok) {
            const budgetData = await budgetResponse.json();
            const budget = budgetData.budget;

            if (!router.query.edit) {
              router.push("/dashboard");
              return;
            }

            setFormData((prev) => ({
              ...prev,
              monthlyIncome: budget.totalIncome.toString(),
              spendingLimit: budget.spendingLimit.toString(),
              savingGoal: budget.savingGoal.toString(),
              currency: userData.user.currency || "USD",
            }));
          }
        } else {
          router.push("/login");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        router.push("/login");
      }
    };

    fetchUserAndBudget();
  }, [router]);

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const defaultDate = `${year}-${month}-01`;
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

    const income = parseFloat(formData.monthlyIncome) || 0;
    const spending = parseFloat(formData.spendingLimit) || 0;
    const saving = parseFloat(formData.savingGoal) || 0;

    if (spending + saving > income) {
      newErrors.submit = "Spending limit and saving goal together cannot exceed monthly income.";
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
      const response = await authenticatedFetch("/api/budget/setup", {
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

  const incomeNum = parseFloat(formData.monthlyIncome) || 0;
  const spendNum = parseFloat(formData.spendingLimit) || 0;
  const saveNum = parseFloat(formData.savingGoal) || 0;

  const allocation = useMemo(() => {
    if (incomeNum <= 0) return null;
    const spendPct = Math.min(100, (spendNum / incomeNum) * 100);
    const savePct = Math.min(100, (saveNum / incomeNum) * 100);
    const totalAlloc = spendPct + savePct;
    const remainderPct = Math.max(0, 100 - totalAlloc);
    return { spendPct, savePct, remainderPct, over: spendNum + saveNum > incomeNum };
  }, [incomeNum, spendNum, saveNum]);

  const sym = getCurrencySymbol(formData.currency);

  const fieldBorder = (name) =>
    errors[name] ? "border-error/50 bg-red-50/50 ring-1 ring-error/15" : "border-lavender/70";

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/40 flex flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 rounded-full border-2 border-teal/30 border-t-teal animate-spin" aria-hidden />
        <p className="text-sm text-ink-secondary">Loading budget setup…</p>
      </div>
    );
  }

  const isEdit = Boolean(router.query.edit);

  return (
    <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      >
        <div className="absolute -top-32 right-0 h-72 w-72 rounded-full bg-teal/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-forest/15 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="rounded-2xl border border-lavender/35 bg-surface/95 backdrop-blur-md p-6 sm:p-9 shadow-(--shadow-fv-lg) ring-1 ring-forest/4">
          {showSuccess ? (
            <div
              className="mb-6 rounded-2xl border border-teal/35 bg-teal-soft/70 px-5 py-4 shadow-(--shadow-fv-sm) flex items-start gap-3"
              role="status"
            >
              <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-forest/10 text-forest">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
              <p className="text-sm font-medium text-void leading-relaxed pt-1">{successMessage}</p>
            </div>
          ) : null}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <Link
              href={isEdit ? "/dashboard" : "/"}
              className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-forest-hover transition-colors w-fit"
            >
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {isEdit ? "Back to dashboard" : "Back to home"}
            </Link>
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-secondary">
              <span>
                Signed in
                {user?.firstName || user?.email ? (
                  <>
                    {" "}
                    as <span className="font-semibold text-void">{user.firstName || user.email}</span>
                  </>
                ) : null}
              </span>
              <span className="inline-flex items-center rounded-full bg-teal-soft px-2.5 py-1 font-semibold text-forest ring-1 ring-teal/25 tabular-nums">
                {sym} {user?.currency}
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="mb-5 flex justify-center">
              <FinValoraLogo size={56} className="drop-shadow-sm" />
            </div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal mb-2">Plan</p>
            <h1 className="font-display text-3xl sm:text-[2rem] font-semibold text-void tracking-tight">
              {isEdit ? "Edit budget" : "Budget setup"}
            </h1>
            <p className="text-sm text-ink-secondary mt-3 max-w-md mx-auto leading-relaxed">
              {isEdit
                ? "Update income, spending cap, and savings target. Changes apply to your current budget period."
                : "Define monthly income, how much you plan to spend, and what you want to set aside. You can adjust this anytime."}
            </p>
            {user?.currency ? (
              <p className="text-xs text-ink-muted mt-3">
                Default currency from your account:{" "}
                <span className="font-semibold text-ink-secondary">
                  {sym} {user.currency}
                </span>
              </p>
            ) : null}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="monthlyIncome" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                Monthly income
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">
                  {sym}
                </span>
                <input
                  type="number"
                  id="monthlyIncome"
                  name="monthlyIncome"
                  value={formData.monthlyIncome}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`${inputBase} pl-10 ${fieldBorder("monthlyIncome")}`}
                  placeholder="0.00"
                />
              </div>
              {errors.monthlyIncome ? <p className="mt-1.5 text-sm text-error">{errors.monthlyIncome}</p> : null}
            </div>

            <div>
              <label htmlFor="startDate" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                Budget start date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className={`${inputBase} ${fieldBorder("startDate")}`}
              />
              {errors.startDate ? <p className="mt-1.5 text-sm text-error">{errors.startDate}</p> : null}
            </div>

            <div>
              <label htmlFor="spendingLimit" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                Spending limit
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">
                  {sym}
                </span>
                <input
                  type="number"
                  id="spendingLimit"
                  name="spendingLimit"
                  value={formData.spendingLimit}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`${inputBase} pl-10 ${fieldBorder("spendingLimit")}`}
                  placeholder="0.00"
                />
              </div>
              {errors.spendingLimit ? <p className="mt-1.5 text-sm text-error">{errors.spendingLimit}</p> : null}
            </div>

            <div>
              <label htmlFor="savingGoal" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                Saving goal
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">
                  {sym}
                </span>
                <input
                  type="number"
                  id="savingGoal"
                  name="savingGoal"
                  value={formData.savingGoal}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`${inputBase} pl-10 ${fieldBorder("savingGoal")}`}
                  placeholder="0.00"
                />
              </div>
              {errors.savingGoal ? <p className="mt-1.5 text-sm text-error">{errors.savingGoal}</p> : null}
            </div>

            {allocation && !allocation.over ? (
              <div className="rounded-xl border border-border-subtle bg-mist/40 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted mb-3">Allocation preview</p>
                <div className="flex h-3 w-full overflow-hidden rounded-full bg-mist ring-1 ring-lavender/30">
                  <div
                    className="h-full bg-linear-to-r from-void/70 to-forest transition-all duration-300"
                    style={{ width: `${allocation.spendPct}%` }}
                    title="Spending"
                  />
                  <div
                    className="h-full bg-linear-to-r from-teal to-forest transition-all duration-300"
                    style={{ width: `${allocation.savePct}%` }}
                    title="Savings"
                  />
                  <div
                    className="h-full bg-mist transition-all duration-300"
                    style={{ width: `${allocation.remainderPct}%` }}
                    title="Unallocated"
                  />
                </div>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-secondary">
                  <span>
                    <span className="inline-block h-2 w-2 rounded-full bg-forest align-middle mr-1.5" aria-hidden />
                    Spend {allocation.spendPct.toFixed(0)}%
                  </span>
                  <span>
                    <span className="inline-block h-2 w-2 rounded-full bg-teal align-middle mr-1.5" aria-hidden />
                    Save {allocation.savePct.toFixed(0)}%
                  </span>
                  {allocation.remainderPct > 0.5 ? (
                    <span>
                      <span className="inline-block h-2 w-2 rounded-full bg-lavender align-middle mr-1.5" aria-hidden />
                      Unallocated {allocation.remainderPct.toFixed(0)}%
                    </span>
                  ) : null}
                </div>
              </div>
            ) : null}

            {allocation?.over ? (
              <p className="text-sm text-error rounded-xl border border-error/20 bg-red-50/80 px-4 py-3">
                Spending plus savings exceed income. Lower one of the amounts or raise income.
              </p>
            ) : null}

            <div>
              <label htmlFor="currency" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                className={`${inputBase} border-lavender/70 cursor-pointer`}
              >
                {CURRENCY_OPTIONS.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.country} ({currency.symbol})
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-ink-muted leading-relaxed">
                Pulled from your profile by default. Updating here changes how amounts are labeled; ensure it matches how you think about money.
              </p>
            </div>

            {errors.submit ? (
              <div
                className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-error flex items-start gap-2"
                role="alert"
              >
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.submit}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-linear-to-br from-teal to-forest px-6 py-4 text-base font-semibold text-white shadow-(--shadow-fv-md) transition-all duration-200 hover:from-forest hover:to-void focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" aria-hidden />
                  Saving…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {isEdit ? "Update budget" : "Save budget plan"}
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
