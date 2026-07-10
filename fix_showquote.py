path = r"E:\projects\Elbo-Tours\app\[locale]\tours\[slug]\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Remove the misplaced showQuote line from module level (next to WHATSAPP)
content = content.replace(
    'const WHATSAPP = "212665889258";\n  const [showQuote, setShowQuote] = useState(false);',
    'const WHATSAPP = "212665889258";'
)

# 2. Add it correctly inside the component, next to the other real useState calls
content = content.replace(
    'const [tour, setTour] = useState<TourDetail | null>(null);',
    'const [tour, setTour] = useState<TourDetail | null>(null);\n  const [showQuote, setShowQuote] = useState(false);'
)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: showQuote moved inside component")
