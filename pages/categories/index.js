import React, { useState, useEffect } from 'react';
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
      <AppSidebar />

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
