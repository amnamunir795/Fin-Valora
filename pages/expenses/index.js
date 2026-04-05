import React, { useState, useEffect } from "react";
import Link from "next/link";
import { authenticatedFetch, logout } from "../../utils/auth";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function Expenses() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState(MONTHS[new Date().getMonth()]);
  const [showModal, setShowModal] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [form, setForm] = useState({ description: "", amount: "", categoryId: "", date: new Date().toISOString().split("T")[0], notes: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

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
      if (txRes.ok) { const d = await txRes.json(); setTransactions(d.transactions || []); }
      if (catRes.ok) { const d = await catRes.json(); setCategories(d.categories || []); }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTx(null);
    setForm({ description: "", amount: "", categoryId: categories[0]?.id || "", date: new Date().toISOString().split("T")[0], notes: "" });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (tx) => {
    setEditingTx(tx);
    const catId = tx.category?.id || tx.category?._id || "";
    setForm({ description: tx.description, amount: String(tx.amount), categoryId: catId, date: tx.date ? tx.date.split("T")[0] : "", notes: tx.notes || "" });
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditingTx(null); setFormError(""); };

  const handleSave = async () => {
    if (!form.description.trim()) { setFormError("Description is required"); return; }
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0) { setFormError("Valid amount is required"); return; }
    if (!form.categoryId) { setFormError("Category is required"); return; }
    if (!form.date) { setFormError("Date is required"); return; }
    setSaving(true); setFormError("");
    try {
      const body = { description: form.description.trim(), amount: parseFloat(form.amount), categoryId: form.categoryId, type: "Expense", date: form.date, notes: form.notes.trim() };
      const res = editingTx
        ? await authenticatedFetch(`/api/transactions/${editingTx.id}`, { method: "PUT", body: JSON.stringify(body) })
        : await authenticatedFetch("/api/transactions", { method: "POST", body: JSON.stringify(body) });
      const data = await res.json();
      if (res.ok) { await fetchData(); closeModal(); }
      else setFormError(data.message || "Something went wrong");
    } catch { setFormError("Network error"); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this expense record?")) return;
    try {
      const res = await authenticatedFetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) setTransactions(transactions.filter(t => String(t.id) !== String(id)));
    } catch (err) { console.error(err); }
  };

  const filtered = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="min-h-screen bg-mist flex">
      <div className="w-64 bg-surface shadow-xl border-r border-lavender/40 relative min-h-screen">
        <div className="p-6 border-b border-lavender/30 bg-gradient-to-r from-surface to-mist/10">
          <div className="flex items-center group cursor-pointer">
            <div className="relative w-10 h-10 mr-3">
              <div className="absolute inset-0 bg-gradient-to-br from-teal to-forest rounded-full blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-teal via-forest to-void rounded-full shadow-lg group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-110 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </div>
              <svg className="relative w-10 h-10 p-1.5" viewBox="0 0 48 48" fill="none">
                <ellipse cx="16" cy="29" rx="8" ry="3" fill="white"/>
                <rect x="28" y="24" width="3" height="16" rx="1.5" fill="white"/>
                <rect x="33" y="28" width="3" height="12" rx="1.5" fill="white" opacity="0.8"/>
                <rect x="38" y="32" width="3" height="8" rx="1.5" fill="white" opacity="0.7"/>
                <path d="M24 18 L24 8 M24 8 L20 12 M24 8 L28 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-teal"/>
              </svg>
            </div>
            <span className="text-xl font-bold text-void group-hover:text-forest transition-colors duration-300">FinValora</span>
          </div>
        </div>

        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" /></svg>
              Dashboard
            </Link>
            <Link href="/categories" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" /></svg>
              Categories
            </Link>
            <Link href="/income" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
              Income
            </Link>
            <div className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-teal to-forest rounded-lg shadow-md">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
              Expenses
            </div>
            <Link href="/reports" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Reports
            </Link>
            <Link href="/ai-chat" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              AI Chat
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              Settings
            </Link>
          </div>
        </nav>

        <div className="absolute bottom-6 left-6">
          <button type="button" onClick={logout} className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-gradient-to-r from-surface to-mist/20 shadow-lg border-b border-lavender/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-void">Expenses</h1>
            <div className="flex items-center gap-3">
              <label className="text-sm text-forest whitespace-nowrap" htmlFor="expenses-month">Month</label>
              <select
                id="expenses-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200 min-w-[10rem]"
              >
                {MONTHS.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <main className="p-6 space-y-6">
          {transactions.length > 0 && (
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <p className="text-sm font-medium text-forest mb-1">Total Expenses — {selectedMonth}</p>
              <p className="text-3xl font-bold text-void">{totalExpenses.toLocaleString()}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-void">All expenses</h2>
            <button type="button" onClick={openAddModal} className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200">
              Add expense
            </button>
          </div>

          <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
            <label className="block text-sm font-medium text-void mb-2">Search</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by description or category..." className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
          </div>

          <div className="bg-surface rounded-lg border border-lavender/40 shadow-md overflow-hidden">
            <div className="grid grid-cols-5 gap-4 px-6 py-4 bg-gradient-to-r from-mist/20 to-mist/10 border-b border-lavender/40 font-semibold text-void text-sm">
              <div>Description</div>
              <div>Category</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Actions</div>
            </div>

            {loading ? (
              <div className="px-6 py-10 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="px-6 py-10 text-center text-forest">
                There are no records to display
              </div>
            ) : (
              <div className="divide-y divide-lavender/30">
                {filtered.map((tx) => (
                  <div key={tx.id} className="grid grid-cols-5 gap-4 px-6 py-4 hover:bg-mist/10 transition-colors duration-200 items-center">
                    <div className="font-medium text-void truncate">{tx.description}</div>
                    <div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-teal/20 text-forest border border-teal/30">
                        {tx.category?.name || "—"}
                      </span>
                    </div>
                    <div className="font-semibold text-void">{tx.amount?.toLocaleString()}</div>
                    <div className="text-sm text-void/70">{tx.date ? new Date(tx.date).toLocaleDateString() : "—"}</div>
                    <div className="flex items-center space-x-2">
                      <button type="button" onClick={() => openEditModal(tx)} className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded-lg flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm" aria-label="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button type="button" onClick={() => handleDelete(tx.id)} className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded-lg flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm" aria-label="Delete">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-void bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-2xl border border-lavender/40">
            <h3 className="text-lg font-bold text-void mb-4">{editingTx ? "Edit expense" : "Add expense"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-void mb-2">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Groceries" autoFocus className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-void mb-2">Amount</label>
                <input type="number" min="0.01" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-void mb-2">Category</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200">
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-void mb-2">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-void mb-2">Notes (optional)</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any additional notes..." rows={2} className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200 resize-none" />
              </div>
              {formError && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {formError}
                </p>
              )}
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button type="button" onClick={closeModal} className="px-4 py-2 text-void border border-lavender rounded-lg hover:bg-mist/30 transition-all duration-200">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200 disabled:opacity-60">
                {saving ? "Saving..." : editingTx ? "Update" : "Add expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
