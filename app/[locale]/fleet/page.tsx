import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const vehicleImgs = ['/images/fleet/sedan.jpg', '/images/fleet/minivan.jpg', '/images/fleet/minibus.jpg'];
const vehicleEmojis = ['??', '??', '??'];
const vehicleAc = [true, true, true];
const vehicleWifi = [false, true, true];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'Our Fleet | Private Tourist Transport Vehicles in Morocco – Elbo Tours'
    : 'Notre Flotte | Véhicules de Transport Touristique Privé au Maroc – Elbo Tours';
  const description = isEn
    ? 'Explore Elbo Tours modern fleet of air-conditioned vehicles — sedans, minivans and minibuses — for private transfers and tours across Morocco.'
    : 'Découvrez la flotte moderne d\'Elbo Tours — berlines, minivans et minibus climatisés — pour vos transferts privés et circuits à travers le Maroc.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/fleet`,
      languages: { en: 'https://elbo-tours.com/en/fleet', fr: 'https://elbo-tours.com/fr/fleet' },
    },
    openGraph: { title, description, url: `https://elbo-tours.com/${locale}/fleet`, images: ['/images/hero-fleet.jpg'], type: 'website' },
  };
}

export default function FleetPage() {
  const t = useTranslations('fleet');
  const locale = useLocale();
  const vehicles = t.raw('vehicles') as { name: string; capacity: string; bags: string; desc: string }[];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: vehicles.map((v, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Vehicle',
        name: v.name,
        description: v.desc,
        ...(vehicleImgs[i] ? { image: `https://elbo-tours.com${vehicleImgs[i]}` } : {}),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[#1A1A2E] text-white text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('hero_title')}</h1>
          <p className="text-gray-300 mt-4">{t('hero_sub')}</p>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center card-hover">
                {vehicleImgs[i] ? (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={vehicleImgs[i]!}
                      alt={`${v.name} – Elbo Tours`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-2xl flex items-center justify-center text-7xl flex-shrink-0">
                    {vehicleEmojis[i]}
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{v.name}</h2>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    <span className="text-sm text-[#C8960C] font-semibold">?? {v.capacity}</span>
                    <span className="text-sm text-gray-500">?? {v.bags}</span>
                    {vehicleAc[i] && <span className="text-sm text-gray-500">?? A/C</span>}
                    {vehicleWifi[i] && <span className="text-sm text-gray-500">?? WiFi</span>}
                  </div>
                  <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
                <Link href={`/${locale}/contact`} className="btn-gold flex-shrink-0">{t('book_btn')}</Link>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}


