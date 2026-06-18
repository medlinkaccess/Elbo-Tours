# -*- coding: utf-8 -*-
path = r"E:\projects\Elbo-Tours\app\[locale]\admin\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'departsFrom: "Marrakech", maxGroupSize: "12", tags: "",',
    'departsFrom: "Marrakech", maxGroupSize: "12", tags: "", priceDisplay: "",'
)

content = content.replace(
    '<Field label="Departs From">',
    '<Field label="Price Display"><input style={inp} value={form.priceDisplay} onChange={e => set("priceDisplay", e.target.value)} placeholder="e.g. From EUR590" /></Field>\n            <Field label="Departs From">',
    1
)

content = content.replace(
    'tags: (detail.tags || []).join(", "),',
    'tags: (detail.tags || []).join(", "),\n      priceDisplay: detail.priceDisplay || "",'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: priceDisplay field added")
