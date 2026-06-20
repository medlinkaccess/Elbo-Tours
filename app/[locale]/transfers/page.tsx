import type { Metadata } from 'next';
import TransfersClient from './TransfersClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'Private Transfers in Morocco | Airport & City-to-City | Elbo Tours'
    : 'Transferts Privés au Maroc | Aéroport & Ville à Ville | Elbo Tours';
  const description = isEn
    ? 'Book private airport transfers and city-to-city routes across Morocco. Marrakech, Casablanca, Agadir, Fes and more. Fixed prices, professional drivers.'
    : 'Réservez vos transferts privés aéroport et trajets ville à ville au Maroc. Marrakech, Casablanca, Agadir, Fès et plus. Prix fixes, chauffeurs professionnels.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/transfers`,
      languages: { en: 'https://elbo-tours.com/en/transfers', fr: 'https://elbo-tours.com/fr/transfers' },
    },
    openGraph: {
      title,
      description,
      url: `https://elbo-tours.com/${locale}/transfers`,
      type: 'website',
      images: [{ url: 'https://elbo-tours.com/images/hero-marrakech-transfer.jpg', width: 1200, height: 630, alt: 'Elbo Tours Private Transfers Morocco' }],
    },
  };
}

export default function TransfersPage() {
  return <TransfersClient />;
}
