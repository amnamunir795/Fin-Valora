import React, { useState, useEffect } from "react";
import { authenticatedFetch } from "../../utils/auth";
import AppSidebar from "../../components/AppSidebar";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export default function Income() {
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
        authenticatedFetch(`/api/transactions?type=Income&startDate=${start}&endDate=${end}&limit=100`),
        authenticatedFetch("/api/categories?type=Income"),
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
    setForm({ description: tx.description, amount: String(tx.amount), categoryId: tx.category?.id || "", date: tx.date ? tx.date.split("T")[0] : "", notes: tx.notes || "" });
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
      const body = { description: form.description.trim(), amount: parseFloat(form.amount), categoryId: form.categoryId, type: "Income", date: form.date, notes: form.notes.trim() };
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
    if (!confirm("Delete this income record?")) return;
    try {
      const res = await authenticatedFetch(`/api/transactions/${id}`, { method: "DELETE" });
      if (res.ok) setTransactions(transactions.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  };

  const filtered = transactions.filter(t =>
    t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <div className="min-h-screen bg-mist flex">
      <AppSidebar />

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface to-mist/20 shadow-lg border-b border-lavender/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-void">Incomes</h1>
            <div className="flex items-center gap-3">
              <label className="text-sm text-forest whitespace-nowrap" htmlFor="income-month">Month</label>
              <select
                id="income-month"
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
          {/* Total card */}
          {transactions.length > 0 && (
            <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
              <p className="text-sm font-medium text-forest mb-1">Total Income — {selectedMonth}</p>
              <p className="text-3xl font-bold text-teal">Rs. {totalIncome.toLocaleString()}</p>
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-void">View All Incomes</h2>
            <button onClick={openAddModal} className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200">
              Add Income
            </button>
          </div>

          {/* Search */}
          <div className="bg-surface rounded-lg border border-lavender/40 p-6 shadow-md">
            <label className="block text-sm font-medium text-void mb-2">Search</label>
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by description or category..." className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
          </div>

          {/* Table */}
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
                    <div className="font-semibold text-teal">Rs. {tx.amount?.toLocaleString()}</div>
                    <div className="text-sm text-void/70">{tx.date ? new Date(tx.date).toLocaleDateString() : "—"}</div>
                    <div className="flex items-center space-x-2">
                      <button onClick={() => openEditModal(tx)} className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded-lg flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm" aria-label="Edit">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => handleDelete(tx.id)} className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded-lg flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm" aria-label="Delete">
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-void bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-2xl border border-lavender/40">
            <h3 className="text-lg font-bold text-void mb-4">{editingTx ? "Edit Income" : "Add Income"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-void mb-2">Description</label>
                <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="e.g. Monthly salary" autoFocus className="w-full px-4 py-2 border border-lavender rounded-lg text-void bg-surface hover:border-teal focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200" />
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
              <button onClick={closeModal} className="px-4 py-2 text-void border border-lavender rounded-lg hover:bg-mist/30 transition-all duration-200">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200 disabled:opacity-60">
                {saving ? "Saving..." : editingTx ? "Update" : "Add Income"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
