import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import AppSidebar from "../../components/AppSidebar";
import FinValoraLogo from "../../components/FinValoraLogo";
import { CURRENCY_OPTIONS } from "../../constants/currencies";
import { authenticatedFetch } from "../../utils/auth";

const inputBase =
  "w-full rounded-xl border px-4 py-3 text-void bg-surface transition-all duration-200 placeholder:text-ink-muted " +
  "hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25 border-lavender/70";

const labelBase =
  "block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2";

const cardBase =
  "rounded-2xl border border-lavender/35 bg-surface/95 backdrop-blur-md p-6 sm:p-8 shadow-(--shadow-fv-md) ring-1 ring-forest/4";

const btnPrimary =
  "rounded-xl bg-linear-to-br from-teal to-forest px-6 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) transition-all duration-200 hover:from-forest hover:to-void focus:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

function Banner({ kind, children }) {
  if (!children) return null;
  const ok = kind === "success";
  return (
    <div
      className={`mb-5 rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
        ok
          ? "border-teal/35 bg-teal-soft/70 text-void"
          : "border-red-100 bg-red-50 text-error"
      }`}
      role={ok ? "status" : "alert"}
    >
      <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
        {ok ? (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        )}
      </svg>
      <span>{children}</span>
    </div>
  );
}

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile
  const [profile, setProfile] = useState({ firstName: "", lastName: "", currency: "USD" });
  const [profileMsg, setProfileMsg] = useState({ ok: "", err: "" });
  const [profileSaving, setProfileSaving] = useState(false);

  // Password
  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState({ ok: "", err: "" });
  const [pwSaving, setPwSaving] = useState(false);

  // Budget
  const [budget, setBudget] = useState({ monthlyIncome: "", spendingLimit: "", savingGoal: "" });
  const [hasBudget, setHasBudget] = useState(false);
  const [budgetMsg, setBudgetMsg] = useState({ ok: "", err: "" });
  const [budgetSaving, setBudgetSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setUser(data.user);
        setProfile({
          firstName: data.user.firstName || "",
          lastName: data.user.lastName || "",
          currency: data.user.currency || "USD",
        });

        const bRes = await fetch("/api/budget/current");
        if (bRes.ok) {
          const bData = await bRes.json();
          const b = bData.budget;
          setHasBudget(true);
          setBudget({
            monthlyIncome: b.totalIncome?.toString() || "",
            spendingLimit: b.spendingLimit?.toString() || "",
            savingGoal: b.savingGoal?.toString() || "",
          });
        }
      } catch (e) {
        console.error("Settings load error:", e);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router]);

  const getCurrencySymbol = (code) => {
    const c = CURRENCY_OPTIONS.find((x) => x.code === code);
    return c ? c.symbol : "$";
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ ok: "", err: "" });
    if (!profile.firstName.trim() || !profile.lastName.trim()) {
      setProfileMsg({ ok: "", err: "First and last name are required." });
      return;
    }
    setProfileSaving(true);
    try {
      const res = await authenticatedFetch("/api/auth/profile", {
        method: "PUT",
        body: JSON.stringify(profile),
      });
      const result = await res.json();
      if (res.ok) {
        setUser(result.user);
        setProfileMsg({ ok: "Profile updated.", err: "" });
      } else {
        setProfileMsg({ ok: "", err: result.message || "Failed to update profile." });
      }
    } catch {
      setProfileMsg({ ok: "", err: "Network error. Please try again." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwMsg({ ok: "", err: "" });
    if (pw.newPassword !== pw.confirmPassword) {
      setPwMsg({ ok: "", err: "New passwords do not match." });
      return;
    }
    if (pw.newPassword.length < 6) {
      setPwMsg({ ok: "", err: "New password must be at least 6 characters." });
      return;
    }
    setPwSaving(true);
    try {
      const res = await authenticatedFetch("/api/auth/password", {
        method: "PUT",
        body: JSON.stringify(pw),
      });
      const result = await res.json();
      if (res.ok) {
        setPwMsg({ ok: "Password updated.", err: "" });
        setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setPwMsg({ ok: "", err: result.message || "Failed to update password." });
      }
    } catch {
      setPwMsg({ ok: "", err: "Network error. Please try again." });
    } finally {
      setPwSaving(false);
    }
  };

  const handleBudgetSubmit = async (e) => {
    e.preventDefault();
    setBudgetMsg({ ok: "", err: "" });

    const income = parseFloat(budget.monthlyIncome) || 0;
    const spending = parseFloat(budget.spendingLimit) || 0;
    const saving = parseFloat(budget.savingGoal) || 0;

    if (income <= 0) {
      setBudgetMsg({ ok: "", err: "Enter a valid monthly income." });
      return;
    }
    if (spending <= 0) {
      setBudgetMsg({ ok: "", err: "Enter a valid spending limit." });
      return;
    }
    if (saving < 0) {
      setBudgetMsg({ ok: "", err: "Enter a valid saving goal." });
      return;
    }
    if (spending + saving > income) {
      setBudgetMsg({ ok: "", err: "Spending limit and saving goal together cannot exceed monthly income." });
      return;
    }

    // Preserve current budget period — first day of current month
    const now = new Date();
    const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    setBudgetSaving(true);
    try {
      const res = await authenticatedFetch("/api/budget/setup", {
        method: "POST",
        body: JSON.stringify({
          monthlyIncome: income,
          startDate,
          spendingLimit: spending,
          savingGoal: saving,
          currency: profile.currency,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        setHasBudget(true);
        setBudgetMsg({ ok: "Budget saved.", err: "" });
      } else {
        setBudgetMsg({ ok: "", err: result.message || "Failed to save budget." });
      }
    } catch {
      setBudgetMsg({ ok: "", err: "Network error. Please try again." });
    } finally {
      setBudgetSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-mist flex flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 rounded-full border-2 border-teal/30 border-t-teal animate-spin" aria-hidden />
        <p className="text-sm text-ink-secondary">Loading settings…</p>
      </div>
    );
  }

  const sym = getCurrencySymbol(profile.currency);

  return (
    <div className="flex min-h-screen bg-mist">
      <AppSidebar />

      <main className="flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-3xl px-4 sm:px-8 py-8 sm:py-12">
          <header className="mb-8 flex items-center gap-4">
            <FinValoraLogo size={44} className="drop-shadow-sm" />
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal">Account</p>
              <h1 className="font-display text-2xl sm:text-3xl font-semibold text-void tracking-tight">Settings</h1>
              <p className="text-sm text-ink-secondary mt-1">
                Signed in as <span className="font-semibold text-void">{user?.email}</span>
              </p>
            </div>
          </header>

          <div className="space-y-7">
            {/* Profile */}
            <section className={cardBase}>
              <h2 className="text-lg font-semibold text-void mb-1">Profile</h2>
              <p className="text-sm text-ink-secondary mb-5">Update your name and default currency.</p>
              <Banner kind="success">{profileMsg.ok}</Banner>
              <Banner kind="error">{profileMsg.err}</Banner>

              <form onSubmit={handleProfileSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className={labelBase}>First name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                      maxLength={50}
                      className={inputBase}
                      placeholder="Jane"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className={labelBase}>Last name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                      maxLength={50}
                      className={inputBase}
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className={labelBase}>Email</label>
                  <input
                    id="email"
                    type="email"
                    value={user?.email || ""}
                    disabled
                    className={`${inputBase} cursor-not-allowed opacity-60`}
                  />
                  <p className="mt-1.5 text-xs text-ink-muted">Email cannot be changed.</p>
                </div>

                <div>
                  <label htmlFor="currency" className={labelBase}>Currency</label>
                  <select
                    id="currency"
                    value={profile.currency}
                    onChange={(e) => setProfile((p) => ({ ...p, currency: e.target.value }))}
                    className={`${inputBase} cursor-pointer`}
                  >
                    {CURRENCY_OPTIONS.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.country} ({c.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end">
                  <button type="submit" disabled={profileSaving} className={btnPrimary}>
                    {profileSaving ? "Saving…" : "Save profile"}
                  </button>
                </div>
              </form>
            </section>

            {/* Password */}
            <section className={cardBase}>
              <h2 className="text-lg font-semibold text-void mb-1">Password</h2>
              <p className="text-sm text-ink-secondary mb-5">Change your account password.</p>
              <Banner kind="success">{pwMsg.ok}</Banner>
              <Banner kind="error">{pwMsg.err}</Banner>

              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label htmlFor="currentPassword" className={labelBase}>Current password</label>
                  <input
                    id="currentPassword"
                    type="password"
                    autoComplete="current-password"
                    value={pw.currentPassword}
                    onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))}
                    className={inputBase}
                    placeholder="••••••••"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="newPassword" className={labelBase}>New password</label>
                    <input
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                      value={pw.newPassword}
                      onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))}
                      className={inputBase}
                      placeholder="At least 6 characters"
                    />
                  </div>
                  <div>
                    <label htmlFor="confirmPassword" className={labelBase}>Confirm new password</label>
                    <input
                      id="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      value={pw.confirmPassword}
                      onChange={(e) => setPw((p) => ({ ...p, confirmPassword: e.target.value }))}
                      className={inputBase}
                      placeholder="Re-enter new password"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={pwSaving} className={btnPrimary}>
                    {pwSaving ? "Updating…" : "Update password"}
                  </button>
                </div>
              </form>
            </section>

            {/* Budget */}
            <section className={cardBase}>
              <h2 className="text-lg font-semibold text-void mb-1">Budget</h2>
              <p className="text-sm text-ink-secondary mb-5">
                {hasBudget
                  ? "Edit your current monthly budget."
                  : "No active budget yet — set one up below."}
              </p>
              <Banner kind="success">{budgetMsg.ok}</Banner>
              <Banner kind="error">{budgetMsg.err}</Banner>

              <form onSubmit={handleBudgetSubmit} className="space-y-5">
                <div>
                  <label htmlFor="monthlyIncome" className={labelBase}>Monthly income</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">{sym}</span>
                    <input
                      id="monthlyIncome"
                      type="number"
                      step="0.01"
                      min="0"
                      value={budget.monthlyIncome}
                      onChange={(e) => setBudget((b) => ({ ...b, monthlyIncome: e.target.value }))}
                      className={`${inputBase} pl-10`}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="spendingLimit" className={labelBase}>Spending limit</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">{sym}</span>
                      <input
                        id="spendingLimit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={budget.spendingLimit}
                        onChange={(e) => setBudget((b) => ({ ...b, spendingLimit: e.target.value }))}
                        className={`${inputBase} pl-10`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="savingGoal" className={labelBase}>Saving goal</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted font-semibold tabular-nums pointer-events-none">{sym}</span>
                      <input
                        id="savingGoal"
                        type="number"
                        step="0.01"
                        min="0"
                        value={budget.savingGoal}
                        onChange={(e) => setBudget((b) => ({ ...b, savingGoal: e.target.value }))}
                        className={`${inputBase} pl-10`}
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={budgetSaving} className={btnPrimary}>
                    {budgetSaving ? "Saving…" : hasBudget ? "Update budget" : "Save budget"}
                  </button>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
