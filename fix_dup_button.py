path = r"E:\projects\Elbo-Tours\app\[locale]\tours\[slug]\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old_block = '''            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtnSecondary}>
              {locale === "fr" ? "Demander un devis" : "Request a quote"}
            </a>'''

if old_block in content:
    content = content.replace(old_block, "")
    print("OK: duplicate button removed")
else:
    print("Block not found - check exact whitespace")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
