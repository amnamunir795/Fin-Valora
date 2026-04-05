import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { authenticatedFetch, logout } from '../../utils/auth';

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
        setCategories(categories.filter(c => c.id !== id));
      }
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const filtered = categories.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-mist flex">
      {/* Sidebar */}
      <div className="w-64 bg-surface shadow-xl border-r border-lavender/40 flex flex-col">
        <div className="p-6 border-b border-lavender/30 bg-gradient-to-r from-surface to-mist/10">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-teal via-forest to-void rounded-full flex items-center justify-center mr-3 shadow-lg">
              <span className="text-white font-bold text-sm">FV</span>
            </div>
            <span className="text-xl font-bold text-void">FinValora</span>
          </div>
        </div>

        <nav className="mt-6 flex-1">
          <div className="px-4 space-y-2">
            <Link href="/dashboard" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
              </svg>
              Dashboard
            </Link>
            <div className="flex items-center px-4 py-3 text-white bg-gradient-to-r from-teal to-forest rounded-lg shadow-md">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categories
            </div>
            <Link href="/income" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Income
            </Link>
            <Link href="/expenses" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Expenses
            </Link>
            <Link href="/reports" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Reports
            </Link>
            <Link href="/ai-chat" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              AI Chat
            </Link>
            <Link href="/settings" className="flex items-center px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200">
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-lavender/30">
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-3 text-void hover:bg-mist/30 hover:text-forest rounded-lg transition-all duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-surface to-mist/20 shadow-lg border-b border-lavender/40 px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-void">Categories</h1>
          </div>
        </div>

        <main className="p-6">
          <div className="bg-surface rounded-xl border border-lavender/40 shadow-md p-6">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-void">View All Categories</h2>
              <button
                onClick={openAddModal}
                className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200"
              >
                Add Category
              </button>
            </div>

            {/* Search */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-void mb-2">Search</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search categories..."
                className="w-full px-4 py-2 border border-lavender rounded-lg text-void focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Table */}
            <div className="rounded-lg border border-lavender/40 overflow-hidden">
              <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-mist/20 border-b border-lavender/40 font-semibold text-void text-sm">
                <div>Name</div>
                <div>Type</div>
                <div>Actions</div>
              </div>

              {loading ? (
                <div className="px-6 py-10 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal mx-auto"></div>
                </div>
              ) : filtered.length === 0 ? (
                <div className="px-6 py-10 text-center text-forest">
                  {searchTerm ? 'No categories match your search.' : 'No categories yet. Add one to get started.'}
                </div>
              ) : (
                <div className="divide-y divide-lavender/30">
                  {filtered.map((cat) => (
                    <div key={cat.id} className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-mist/10 transition-colors">
                      <div className="flex items-center font-medium text-void">{cat.name}</div>
                      <div className="flex items-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${cat.type === 'Income' ? 'bg-teal/20 text-forest' : 'bg-void/10 text-void'}`}>
                          {cat.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openEditModal(cat)}
                          className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm"
                          aria-label="Edit category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="w-8 h-8 bg-gradient-to-r from-teal to-forest text-white rounded flex items-center justify-center hover:from-forest hover:to-void transition-all duration-200 shadow-sm"
                          aria-label="Delete category"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-surface rounded-xl p-6 w-full max-w-md shadow-2xl border border-lavender/40">
            <h3 className="text-lg font-bold text-void mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-void mb-2">Category Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  className="w-full px-4 py-2 border border-lavender rounded-lg text-void focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200"
                  placeholder="Enter category name"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-void mb-2">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-4 py-2 border border-lavender rounded-lg text-void focus:ring-2 focus:ring-teal focus:border-transparent transition-all duration-200"
                >
                  <option value="Expense">Expense</option>
                  <option value="Income">Income</option>
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-void border border-lavender rounded-lg hover:bg-mist/30 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 bg-gradient-to-r from-teal to-forest text-white rounded-lg hover:from-forest hover:to-void font-medium shadow-md transition-all duration-200 disabled:opacity-60"
              >
                {saving ? 'Saving...' : editingCategory ? 'Update' : 'Add Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
