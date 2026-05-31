import Head from 'next/head';
import React, { useState, useEffect, useMemo } from 'react';
import { authenticatedFetch } from '../../utils/auth';
import AppSidebar from '../../components/AppSidebar';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'Expense' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await authenticatedFetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setForm({ name: '', type: 'Expense' });
    setError('');
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, type: cat.type });
    setError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      let res;
      if (editingCategory) {
        res = await authenticatedFetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify({ name: form.name.trim(), type: form.type }),
        });
      } else {
        res = await authenticatedFetch('/api/categories', {
          method: 'POST',
          body: JSON.stringify({ name: form.name.trim(), type: form.type }),
        });
      }
      const data = await res.json();
      if (res.ok) {
        await fetchCategories();
        closeModal();
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    try {
      const res = await authenticatedFetch(`/api/categories/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories(categories.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filtered = useMemo(
    () => categories.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [categories, searchTerm],
  );

  const expenseTotal = useMemo(() => categories.filter((c) => c.type === 'Expense').length, [categories]);
  const incomeTotal = useMemo(() => categories.filter((c) => c.type === 'Income').length, [categories]);

  const typeBadgeClass = (type) =>
    type === 'Income'
      ? 'bg-teal-soft text-forest ring-1 ring-teal/25'
      : 'bg-mist text-void ring-1 ring-lavender/40';

  return (
    <><Head><title>Categories — FinValora</title></Head>
    <div className="min-h-screen bg-linear-to-br from-mist via-surface to-teal-soft/35 flex">
      <AppSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="fv-app-page-header px-5 sm:px-8 py-5 shrink-0">
          <div className="max-w-5xl mx-auto">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal/90 mb-1">Organize</p>
            <h1 className="font-display text-3xl font-semibold text-white tracking-tight">Categories</h1>
            <p className="text-sm text-white/80 mt-1.5 max-w-2xl leading-relaxed">
              Income and expense labels used across transactions, budget, and reports. Keep names clear and
              consistent.
            </p>
          </div>
        </header>

        <main className="flex-1 p-5 sm:p-8 max-w-5xl w-full mx-auto space-y-6">
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-lavender/35 bg-surface px-5 py-4 shadow-(--shadow-fv-sm) ring-1 ring-forest/4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Total</p>
              <p className="font-display text-2xl font-semibold text-void tabular-nums mt-1">{categories.length}</p>
              <p className="text-xs text-ink-secondary mt-1">All categories</p>
            </div>
            <div className="rounded-2xl border border-lavender/35 bg-surface px-5 py-4 shadow-(--shadow-fv-sm) ring-1 ring-forest/4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Expense</p>
              <p className="font-display text-2xl font-semibold text-teal tabular-nums mt-1">{expenseTotal}</p>
              <p className="text-xs text-ink-secondary mt-1">Spending labels</p>
            </div>
            <div className="rounded-2xl border border-lavender/35 bg-surface px-5 py-4 shadow-(--shadow-fv-sm) ring-1 ring-forest/4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">Income</p>
              <p className="font-display text-2xl font-semibold text-forest tabular-nums mt-1">{incomeTotal}</p>
              <p className="text-xs text-ink-secondary mt-1">Earnings labels</p>
            </div>
          </section>

          <section className="rounded-2xl border border-lavender/35 bg-surface shadow-(--shadow-fv-lg) ring-1 ring-forest/4 overflow-hidden">
            <div className="px-5 sm:px-7 pt-6 sm:pt-7 pb-5 border-b border-border-subtle bg-linear-to-b from-mist/30 to-transparent">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">Library</p>
                  <h2 className="font-display text-xl sm:text-2xl font-semibold text-void mt-0.5">Your categories</h2>
                  <p className="text-sm text-ink-secondary mt-1">
                    {filtered.length === categories.length
                      ? `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`
                      : `${filtered.length} shown · ${categories.length} total`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openAddModal}
                  className="inline-flex items-center justify-center gap-2 shrink-0 rounded-xl bg-linear-to-br from-teal to-forest px-5 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) transition-all duration-200 hover:from-forest hover:to-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add category
                </button>
              </div>

              <div className="mt-5">
                <label htmlFor="category-search" className="sr-only">
                  Search categories
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
                    id="category-search"
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search by name…"
                    className="w-full rounded-xl border border-lavender/60 bg-surface py-3 pl-12 pr-4 text-void placeholder:text-ink-muted shadow-(--shadow-fv-xs) transition-all duration-200 hover:border-teal/40 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
                  />
                </div>
              </div>
            </div>

            <div className="px-0">
              {loading ? (
                <div className="flex flex-col items-center justify-center gap-3 px-6 py-16">
                  <div
                    className="h-10 w-10 rounded-full border-2 border-teal/30 border-t-teal animate-spin"
                    aria-hidden
                  />
                  <p className="text-sm text-ink-secondary">Loading categories…</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-16 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-soft/80 text-forest ring-1 ring-teal/20">
                    <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium text-void">
                    {searchTerm ? 'No matching categories' : 'No categories yet'}
                  </p>
                  <p className="mt-1 text-sm text-ink-secondary max-w-sm mx-auto">
                    {searchTerm
                      ? 'Try a different search term.'
                      : 'Create your first category to tag income and expenses consistently.'}
                  </p>
                  {!searchTerm ? (
                    <button
                      type="button"
                      onClick={openAddModal}
                      className="mt-6 inline-flex items-center gap-2 rounded-xl border border-lavender px-4 py-2.5 text-sm font-semibold text-forest hover:bg-teal-soft/60 transition-colors"
                    >
                      Add your first category
                    </button>
                  ) : null}
                </div>
              ) : (
                <>
                  <div className="hidden sm:grid grid-cols-[1fr_minmax(0,8rem)_auto] gap-4 px-6 py-3.5 bg-teal-soft/40 border-b border-border-subtle text-left">
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Name</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">Type</span>
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest text-right pr-1">
                      Actions
                    </span>
                  </div>
                  <ul className="divide-y divide-border-subtle">
                    {filtered.map((cat) => (
                      <li key={cat.id}>
                        <div className="sm:hidden px-5 py-4 space-y-3 hover:bg-mist/40 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-semibold text-void leading-snug">{cat.name}</span>
                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeClass(cat.type)}`}
                            >
                              {cat.type}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-lavender bg-surface py-2.5 text-sm font-semibold text-forest hover:border-teal hover:bg-teal-soft/50 transition-all"
                              aria-label={`Edit ${cat.name}`}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(cat.id)}
                              className="inline-flex items-center justify-center rounded-xl border border-error/25 bg-red-50/80 px-3 py-2.5 text-error hover:bg-red-100 transition-colors"
                              aria-label={`Delete ${cat.name}`}
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

                        <div className="hidden sm:grid sm:grid-cols-[1fr_minmax(0,8rem)_auto] sm:gap-4 sm:items-center sm:px-6 sm:py-4 hover:bg-mist/30 transition-colors group">
                          <span className="font-medium text-void min-w-0 truncate">{cat.name}</span>
                          <span>
                            <span
                              className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${typeBadgeClass(cat.type)}`}
                            >
                              {cat.type}
                            </span>
                          </span>
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(cat)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-teal to-forest text-white shadow-(--shadow-fv-xs) transition-all duration-200 hover:from-forest hover:to-void focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 opacity-90 group-hover:opacity-100"
                              aria-label={`Edit ${cat.name}`}
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
                              onClick={() => handleDelete(cat.id)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-error/30 text-error bg-red-50/50 hover:bg-red-100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error/40 focus-visible:ring-offset-2"
                              aria-label={`Delete ${cat.name}`}
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
          aria-labelledby="category-modal-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-lavender/40 bg-surface p-6 sm:p-7 shadow-(--shadow-fv-xl) ring-1 ring-forest/8">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-teal">
              {editingCategory ? 'Edit' : 'New'}
            </p>
            <h3 id="category-modal-title" className="font-display text-xl font-semibold text-void mt-1 mb-6">
              {editingCategory ? 'Edit category' : 'Add category'}
            </h3>

            <div className="space-y-5">
              <div>
                <label htmlFor="category-name" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Name
                </label>
                <input
                  id="category-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full rounded-xl border border-lavender px-4 py-3 text-void placeholder:text-ink-muted transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
                  placeholder="e.g. Groceries, Salary"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="category-type" className="block text-xs font-semibold uppercase tracking-wide text-ink-secondary mb-2">
                  Type
                </label>
                <select
                  id="category-type"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full rounded-xl border border-lavender px-4 py-3 text-void bg-surface transition-all hover:border-teal/50 focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/25"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              {error ? (
                <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-error" role="alert">
                  {error}
                </p>
              ) : null}
            </div>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto rounded-xl border border-lavender px-5 py-3 text-sm font-semibold text-void hover:bg-mist/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal/30"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-full sm:w-auto rounded-xl bg-linear-to-br from-teal to-forest px-5 py-3 text-sm font-semibold text-white shadow-(--shadow-fv-sm) transition-all hover:from-forest hover:to-void disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2"
              >
                {saving ? 'Saving…' : editingCategory ? 'Save changes' : 'Add category'}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
    </>
  );
}
