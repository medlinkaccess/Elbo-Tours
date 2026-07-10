import type { Metadata } from 'next';
import TransfersClient from './TransfersClient';
import { TransfersJsonLd } from '@/components/JsonLd';
import { getTransfers } from '@/lib/getTransfers';

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
      canonical: `https://www.elbo-tours.com/${locale}/transfers`,
      languages: { en: 'https://www.elbo-tours.com/en/transfers', fr: 'https://www.elbo-tours.com/fr/transfers' },
    },
    openGraph: {
      title,
      description,
      url: `https://www.elbo-tours.com/${locale}/transfers`,
      type: 'website',
      images: [{ url: 'https://www.elbo-tours.com/images/hero-marrakech-transfer.jpg', width: 1200, height: 630, alt: 'Elbo Tours Private Transfers Morocco' }],
    },
  };
}

export default async function TransfersPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const transfers = await getTransfers(locale);
  const airports = transfers.filter((t) => t.type === 'AIRPORT');
  const cityRoutes = transfers.filter((t) => t.type === 'INTER_CITY');

  return (
    <>
      <TransfersJsonLd transfers={transfers} locale={locale} />
      <TransfersClient initialAirports={airports} initialCityRoutes={cityRoutes} />
    </>
  );
}
