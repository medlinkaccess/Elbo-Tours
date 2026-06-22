import { MetadataRoute } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sql = neon(process.env.DATABASE_URL!);
  const base = 'https://www.elbo-tours.com';
  const locales = ['en', 'fr'];

  const staticPages = ['', '/tours', '/transfers', '/fleet', '/blog', '/about', '/contact'];
  const staticUrls: MetadataRoute.Sitemap = staticPages.flatMap(page =>
    locales.map(locale => ({
      url: `${base}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: page === '' ? 1.0 : page === '/tours' ? 0.9 : 0.7,
    }))
  );

  const tours = await sql`SELECT slug, "updatedAt" FROM tours WHERE active = true`;
  const tourUrls: MetadataRoute.Sitemap = tours.flatMap((t: any) =>
    locales.map(locale => ({
      url: `${base}/${locale}/tours/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  const transfers = await sql`SELECT slug, "updatedAt" FROM transfers WHERE active = true`;
  const transferUrls: MetadataRoute.Sitemap = transfers.flatMap((t: any) =>
    locales.map(locale => ({
      url: `${base}/${locale}/transfers/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  const posts = await sql`SELECT slug, "updatedAt" FROM blogs WHERE status = 'PUBLISHED'`;
  const blogUrls: MetadataRoute.Sitemap = posts.flatMap((p: any) =>
    locales.map(locale => ({
      url: `${base}/${locale}/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticUrls, ...tourUrls, ...transferUrls, ...blogUrls];
}