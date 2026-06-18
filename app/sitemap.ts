import { MetadataRoute } from 'next';
import { neon } from '@neondatabase/serverless';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sql = neon(process.env.DATABASE_URL!);
  const base = 'https://elbo-tours.com';
  const locales = ['en', 'fr'];

  // Static pages
  const staticPages = ['', '/tours', '/transfers', '/fleet', '/blog', '/about', '/contact'];
  const staticUrls = staticPages.flatMap(page =>
    locales.map(locale => ({
      url: `${base}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' : 'monthly' as const,
      priority: page === '' ? 1.0 : page === '/tours' ? 0.9 : 0.7,
    }))
  );

  // Tours
  const tours = await sql`SELECT slug, "updatedAt" FROM tours WHERE active = true`;
  const tourUrls = tours.flatMap(t =>
    locales.map(locale => ({
      url: `${base}/${locale}/tours/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }))
  );

  // Transfers
  const transfers = await sql`SELECT slug, "updatedAt" FROM transfers WHERE active = true`;
  const transferUrls = transfers.flatMap(t =>
    locales.map(locale => ({
      url: `${base}/${locale}/transfers/${t.slug}`,
      lastModified: new Date(t.updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  // Blog
  const posts = await sql`SELECT slug, updated_at FROM blog_posts`;
  const blogUrls = posts.flatMap(p =>
    locales.map(locale => ({
      url: `${base}/${locale}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticUrls, ...tourUrls, ...transferUrls, ...blogUrls];
}