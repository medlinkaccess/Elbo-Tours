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

    const rows = await sql.query(
      `SELECT b.id, b.slug, b.category, b.image_url as image, b.created_at,
              bt.title, bt.excerpt, bt.content,
              btfr.title as "titleFr", btfr.excerpt as "excerptFr", btfr.content as "contentFr"
       FROM blog_posts b
       LEFT JOIN blog_translations bt ON bt.blog_id = b.id AND bt.locale = 'en'
       LEFT JOIN blog_translations btfr ON btfr.blog_id = b.id AND btfr.locale = 'fr'
       ORDER BY b.created_at DESC`
    );

    const result = rows.map((b: any) => ({
      id: b.id,
      slug: b.slug,
      category: b.category,
      image: b.image,
      date: new Date(b.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
      title: locale === 'fr' && b.titleFr ? b.titleFr : b.title,
      titleFr: b.titleFr,
      excerpt: locale === 'fr' && b.excerptFr ? b.excerptFr : b.excerpt,
      excerptFr: b.excerptFr,
      content: locale === 'fr' && b.contentFr ? b.contentFr : b.content,
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

    await sql.query(
      `INSERT INTO blog_posts (id, slug, image_url, category)
       VALUES ($1, $2, $3, $4)`,
      [id, slug, body.image || '', body.category]
    );

    await sql.query(
      `INSERT INTO blog_translations (id, blog_id, locale, title, excerpt, content)
       VALUES ($1, $2, 'en', $3, $4, $5)`,
      [randomUUID(), id, body.title, body.excerpt, contentArray]
    );

    if (body.titleFr) {
      await sql.query(
        `INSERT INTO blog_translations (id, blog_id, locale, title, excerpt, content)
         VALUES ($1, $2, 'fr', $3, $4, $5)`,
        [randomUUID(), id, body.titleFr, body.excerptFr, contentArrayFr]
      );
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

    await sql.query(
      `UPDATE blog_posts SET image_url=$1, category=$2, updated_at=NOW() WHERE id=$3`,
      [body.image || '', body.category, body.id]
    );

    await sql.query(`DELETE FROM blog_translations WHERE blog_id=$1`, [body.id]);
    await sql.query(
      `INSERT INTO blog_translations (id, blog_id, locale, title, excerpt, content) VALUES ($1, $2, 'en', $3, $4, $5)`,
      [randomUUID(), body.id, body.title, body.excerpt, contentArray]
    );
    if (body.titleFr) {
      await sql.query(
        `INSERT INTO blog_translations (id, blog_id, locale, title, excerpt, content) VALUES ($1, $2, 'fr', $3, $4, $5)`,
        [randomUUID(), body.id, body.titleFr, body.excerptFr, contentArrayFr]
      );
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
    await sql.query(`DELETE FROM blog_posts WHERE id=$1`, [id]);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}