admin_path = r"E:\projects\Elbo-Tours\app\[locale]\admin\page.tsx"

new_tours_tab = """
function ListEditor({ label, values, onChange }: { label: string; values: string[]; onChange: (v: string[]) => void }) {
  function update(i: number, v: string) { const a = [...values]; a[i] = v; onChange(a); }
  function add() { onChange([...values, ""]); }
  function remove(i: number) { onChange(values.filter((_, j) => j !== i)); }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <label style={lbl}>{label}</label>
        <button type="button" onClick={add} style={{ ...btn("#e8f4e8", "#2d7a2d"), fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>+ Add</button>
      </div>
      {values.map((v, i) => (
        <div key={i} style={{ display: "flex", gap: "0.4rem", marginBottom: "0.4rem" }}>
          <input style={{ ...inp, flex: 1 }} value={v} onChange={e => update(i, e.target.value)} />
          <button type="button" onClick={() => remove(i)} style={{ ...btn("#fdecea", "#c0392b"), padding: "0.3rem 0.6rem" }}>x</button>
        </div>
      ))}
    </div>
  );
}

function ItineraryEditor({ days, onChange }: { days: any[]; onChange: (v: any[]) => void }) {
  function update(i: number, k: string, v: string) { const a = [...days]; a[i] = { ...a[i], [k]: v }; onChange(a); }
  function add() { onChange([...days, { day: days.length + 1, title: "", description: "" }]); }
  function remove(i: number) { onChange(days.filter((_, j) => j !== i).map((d, j) => ({ ...d, day: j + 1 }))); }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
        <label style={lbl}>Itinerary</label>
        <button type="button" onClick={add} style={{ ...btn("#e8f4e8", "#2d7a2d"), fontSize: "0.75rem", padding: "0.2rem 0.6rem" }}>+ Day</button>
      </div>
      {days.map((d, i) => (
        <div key={i} style={{ border: "1px solid #e8e0d0", borderRadius: "6px", padding: "0.75rem", marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontWeight: 700, fontSize: "0.85rem", color: "#C8960C" }}>Day {d.day}</span>
            <button type="button" onClick={() => remove(i)} style={{ ...btn("#fdecea", "#c0392b"), padding: "0.2rem 0.5rem", fontSize: "0.75rem" }}>Remove</button>
          </div>
          <input style={{ ...inp, marginBottom: "0.4rem" }} placeholder="Day title" value={d.title} onChange={e => update(i, "title", e.target.value)} />
          <textarea style={{ ...inp, height: "60px", resize: "vertical" }} placeholder="Day description" value={d.description} onChange={e => update(i, "description", e.target.value)} />
        </div>
      ))}
    </div>
  );
}

function ToursTab() {
  const [tours, setTours] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState({
    title: "", titleFr: "", desc: "", descFr: "",
    category: CATEGORIES[0], duration: "", price: "", image: "",
    featured: false, active: true,
    departsFrom: "Marrakech", maxGroupSize: "12", tags: "",
    highlights: [] as string[],
    includes: [] as string[],
    excludes: [] as string[],
    itinerary: [] as any[],
  });
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => { fetch("/api/tours?admin=1").then(r => r.json()).then(setTours); }, []);

  function set(k: string, v: any) { setForm(f => ({ ...f, [k]: v })); }

  async function startEdit(tour: any) {
    setEditing(tour);
    // Load full detail to get highlights/includes/excludes/itinerary
    const detail = await fetch("/api/tours/" + tour.slug).then(r => r.json());
    setForm({
      title: tour.title || "",
      titleFr: tour.titleFr || "",
      desc: tour.desc || "",
      descFr: tour.descFr || "",
      category: tour.category || CATEGORIES[0],
      duration: tour.duration || "",
      price: tour.priceFrom?.toString() || "",
      image: tour.image || "",
      featured: tour.featured || false,
      active: tour.active !== false,
      departsFrom: detail.departsFrom || "Marrakech",
      maxGroupSize: detail.maxGroupSize?.toString() || "12",
      tags: (detail.tags || []).join(", "),
      highlights: detail.highlights || [],
      includes: detail.includes || [],
      excludes: detail.excludes || [],
      itinerary: detail.itinerary || [],
    });
    setExpandedSection(null);
  }

  function startNew() {
    setEditing({});
    setForm({ title: "", titleFr: "", desc: "", descFr: "", category: CATEGORIES[0], duration: "", price: "", image: "", featured: false, active: true, departsFrom: "Marrakech", maxGroupSize: "12", tags: "", highlights: [], includes: [], excludes: [], itinerary: [] });
  }

  async function save() {
    setSaving(true); setErr("");
    const slug = editing?.slug;
    const method = slug ? "PUT" : "POST";
    const url = slug ? "/api/tours/" + slug : "/api/tours";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: parseFloat(form.price) || 0 }),
    });
    if (res.ok) {
      const updated = await fetch("/api/tours?admin=1").then(r => r.json());
      setTours(updated); setEditing(null);
    } else {
      const data = await res.json().catch(() => ({}));
      setErr("Save failed: " + (data.error || res.status));
    }
    setSaving(false);
  }

  async function deleteTour(tour: any) {
    if (!confirm("Delete " + tour.title + "?")) return;
    await fetch("/api/tours/" + tour.slug, { method: "DELETE" });
    setTours(t => t.filter(x => x.id !== tour.id));
  }

  const Section = ({ id, label, children }: { id: string; label: string; children: React.ReactNode }) => (
    <div style={{ gridColumn: "1/-1", border: "1px solid #e8e0d0", borderRadius: "8px", overflow: "hidden" }}>
      <button type="button" onClick={() => setExpandedSection(expandedSection === id ? null : id)}
        style={{ width: "100%", padding: "0.75rem 1rem", background: expandedSection === id ? "#fdf6e8" : "#fafaf8", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: "0.85rem", color: "#1a0d00" }}>
        <span>{label}</span><span>{expandedSection === id ? "?" : "?"}</span>
      </button>
      {expandedSection === id && <div style={{ padding: "1rem" }}>{children}</div>}
    </div>
  );

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ color: "#666", fontSize: "0.9rem" }}>{tours.length} tours</span>
        <button onClick={startNew} style={btn("#C8960C", "#fff")}>+ New Tour</button>
      </div>

      {editing !== null && (
        <div style={{ background: "#fff", borderRadius: "12px", padding: "1.5rem", border: "1px solid #e8e0d0", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1.25rem", color: "#1a0d00" }}>{editing?.slug ? "Edit Tour" : "New Tour"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Field label="Title (EN)"><input style={inp} value={form.title} onChange={e => set("title", e.target.value)} /></Field>
            <Field label="Title (FR)"><input style={inp} value={form.titleFr} onChange={e => set("titleFr", e.target.value)} /></Field>
            <div style={{ gridColumn: "1/-1" }}><Field label="Description (EN)"><textarea style={{ ...inp, height: "80px", resize: "vertical" }} value={form.desc} onChange={e => set("desc", e.target.value)} /></Field></div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Description (FR)"><textarea style={{ ...inp, height: "80px", resize: "vertical" }} value={form.descFr} onChange={e => set("descFr", e.target.value)} /></Field></div>
            <Field label="Category"><select style={inp} value={form.category} onChange={e => set("category", e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select></Field>
            <Field label="Duration"><input style={inp} value={form.duration} onChange={e => set("duration", e.target.value)} placeholder="e.g. 3 days / 2 nights" /></Field>
            <Field label="Price (EUR)"><input style={inp} type="number" value={form.price} onChange={e => set("price", e.target.value)} placeholder="0 = Ask for price" /></Field>
            <Field label="Departs From"><input style={inp} value={form.departsFrom} onChange={e => set("departsFrom", e.target.value)} placeholder="Marrakech" /></Field>
            <Field label="Max Group Size"><input style={inp} type="number" value={form.maxGroupSize} onChange={e => set("maxGroupSize", e.target.value)} /></Field>
            <Field label="Tags (comma separated)"><input style={inp} value={form.tags} onChange={e => set("tags", e.target.value)} placeholder="multi-day, classic, desert" /></Field>
            <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", paddingTop: "1.5rem" }}>
              <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", cursor: "pointer" }}><input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} /> Featured</label>
              <label style={{ display: "flex", gap: "0.4rem", alignItems: "center", cursor: "pointer" }}><input type="checkbox" checked={form.active} onChange={e => set("active", e.target.checked)} /> Active</label>
            </div>
            <div style={{ gridColumn: "1/-1" }}><Field label="Image (used for card & hero)"><ImageUpload value={form.image} onChange={v => set("image", v)} /></Field></div>

            <Section id="highlights" label={"Highlights (" + form.highlights.length + ")"}>
              <ListEditor label="" values={form.highlights} onChange={v => set("highlights", v)} />
            </Section>
            <Section id="includes" label={"Included (" + form.includes.length + ") / Excluded (" + form.excludes.length + ")"}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <ListEditor label="Included" values={form.includes} onChange={v => set("includes", v)} />
                <ListEditor label="Not Included" values={form.excludes} onChange={v => set("excludes", v)} />
              </div>
            </Section>
            <Section id="itinerary" label={"Itinerary (" + form.itinerary.length + " days)"}>
              <ItineraryEditor days={form.itinerary} onChange={v => set("itinerary", v)} />
            </Section>
          </div>
          {err && <p style={{ color: "#c0392b", fontSize: "0.85rem", margin: "0.75rem 0 0" }}>{err}</p>}
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "1.25rem" }}>
            <button onClick={save} disabled={saving} style={btn("#C8960C", "#fff")}>{saving ? "Saving..." : "Save"}</button>
            <button onClick={() => setEditing(null)} style={btn("#e8e0d0", "#555")}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {tours.map((t: any) => (
          <div key={t.id} style={{ background: "#fff", borderRadius: "10px", padding: "1rem 1.25rem", border: "1px solid #e8e0d0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {t.image && <img src={t.image} alt={t.title} style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "6px" }} />}
              <div>
                <div style={{ fontWeight: 600, color: "#1a0d00" }}>{t.title}</div>
                <div style={{ fontSize: "0.8rem", color: "#888" }}>{t.category} &middot; {t.duration}</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => startEdit(t)} style={btn("#f0e8d8", "#8B6914")}>Edit</button>
              <button onClick={() => deleteTour(t)} style={btn("#fdecea", "#c0392b")}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
"""

with open(admin_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace the old ToursTab function
import re
content = re.sub(
    r'function ToursTab\(\).*?(?=\nfunction FleetTab)',
    new_tours_tab.strip() + "\n\n",
    content,
    flags=re.DOTALL
)

with open(admin_path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: admin ToursTab replaced with full field editor")
