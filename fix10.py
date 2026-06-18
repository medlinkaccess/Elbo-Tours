path = r"E:\projects\Elbo-Tours\app\[locale]\transfers\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# The fallback airports section (second occurrence) wrongly uses priceFrom
# Split on the marker comment to fix only the fallback block
old = '''                {/* 2. Show Fallback Airport Transfers if database is empty */}
                {showFallbacks && FALLBACK_AIRPORTS.map((airport, i) => {
                  const msg = encodeURIComponent(`Hi! I need an airport transfer at ${airport.city} (${airport.code}).`);
                  return (
                    <div key={i} className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-[#C8960C] hover:shadow-lg transition-all duration-200 relative bg-white">
                      <div className="relative h-36 overflow-hidden">
                        <img src={airport.img} alt={airport.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <div className="font-bold text-2xl text-white">{airport.code}</div>
                          <div className="text-xs text-white/80">{airport.city}</div>
                        </div>
                        {airport.popular && (
                          <span className="absolute top-3 right-3 bg-[#C8960C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{popular}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">{t(\'per_vehicle\')}</span>
                          <span className="font-bold text-[#C8960C] text-lg">{airport.priceFrom > 0 ? `From \u20ac${airport.priceFrom}` : "Ask for price"}</span>'''

new = '''                {/* 2. Show Fallback Airport Transfers if database is empty */}
                {showFallbacks && FALLBACK_AIRPORTS.map((airport, i) => {
                  const msg = encodeURIComponent(`Hi! I need an airport transfer at ${airport.city} (${airport.code}).`);
                  return (
                    <div key={i} className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-[#C8960C] hover:shadow-lg transition-all duration-200 relative bg-white">
                      <div className="relative h-36 overflow-hidden">
                        <img src={airport.img} alt={airport.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <div className="font-bold text-2xl text-white">{airport.code}</div>
                          <div className="text-xs text-white/80">{airport.city}</div>
                        </div>
                        {airport.popular && (
                          <span className="absolute top-3 right-3 bg-[#C8960C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{popular}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">{t(\'per_vehicle\')}</span>
                          <span className="font-bold text-[#C8960C] text-lg">{airport.price}</span>'''

content = content.replace(old, new)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: fallback airports restored to use airport.price")
