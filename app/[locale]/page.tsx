import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import { useLocale } from 'next-intl';

function ServiceIcon({ icon }: { icon: string }) {
  const icons: Record<string, JSX.Element> = {
    plane: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>,
    car: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 6H7L5 12H3v3h2a2 2 0 004 0h6a2 2 0 004 0h2v-5l-3-6h-5z"/></svg>,
    hotel: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0H5m14 0V9a2 2 0 00-2-2h-4a2 2 0 00-2 2v12M9 9h1m4 0h1M9 13h1m4 0h1"/></svg>,
    compass: <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth={1.5}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z"/></svg>,
  };
  return icons[icon] || null;
}

export default function Home() {
  const t = useTranslations();
  const locale = useLocale();
  const stats = t.raw('stats') as Array<{num: string; label: string}>;
  const services = t.raw('services.items') as Array<{icon: string; title: string; desc: string}>;
  const fleet = t.raw('fleet.items') as Array<{name: string; capacity: string}>;
  const whyPoints = t.raw('why.points') as string[];
  const testimonials = t.raw('testimonials.items') as Array<{text: string; name: string; country: string}>;

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{background: 'linear-gradient(135deg, #1A1A2E 0%, #2d1b00 50%, #1A1A2E 100%)'}}>
          {/* Decorative pattern */}
          <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(circle at 25% 25%, #C8960C 0%, transparent 50%), radial-gradient(circle at 75% 75%, #C8440A 0%, transparent 50%)' }}/>
          <div className="absolute inset-0 bg-black/30" />

          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 pt-20">
            <span className="inline-flex items-center gap-2 bg-[#C8960C]/20 border border-[#C8960C]/40 text-[#F0C040] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-8">
              ✦ {t('hero.badge')}
            </span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight" style={{fontFamily: 'var(--font-playfair), Georgia, serif'}}>
              {t('hero.title').split('\n').map((line: string, i: number) => (
                <span key={i}>{line}{i === 0 && <br/>}</span>
              ))}
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="btn-gold text-base px-8 py-4">
                {t('hero.cta')} →
              </Link>
              <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer" className="btn-outline text-base px-8 py-4">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                {t('hero.whatsapp')}
              </a>
            </div>
          </div>

          {/* Stats bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm border-t border-white/20">
            <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold text-[#F0C040]">{s.num}</div>
                  <div className="text-xs text-gray-300 uppercase tracking-wide">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SERVICES */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="section-badge">{t('services.badge')}</span>
              <h2 className="font-display text-4xl font-bold text-[#1A1A2E] gold-underline inline-block" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('services.title')}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-8 card-hover border border-gray-100">
                  <div className="w-14 h-14 bg-[#FEF3C7] rounded-xl flex items-center justify-center mb-5 text-[#C8960C]">
                    <ServiceIcon icon={s.icon} />
                  </div>
                  <h3 className="font-semibold text-[#1A1A2E] text-lg mb-3">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHY US */}
        <section className="py-24 bg-[#1A1A2E]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <span className="section-badge">{t('why.badge')}</span>
                <h2 className="font-display text-4xl font-bold text-white mt-2 mb-8" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('why.title')}</h2>
                <ul className="space-y-4">
                  {whyPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300">
                      <span className="w-6 h-6 rounded-full bg-[#C8960C] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                        </svg>
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <Link href={`/${locale}/contact`} className="btn-gold mt-10 inline-flex">
                  Get a Free Quote →
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Morocco', icon: '🇲🇦' },
                  { label: 'Sahara', icon: '🏜️' },
                  { label: 'Atlas', icon: '⛰️' },
                  { label: 'Coast', icon: '🌊' },
                ].map((d, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="text-4xl mb-3">{d.icon}</div>
                    <div className="text-white font-semibold">{d.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FLEET */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="section-badge">{t('fleet.badge')}</span>
              <h2 className="font-display text-4xl font-bold text-[#1A1A2E]" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('fleet.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {fleet.map((v, i) => (
                <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden card-hover bg-white">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 h-48 flex items-center justify-center">
                    <span className="text-6xl">{i === 0 ? '🚗' : i === 1 ? '🚐' : '🚌'}</span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-[#1A1A2E] mb-1">{v.name}</h3>
                    <p className="text-[#C8960C] text-sm font-medium">{v.capacity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="section-badge">{t('testimonials.badge')}</span>
              <h2 className="font-display text-4xl font-bold text-[#1A1A2E]" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('testimonials.title')}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((r, i) => (
                <div key={i} className="bg-white rounded-2xl p-7 card-hover border border-gray-100">
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, s) => <span key={s} className="text-[#C8960C] text-lg">★</span>)}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{r.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#C8960C] flex items-center justify-center text-white font-bold text-sm">
                      {r.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-sm text-[#1A1A2E]">{r.name}</div>
                      <div className="text-xs text-gray-400">{r.country}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="py-20 bg-[#C8960C]">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="font-display text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>Ready to Explore Morocco?</h2>
            <p className="text-white/80 text-lg mb-8">Book your private transfer or excursion today. Fast confirmation by WhatsApp.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={`/${locale}/contact`} className="bg-white text-[#C8960C] font-bold px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
                Book Now →
              </Link>
              <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 transition-colors inline-flex items-center gap-2">
                WhatsApp Us
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
