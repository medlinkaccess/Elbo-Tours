path = r"E:\projects\Elbo-Tours\app\[locale]\tours\[slug]\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Add import
content = content.replace(
    'import { TourJsonLd } from "@/components/JsonLd";',
    'import { TourJsonLd } from "@/components/JsonLd";\nimport QuoteModal from "@/components/tours/QuoteModal";'
)

# 2. Add showQuote state after existing useState
content = content.replace(
    'const WHATSAPP = "212665889258";',
    'const WHATSAPP = "212665889258";\n  const [showQuote, setShowQuote] = useState(false);'
)

# 3. Add Request Quote button next to WhatsApp button and modal
old_btn = '<a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtnSecondary}>'
new_btn = '''<button onClick={() => setShowQuote(true)} className={styles.ctaBtnSecondary} style={{ cursor: "pointer", border: "none" }}>
              {locale === "fr" ? "Demander un devis" : "Request a Quote"}
            </button>
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtnSecondary}>'''

content = content.replace(old_btn, new_btn, 1)

# 4. Add modal before closing return
content = content.replace(
    '</TourJsonLd>',
    '</TourJsonLd>\n      {showQuote && tour && <QuoteModal tourId={tour.id} tourTitle={tour.title} onClose={() => setShowQuote(false)} />}'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: QuoteModal added to tour detail page")
