import React, { useState, useEffect, useMemo } from "react";
import { authenticatedFetch } from "../../utils/auth";
import AppSidebar from "../../components/AppSidebar";
import { CURRENCY_OPTIONS } from "../../constants/currencies";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function currencySymbolForCode(code) {
  const c = CURRENCY_OPTIONS.find((x) => x.code === code);
  return c?.symbol ?? "$";
}

export default function Expenses() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [form, setForm] = useState({
    description: "",
    amount: "",
    categoryId: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [currencySymbol, setCurrencySymbol] = useState("$");

  useEffect(() => {
    (async () => {
      try {
        const res = await authenticatedFetch("/api/auth/me");
        if (res.ok) {
          const d = await res.json();
          setCurrencySymbol(currencySymbolForCode(d.user?.currency));
        }
      } catch {
        /* keep default */
      }
    })();
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const year = new Date().getFullYear();
      const monthIndex = MONTHS.indexOf(selectedMonth);
      const start = new Date(year, monthIndex, 1).toISOString();
      const end = new Date(year, monthIndex + 1, 0, 23, 59, 59).toISOString();
      const [txRes, catRes] = await Promise.all([
        authenticatedFetch(`/api/transactions?type=Expense&startDate=${start}&endDate=${end}&limit=100`),
        authenticatedFetch("/api/categories?type=Expense"),
      ]);
      if (txRes.ok) {
        const d = await txRes.json();
        setTransactions(d.transactions || []);
      }
      if (catRes.ok) {
        const d = await catRes.json();
        setCategories(d.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTx(null);
    setForm({
      description: "",
      amount: "",
      categoryId: categories[0]?.id || "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    const catId = tx.category?.id || tx.category?._id || "";
    setForm({
      description: tx.description,
      amount: String(tx.amount),
      categoryId: catId,
      date: tx.date ? tx.date.split("T")[0] : "",
      notes: tx.notes || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTx(null);
    setFormError("");
  };

  const handleSave = async () => {
    if (!form.description.trim()) {
      setFormError("Description is required");
      return;
    }
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) {
      setFormError("Valid amount is required");
      return;
    }
    if (!form.categoryId) {
      setFormError("Category is required");
      return;
    }
    if (!form.date) {
      setFormError("Date is required");
      return;
    }
    setSaving(true);
    setFormError("");
    try {
      const body = {
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        categoryId: form.categoryId,
        type: "Expense",
        date: form.date,
        notes: form.notes.trim(),
      };
      const res = editingTx
        ? await authenticatedFetch(`/api/transactions/${editingTx.id}`, { method: "PUT", body: JSON.stringify(body) })
        : await authenticatedFetch("/api/transactions", { method: "POST", body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) {
        await fetchData();
        closeModal();
      } else setFormError(data.message || "Something went wrong");
    } catch {
      setFormError("Network error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const res = await authenticatedFetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) setTransactions(transactions.filter((t) => String(t.id) !== String(id)));
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = useMemo(
    () =>
      transactions.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [transactions, searchTerm],
  );

  const monthTotal = useMemo(() => transactions.reduce((sum, t) => sum + (t.amount || 0), 0), [transactions]);

  const inputClass =
    "w-full rounded-xl border border-lavender px-4 py-3 text-void bg-surface placeholder:text-ink-muted transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25";

  return (
    <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
          <div className="max-w-6xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-1">Cash out</p>
              <h1 className="font-display text-3xl font-semibold text-white tracking-tight">Expenses</h1>
              <p className="text-sm text-white/80 mt-1.5 max-w-xl">
                Track spending by category for each month. Use search to narrow the list without changing the month
                total.
              </p>
            </div>
            <div className="flex flex-col gap-1.5 shrink-0">
              <label className="text-[11px] font-semibold uppercase tracking-wide text-white/70" htmlFor="expenses-month">
                Month
              </label>
              <select
                id="expenses-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="min-w-44 rounded-xl border border-white/25 bg-white/95 px-4 py-2.5 text-sm font-medium text-forest shadow-(--shadow-fv-xs) transition-colors hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/30"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-6xl w-full mx-auto space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-md) ring-1 ring-forest/4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Total expenses</p>
              <p className="text-xs text-ink-secondary mt-0.5 mb-3">{selectedMonth}</p>
              <p className="font-display text-3xl sm:text-4xl font-semibold text-void tabular-nums">
                {currencySymbol}
                {monthTotal.toLocaleString()}
              </p>
              {searchTerm ? (
                <p className="text-xs text-ink-muted mt-2">
                  Table filtered — subtotal {currencySymbol}
                  {filtered.reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()} ({filtered.length}{" "}
                  {filtered.length === 1 ? "entry" : "entries"})
                </p>
              ) : null}
            </div>
            <div className="rounded-2xl border border-lavender/35 bg-surface p-6 shadow-(--shadow-fv-sm) ring-1 ring-forest/4 flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Entries</p>
              <p className="font-display text-2xl font-semibold text-void tabular-nums mt-2">{transactions.length}</p>
              <p className="text-xs text-ink-secondary mt-1">In {selectedMonth}</p>
            </div>
          </section>

          <section className="rounded-2xl border border-lavender/35 bg-surface shadow-(--shadow-fv-lg) ring-1 ring-forest/4 overflow-hidden">
            <div className="px-5 sm:px-7 pt-6 pb-5 border-b border-border-subtle bg-linear-to-b from-mist/30 to-transparent">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">Ledger</p>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-void mt-0.5">Expense records</h2>
                  <p className="text-sm text-ink-secondary mt-1">
                    {filtered.length === transactions.length
                      ? `${transactions.length} ${transactions.length === 1 ? "record" : "records"}`
                      : `${filtered.length} shown · ${transactions.length} in month`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl bg-linear-to-br from-teal to-forest px-5 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) transition-all hover:from-forest hover:to-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add expense
                </button>
              </div>

              <div className="mt-5">
                <label htmlFor="expense-search" className="sr-only">
                  Search expenses
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" aria-hidden>
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </span>
                  <input
                    id="expense-search"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search description or category…"
                    className="w-full rounded-xl border border-lavender/60 bg-surface py-3 pl-12 pr-4 text-void placeholder:text-ink-muted shadow-(--shadow-fv-xs) transition-all hover:border-teal/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
                  />
                </div>
              </div>
            </div>

            <div>
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <div className="h-10 w-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin" aria-hidden />
                  <p className="text-sm text-ink-secondary">Loading expenses…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-mist text-forest ring-1 ring-lavender/40">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-void">No expenses to show</p>
                  <p className="text-sm text-ink-secondary mt-1 max-w-sm mx-auto">
                    {searchTerm ? "Try a different search." : `Add expenses for ${selectedMonth} to see them here.`}
                  </p>
                  {!searchTerm ? (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl border border-lavender px-4 py-2.5 text-sm font-semibold text-forest hover:bg-teal-soft/60 transition-colors"
                    >
                      Add first expense
                    </button>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_auto] gap-4 px-6 py-3.5 bg-mist/60 border-b border-border-subtle text-left items-center">
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Description</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Category</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Amount</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Date</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest text-right pr-1">Actions</span>
                  </div>
                  <ul className="divide-y divide-border-subtle">
                    {filtered.map((tx) => (
                      <li key={tx.id}>
                        <div className="lg:hidden px-5 py-4 space-y-3 hover:bg-mist/40 transition-colors">
                          <div className="flex justify-between gap-3 items-start">
                            <span className="font-semibold text-void leading-snug min-w-0">{tx.description}</span>
                            <span className="shrink-0 font-display text-lg font-semibold text-void tabular-nums">
                              {currencySymbol}
                              {tx.amount?.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-sm text-ink-secondary">
                            <span className="inline-flex rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-void ring-1 ring-lavender/40">
                              {tx.category?.name || "—"}
                            </span>
                            <span>{tx.date ? new Date(tx.date).toLocaleDateString() : "—"}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(tx)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-lavender py-2.5 text-sm font-semibold text-forest hover:border-teal hover:bg-teal-soft/50 transition-all"
                              aria-label={`Edit ${tx.description}`}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tx.id)}
                              className="inline-flex items-center justify-center rounded-xl border border-error/25 bg-red-50/80 px-3 py-2.5 text-error hover:bg-red-100 transition-colors"
                              aria-label={`Delete ${tx.description}`}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>

                        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1.4fr)_minmax(0,0.9fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_auto] gap-4 px-6 py-4 items-center hover:bg-mist/30 transition-colors group">
                          <span className="font-medium text-void truncate min-w-0">{tx.description}</span>
                          <span>
                            <span className="inline-flex rounded-full bg-mist px-2.5 py-1 text-xs font-semibold text-void ring-1 ring-lavender/40">
                              {tx.category?.name || "—"}
                            </span>
                          </span>
                          <span className="font-display font-semibold text-void tabular-nums">
                            {currencySymbol}
                            {tx.amount?.toLocaleString()}
                          </span>
                          <span className="text-sm text-ink-secondary tabular-nums">
                            {tx.date ? new Date(tx.date).toLocaleDateString() : "—"}
                          </span>
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(tx)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal to-forest text-white shadow-(--shadow-fv-xs) transition-all hover:from-forest hover:to-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                              aria-label={`Edit ${tx.description}`}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(tx.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-error/30 text-error bg-red-50/50 hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:ring-offset-2"
                              aria-label={`Delete ${tx.description}`}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </section>
        </main>
      </div>

      {showModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/45 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="expense-modal-title"
        >
          <div className="w-full max-w-md max-h-[min(90vh,640px)] overflow-y-auto rounded-2xl border border-lavender/40 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-xl) ring-1 ring-forest/8">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">{editingTx ? "Edit" : "New"}</p>
            <h3 id="expense-modal-title" className="font-display text-xl font-semibold text-void mt-1 mb-6">
              {editingTx ? "Edit expense" : "Add expense"}
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="exp-desc" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Description
                </label>
                <input
                  id="exp-desc"
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="e.g. Groceries"
                  autoFocus
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="exp-amt" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Amount
                </label>
                <input
                  id="exp-amt"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="exp-cat" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Category
                </label>
                <select
                  id="exp-cat"
                  value={form.categoryId}
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="exp-date" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Date
                </label>
                <input
                  id="exp-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="exp-notes" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Notes (optional)
                </label>
                <textarea
                  id="exp-notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional notes…"
                  rows={2}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {formError ? (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-error flex items-start gap-2" role="alert">
                  <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {formError}
                </p>
              ) : null}
            </div>
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto rounded-xl border border-lavender px-5 py-3 text-sm font-semibold text-void hover:bg-mist/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto rounded-xl bg-linear-to-br from-teal to-forest px-5 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) hover:from-forest hover:to-void disabled:opacity-55 transition-all"
              >
                {saving ? "Saving…" : editingTx ? "Save changes" : "Add expense"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
