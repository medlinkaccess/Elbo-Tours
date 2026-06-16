import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import type { Metadata } from 'next';

const vehicles = [
  { emoji: '🚗', img: null, name: 'Standard Car', capacity: 'Up to 3 passengers', seats: 3, bags: '3 bags', ac: true, wifi: false, desc: 'Comfortable sedan ideal for individuals, couples and small families. Airport transfers and city rides.' },
  { emoji: '🚐', img: '/images/fleet/minivan.jpg', name: 'Minivan', capacity: 'Up to 7 passengers', seats: 7, bags: '7 bags', ac: true, wifi: true, desc: 'Spacious, modern minivan perfect for families and small groups touring Morocco. Air-conditioned, generous luggage space, and a smooth ride for long desert or mountain routes.' },
  { emoji: '🚌', img: null, name: 'Minibus', capacity: 'Up to 17 passengers', seats: 17, bags: '17 bags', ac: true, wifi: true, desc: 'Our largest vehicle, ideal for group tours, corporate travel and large family trips across Morocco.' },
];

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const title = 'Our Fleet | Private Tourist Transport Vehicles in Morocco - Elbo Tours';
  const description = 'Explore Elbo Tours\u2019 modern fleet of air-conditioned vehicles \u2014 sedans, minivans and minibuses \u2014 for private transfers and tours across Morocco. Comfortable, safe, and ready for any group size.';

  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/fleet`,
      languages: {
        en: 'https://elbo-tours.com/en/fleet',
        fr: 'https://elbo-tours.com/fr/fleet',
      },
    },
    openGraph: {
      title,
      description,
      url: `https://elbo-tours.com/${locale}/fleet`,
      images: ['/images/hero-fleet.jpg'],
      type: 'website',
    },
  };
}

export default function FleetPage() {
  const locale = useLocale();

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
        vehicleSeatingCapacity: v.seats,
        ...(v.img ? { image: `https://elbo-tours.com${v.img}` } : {}),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[#1A1A2E] text-white text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>Our Fleet</h1>
          <p className="text-gray-300 mt-4">Modern, air-conditioned vehicles for every group size.</p>
        </section>
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {vehicles.map((v, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-8 flex flex-col md:flex-row gap-8 items-center card-hover">
                {v.img ? (
                  <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden flex-shrink-0 relative">
                    <Image
                      src={v.img}
                      alt={`${v.name} - Elbo Tours private transport vehicle in Morocco`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-40 h-40 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-2xl flex items-center justify-center text-7xl flex-shrink-0">{v.emoji}</div>
                )}
                <div className="flex-1">
                  <h2 className="font-display text-2xl font-bold text-[#1A1A2E] mb-1" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{v.name}</h2>
                  <div className="flex gap-3 mb-3 flex-wrap">
                    <span className="text-sm text-[#C8960C] font-semibold">👥 {v.capacity}</span>
                    <span className="text-sm text-gray-500">🧳 {v.bags}</span>
                    {v.ac && <span className="text-sm text-gray-500">❄️ A/C</span>}
                    {v.wifi && <span className="text-sm text-gray-500">📶 WiFi</span>}
                  </div>
                  <p className="text-gray-500 leading-relaxed">{v.desc}</p>
                </div>
                <Link href={`/${locale}/contact`} className="btn-gold flex-shrink-0">Book →</Link>
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