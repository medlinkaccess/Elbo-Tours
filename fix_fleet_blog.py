import os

# --- Fleet [id] route ---
fleet_dir = r"E:\projects\Elbo-Tours\app\api\fleet\[id]"
os.makedirs(fleet_dir, exist_ok=True)

fleet_route = r"E:\projects\Elbo-Tours\app\api\fleet\[id]\route.ts"
with open(fleet_route, "w", encoding="utf-8") as f:
    f.write("""import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    const body = await req.json();
    await sql.query(
      `UPDATE fleet SET price=$1, passengers=$2, bags=$3, image_url=$4, updated_at=NOW() WHERE id=$5`,
      [body.price, body.passengers, body.bags, body.image || '', id]
    );
    await sql.query(`DELETE FROM fleet_translations WHERE fleet_id=$1`, [id]);
    await sql.query(
      `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'en', $3, $4)`,
      [randomUUID(), id, body.name, body.desc || '']
    );
    if (body.nameFr) {
      await sql.query(
        `INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1, $2, 'fr', $3, $4)`,
        [randomUUID(), id, body.nameFr, body.descFr || '']
      );
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/fleet/[id]]', err);
    return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    await sql.query(`DELETE FROM fleet_translations WHERE fleet_id=$1`, [id]);
    await sql.query(`DELETE FROM fleet WHERE id=$1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/fleet/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
  }
}
""")
print("OK: app/api/fleet/[id]/route.ts created")

# --- Blog [id] route ---
blog_dir = r"E:\projects\Elbo-Tours\app\api\blog\[id]"
os.makedirs(blog_dir, exist_ok=True)

blog_route = r"E:\projects\Elbo-Tours\app\api\blog\[id]\route.ts"
with open(blog_route, "w", encoding="utf-8") as f:
    f.write("""import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    const body = await req.json();
    await sql`UPDATE blogs SET "imageUrl"=${body.image || ''}, "updatedAt"=NOW() WHERE id=${id}`;
    await sql`DELETE FROM blog_translations WHERE "blogId"=${id}`;
    await sql`
      INSERT INTO blog_translations (id, "blogId", locale, title, content, excerpt, "metaTitle", "metaDesc")
      VALUES (${randomUUID()}, ${id}, 'en', ${body.title || ''}, ${body.content || ''}, ${body.excerpt || ''}, ${body.title || ''}, ${body.excerpt || ''})
    `;
    if (body.titleFr) {
      await sql`
        INSERT INTO blog_translations (id, "blogId", locale, title, content, excerpt, "metaTitle", "metaDesc")
        VALUES (${randomUUID()}, ${id}, 'fr', ${body.titleFr || ''}, ${body.contentFr || ''}, ${body.excerptFr || ''}, ${body.titleFr || ''}, ${body.excerptFr || ''})
      `;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[PUT /api/blog/[id]]', err);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = params;
  try {
    await sql`DELETE FROM blog_translations WHERE "blogId"=${id}`;
    await sql`DELETE FROM blogs WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[DELETE /api/blog/[id]]', err);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
""")
print("OK: app/api/blog/[id]/route.ts created")
