import { NextRequest, NextResponse } from 'next/server';
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
