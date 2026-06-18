import { NextRequest, NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { randomUUID } from 'crypto';

function isAuthed(req: NextRequest) {
  return req.cookies.get('admin_auth')?.value === 'true';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';
    const rows = await sql`
      SELECT b.id, b.slug, b."imageUrl" as image, b."createdAt" as created_at,
             bt.title, bt.excerpt, bt.content,
             btfr.title as "titleFr", btfr.excerpt as "excerptFr", btfr.content as "contentFr"
      FROM blogs b
      LEFT JOIN blog_translations bt ON bt."blogId" = b.id AND bt.locale = 'en'
      LEFT JOIN blog_translations btfr ON btfr."blogId" = b.id AND btfr.locale = 'fr'
      WHERE b.status = 'PUBLISHED'
      ORDER BY b."createdAt" DESC
    `;
    const result = rows.map((b: any) => ({
      id: b.id,
      slug: b.slug,
      image: b.image,
      date: new Date(b.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      title: locale === 'fr' && b.titleFr ? b.titleFr : b.title,
      titleFr: b.titleFr,
      excerpt: locale === 'fr' && b.excerptFr ? b.excerptFr : b.excerpt,
      excerptFr: b.excerptFr,
      content: Array.isArray(locale === 'fr' && b.contentFr ? b.contentFr : b.content) ? (locale === 'fr' && b.contentFr ? b.contentFr : b.content) : [],
      contentFr: b.contentFr,
    }));
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const id = randomUUID();
    const slug = body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const contentArray = body.content.split('\n').filter((p: string) => p.trim() !== '');
    const contentArrayFr = body.contentFr ? body.contentFr.split('\n').filter((p: string) => p.trim() !== '') : [];
    await sql`INSERT INTO blogs (id, slug, "imageUrl", status, "createdAt", "updatedAt") VALUES (${id}, ${slug}, ${body.image || ''}, 'PUBLISHED', NOW(), NOW())`;
    await sql`INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES (${randomUUID()}, ${id}, 'en', ${body.title}, ${body.excerpt}, ${contentArray})`;
    if (body.titleFr) {
      await sql`INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES (${randomUUID()}, ${id}, 'fr', ${body.titleFr}, ${body.excerptFr}, ${contentArrayFr})`;
    }
    return NextResponse.json({ id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const body = await req.json();
    const contentArray = body.content.split('\n').filter((p: string) => p.trim() !== '');
    const contentArrayFr = body.contentFr ? body.contentFr.split('\n').filter((p: string) => p.trim() !== '') : [];
    await sql`UPDATE blogs SET "imageUrl"=${body.image || ''}, "updatedAt"=NOW() WHERE id=${body.id}`;
    await sql`DELETE FROM blog_translations WHERE "blogId"=${body.id}`;
    await sql`INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES (${randomUUID()}, ${body.id}, 'en', ${body.title}, ${body.excerpt}, ${contentArray})`;
    if (body.titleFr) {
      await sql`INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES (${randomUUID()}, ${body.id}, 'fr', ${body.titleFr}, ${body.excerptFr}, ${contentArrayFr})`;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const { id } = await req.json();
    await sql`DELETE FROM blog_translations WHERE "blogId"=${id}`;
    await sql`DELETE FROM blogs WHERE id=${id}`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}