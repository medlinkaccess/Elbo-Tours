path = r"E:\projects\Elbo-Tours\app\[locale]\tours\[slug]\page.tsx"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = '''<button onClick={() => setShowQuote(true)} className={styles.ctaBtnSecondary} style={{ cursor: "pointer", border: "none" }}>'''
new = '''<button onClick={() => setShowQuote(true)} className={styles.ctaBtnSecondary} style={{ cursor: "pointer", width: "100%", background: "#fff" }}>'''

if old in content:
    content = content.replace(old, new)
    print("OK: button style fixed")
else:
    print("NOT FOUND - check exact text")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
