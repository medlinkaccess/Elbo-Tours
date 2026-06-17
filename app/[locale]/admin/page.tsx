'use client';
import { useState, useEffect, useRef } from 'react';

const TOUR_CATEGORIES = ['Day Trips', 'Desert Tours', 'City Tours', 'Multi-day Tours', 'Custom/Private Tours'];
const BLOG_CATEGORIES = ['Travel Tips', 'Guides', 'Culture', 'News'];

const EMPTY_TOUR_FORM = { title: '', titleFr: '', category: TOUR_CATEGORIES[0], duration: '', from: '', price: '', desc: '', descFr: '', image: '', featured: false };
const EMPTY_TRANSFER_FORM = { title: '', titleFr: '', from_location: '', duration: '', price: '', desc: '', descFr: '', image: '' };
const EMPTY_FLEET_FORM = { name: '', nameFr: '', passengers: 4, bags: 3, price: '', desc: '', descFr: '', image: '' };
const EMPTY_BLOG_FORM = { title: '', titleFr: '', category: BLOG_CATEGORIES[0], excerpt: '', excerptFr: '', content: '', contentFr: '', image: '' };

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Section States
  const [activeSection, setActiveSection] = useState<'tours' | 'transfers' | 'fleet' | 'blog'>('tours');
  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [editId, setEditId] = useState<string | null>(null);

  // Data lists
  const [tours, setTours] = useState<any[]>([]);
  const [transfers, setTransfers] = useState<any[]>([]);
  const [fleet, setFleet] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);

  // Adaptive Form State
  const [form, setForm] = useState<any>(EMPTY_TOUR_FORM);

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    setLoading(true);
    try {
      const [tRes, trRes, fRes, bRes] = await Promise.all([
        fetch('/api/tours'),
        fetch('/api/transfers'),
        fetch('/api/fleet'),
        fetch('/api/blog')
      ]);
      setTours(await tRes.json());
      setTransfers(await trRes.json());
      setFleet(await fRes.json());
      setBlogs(await bRes.json());
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

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
      loadAllData();
    } else {
      setAuthError('Wrong password.');
    }
  }

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    setAuthed(false);
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
    
    const res = await fetch(`/api/${activeSection}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.status === 401) {
      setAuthed(false);
      setSaving(false);
      return;
    }

    setSaving(false);
    resetForm();
    setActiveTab('list');
    setSuccessMsg('Saved successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadAllData();
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    const res = await fetch(`/api/${activeSection}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.status === 401) {
      setAuthed(false);
      return;
    }

    setSuccessMsg('Deleted successfully.');
    setTimeout(() => setSuccessMsg(''), 3000);
    loadAllData();
  }

  function startEdit(item: any) {
    setForm({ ...item });
    setEditId(item.id);
    setActiveTab('add');
  }

  function resetForm() {
    setEditId(null);
    if (activeSection === 'tours') setForm(EMPTY_TOUR_FORM);
    if (activeSection === 'transfers') setForm(EMPTY_TRANSFER_FORM);
    if (activeSection === 'fleet') setForm(EMPTY_FLEET_FORM);
    if (activeSection === 'blog') setForm(EMPTY_BLOG_FORM);
  }

  function switchSection(section: 'tours' | 'transfers' | 'fleet' | 'blog') {
    setActiveSection(section);
    setEditId(null);
    setActiveTab('list');
    if (section === 'tours') setForm(EMPTY_TOUR_FORM);
    if (section === 'transfers') setForm(EMPTY_TRANSFER_FORM);
    if (section === 'fleet') setForm(EMPTY_FLEET_FORM);
    if (section === 'blog') setForm(EMPTY_BLOG_FORM);
  }

  const rawList = 
    activeSection === 'tours' ? tours :
    activeSection === 'transfers' ? transfers :
    activeSection === 'fleet' ? fleet : blogs;

  const currentList = Array.isArray(rawList) ? rawList : [];

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#1A1A2E] flex items-center justify-center px-4">
        <form onSubmit={handleLogin} className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm space-y-4">
          <h1 className="text-center font-bold text-2xl text-[#1A1A2E]">Admin Portal</h1>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none" autoFocus />
          {authError && <p className="text-red-500 text-sm text-center">{authError}</p>}
          <button type="submit" className="w-full bg-[#C8960C] text-white rounded-xl py-3 font-semibold">Sign In</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar navigation */}
      <aside className="w-full lg:w-64 bg-[#1A1A2E] text-white flex-shrink-0 flex flex-col border-r border-gray-800">
        <div className="p-6 border-b border-gray-800">
          <h2 className="font-bold text-lg text-white">Elbo Tours</h2>
          <p className="text-xs text-gray-400">Control Panel</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: 'tours', label: 'Tours List', icon: '🗺️' },
            { id: 'transfers', label: 'Transfers', icon: '🚐' },
            { id: 'fleet', label: 'Fleet vehicles', icon: '🚗' },
            { id: 'blog', label: 'Blog Posts', icon: '✍️' }
          ].map(s => (
            <button key={s.id} onClick={() => switchSection(s.id as any)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? 'bg-[#C8960C] text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
              <span>{s.icon}</span>{s.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="flex-1">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <h1 className="font-bold text-xl text-[#1A1A2E] capitalize">{activeSection}</h1>
          <button onClick={handleLogout} className="text-xs bg-red-50 text-red-600 px-3 py-1.5 rounded-lg">Logout</button>
        </header>

        <div className="max-w-5xl mx-auto px-4 py-8">
          {successMsg && <div className="mb-6 bg-green-50 border text-green-700 rounded-xl px-4 py-3 text-sm font-medium">✅ {successMsg}</div>}

          <div className="flex gap-2 mb-6">
            <button onClick={() => { setActiveTab('list'); resetForm(); }} className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${activeTab === 'list' ? 'bg-[#1A1A2E] text-white' : 'bg-white border text-gray-600'}`}>
              📋 View List
            </button>
            <button onClick={() => setActiveTab('add')} className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${activeTab === 'add' ? 'bg-[#C8960C] text-white' : 'bg-white border text-gray-600'}`}>
              {editId ? '📝 Edit Entry' : '➕ Add Entry'}
            </button>
          </div>

          {activeTab === 'list' ? (
            <div className="bg-white rounded-2xl border overflow-hidden divide-y">
              {loading ? <div className="p-10 text-center text-gray-400">Loading data...</div> :
               currentList.length === 0 ? <div className="p-10 text-center text-gray-400">No items found. Create some!</div> :
               currentList.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50">
                  <img src={item.image || '/images/logo.png'} alt="" className="w-16 h-12 object-cover rounded-lg bg-gray-100 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-[#1A1A2E] block truncate">{item.title || item.name}</span>
                    <span className="text-xs text-[#C8960C] font-semibold">{item.price}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(item)} className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs font-semibold">Edit</button>
                    <button onClick={() => handleDelete(item.id, item.title || item.name)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-semibold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border p-6 md:p-8">
              <form onSubmit={handleSave} className="space-y-6">
                {/* Photo Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Display Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-20 border rounded-xl overflow-hidden flex items-center justify-center bg-gray-50">
                      {form.image ? <img src={form.image} alt="" className="w-full h-full object-cover" /> : <span className="text-3xl">📷</span>}
                    </div>
                    <div>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                      <button type="button" onClick={() => fileRef.current?.click()} className="px-4 py-2 border rounded-lg text-sm font-medium">
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Form Fields depend dynamically on the active category */}
                {activeSection === 'tours' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title (EN)" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input value={form.titleFr} onChange={e => setForm({ ...form, titleFr: e.target.value })} placeholder="Title (FR)" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm bg-white">
                        {TOUR_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 1 day)" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} placeholder="Depart city" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (e.g. From €65)" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <textarea required rows={4} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Description (EN)" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                    <textarea rows={4} value={form.descFr} onChange={e => setForm({ ...form, descFr: e.target.value })} placeholder="Description (FR)" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </>
                )}

                {activeSection === 'transfers' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Route Name EN (e.g. Casablanca to Marrakech)" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input value={form.titleFr} onChange={e => setForm({ ...form, titleFr: e.target.value })} placeholder="Route Name FR" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input required value={form.from_location} onChange={e => setForm({ ...form, from_location: e.target.value })} placeholder="From Location" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Duration (e.g. 3 hours)" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price (e.g. €120)" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <textarea required rows={3} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Description (EN)" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </>
                )}

                {activeSection === 'fleet' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Vehicle Name EN" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input value={form.nameFr} onChange={e => setForm({ ...form, nameFr: e.target.value })} placeholder="Vehicle Name FR" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <input required type="number" value={form.passengers} onChange={e => setForm({ ...form, passengers: parseInt(e.target.value) })} placeholder="Passengers" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required type="number" value={form.bags} onChange={e => setForm({ ...form, bags: parseInt(e.target.value) })} placeholder="Max Luggage Bags" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="Price per day" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <textarea required rows={3} value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Vehicle Details & features (EN)" className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </>
                )}

                {activeSection === 'blog' && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Post Title EN" className="border rounded-xl px-4 py-2.5 text-sm" />
                      <input value={form.titleFr} onChange={e => setForm({ ...form, titleFr: e.target.value })} placeholder="Post Title FR" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm bg-white">
                        {BLOG_CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                      <input required value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Short excerpt/intro (EN)" className="border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <textarea required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Post Article Content (EN) - Press enter for new paragraphs..." className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                    <textarea rows={8} value={form.contentFr} onChange={e => setForm({ ...form, contentFr: e.target.value })} placeholder="Post Article Content (FR)..." className="w-full border rounded-xl px-4 py-2.5 text-sm" />
                  </>
                )}

                <div className="flex gap-3">
                  <button type="submit" disabled={saving} className="bg-[#C8960C] text-white rounded-xl px-8 py-3 font-semibold disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Entry'}
                  </button>
                  <button type="button" onClick={() => { setActiveTab('list'); resetForm(); }} className="px-6 py-3 border rounded-xl text-sm font-semibold">Cancel</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}