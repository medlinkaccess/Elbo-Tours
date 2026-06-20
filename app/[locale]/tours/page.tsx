import type { Metadata } from 'next';
import ToursClient from './ToursClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'Morocco Tours & Excursions | Desert, City & Custom Tours | Elbo Tours'
    : 'Circuits et Excursions au Maroc | Désert, Ville & Sur-Mesure | Elbo Tours';
  const description = isEn
    ? 'Browse private Morocco tours: Sahara desert trips, city excursions, multi-day itineraries and custom tours. Book your Morocco adventure with Elbo Tours.'
    : 'Découvrez nos circuits privés au Maroc : désert du Sahara, excursions en ville, itinéraires multi-jours et circuits sur-mesure avec Elbo Tours.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/tours`,
      languages: { en: 'https://elbo-tours.com/en/tours', fr: 'https://elbo-tours.com/fr/tours' },
    },
    openGraph: {
      title,
      description,
      url: `https://elbo-tours.com/${locale}/tours`,
      type: 'website',
      images: [{ url: 'https://elbo-tours.com/images/hero-desert.jpg', width: 1200, height: 630, alt: 'Elbo Tours Morocco Excursions' }],
    },
  };
}

export default function ToursPage() {
  return <ToursClient />;
}
