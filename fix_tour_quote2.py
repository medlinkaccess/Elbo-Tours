path = r"E:\projects\Elbo-Tours\app\[locale]\tours\[slug]\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Add modal render before </main>
if "showQuote && tour &&" not in content:
    content = content.replace(
        "    </main>\n  );\n}",
        "      {showQuote && tour && <QuoteModal tourId={tour.id} tourTitle={tour.title} onClose={() => setShowQuote(false)} />}\n    </main>\n  );\n}"
    )
    print("OK: modal render added")
else:
    print("modal already present")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
