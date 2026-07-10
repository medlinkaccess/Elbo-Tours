path = r"E:\projects\Elbo-Tours\app\[locale]\admin\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add MessagesTab function before the main admin component
messages_tab = """
function MessagesTab() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'read' | 'replied'>('all');

  useEffect(() => {
    fetch('/api/quotes').then(r => r.json()).then(data => { setItems(Array.isArray(data) ? data : []); setLoading(false); });
  }, []);

  async function markStatus(id: string, status: string) {
    await fetch('/api/quotes', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setItems(items => items.map(i => i.id === id ? { ...i, status } : i));
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter);
  const newCount = items.filter(i => i.status === 'new').length;

  const statusColor: Record<string, string> = { new: '#C8960C', read: '#888', replied: '#2d7a2d' };

  return (
    <div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        {['all', 'new', 'read', 'replied'].map(f => (
          <button key={f} onClick={() => setFilter(f as any)}
            style={{ padding: '0.4rem 1rem', border: '1px solid #e8e0d0', borderRadius: '20px', cursor: 'pointer',
              background: filter === f ? '#C8960C' : '#fff', color: filter === f ? '#fff' : '#666', fontSize: '0.85rem', fontWeight: 600, textTransform: 'capitalize' }}>
            {f}{f === 'new' && newCount > 0 ? ` (${newCount})` : ''}
          </button>
        ))}
      </div>
      {loading && <p style={{ color: '#888' }}>Loading...</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#888' }}>No messages found.</p>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map((q: any) => (
          <div key={q.id} style={{ background: '#fff', borderRadius: '10px', padding: '1.25rem', border: q.status === 'new' ? '2px solid #C8960C' : '1px solid #e8e0d0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1a0d00', fontSize: '0.95rem' }}>{q.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '0.15rem' }}>{q.tour_title || 'General Inquiry'}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: statusColor[q.status] || '#888', textTransform: 'uppercase' }}>{q.status}</span>
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{new Date(q.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.85rem', color: '#555', marginBottom: '0.75rem' }}>
              <span>Email: <a href={"mailto:" + q.email} style={{ color: '#C8960C' }}>{q.email}</a></span>
              <span>Phone: {q.phone || '-'}</span>
              <span>Date: {q.travel_date || '-'}</span>
              <span>Group: {q.group_size} pax</span>
            </div>
            {q.message && <p style={{ fontSize: '0.85rem', color: '#444', background: '#fafaf8', padding: '0.6rem', borderRadius: '6px', margin: '0 0 0.75rem' }}>{q.message}</p>}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={"mailto:" + q.email + "?subject=Re: " + encodeURIComponent(q.tour_title || 'Your Inquiry')}
                onClick={() => markStatus(q.id, 'replied')}
                style={{ ...btn('#e8f4e8', '#2d7a2d'), fontSize: '0.8rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}>
                Reply by Email
              </a>
              <a href={"https://wa.me/" + (q.phone || '').replace(/[^0-9]/g, '')}
                target="_blank" rel="noopener noreferrer"
                onClick={() => markStatus(q.id, 'replied')}
                style={{ ...btn('#e8f4e8', '#25D366'), fontSize: '0.8rem', padding: '0.35rem 0.75rem', textDecoration: 'none' }}>
                WhatsApp
              </a>
              {q.status === 'new' && (
                <button onClick={() => markStatus(q.id, 'read')} style={{ ...btn('#f0f0f0', '#666'), fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}>Mark Read</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

# Insert MessagesTab before the main export/component
content = content.replace(
    "function TransfersTab()",
    messages_tab.strip() + "\n\nfunction TransfersTab()"
)

# 2. Add messages to tab state type
content = content.replace(
    "useState<'tours' | 'fleet' | 'blog' | 'transfers'>('tours')",
    "useState<'tours' | 'fleet' | 'blog' | 'transfers' | 'messages'>('tours')"
)

# 3. Add messages to tabs array
content = content.replace(
    "{ id: 'transfers', label: 'Transfers' },",
    "{ id: 'transfers', label: 'Transfers' },\n    { id: 'messages', label: 'Messages' },"
)

# 4. Add messages tab render
content = content.replace(
    "{tab === 'blog' && <BlogTab />}",
    "{tab === 'blog' && <BlogTab />}\n        {tab === 'messages' && <MessagesTab />}"
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: MessagesTab added to admin")
