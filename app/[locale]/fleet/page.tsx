import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLocale } from 'next-intl';
import Link from 'next/link';

const vehicles = [
  { emoji: '🚗', name: 'Standard Car', capacity: 'Up to 3 passengers', bags: '3 bags', ac: true, wifi: false, desc: 'Comfortable sedan ideal for individuals, couples and small families. Airport transfers and city rides.' },
  { emoji: '🚐', name: 'Minivan', capacity: 'Up to 7 passengers', bags: '7 bags', ac: true, wifi: true, desc: 'Spacious minivan perfect for families and small groups. Ample luggage space for long trips.' },
  { emoji: '🚌', name: 'Minibus', capacity: 'Up to 17 passengers', bags: '17 bags', ac: true, wifi: true, desc: 'Our largest vehicle, ideal for group tours, corporate travel and large family trips across Morocco.' },
];

export default function FleetPage() {
  const locale = useLocale();
  return (
    <>
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
                <div className="w-40 h-40 bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] rounded-2xl flex items-center justify-center text-7xl flex-shrink-0">{v.emoji}</div>
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
