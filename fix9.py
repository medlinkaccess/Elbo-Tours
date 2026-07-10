path = r"E:\projects\Elbo-Tours\app\[locale]\transfers\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Fix airport card price display
content = content.replace(
    '<span className="font-bold text-[#C8960C] text-lg">{airport.price}</span>',
    '<span className="font-bold text-[#C8960C] text-lg">{airport.priceFrom > 0 ? `From \u20ac${airport.priceFrom}` : "Ask for price"}</span>'
)

# Fix city route card price display
content = content.replace(
    '<div className="text-center font-bold text-[#C8960C] text-xl mb-4">{route.price}</div>\n                        <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"\n                          className="w-full block bg-[#C8960C]',
    '<div className="text-center font-bold text-[#C8960C] text-xl mb-4">{route.priceFrom > 0 ? `From \u20ac${route.priceFrom}` : "Ask for price"}</div>\n                        <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"\n                          className="w-full block bg-[#C8960C]',
    1
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: transfers page price display fixed")
