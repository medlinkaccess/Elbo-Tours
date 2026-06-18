slug_path = r"E:\projects\Elbo-Tours\app\api\tours\[slug]\route.ts"

put_delete = """
export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const authed = cookieHeader.includes("admin_auth=true");
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = params;
  const body = await req.json();
  const { randomUUID } = await import("crypto");

  const CAT_REVERSE: Record<string, string> = {
    "Day Trips": "DAY_TRIP",
    "Multi-day Tours": "MULTI_DAY",
    "Desert Tours": "DESERT",
    "City Tours": "CULTURAL",
    "Custom/Private Tours": "PRIVATE",
  };

  try {
    const rows = await sql`SELECT id FROM tours WHERE slug = ${slug} LIMIT 1`;
    if (rows.length === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const id = rows[0].id;

    const category = CAT_REVERSE[body.category] || "DAY_TRIP";
    const price = parseFloat(String(body.price || body.priceFrom || 0).replace(/[^0-9.]/g, "")) || 0;
    const tags = Array.isArray(body.tags) ? body.tags : (body.tags || "").split(",").map((t: string) => t.trim()).filter(Boolean);
    const gallery = Array.isArray(body.gallery) ? body.gallery : [];
    const maxGroup = parseInt(body.maxGroupSize) || 12;

    await sql`
      UPDATE tours SET
        category = ${category}::"TourCategory",
        "priceFrom" = ${price},
        "durationText" = ${body.duration || ""},
        "imageUrl" = ${body.image || ""},
        featured = ${body.featured || false},
        active = ${body.active !== false},
        tags = ${tags},
        "departsFrom" = ${body.departsFrom || "Marrakech"},
        "maxGroupSize" = ${maxGroup},
        gallery = ${gallery},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;

    await sql`DELETE FROM tour_translations WHERE "tourId" = ${id}`;
    await sql`
      INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
      VALUES (
        ${randomUUID()}, ${id}, ${"en"},
        ${body.title || ""},
        ${body.desc || ""},
        ${JSON.stringify(body.itinerary || [])},
        ${body.title || ""},
        ${body.desc || ""}
      )
    `;
    if (body.titleFr) {
      await sql`
        INSERT INTO tour_translations (id, "tourId", locale, title, description, itinerary, "metaTitle", "metaDesc")
        VALUES (
          ${randomUUID()}, ${id}, ${"fr"},
          ${body.titleFr || ""},
          ${body.descFr || ""},
          ${JSON.stringify(body.itinerary || [])},
          ${body.titleFr || ""},
          ${body.descFr || ""}
        )
      `;
    }

    await sql`DELETE FROM tour_highlights WHERE "tourId" = ${id}`;
    for (const h of (body.highlights || [])) {
      if (h.trim()) await sql`INSERT INTO tour_highlights (id, "tourId", locale, text) VALUES (${randomUUID()}, ${id}, ${"en"}, ${h.trim()})`;
    }

    await sql`DELETE FROM tour_inclusions WHERE "tourId" = ${id}`;
    for (const item of (body.includes || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"en"}, ${item.trim()}, ${true})`;
    }
    for (const item of (body.excludes || [])) {
      if (item.trim()) await sql`INSERT INTO tour_inclusions (id, "tourId", locale, text, included) VALUES (${randomUUID()}, ${id}, ${"en"}, ${item.trim()}, ${false})`;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[PUT /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to update tour" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  const cookieHeader = req.headers.get("cookie") || "";
  const authed = cookieHeader.includes("admin_auth=true");
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { slug } = params;
  try {
    await sql`DELETE FROM tours WHERE slug = ${slug}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/tours/[slug]]", err);
    return NextResponse.json({ error: "Failed to delete tour" }, { status: 500 });
  }
}
"""

with open(slug_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.rstrip() + "\n" + put_delete

with open(slug_path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: slug route updated with PUT + DELETE")
