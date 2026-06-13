import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLocale } from 'next-intl';
import Link from 'next/link';

const tours = [
  { emoji: '🏜️', title: 'Sahara Desert Circuit', duration: '3 days', from: 'Marrakech', price: 'From €280/person', desc: 'Epic journey through the Draa Valley to the golden dunes of Merzouga. Camel ride and desert camp included.' },
  { emoji: '⛰️', title: 'Atlas Mountains Day Trip', duration: '1 day', from: 'Marrakech', price: 'From €65/person', desc: 'Explore Berber villages, waterfalls and valleys in the High Atlas. Visit Ourika or Imlil.' },
  { emoji: '🌊', title: 'Essaouira Coastal Escape', duration: '1 day', from: 'Marrakech', price: 'From €55/person', desc: 'Visit the windy blue-white medina of Essaouira, UNESCO heritage site on the Atlantic coast.' },
  { emoji: '🕌', title: 'Marrakech City Tour', duration: 'Half day', from: 'Marrakech', price: 'From €40/person', desc: 'Djemaa el-Fna, souks, Bahia Palace and Majorelle Garden with a professional English-speaking guide.' },
  { emoji: '✈️', title: 'Airport Transfer', duration: 'Any time', from: 'RAK / CMN / AGA', price: 'From €25', desc: 'Fixed-price door-to-door airport pickups. Flight tracking, meet & greet. Available 24/7.' },
  { emoji: '🚐', title: 'Inter-City Transfer', duration: 'Flexible', from: 'Any city', price: 'From €80', desc: 'Private comfortable transfer between any two Moroccan cities. Standard car, minivan or minibus.' },
];

export default function ToursPage() {
  const locale = useLocale();
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[#1A1A2E] text-white text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>Our Tours & Transfers</h1>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto">Discover Morocco with our curated excursions and reliable private transfers.</p>
        </section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.map((tour, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden card-hover">
                  <div className="bg-gradient-to-br from-[#FEF3C7] to-[#FDE68A] h-36 flex items-center justify-center text-6xl">{tour.emoji}</div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2 py-1 rounded-full font-medium">{tour.duration}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{tour.from}</span>
                    </div>
                    <h3 className="font-semibold text-xl text-[#1A1A2E] mb-2">{tour.title}</h3>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4">{tour.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#C8960C]">{tour.price}</span>
                      <Link href={`/${locale}/contact`} className="btn-gold !py-2 !px-4 text-sm">Book →</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
