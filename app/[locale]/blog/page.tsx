import type { Metadata } from 'next';
import BlogClient from './BlogClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'Morocco Travel Blog | Tips, Guides & Itineraries | Elbo Tours'
    : 'Blog Voyage Maroc | Conseils, Guides et Itinéraires | Elbo Tours';
  const description = isEn
    ? 'Expert Morocco travel guides: best time to visit, desert tours, airport transfers, safety tips and cultural etiquette — written by local experts.'
    : 'Guides de voyage au Maroc par des experts locaux : meilleure période, circuits désert, transferts aéroport, sécurité et étiquette culturelle.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/blog`,
      languages: { en: 'https://elbo-tours.com/en/blog', fr: 'https://elbo-tours.com/fr/blog' },
    },
    openGraph: {
      title,
      description,
      url: `https://elbo-tours.com/${locale}/blog`,
      type: 'website',
      images: [{ url: 'https://elbo-tours.com/images/hero-sahara.jpg', width: 1200, height: 630, alt: 'Elbo Tours Morocco Travel Blog' }],
    },
  };
}

export default function BlogPage() {
  return <BlogClient />;
}
