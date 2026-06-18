'use client';
import { useState } from 'react';

interface Props {
  tourId: string;
  tourTitle: string;
  onClose: () => void;
}

export default function QuoteModal({ tourId, tourTitle, onClose }: Props) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', travelDate: '', groupSize: '2', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');

  function set(k: string, v: string) { setForm(f => ({ ...f, [k]: v })); }

  async function submit() {
    if (!form.name || !form.email) { setErr('Name and email are required'); return; }
    setSending(true); setErr('');
    const res = await fetch('/api/quotes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tourId, tourTitle, ...form }),
    });
    if (res.ok) { setSent(true); }
    else { setErr('Failed to send. Please try WhatsApp instead.'); }
    setSending(false);
  }

  const inp: React.CSSProperties = { width: '100%', padding: '0.6rem 0.75rem', border: '1px solid #e8e0d0', borderRadius: '6px', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' };
  const lbl: React.CSSProperties = { display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#555', marginBottom: '0.3rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#fff', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '480px', maxHeight: '90vh', overflowY: 'auto', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#888' }}>x</button>
        {sent ? (
          <div style={{ textAlign: 'center', padding: '2rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>checkmark</div>
            <h3 style={{ color: '#1a0d00', marginBottom: '0.5rem' }}>Request Sent!</h3>
            <p style={{ color: '#666', fontSize: '0.9rem' }}>We will get back to you within 24 hours.</p>
            <button onClick={onClose} style={{ marginTop: '1.5rem', background: '#C8960C', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem 2rem', cursor: 'pointer', fontWeight: 600 }}>Close</button>
          </div>
        ) : (
          <>
            <h3 style={{ margin: '0 0 0.25rem', color: '#1a0d00', fontSize: '1.2rem' }}>Request a Quote</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#888', fontSize: '0.85rem' }}>{tourTitle}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Full Name *</label>
                <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your name" />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Email *</label>
                <input style={inp} type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" />
              </div>
              <div>
                <label style={lbl}>Phone / WhatsApp</label>
                <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+212..." />
              </div>
              <div>
                <label style={lbl}>Group Size</label>
                <input style={inp} type="number" min="1" value={form.groupSize} onChange={e => set('groupSize', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Travel Date</label>
                <input style={inp} type="date" value={form.travelDate} onChange={e => set('travelDate', e.target.value)} />
              </div>
              <div style={{ gridColumn: '1/-1' }}>
                <label style={lbl}>Message (optional)</label>
                <textarea style={{ ...inp, height: '80px', resize: 'vertical' }} value={form.message} onChange={e => set('message', e.target.value)} placeholder="Any special requests..." />
              </div>
            </div>
            {err && <p style={{ color: '#c0392b', fontSize: '0.85rem', margin: '0.75rem 0 0' }}>{err}</p>}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
              <button onClick={submit} disabled={sending} style={{ flex: 1, background: '#C8960C', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.75rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.95rem' }}>
                {sending ? 'Sending...' : 'Send Request'}
              </button>
              <a href={"https://wa.me/212665889258?text=" + encodeURIComponent("Hi! I am interested in " + tourTitle)}
                target="_blank" rel="noopener noreferrer"
                style={{ flex: 1, background: '#25D366', color: '#fff', borderRadius: '8px', padding: '0.75rem', fontWeight: 600, fontSize: '0.95rem', textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                WhatsApp
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
