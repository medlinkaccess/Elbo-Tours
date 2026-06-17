'use client';
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';

const CATEGORIES = [
  'All',
  'Day Trips',
  'Desert Tours',
  'City Tours',
  'Multi-day Tours',
  'Airport Transfers',
  'Custom/Private Tours',
];

const CATEGORY_ICONS: Record<string, string> = {
  'All': '🗺️',
  'Day Trips': '☀️',
  'Desert Tours': '🏜️',
  'City Tours': '🏙️',
  'Multi-day Tours': '🌍',
  'Airport Transfers': '✈️',
  'Custom/Private Tours': '🚐',
};

// Fallback gradient colors per category
const CATEGORY_GRADIENTS: Record<string, string> = {
  'Day Trips': 'from-amber-100 to-orange-100',
  'Desert Tours': '🏜️',
  'City Tours': 'from-blue-100 to-indigo-100',
  'Multi-day Tours': 'from-emerald-100 to-teal-100',
  'Airport Transfers': 'from-sky-100 to-blue-100',
  'Custom/Private Tours': 'from-purple-100 to-pink-100',
};

const CATEGORY_EMOJI: Record<string, string> = {
  'Day Trips': '☀️',
  'Desert Tours': '🏜️',
  'City Tours': '🏙️',
  'Multi-day Tours': '🌍',
  'Airport Transfers': '✈️',
  'Custom/Private Tours': '🚐',
};

interface Tour {
  id: string;
  title: string;
  titleFr?: string;
  category: string;
  duration: string;
  from: string;
  price: string;
  desc: string;
  descFr?: string;
  image?: string;
  featured?: boolean;
}

export default function ToursPage() {
  const locale = useLocale();
  const [tours, setTours] = useState<Tour[]>([]);
  const [active, setActive] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/tours?locale=${locale}`)
      .then(r => r.json())
      .then(data => { setTours(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = active === 'All' ? tours : tours.filter(t => t.category === active);

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* HERO BANNER */}
        <section className="relative py-20 bg-[#1A1A2E] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #C8960C 0%, transparent 60%), radial-gradient(circle at 80% 50%, #C8440A 0%, transparent 60%)'}} />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <span className="inline-flex items-center gap-2 bg-[#C8960C]/20 border border-[#C8960C]/40 text-[#F0C040] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              🗺️ Explore Morocco
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>
              Tours & Excursions
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Hand-picked experiences across Morocco â€” from desert adventures to city discoveries and seamless transfers.
            </p>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="sticky top-20 z-30 bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-4 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active === cat
                      ? 'bg-[#C8960C] text-white shadow-md scale-105'
                      : 'bg-gray-100 text-gray-600 hover:bg-[#FEF3C7] hover:text-[#92400E]'
                  }`}
                >
                  <span>{CATEGORY_ICONS[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* TOURS GRID */}
        <section className="py-16 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-6 bg-gray-200 rounded w-2/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No tours in this category yet</h3>
                <p className="text-gray-400">Check back soon or <Link href={`/${locale}/contact`} className="text-[#C8960C] underline">contact us</Link> for a custom itinerary.</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-400 mb-8 font-medium">{filtered.length} {filtered.length === 1 ? 'tour' : 'tours'} {active !== 'All' ? `in ${active}` : 'available'}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filtered.map(tour => (
                    <TourCard key={tour.id} tour={tour} locale={locale} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA STRIP */}
        <section className="py-16 bg-[#1A1A2E]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-3" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-400 mb-8">We create custom itineraries for any group size. Just tell us your dream trip.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="btn-gold px-8 py-4 text-base">
                Request Custom Tour â†’
              </Link>
              <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer"
                className="btn-outline px-8 py-4 text-base">
                💬 WhatsApp Us
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

function TourCard({ tour, locale }: { tour: Tour; locale: string }) {
  const title = locale === 'fr' && tour.titleFr ? tour.titleFr : tour.title;
  const desc = locale === 'fr' && tour.descFr ? tour.descFr : tour.desc;
  const gradient = CATEGORY_GRADIENTS[tour.category] || 'from-gray-100 to-gray-200';
  const emoji = CATEGORY_EMOJI[tour.category] || '🗺️';

  const waMsg = encodeURIComponent(`Hi! I'm interested in: ${tour.title} (${tour.price}). Can you give me more info?`);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover flex flex-col">
      {/* Image or gradient placeholder */}
      <div className="relative h-52 overflow-hidden">
        {tour.image ? (
          <img src={tour.image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-7xl opacity-60">{emoji}</span>
          </div>
        )}
        {tour.featured && (
          <span className="absolute top-3 left-3 bg-[#C8960C] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            â­ Featured
          </span>
        )}
        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1A1A2E] text-xs font-semibold px-2.5 py-1 rounded-full">
          {tour.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex gap-2 mb-3 flex-wrap">
          <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 rounded-full font-medium">
            🕐 {tour.duration}
          </span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            📍 {tour.from}
          </span>
        </div>

        <h3 className="font-semibold text-xl text-[#1A1A2E] mb-2 leading-snug">{title}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">{desc}</p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-400 block">Starting from</span>
            <span className="font-bold text-[#C8960C] text-lg">{tour.price}</span>
          </div>
          <div className="flex gap-2">
            <a
              href={`https://wa.me/212665889258?text=${waMsg}`}
              target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center transition-colors"
              title="WhatsApp"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            <Link href={`/${locale}/tours/${tour.id}`} className="btn-gold !py-2 !px-4 text-sm">
              View â†’
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}





