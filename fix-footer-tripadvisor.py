path = r"E:\projects\Elbo-Tours\components\layout\Footer.tsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add Script import
old_import = "import Image from 'next/image';"
new_import = "import Image from 'next/image';\nimport Script from 'next/script';"
if old_import in content and "next/script" not in content:
    content = content.replace(old_import, new_import, 1)

# 2. Replace the TripAdvisor placeholder icon with the real widget
old_block = """              <a href="#" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.49 2 2 6.13 2 11.23c0 2.9 1.46 5.49 3.74 7.18-.12.42-.78 2.69-.81 2.87 0 0-.02.13.07.18.09.06.2.01.2.01.27-.04 3.09-2.02 3.58-2.36.69.1 1.41.16 2.14.16h.08c5.51 0 10-4.13 10-9.23S17.59 2 12.08 2H12zm5.27 7.05a3.27 3.27 0 11-6.54 0 3.27 3.27 0 016.54 0zm-9 0a3.27 3.27 0 11-6.54 0 3.27 3.27 0 016.54 0z"/></svg>
              </a>"""

new_block = """              <div id="TA_rated369" className="TA_rated flex items-center">
                <ul id="JWmEUz8p8e" className="TA_links 73An2c2 list-none m-0 p-0">
                  <li id="v6HgWV" className="9OrnlppIbcb">
                    <a target="_blank" rel="noopener noreferrer" href="https://www.tripadvisor.com/Attraction_Review-g293732-d34341288-Reviews-Elbo_Tours-Casablanca_Casablanca_Settat.html">
                      <img src="https://www.tripadvisor.com/img/cdsi/img2/badges/ollie-11424-2.gif" alt="TripAdvisor" className="h-9 w-auto" />
                    </a>
                  </li>
                </ul>
              </div>
              <Script
                async
                src="https://www.jscache.com/wejs?wtype=rated&uniq=369&locationId=34341288&lang=en_US&display_version=2"
                strategy="lazyOnload"
              />"""

if old_block not in content:
    raise SystemExit("TripAdvisor placeholder not found - file may have changed.")

content = content.replace(old_block, new_block)
with open(path, "w", encoding="utf-8") as f:
    f.write(content)
print("Footer.tsx updated with real TripAdvisor widget.")
