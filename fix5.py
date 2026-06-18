path = r"E:\projects\Elbo-Tours\app\api\tours\[slug]\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Find first occurrence of PUT and keep only that one
first = content.find("export async function PUT(")
second = content.find("export async function PUT(", first + 1)

if second != -1:
    content = content[:second].rstrip() + "\n"
    print("OK: removed duplicate PUT/DELETE block")
else:
    print("No duplicate found")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)
