'use client';
import { useState, useEffect, useRef } from 'react';

interface Tour {
  id: string; slug: string; title: string; titleFr: string;
  desc: string; descFr: string; image: string; category: string;
  duration: string; price: string; featured: boolean; active: boolean;
}
const CATEGORIES = ['Day Trips', 'Multi-day Tours', 'Desert Tours', 'City Tours', 'Custom/Private Tours'];
const BLOG_CATS = ['Travel Tips', 'Destinations', 'Culture', 'Food', 'Adventure'];
const inp = { width: '100%', padding: '0.6rem 0.8rem', border: '1.5px solid #e0d8cc', borderRadius: '6px', fontSize: '0.9rem', boxSizing: 'border-box' as const };
const lbl = { display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#666', marginBottom: '0.3rem', textTransform: 'uppercase' as const, letterSpacing: '.05em' };
const btn = (bg: string, color: string) => ({ padding: '0.35rem 0.75rem', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, background: bg, color });

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={lbl}>{label}</label>{children}</div>;
}

function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
    } catch (err) {
      console.error('Upload failed', err);
    }
    setUploading(false);
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input style={{ ...inp, flex: 1 }} value={value} onChange={e => onChange(e.target.value)} placeholder="/images/tours/..." />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          style={{ ...btn('#C8960C', '#fff'), padding: '0.6rem 1rem', whiteSpace: 'nowrap' as const }}
        >
          {uploading ? 'Uploading...' : 'Upload Image'}
        </button>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
      </div>
      {value && value.startsWith('http') && (
        <img src={value} alt="preview" style={{ marginTop: '0.5rem', height: '80px', borderRadius: '6px', objectFit: 'cover' }} />
      )}
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit() {
    setLoading(true); setErr('');
    const r = await fetch('/api/admin-auth', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: pw }) });
    if (r.ok) { onLogin(); } else { setErr('Invalid password'); }
    setLoading(false);
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f0e8' }}>
      <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', color: '#1a0d00', marginBottom: '0.25rem' }}>Elbo Tours</h1>
        <p style={{ color: '#888', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Admin Panel</p>
        <input type="password" placeholder="Password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()}
          style={{ ...inp, marginBottom: '0.75rem' }} />
        {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{err}</p>}
        <button onClick={submit} disabled={loading} style={{ width: '100%', padding: '0.8rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>
    </div>
  );
}

function ToursTab() {
  const [tours, setTours] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', titleFr: '', desc: '', descFr: '', category: CATEGORIES[0], duration: '', price: '', image: '', featured: false, active: true });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/tours').then(r => r.json()).then(setTours); }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  function startEdit(tour: any) {
    setEditing(tour);
    setForm({ title: tour.title || '', titleFr: tour.titleFr || '', desc: tour.desc || '', descFr: tour.descFr || '', category: tour.category || CATEGORIES[0], duration: tour.duration || '', price: tour.priceFrom?.toString() || '', image: tour.image || '', featured: tour.featured || false, active: tour.active !== false });
  }

  function startNew() { setEditing({}); setForm({ title: '', titleFr: '', desc: '', descFr: '', category: CATEGORIES[0], duration: '', price: '', image: '', featured: false, active: true }); }

  async function save() {
    setSaving(true); setErr('');
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? '/api/tours/' + editing.id : '/api/tours';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }) });
    if (res.ok) { const updated = await fetch('/api/tours').then(r => r.json()); setTours(updated); setEditing(null); }
    else { setErr('Save failed'); }
    setSaving(false);
  }

  async function deleteTour(id: string) {
    if (!confirm('Delete this tour?')) return;
    await fetch('/api/tours/' + id, { method: 'DELETE' });
    setTours(t => t.filter(x => x.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>{tours.length} tours</span>
        <button onClick={startNew} style={btn('#C8960C', '#fff')}>+ New Tour</button>
      </div>

      {editing !== null && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{editing?.id ? 'Edit Tour' : 'New Tour'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Description (EN)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} /></Field></div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Description (FR)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.descFr} onChange={e => set('descFr', e.target.value)} /></Field></div>
            <Field label="Category"><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Duration"><input style={inp} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 3 days / 2 nights" /></Field>
            <Field label="Price (EUR)"><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = Ask for price" /></Field>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured</label>
              <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} /> Active</label>
            </div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Image"><ImageUpload value={form.image} onChange={v => set('image', v)} /></Field></div>
          </div>
          {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} style={btn('#C8960C', '#fff')}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} style={btn('#e8e0d0', '#555')}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {tours.map((t: any) => (
          <div key={t.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid #e8e0d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {t.image && <img src={t.image} alt={t.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
              <div>
                <div style={{ fontWeight: 600, color: '#1a0d00' }}>{t.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.category} &middot; {t.duration}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(t)} style={btn('#f0e8d8', '#8B6914')}>Edit</button>
              <button onClick={() => deleteTour(t.id)} style={btn('#fdecea', '#c0392b')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FleetTab() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ name: '', nameFr: '', desc: '', passengers: '', bags: '', price: '', image: '' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/fleet').then(r => r.json()).then(setItems); }, []);
  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }
  function startEdit(item: any) { setEditing(item); setForm({ name: item.name || '', nameFr: item.nameFr || '', desc: item.desc || '', passengers: item.passengers?.toString() || '', bags: item.bags?.toString() || '', price: item.price?.toString() || '', image: item.image || '' }); }
  function startNew() { setEditing({}); setForm({ name: '', nameFr: '', desc: '', passengers: '', bags: '', price: '', image: '' }); }

  async function save() {
    setSaving(true); setErr('');
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? '/api/fleet/' + editing.id : '/api/fleet';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, passengers: parseInt(form.passengers) || 0, bags: parseInt(form.bags) || 0, price: parseFloat(form.price) || 0 }) });
    if (res.ok) { const updated = await fetch('/api/fleet').then(r => r.json()); setItems(updated); setEditing(null); }
    else { setErr('Save failed'); }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this vehicle?')) return;
    await fetch('/api/fleet/' + id, { method: 'DELETE' });
    setItems(i => i.filter(x => x.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>{items.length} vehicles</span>
        <button onClick={startNew} style={btn('#C8960C', '#fff')}>+ New Vehicle</button>
      </div>
      {editing !== null && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{editing?.id ? 'Edit Vehicle' : 'New Vehicle'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Name (EN)"><input style={inp} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
            <Field label="Name (FR)"><input style={inp} value={form.nameFr} onChange={e => set('nameFr', e.target.value)} /></Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Description"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} /></Field></div>
            <Field label="Passengers"><input style={inp} type="number" value={form.passengers} onChange={e => set('passengers', e.target.value)} /></Field>
            <Field label="Bags"><input style={inp} type="number" value={form.bags} onChange={e => set('bags', e.target.value)} /></Field>
            <Field label="Price / day (EUR)"><input style={inp} value={form.price} onChange={e => set('price', e.target.value)} /></Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Image"><ImageUpload value={form.image} onChange={v => set('image', v)} /></Field></div>
          </div>
          {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} style={btn('#C8960C', '#fff')}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} style={btn('#e8e0d0', '#555')}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((t: any) => (
          <div key={t.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid #e8e0d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {t.image && <img src={t.image} alt={t.name} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
              <div>
                <div style={{ fontWeight: 600, color: '#1a0d00' }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.passengers} pax &middot; {t.bags} bags</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(t)} style={btn('#f0e8d8', '#8B6914')}>Edit</button>
              <button onClick={() => deleteItem(t.id)} style={btn('#fdecea', '#c0392b')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', titleFr: '', excerpt: '', excerptFr: '', category: BLOG_CATS[0], image: '', status: 'PUBLISHED' });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/blog').then(r => r.json()).then(setPosts); }, []);
  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }
  function startEdit(post: any) { setEditing(post); setForm({ title: post.title || '', titleFr: post.titleFr || '', excerpt: post.excerpt || '', excerptFr: post.excerptFr || '', category: post.category || BLOG_CATS[0], image: post.image || '', status: post.status || 'PUBLISHED' }); }
  function startNew() { setEditing({}); setForm({ title: '', titleFr: '', excerpt: '', excerptFr: '', category: BLOG_CATS[0], image: '', status: 'PUBLISHED' }); }

  async function save() {
    setSaving(true); setErr('');
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? '/api/blog/' + editing.id : '/api/blog';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) { const updated = await fetch('/api/blog').then(r => r.json()); setPosts(updated); setEditing(null); }
    else { setErr('Save failed'); }
    setSaving(false);
  }

  async function deletePost(id: string) {
    if (!confirm('Delete this post?')) return;
    await fetch('/api/blog/' + id, { method: 'DELETE' });
    setPosts(p => p.filter(x => x.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>{posts.length} posts</span>
        <button onClick={startNew} style={btn('#C8960C', '#fff')}>+ New Post</button>
      </div>
      {editing !== null && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{editing?.id ? 'Edit Post' : 'New Post'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Excerpt (EN)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} /></Field></div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Excerpt (FR)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.excerptFr} onChange={e => set('excerptFr', e.target.value)} /></Field></div>
            <Field label="Category"><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{BLOG_CATS.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Status"><select style={inp} value={form.status} onChange={e => set('status', e.target.value)}><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select></Field>
            <div style={{ gridColumn: '1/-1' }}><Field label="Image"><ImageUpload value={form.image} onChange={v => set('image', v)} /></Field></div>
          </div>
          {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} style={btn('#C8960C', '#fff')}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} style={btn('#e8e0d0', '#555')}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {posts.map((p: any) => (
          <div key={p.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid #e8e0d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {p.image && <img src={p.image} alt={p.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
              <div>
                <div style={{ fontWeight: 600, color: '#1a0d00' }}>{p.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{p.date}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(p)} style={btn('#f0e8d8', '#8B6914')}>Edit</button>
              <button onClick={() => deletePost(p.id)} style={btn('#fdecea', '#c0392b')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TransfersTab() {
  const [items, setItems] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({ title: '', titleFr: '', fromLocation: '', toLocation: '', priceFrom: '', image: '', active: true });
  const [err, setErr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetch('/api/transfers').then(r => r.json()).then(setItems); }, []);
  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }
  function startEdit(item: any) { setEditing(item); setForm({ title: item.title || '', titleFr: item.titleFr || '', fromLocation: item.fromLocation || '', toLocation: item.toLocation || '', priceFrom: item.priceFrom?.toString() || '', image: item.image || '', active: item.active !== false }); }
  function startNew() { setEditing({}); setForm({ title: '', titleFr: '', fromLocation: '', toLocation: '', priceFrom: '', image: '', active: true }); }

  async function save() {
    setSaving(true); setErr('');
    const method = editing?.id ? 'PUT' : 'POST';
    const url = editing?.id ? '/api/transfers/' + editing.id : '/api/transfers';
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, priceFrom: parseFloat(form.priceFrom) || 0 }) });
    if (res.ok) { const updated = await fetch('/api/transfers').then(r => r.json()); setItems(updated); setEditing(null); }
    else { setErr('Save failed'); }
    setSaving(false);
  }

  async function deleteItem(id: string) {
    if (!confirm('Delete this transfer?')) return;
    await fetch('/api/transfers/' + id, { method: 'DELETE' });
    setItems(i => i.filter(x => x.id !== id));
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <span style={{ color: '#666', fontSize: '0.9rem' }}>{items.length} transfers</span>
        <button onClick={startNew} style={btn('#C8960C', '#fff')}>+ New Transfer</button>
      </div>
      {editing !== null && (
        <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{editing?.id ? 'Edit Transfer' : 'New Transfer'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
            <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
            <Field label="From Location"><input style={inp} value={form.fromLocation} onChange={e => set('fromLocation', e.target.value)} /></Field>
            <Field label="To Location"><input style={inp} value={form.toLocation} onChange={e => set('toLocation', e.target.value)} /></Field>
            <Field label="Price From (EUR)"><input style={inp} type="number" value={form.priceFrom} onChange={e => set('priceFrom', e.target.value)} placeholder="0 = Ask for price" /></Field>
            <div style={{ display: 'flex', alignItems: 'center', paddingTop: '1.5rem' }}>
              <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} /> Active</label>
            </div>
            <div style={{ gridColumn: '1/-1' }}><Field label="Image"><ImageUpload value={form.image} onChange={v => set('image', v)} /></Field></div>
          </div>
          {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
            <button onClick={save} disabled={saving} style={btn('#C8960C', '#fff')}>{saving ? 'Saving...' : 'Save'}</button>
            <button onClick={() => setEditing(null)} style={btn('#e8e0d0', '#555')}>Cancel</button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((t: any) => (
          <div key={t.id} style={{ background: '#fff', borderRadius: '10px', padding: '1rem 1.25rem', border: '1px solid #e8e0d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {t.image && <img src={t.image} alt={t.title} style={{ width: '60px', height: '45px', objectFit: 'cover', borderRadius: '6px' }} />}
              <div>
                <div style={{ fontWeight: 600, color: '#1a0d00' }}>{t.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#888' }}>{t.fromLocation} &rarr; {t.toLocation}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(t)} style={btn('#f0e8d8', '#8B6914')}>Edit</button>
              <button onClick={() => deleteItem(t.id)} style={btn('#fdecea', '#c0392b')}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'tours' | 'fleet' | 'blog' | 'transfers'>('tours');

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  const tabs = [
    { id: 'tours', label: 'Tours' },
    { id: 'transfers', label: 'Transfers' },
    { id: 'fleet', label: 'Fleet' },
    { id: 'blog', label: 'Blog' },
  ] as const;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
      <header style={{ background: '#1a0d00', color: '#fff', padding: '0 2rem', display: 'flex', alignItems: 'center', gap: '0.75rem', height: '56px' }}>
        <img src="/logos/elbo-logo.png" alt="Elbo Tours" style={{ height: '36px', objectFit: 'contain' }} />
        <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: '1.1rem' }}>Admin</span>
      </header>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', borderBottom: '2px solid #e8e0d0', paddingBottom: '0' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              style={{ padding: '0.6rem 1.25rem', border: 'none', borderRadius: '8px 8px 0 0', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: tab === t.id ? '#C8960C' : 'transparent', color: tab === t.id ? '#fff' : '#888', borderBottom: tab === t.id ? '2px solid #C8960C' : 'none', marginBottom: '-2px' }}>
              {t.label}
            </button>
          ))}
        </div>
        {tab === 'tours' && <ToursTab />}
        {tab === 'transfers' && <TransfersTab />}
        {tab === 'fleet' && <FleetTab />}
        {tab === 'blog' && <BlogTab />}
      </div>
    </div>
  );
}
