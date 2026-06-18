path = r"E:\projects\Elbo-Tours\app\api\tours\[slug]\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add priceDisplay to the UPDATE statement
content = content.replace(
    '"maxGroupSize" = ${maxGroup},\n        gallery = ${gallery},\n        "updatedAt" = NOW()',
    '"maxGroupSize" = ${maxGroup},\n        gallery = ${gallery},\n        "priceDisplay" = ${body.priceDisplay || null},\n        "updatedAt" = NOW()'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: priceDisplay added to UPDATE")
