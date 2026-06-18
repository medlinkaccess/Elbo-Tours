'use client';

import { useState, useEffect } from 'react';

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

// · Generic Form Row helpers ·
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label style={lbl}>{label}</label>{children}</div>;
}

// · Tour Form ·
function TourForm({ tour, onSave, onCancel }: { tour?: Tour | null; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: tour?.title || '', titleFr: tour?.titleFr || '',
    desc: tour?.desc || '', descFr: tour?.descFr || '',
    image: tour?.image || '', category: tour?.category || 'Multi-day Tours',
    duration: tour?.duration || '', price: tour?.price?.replace(/[^0-9.]/g, '') || '',
    featured: tour?.featured || false, active: tour?.active !== false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  async function save() {
    if (!form.title) { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    const r = await fetch('/api/tours', { method: tour ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(tour ? { ...form, id: tour.id } : form) });
    if (r.ok) { onSave(); } else { setErr('Failed to save'); }
    setSaving(false);
  }
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0' }}>
      <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{tour ? 'Edit Tour' : 'New Tour'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
        <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (EN)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (FR)"><textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.descFr} onChange={e => set('descFr', e.target.value)} /></Field></div>
        <Field label="Category"><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Duration"><input style={inp} value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="e.g. 3 days / 2 nights" /></Field>
        <Field label="Price (EUR)"><input style={inp} type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = Ask for price" /></Field>
        <Field label="Image URL"><input style={inp} value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/tours/..." /></Field>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={form.featured} onChange={e => set('featured', e.target.checked)} /> Featured</label>
          <label style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', cursor: 'pointer' }}><input type="checkbox" checked={form.active} onChange={e => set('active', e.target.checked)} /> Active</label>
        </div>
      </div>
      {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button onClick={save} disabled={saving} style={{ padding: '0.65rem 1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Tour'}</button>
        <button onClick={onCancel} style={{ padding: '0.65rem 1.25rem', background: '#f5f0e8', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

// · Fleet Form ·
function FleetForm({ vehicle, onSave, onCancel }: { vehicle?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: vehicle?.name || '', nameFr: vehicle?.nameFr || '',
    desc: vehicle?.desc || '', descFr: vehicle?.descFr || '',
    image: vehicle?.image || '', price: vehicle?.price || '',
    passengers: vehicle?.passengers || '', bags: vehicle?.bags || '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  async function save() {
    if (!form.name) { setErr('Name is required'); return; }
    setSaving(true); setErr('');
    const r = await fetch('/api/fleet', { method: vehicle ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(vehicle ? { ...form, id: vehicle.id } : form) });
    if (r.ok) { onSave(); } else { setErr('Failed to save'); }
    setSaving(false);
  }
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0' }}>
      <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{vehicle ? 'Edit Vehicle' : 'New Vehicle'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Name (EN)"><input style={inp} value={form.name} onChange={e => set('name', e.target.value)} /></Field>
        <Field label="Name (FR)"><input style={inp} value={form.nameFr} onChange={e => set('nameFr', e.target.value)} /></Field>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (EN)"><textarea style={{ ...inp, height: '70px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (FR)"><textarea style={{ ...inp, height: '70px', resize: 'vertical' }} value={form.descFr} onChange={e => set('descFr', e.target.value)} /></Field></div>
        <Field label="Passengers"><input style={inp} type="number" value={form.passengers} onChange={e => set('passengers', e.target.value)} /></Field>
        <Field label="Bags"><input style={inp} type="number" value={form.bags} onChange={e => set('bags', e.target.value)} /></Field>
        <Field label="Price / day (EUR)"><input style={inp} value={form.price} onChange={e => set('price', e.target.value)} placeholder="e.g. 120" /></Field>
        <Field label="Image URL"><input style={inp} value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/fleet/..." /></Field>
      </div>
      {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button onClick={save} disabled={saving} style={{ padding: '0.65rem 1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Vehicle'}</button>
        <button onClick={onCancel} style={{ padding: '0.65rem 1.25rem', background: '#f5f0e8', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

// · Blog Form ·
function BlogForm({ post, onSave, onCancel }: { post?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: post?.title || '', titleFr: post?.titleFr || '',
    excerpt: post?.excerpt || '', excerptFr: post?.excerptFr || '',
    content: Array.isArray(post?.content) ? post.content.join('\n\n') : post?.content || '',
    contentFr: Array.isArray(post?.contentFr) ? post.contentFr.join('\n\n') : post?.contentFr || '',
    image: post?.image || '', category: post?.category || 'Travel Tips',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  async function save() {
    if (!form.title) { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    const r = await fetch('/api/blog', { method: post ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(post ? { ...form, id: post.id } : form) });
    if (r.ok) { onSave(); } else { setErr('Failed to save'); }
    setSaving(false);
  }
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0' }}>
      <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{post ? 'Edit Post' : 'New Blog Post'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
        <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
        <Field label="Category"><select style={inp} value={form.category} onChange={e => set('category', e.target.value)}>{BLOG_CATS.map(c => <option key={c}>{c}</option>)}</select></Field>
        <Field label="Image URL"><input style={inp} value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/blog/..." /></Field>
        <div style={{ gridColumn: '1/-1' }}><Field label="Excerpt (EN)"><textarea style={{ ...inp, height: '60px', resize: 'vertical' }} value={form.excerpt} onChange={e => set('excerpt', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Excerpt (FR)"><textarea style={{ ...inp, height: '60px', resize: 'vertical' }} value={form.excerptFr} onChange={e => set('excerptFr', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Content (EN) - separate paragraphs with blank lines"><textarea style={{ ...inp, height: '160px', resize: 'vertical' }} value={form.content} onChange={e => set('content', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Content (FR)"><textarea style={{ ...inp, height: '160px', resize: 'vertical' }} value={form.contentFr} onChange={e => set('contentFr', e.target.value)} /></Field></div>
      </div>
      {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button onClick={save} disabled={saving} style={{ padding: '0.65rem 1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Post'}</button>
        <button onClick={onCancel} style={{ padding: '0.65rem 1.25rem', background: '#f5f0e8', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}

// · Tours Tab ·
function ToursTab() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Tour | null | undefined>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  async function load() { setLoading(true); const r = await fetch('/api/tours?locale=en'); setTours(await r.json()); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function del(id: string) {
    if (!confirm('Delete this tour?')) return;
    setDeleting(id);
    await fetch('/api/tours', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#1a0d00' }}>Tours <span style={{ color: '#aaa', fontWeight: 400 }}>({tours.length})</span></h2>
        {editing === undefined && <button onClick={() => setEditing(null)} style={{ ...btn('#C8960C', '#fff'), padding: '0.5rem 1.25rem' }}>+ New Tour</button>}
      </div>
      {editing !== undefined && <div style={{ marginBottom: '1.5rem' }}><TourForm tour={editing} onSave={() => { setEditing(undefined); load(); }} onCancel={() => setEditing(undefined)} /></div>}
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {tours.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #e8e0d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              {t.image ? <img src={t.image} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }} /> : <div style={{ width: '64px', height: '44px', background: '#f0ebe0', borderRadius: '5px', flexShrink: 0 }} />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: '#1a0d00', fontSize: '0.95rem' }}>{t.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{t.category} · {t.duration || '—'} · {t.price}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                {t.featured && <span style={{ fontSize: '0.7rem', background: '#fff3cd', color: '#856404', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Featured</span>}
                <button onClick={() => setEditing(t)} style={btn('#e8f4fd', '#2980b9')}>Edit</button>
                <button onClick={() => del(t.id)} disabled={deleting === t.id} style={btn('#fdecea', '#c0392b')}>{deleting === t.id ? '...' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TransferForm({ transfer, onSave, onCancel }: { transfer?: any; onSave: () => void; onCancel: () => void }) {
  const [form, setForm] = useState({
    title: transfer?.title || '', titleFr: transfer?.titleFr || '',
    desc: transfer?.desc || '', descFr: transfer?.descFr || '',
    fromLocation: transfer?.fromLocation || '', priceFrom: transfer?.priceFrom || '', image: transfer?.image || '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');
  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));
  async function save() {
    if (!form.title) { setErr('Title is required'); return; }
    setSaving(true); setErr('');
    const r = await fetch('/api/transfers', { method: transfer ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(transfer ? { ...form, id: transfer.id } : form) });
    if (r.ok) { onSave(); } else { setErr('Failed to save'); }
    setSaving(false);
  }
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', border: '1px solid #e8e0d0' }}>
      <h3 style={{ margin: '0 0 1.25rem', color: '#1a0d00' }}>{transfer ? 'Edit Transfer' : 'New Transfer'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set('title', e.target.value)} /></Field>
        <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set('titleFr', e.target.value)} /></Field>
        <Field label="From Location"><input style={inp} value={form.fromLocation} onChange={e => set('fromLocation', e.target.value)} placeholder="e.g. Marrakech Menara Airport" /></Field>
        <Field label="Price From (EUR)"><input style={inp} type="number" value={form.priceFrom} onChange={e => set('priceFrom', e.target.value)} /></Field>
        <Field label="Image URL"><input style={inp} value={form.image} onChange={e => set('image', e.target.value)} placeholder="/images/airports/..." /></Field>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (EN)"><textarea style={{ ...inp, height: '60px', resize: 'vertical' }} value={form.desc} onChange={e => set('desc', e.target.value)} /></Field></div>
        <div style={{ gridColumn: '1/-1' }}><Field label="Description (FR)"><textarea style={{ ...inp, height: '60px', resize: 'vertical' }} value={form.descFr} onChange={e => set('descFr', e.target.value)} /></Field></div>
      </div>
      {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button onClick={save} disabled={saving} style={{ padding: '0.65rem 1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Transfer'}</button>
        <button onClick={onCancel} style={{ padding: '0.65rem 1.25rem', background: '#f5f0e8', color: '#666', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  );
}
function TransfersTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  async function load() { setLoading(true); try { const r = await fetch('/api/transfers?locale=en'); const d = await r.json(); setItems(Array.isArray(d) ? d : []); } catch {} finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function del(id: string) {
    if (!confirm('Delete this transfer?')) return;
    setDeleting(id);
    await fetch('/api/transfers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#1a0d00' }}>Transfers <span style={{ color: '#aaa', fontWeight: 400 }}>({items.length})</span></h2>
        {editing === undefined && <button onClick={() => setEditing(null)} style={{ ...btn('#C8960C', '#fff'), padding: '0.5rem 1.25rem' }}>+ New Transfer</button>}
      </div>
      {editing !== undefined && <div style={{ marginBottom: '1.5rem' }}><TransferForm transfer={editing} onSave={() => { setEditing(undefined); load(); }} onCancel={() => setEditing(undefined)} /></div>}
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {items.map((t: any) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #e8e0d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1a0d00' }}>{t.title || t.slug}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{t.fromLocation} · from ·{t.priceFrom}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setEditing(t)} style={btn('#e8f4fd', '#2980b9')}>Edit</button>
                <button onClick={() => del(t.id)} disabled={deleting === t.id} style={btn('#fdecea', '#c0392b')}>{deleting === t.id ? '...' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// · Fleet Tab ·
function FleetTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  async function load() { setLoading(true); const r = await fetch('/api/fleet?locale=en'); setItems(await r.json()); setLoading(false); }
  useEffect(() => { load(); }, []);
  async function del(id: string) {
    if (!confirm('Delete this vehicle?')) return;
    setDeleting(id);
    await fetch('/api/fleet', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#1a0d00' }}>Fleet <span style={{ color: '#aaa', fontWeight: 400 }}>({items.length})</span></h2>
        {editing === undefined && <button onClick={() => setEditing(null)} style={{ ...btn('#C8960C', '#fff'), padding: '0.5rem 1.25rem' }}>+ New Vehicle</button>}
      </div>
      {editing !== undefined && <div style={{ marginBottom: '1.5rem' }}><FleetForm vehicle={editing} onSave={() => { setEditing(undefined); load(); }} onCancel={() => setEditing(undefined)} /></div>}
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {items.length === 0 && <p style={{ color: '#aaa' }}>No vehicles yet.</p>}
          {items.map((v: any) => (
            <div key={v.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #e8e0d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              {v.image ? <img src={v.image} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }} /> : <div style={{ width: '64px', height: '44px', background: '#f0ebe0', borderRadius: '5px', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1a0d00' }}>{v.name}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{v.passengers} passengers · {v.bags} bags · {v.price ? `·{v.price}` : 'Price TBD'}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setEditing(v)} style={btn('#e8f4fd', '#2980b9')}>Edit</button>
                <button onClick={() => del(v.id)} disabled={deleting === v.id} style={btn('#fdecea', '#c0392b')}>{deleting === v.id ? '...' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// · Blog Tab ·
function BlogTab() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(undefined);
  const [deleting, setDeleting] = useState<string | null>(null);
  async function load() { setLoading(true); try { const r = await fetch('/api/blog?locale=en'); const d = await r.json(); setPosts(Array.isArray(d) ? d : []); } catch {} finally { setLoading(false); } }
  useEffect(() => { load(); }, []);
  async function del(id: string) {
    if (!confirm('Delete this post?')) return;
    setDeleting(id);
    await fetch('/api/blog', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    setDeleting(null); load();
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, color: '#1a0d00' }}>Blog Posts <span style={{ color: '#aaa', fontWeight: 400 }}>({posts.length})</span></h2>
        {editing === undefined && <button onClick={() => setEditing(null)} style={{ ...btn('#C8960C', '#fff'), padding: '0.5rem 1.25rem' }}>+ New Post</button>}
      </div>
      {editing !== undefined && <div style={{ marginBottom: '1.5rem' }}><BlogForm post={editing} onSave={() => { setEditing(undefined); load(); }} onCancel={() => setEditing(undefined)} /></div>}
      {loading ? <p style={{ color: '#888' }}>Loading...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {posts.length === 0 && <p style={{ color: '#aaa' }}>No blog posts yet.</p>}
          {posts.map((p: any) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#fff', border: '1px solid #e8e0d0', borderRadius: '8px', padding: '0.75rem 1rem' }}>
              {p.image ? <img src={p.image} alt="" style={{ width: '64px', height: '44px', objectFit: 'cover', borderRadius: '5px', flexShrink: 0 }} /> : <div style={{ width: '64px', height: '44px', background: '#f0ebe0', borderRadius: '5px', flexShrink: 0 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: '#1a0d00' }}>{p.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#888' }}>{p.category} · {p.date}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button onClick={() => setEditing(p)} style={btn('#e8f4fd', '#2980b9')}>Edit</button>
                <button onClick={() => del(p.id)} disabled={deleting === p.id} style={btn('#fdecea', '#c0392b')}>{deleting === p.id ? '...' : 'Delete'}</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// · Main ·
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<'tours' | 'transfers' | 'fleet' | 'blog'>('tours');
  async function logout() { await fetch('/api/admin-auth', { method: 'DELETE' }); setAuthed(false); }
  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;
  const tabBtn = (t: string, active: boolean) => ({
    padding: '0.65rem 1.25rem', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem', background: 'transparent',
    borderBottom: active ? '2px solid #C8960C' : '2px solid transparent', color: active ? '#C8960C' : '#666',
  });
  const TABS = [{ id: 'tours', label: 'Tours' }, { id: 'transfers', label: 'Transfers' }, { id: 'fleet', label: 'Fleet' }, { id: 'blog', label: 'Blog' }];
  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8' }}>
      <div style={{ background: '#1a0d00', color: '#fff', padding: '0 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
        <span style={{ fontFamily: 'Georgia,serif', fontWeight: 700, fontSize: '1.1rem' }}>Elbo Tours Admin</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="/en/tours" target="_blank" style={{ color: '#C8960C', fontSize: '0.85rem', textDecoration: 'none' }}>View Site</a>
          <button onClick={logout} style={{ padding: '0.35rem 0.9rem', background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem' }}>Logout</button>
        </div>
      </div>
      <div style={{ background: '#fff', borderBottom: '1px solid #e8e0d0', padding: '0 1.5rem', display: 'flex' }}>
        {TABS.map(t => <button key={t.id} style={tabBtn(t.id, tab === t.id)} onClick={() => setTab(t.id as any)}>{t.label}</button>)}
      </div>
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {tab === 'tours' && <ToursTab />}
        {tab === 'transfers' && <TransfersTab />}
        {tab === 'fleet' && <FleetTab />}
        {tab === 'blog' && <BlogTab />}
      </div>
    </div>
  );
}