'use client';
import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';
import Link from 'next/link';

// FALLBACK DATA (Shown if your Postgres database is empty)
const FALLBACK_ROUTES = [
  { from: 'Marrakech', to: 'Agadir', duration: '2h 45min', distance: '250 km', price: '€90', popular: true },
  { from: 'Marrakech', to: 'Casablanca', duration: '2h 30min', distance: '240 km', price: '€110', popular: true },
  { from: 'Marrakech', to: 'Essaouira', duration: '2h 30min', distance: '190 km', price: '€80', popular: false },
  { from: 'Marrakech', to: 'Fes', duration: '7h', distance: '570 km', price: '€220', popular: false },
  { from: 'Casablanca', to: 'Rabat', duration: '1h', distance: '90 km', price: '€50', popular: true },
  { from: 'Marrakech', to: 'Ouarzazate', duration: '3h', distance: '200 km', price: '€100', popular: false },
  { from: 'Agadir', to: 'Taghazout', duration: '20 min', distance: '19 km', price: '€25', popular: true },
  { from: 'Tangier', to: 'Chefchaouen', duration: '2h', distance: '130 km', price: '€70', popular: false },
];

const FALLBACK_AIRPORTS = [
  { code: 'RAK', city: 'Marrakech Menara', price: 'From €18', popular: true, img: '/images/airports/rak.webp' },
  { code: 'CMN', city: 'Casablanca Mohammed V', price: 'From €30', popular: true, img: '/images/airports/cmn.webp' },
  { code: 'AGA', city: 'Agadir Al Massira', price: 'From €20', popular: true, img: '/images/airports/aga.webp' },
  { code: 'TNG', city: 'Tangier Ibn Battouta', price: 'From €20', popular: false, img: '/images/airports/tng.webp' },
  { code: 'FEZ', city: 'Fes Saïss', price: 'From €25', popular: false, img: '/images/airports/fez.webp' },
  { code: 'NDR', city: 'Nador El Aroui', price: 'From €22', popular: false, img: '/images/airports/ndr.jpg' },
];

export default function TransfersClient() {
  const t = useTranslations('transfers');
  const locale = useLocale();
  const waBase = 'https://wa.me/212665889258?text=';
  const why = t.raw('why') as { icon: string; title: string; desc: string }[];
  const steps = t.raw('steps') as { num: string; title: string; desc: string }[];
  const popular = t('popular');

  const [dbTransfers, setDbTransfers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/transfers?locale=${locale}`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setDbTransfers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [locale]);

  // SMART FILTER: Sorts database entries into Airport vs City-to-City routes automatically
  const dbAirports = dbTransfers.filter(
    item =>
      item.slug.includes('airport') ||
      item.title.toLowerCase().includes('airport') ||
      item.title.toLowerCase().includes('aéroport') ||
      item.title.length < 15
  );

  const dbCityRoutes = dbTransfers.filter(
    item =>
      !item.slug.includes('airport') &&
      !item.title.toLowerCase().includes('airport') &&
      !item.title.toLowerCase().includes('aéroport') &&
      item.title.length >= 15
  );

  // Fallback triggers if database has no entries
  const displayAirports = dbTransfers.length > 0 ? dbAirports : [];
  const displayCityRoutes = dbTransfers.length > 0 ? dbCityRoutes : [];
  const showFallbacks = dbTransfers.length === 0 && !loading;

  return (
    <>
      <Navbar />
      <main className="pt-20">

        {/* HERO */}
        <section className="relative py-24 bg-[#1A1A2E] overflow-hidden">
          <div className="absolute inset-0 opacity-15" style={{backgroundImage:'radial-gradient(circle at 30% 50%, #C8960C 0%, transparent 55%), radial-gradient(circle at 70% 30%, #1e40af 0%, transparent 55%)'}} />
          <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
            <span className="inline-flex items-center gap-2 bg-[#C8960C]/20 border border-[#C8960C]/40 text-[#F0C040] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              ✈️ {t('badge')}
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>
              {t('hero_title')}
            </h1>
            <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10">{t('hero_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="btn-gold px-8 py-4 text-base">{t('quote_btn')} →</Link>
              <a href={`${waBase}${encodeURIComponent('Hi! I need a private transfer in Morocco.')}`}
                target="_blank" rel="noopener noreferrer" className="btn-outline px-8 py-4 text-base">
                💬 {t('whatsapp_btn')}
              </a>
            </div>
          </div>
        </section>

        {/* WHY BOOK */}
        <section className="py-16 bg-white border-b border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {why.map((item, i) => (
                <div key={i} className="text-center p-6 rounded-2xl bg-gray-50 hover:bg-[#FEF3C7]/50 transition-colors">
                  <div className="text-4xl mb-3">{item.icon}</div>
                  <h3 className="font-bold text-[#1A1A2E] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="section-badge">{t('how_badge')}</span>
              <h2 className="font-display text-3xl font-bold text-[#1A1A2E] mt-2" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('how_title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={i} className="relative">
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-px bg-[#C8960C]/30 z-0" style={{width:'calc(100% - 2rem)'}} />
                  )}
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-[#C8960C] text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-lg">{step.num}</div>
                    <h3 className="font-semibold text-[#1A1A2E] mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* AIRPORT TRANSFERS */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="section-badge">✈️ {t('airport_badge')}</span>
              <h2 className="font-display text-3xl font-bold text-[#1A1A2E] mt-2" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('airport_title')}</h2>
              <p className="text-gray-500 mt-3 max-w-lg mx-auto">{t('airport_sub')}</p>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading transfers...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* 1. Show Database Airport Transfers */}
                {displayAirports.map((airport, i) => {
                  const msg = encodeURIComponent(`Hi! I need an airport transfer: ${airport.title}.`);
                  return (
                    <div key={i} className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-[#C8960C] hover:shadow-lg transition-all duration-200 relative bg-white">
                      <div className="relative h-36 overflow-hidden">
                        <img src={airport.image || '/images/logo.png'} alt={airport.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <div className="font-bold text-xl text-white">{airport.title}</div>
                          <div className="text-xs text-white/80">⏱️ {airport.duration}</div>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">{t('per_vehicle')}</span>
                          <span className="font-bold text-[#C8960C] text-lg">{airport.priceFrom > 0 ? `From €${airport.priceFrom}` : "Ask for price"}</span>
                        </div>
                        <div className="flex gap-2">
                          <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                            💬 WhatsApp
                          </a>
                          <Link href={`/${locale}/contact`}
                            className="flex-1 bg-[#C8960C] hover:bg-[#b07e08] text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                            {t('book_now')} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Show Fallback Airport Transfers if database is empty */}
                {showFallbacks && FALLBACK_AIRPORTS.map((airport, i) => {
                  const msg = encodeURIComponent(`Hi! I need an airport transfer at ${airport.city} (${airport.code}).`);
                  return (
                    <div key={i} className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-[#C8960C] hover:shadow-lg transition-all duration-200 relative bg-white">
                      <div className="relative h-36 overflow-hidden">
                        <img src={airport.img} alt={airport.city} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-4">
                          <div className="font-bold text-2xl text-white">{airport.code}</div>
                          <div className="text-xs text-white/80">{airport.city}</div>
                        </div>
                        {airport.popular && (
                          <span className="absolute top-3 right-3 bg-[#C8960C] text-white text-xs font-bold px-2.5 py-0.5 rounded-full">{popular}</span>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs text-gray-400">{t('per_vehicle')}</span>
                          <span className="font-bold text-[#C8960C] text-lg">{airport.price}</span>
                        </div>
                        <div className="flex gap-2">
                          <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                            💬 WhatsApp
                          </a>
                          <Link href={`/${locale}/contact`}
                            className="flex-1 bg-[#C8960C] hover:bg-[#b07e08] text-white text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                            {t('book_now')} →
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CITY TO CITY */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <span className="section-badge">🚐 {t('city_badge')}</span>
              <h2 className="font-display text-3xl font-bold text-[#1A1A2E] mt-2" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('city_title')}</h2>
              <p className="text-gray-500 mt-3">{t('city_sub')}</p>
            </div>

            {loading ? (
              <div className="text-center py-10 text-gray-400">Loading routes...</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 1. Show Database City to City Transfers */}
                {displayCityRoutes.map((route, i) => {
                  const msg = encodeURIComponent(`Hi! I need a transfer: ${route.title}.`);
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#C8960C] hover:shadow-md transition-all duration-200 relative flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-[#1A1A2E] text-base mb-2 text-center">{route.title}</div>
                        <div className="flex justify-between text-xs text-gray-400 mb-4">
                          <span>⏱ {route.duration}</span>
                          <span>📍 {route.from_location}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-bold text-[#C8960C] text-xl mb-4">{route.priceFrom > 0 ? `From €${route.priceFrom}` : "Ask for price"}</div>
                        <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"
                          className="w-full block bg-[#C8960C] hover:bg-[#F0C040] text-white hover:text-[#1A1A2E] text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                          {t('book_route')}
                        </a>
                      </div>
                    </div>
                  );
                })}

                {/* 2. Show Fallback City to City Transfers if database is empty */}
                {showFallbacks && FALLBACK_ROUTES.map((route, i) => {
                  const msg = encodeURIComponent(`Hi! I need a transfer from ${route.from} to ${route.to}.`);
                  return (
                    <div key={i} className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#C8960C] hover:shadow-md transition-all duration-200 relative flex flex-col justify-between">
                      {route.popular && (
                        <span className="absolute -top-2.5 right-4 bg-[#1A1A2E] text-[#F0C040] text-xs font-bold px-2.5 py-0.5 rounded-full">{popular}</span>
                      )}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="font-bold text-[#1A1A2E]">{route.from}</div>
                          <div className="text-[#C8960C] font-bold text-lg px-2">→</div>
                          <div className="font-bold text-[#1A1A2E]">{route.to}</div>
                        </div>
                        <div className="flex justify-between text-xs text-gray-400 mb-4">
                          <span>⏱ {route.duration}</span>
                          <span>📍 {route.distance}</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-center font-bold text-[#C8960C] text-xl mb-4">{route.price}</div>
                        <a href={`https://wa.me/212665889258?text=${msg}`} target="_blank" rel="noopener noreferrer"
                          className="w-full block bg-[#C8960C] hover:bg-[#F0C040] text-white hover:text-[#1A1A2E] text-sm font-semibold py-2 rounded-lg text-center transition-colors">
                          {t('book_route')}
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <p className="text-center text-sm text-gray-400 mt-8">
              <a href={`${waBase}${encodeURIComponent('Hi! I need a custom transfer route.')}`} target="_blank" rel="noopener noreferrer" className="text-[#C8960C] underline">
                {t('custom_route')}
              </a>
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-[#C8960C]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('cta_title')}</h2>
            <p className="text-white/80 text-lg mb-8">{t('cta_sub')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="bg-white text-[#C8960C] font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                {t('book_now')} →
              </Link>
              <a href={`${waBase}${encodeURIComponent('Hi! I want to book a transfer.')}`} target="_blank" rel="noopener noreferrer"
                className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                💬 {t('whatsapp')}
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
