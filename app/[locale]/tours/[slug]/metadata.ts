import { Metadata } from 'next';

const BASE = 'https://elbo-tours.com';

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  try {
    const res = await fetch(`${BASE}/api/tours/${slug}?locale=${locale}`, { cache: 'no-store' });
    if (!res.ok) return {};
    const tour = await res.json();
    const title = `${tour.title} | Elbo Tours`;
    const description = tour.metaDesc || tour.description?.slice(0, 160);
    const image = tour.imageUrl ? `${BASE}${tour.imageUrl}` : `${BASE}/images/og-default.jpg`;
    return {
      title,
      description,
      alternates: {
        canonical: `${BASE}/${locale}/tours/${slug}`,
        languages: { en: `${BASE}/en/tours/${slug}`, fr: `${BASE}/fr/tours/${slug}` },
      },
      openGraph: {
        title,
        description,
        url: `${BASE}/${locale}/tours/${slug}`,
        siteName: 'Elbo Tours',
        images: [{ url: image, width: 1200, height: 630, alt: tour.title }],
        type: 'website',
        locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      },
      twitter: { card: 'summary_large_image', title, description, images: [image] },
    };
  } catch {
    return {};
  }
}