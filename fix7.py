path = r"E:\projects\Elbo-Tours\app\api\tours\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add priceDisplay to SELECT
content = content.replace(
    't.featured, t.active, t.category, t."sortOrder",',
    't.featured, t.active, t.category, t."sortOrder", t."priceDisplay",'
)

# Add priceDisplay to result map
content = content.replace(
    '      featured: t.featured,\n      active: t.active,\n    }))',
    '      featured: t.featured,\n      active: t.active,\n      priceDisplay: t.priceDisplay || \'\',\n    }))'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: priceDisplay added to GET response")
