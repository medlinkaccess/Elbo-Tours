'use client';
import { useState, useEffect, useRef } from 'react';

const CATEGORIES = [
  'Day Trips',
  'Desert Tours',
  'City Tours',
  'Multi-day Tours',
  'Airport Transfers',
  'Custom/Private Tours',
];

interface Tour {
  id: string;
  title: string;
  titleFr: string;
  category: string;
  duration: string;
  from: string;
  price: string;
  desc: string;
  descFr: string;
  image: string;
  featured: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  title: '', titleFr: '',
  category: CATEGORIES[0],
  duration: '', from: '',
  price: '', desc: '', descFr: '',
  image: '', featured: false,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<any>(EMPTY_FORM);
  const [editId, setEditId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<'tours' | 'add'>('tours');
  const [filterCat, setFilterCat] = useState('All');
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Check auth on load
  useEffect(() => {
    // Try to load tours — if 200, we're authed (cookie-based)
    fetch('/api/tours').then(r => {
      if (r.ok) { setAuthed(true); loadTours(); }
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthError('');
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      loadTours();
    } else {
      setAuthError('Wrong password. Try again.');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setAuthed(false);
    setTours([]);
  }

  async function loadTours() {
    setLoading(true);
    const res = await fetch('/api/tours');
    const data = await res.json();
    setTours(data);
    setLoading(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.url) setForm((f: any) => ({ ...f, image: data.url }));
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { ...form, id: editId } : form;
    await fetch('/api/tours', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    setSaving(false);
    setForm(EMPTY_FORM);
    setEditId(null);
    setShowForm(false);
    setActiveTab('tours');
    setSuccessMsg(editId ? 'Tour updated!' : 'Tour added!');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadTours();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch('/api/tours', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSuccessMsg('Tour deleted.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadTours();
  }

  function startEdit(tour: Tour) {
    setForm({ ...tour });
    setEditId(tour.id);
    setActiveTab('add');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelEdit() {
    setForm(EMPTY_FORM);
    setEditId(null);
    setActiveTab('tours');
  }

  const filtered = filterCat === 'All' ? tours : tours.filter(t => t.category === filterCat);

  // ── LOGIN SCREEN ──
  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#C8960C] rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">🔐</div>
            <h1 className="font-bold text-2xl text-[#1A1A2E]">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Elbo Tours Management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C] focus:ring-2 focus:ring-[#C8960C]/20"
              autoFocus
            />
            {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
            <button type="submit" className="btn-gold w-full justify-center py-3">
              Sign In →
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── ADMIN DASHBOARD ──
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="bg-[#1A1A2E] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C8960C] rounded-lg flex items-center justify-center font-bold text-sm">ET</div>
          <div>
            <div className="font-bold leading-none">Elbo Tours</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" target="_blank" className="text-xs text-gray-400 hover:text-white transition-colors">
            View Site ↗
          </a>
          <button onClick={handleLogout} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Success message */}
        {successMsg && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm font-medium flex items-center gap-2">
            ✅ {successMsg}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Tours', value: tours.length, icon: '🗺️' },
            { label: 'Featured', value: tours.filter(t => t.featured).length, icon: '⭐' },
            { label: 'With Photos', value: tours.filter(t => t.image).length, icon: '📷' },
            { label: 'Categories', value: new Set(tours.map(t => t.category)).size, icon: '🏷️' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className="text-3xl">{s.icon}</div>
              <div>
                <div className="text-2xl font-bold text-[#1A1A2E]">{s.value}</div>
                <div className="text-xs text-gray-400">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => { setActiveTab('tours'); cancelEdit(); }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'tours' ? 'bg-[#1A1A2E] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            📋 All Tours ({tours.length})
          </button>
          <button onClick={() => { setActiveTab('add'); if (!editId) setForm(EMPTY_FORM); }}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${activeTab === 'add' ? 'bg-[#C8960C] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'}`}>
            {editId ? '✏️ Edit Tour' : '➕ Add Tour'}
          </button>
        </div>

        {/* ALL TOURS TAB */}
        {activeTab === 'tours' && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            {/* Filter bar */}
            <div className="p-4 border-b border-gray-100 flex gap-2 overflow-x-auto">
              {['All', ...CATEGORIES].map(cat => (
                <button key={cat} onClick={() => setFilterCat(cat)}
                  className={`flex-shrink-0 text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filterCat === cat ? 'bg-[#C8960C] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="py-20 text-center text-gray-400">Loading tours...</div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-gray-500">No tours yet. Add your first one!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filtered.map(tour => (
                  <div key={tour.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                    {/* Thumbnail */}
                    <div className="w-16 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                      {tour.image ? (
                        <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">🗺️</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-[#1A1A2E] truncate">{tour.title}</span>
                        {tour.featured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">⭐ Featured</span>}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-400">
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{tour.category}</span>
                        <span>⏱ {tour.duration}</span>
                        <span className="font-semibold text-[#C8960C]">{tour.price}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => startEdit(tour)}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(tour.id, tour.title)}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg text-xs font-semibold transition-colors">
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ADD/EDIT TOUR TAB */}
        {activeTab === 'add' && (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
            <h2 className="font-bold text-xl text-[#1A1A2E] mb-6">
              {editId ? '✏️ Edit Tour' : '➕ Add New Tour'}
            </h2>
            <form onSubmit={handleSave} className="space-y-6">

              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tour Photo</label>
                <div className="flex gap-4 items-start">
                  <div className="w-32 h-24 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                    {form.image ? (
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-300 text-3xl">📷</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    <button type="button" onClick={() => fileRef.current?.click()}
                      disabled={uploading}
                      className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium hover:border-[#C8960C] transition-colors disabled:opacity-50">
                      {uploading ? '⏳ Uploading...' : '📤 Upload Photo'}
                    </button>
                    <p className="text-xs text-gray-400 mt-2">JPG, PNG, WebP — max 5MB. If no photo, a gradient placeholder will show.</p>
                    {form.image && (
                      <div className="mt-2 text-xs text-gray-500 break-all">{form.image}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Title EN/FR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title (English) *</label>
                  <input required value={form.title} onChange={e => setForm((f: any) => ({...f, title: e.target.value}))}
                    placeholder="e.g. Sahara Desert Circuit"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Title (French)</label>
                  <input value={form.titleFr} onChange={e => setForm((f: any) => ({...f, titleFr: e.target.value}))}
                    placeholder="e.g. Circuit Désert du Sahara"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C]" />
                </div>
              </div>

              {/* Category, Duration, From, Price */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Category *</label>
                  <select required value={form.category} onChange={e => setForm((f: any) => ({...f, category: e.target.value}))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C] bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Duration *</label>
                  <input required value={form.duration} onChange={e => setForm((f: any) => ({...f, duration: e.target.value}))}
                    placeholder="e.g. 1 day"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Starting From *</label>
                  <input required value={form.from} onChange={e => setForm((f: any) => ({...f, from: e.target.value}))}
                    placeholder="e.g. Marrakech"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C]" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
                  <input required value={form.price} onChange={e => setForm((f: any) => ({...f, price: e.target.value}))}
                    placeholder="e.g. From €65/person"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C]" />
                </div>
              </div>

              {/* Description EN/FR */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (English) *</label>
                  <textarea required rows={4} value={form.desc} onChange={e => setForm((f: any) => ({...f, desc: e.target.value}))}
                    placeholder="Describe the tour in English..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Description (French)</label>
                  <textarea rows={4} value={form.descFr} onChange={e => setForm((f: any) => ({...f, descFr: e.target.value}))}
                    placeholder="Décrivez le tour en français..."
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C8960C] resize-none" />
                </div>
              </div>

              {/* Featured toggle */}
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setForm((f: any) => ({...f, featured: !f.featured}))}
                  className={`w-12 h-6 rounded-full transition-colors ${form.featured ? 'bg-[#C8960C]' : 'bg-gray-200'} relative flex-shrink-0`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.featured ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">⭐ Mark as Featured (shown prominently)</span>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-gold px-8 py-3 disabled:opacity-50">
                  {saving ? '⏳ Saving...' : editId ? '✅ Update Tour' : '➕ Add Tour'}
                </button>
                <button type="button" onClick={cancelEdit}
                  className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
