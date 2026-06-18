import re

path = r"E:\projects\Elbo-Tours\app\api\tours\route.ts"

with open(path, "r", encoding="utf-8") as f:
    content = f.read()

old = "       WHERE t.active = true"
new = '       WHERE (t.active = true OR $1 = \'admin\')'
content = content.replace(old, new)

old2 = "      []"
new2 = "      [searchParams.get('admin') || '']"
content = content.replace(old2, new2, 1)

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: tours GET updated to support admin=1 param")
