'use client';

import { useTranslations } from 'next-intl';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { useState, useEffect } from 'react';

// ─── Tour type icons ──────────────────────────────────────────────────────────
const TOUR_TYPES = [
  { label: 'Desert', img: '/images/types/type-desert.jpg', href: '/tours?type=desert' },
  { label: 'Culture', img: '/images/types/type-culture.jpg', href: '/tours?type=culture' },
  { label: 'Adventure', img: '/images/types/type-adventure.jpg', href: '/tours?type=adventure' },
  { label: 'Nature', img: '/images/types/type-nature.jpg', href: '/tours?type=nature' },
  { label: 'Luxury', img: '/images/types/type-luxury.jpg', href: '/tours?type=luxury' },
  { label: 'Family', img: '/images/types/type-family.jpg', href: '/tours?type=family' },
  { label: '4×4 & Moto', img: '/images/types/type-4x4.jpg', href: '/tours?type=4x4' },
  { label: 'Birdwatch', img: '/images/types/type-birdwatch.jpg', href: '/tours?type=birdwatch' },
  { label: 'Yoga', img: '/images/types/type-yoga.jpg', href: '/tours?type=yoga' },
  { label: 'City Break', img: '/images/types/type-city.jpg', href: '/tours?type=city' },
];

// ─── Hero slides ──────────────────────────────────────────────────────────────
const SLIDES_DATA = [
  { bg: 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(/images/hero-essence.jpg) center/cover no-repeat', accent: '#C8960C', href: '/tours' },
  { bg: 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(/images/hero-sahara.jpg) center/cover no-repeat', accent: '#5aaa5a', href: '/tours?type=desert' },
  { bg: 'linear-gradient(rgba(0,0,0,0.45),rgba(0,0,0,0.45)), url(/images/hero-cities.jpg) center/cover no-repeat', accent: '#C8440A', href: '/tours?type=culture' },
];

// ─── Featured tours ───────────────────────────────────────────────────────────
const FEATURED_TOURS = [
  { img: "/images/tours/tour-grand-morocco.jpg", days: "10-14 days", title: "Grand Morocco Tour", desc: "The ultimate Moroccan experience: golden Sahara dunes, the blue medinas of Fes and Chefchaouen, snow-capped Atlas peaks, ancient imperial cities, and the windswept Atlantic coast of Essaouira all in one private journey.", tags: ["Family", "Luxury", "Desert", "Culture"], href: "/tours/grand-morocco" },
  { img: "/images/tours/tour-great-south.jpg", days: "7-11 days", title: "The Great South", desc: "Cross the High Atlas via Tizi n Tichka, explore the UNESCO kasbah of Ait Ben Haddou, wind through the Valley of a Thousand Kasbahs, and arrive at the towering dunes of Merzouga for a camel trek under the Saharan stars.", tags: ["Adventure", "Desert", "Nature"], href: "/tours/great-south" },
  { img: "/images/tours/tour-marrakech-fes.jpg", days: "3-6 days", title: "Marrakech to Fes via Desert", desc: "Cross the Atlas mountains, discover the timeless kasbah of Ait Ben Haddou, traverse the Ziz palm valley, and reach the golden Sahara dunes before arriving in the ancient medina of Fes.", tags: ["Adventure", "Culture", "Desert"], href: "/tours/marrakech-fes" },
  { img: "/images/tours/tour-north-morocco.jpg", days: "7-10 days", title: "North Morocco Tour", desc: "Discover the indigo-blue streets of Chefchaouen in the Rif mountains, the Roman glory of Volubilis, the white-washed port of Asilah, and the timeless souks of Fes and Meknes.", tags: ["Culture", "Nature", "Adventure"], href: "/tours/north-morocco" },
  { img: "/images/tours/tour-imperial-cities.jpg", days: "6-9 days", title: "Imperial Cities Tour", desc: "Walk in the footsteps of sultans across Morocco four royal capitals: the spiritual depth of Fes, the Roman ruins of Meknes and Volubilis, the energy of Casablanca and Rabat, and the rose-red magic of Marrakech.", tags: ["Culture", "History", "Luxury"], href: "/tours/imperial-cities" },
  { img: "/images/tours/tour-atlas-nature.jpg", days: "2-3 days", title: "Atlas and Waterfalls Escape", desc: "Visit the spectacular three-tiered Ouzoud Falls, the highest in North Africa. Swim in emerald pools, spot Barbary macaques, and lunch riverside in a Berber village with the Atlas mountains as your backdrop.", tags: ["Nature", "Adventure", "Family"], href: "/tours/atlas-waterfalls" },
  { img: "/images/tours/tour-ourika-valley.jpg", days: "1-2 days", title: "Ourika Valley Day Trip", desc: "Just 30 minutes from Marrakech, the Ourika Valley opens into a lush Berber world of rushing rivers, terraced saffron fields, and family-run mountain restaurants perched above turquoise water.", tags: ["Nature", "Culture", "Family"], href: "/tours/ourika-valley" },
  { img: "/images/tours/tour-4x4-adventure.jpg", days: "1-3 days", title: "Quad and Buggy Desert Adventure", desc: "Tear across the volcanic plains of the Agafay Desert in a powerful buggy or quad bike. Raw lunar landscape as far as the eye can see. Combine with a sunset camel ride and dinner under the stars.", tags: ["Adventure", "4x4", "Family"], href: "/tours/quad-buggy" },
  { img: "/images/tours/tour-essaouira.jpg", days: "2-3 days", title: "Essaouira Atlantic Escape", desc: "A UNESCO-listed medina of blue-and-white alleys, Portuguese ramparts with ancient cannons, a buzzing fish market, and one of Africa finest kitesurfing beaches. A soulful contrast to the desert heat.", tags: ["Culture", "Nature", "Luxury"], href: "/tours/essaouira" },
];

// ─── Stats ────────────────────────────────────────────────────────────────────
const STATS_NUMS = ['20+', '24', '7', '1'];

// ─── Why us ───────────────────────────────────────────────────────────────────
// WHY_US loaded from translations

// ─── Testimonials ─────────────────────────────────────────────────────────────
// TESTIMONIALS loaded from translations

// ─── Departure cities ─────────────────────────────────────────────────────────
const CITIES = [
  { name: 'Marrakech', count: 16 },
  { name: 'Casablanca', count: 15 },
  { name: 'Rabat', count: 12 },
  { name: 'Tangier', count: 10 },
  { name: 'Fès', count: 8 },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function Home() {
  const locale = useLocale();
  const t = useTranslations();
  const t2 = t;
  const [slide, setSlide] = useState(0);

  const slides = SLIDES_DATA.map((sd, i) => ({
    ...sd,
    headline: t(`hero.slides.${i}.headline`),
    sub: t(`hero.slides.${i}.sub`),
    cta: { label: t(`hero.slides.${i}.cta`), href: sd.href },
  }));

  const stats = STATS_NUMS.map((num, i) => ({ num, label: t(`stats.${i}.label`) }));

  const WHY_US = Array.from({length: 6}, (_, i) => ({
    title: t(`why.items.${i}.title`),
    body: t(`why.items.${i}.body`),
  }));

  const TESTIMONIALS = Array.from({length: 3}, (_, i) => ({
    name: t(`testimonials.items.${i}.name`),
    country: t(`testimonials.items.${i}.country`),
    tour: t(`testimonials.items.${i}.tour`),
    text: t(`testimonials.items.${i}.text`),
  }));

  const FEATURED_TOURS_I18N = FEATURED_TOURS.map((tour, i) => ({
    ...tour,
    days: t(`featured.tours.${i}.days`),
    title: t(`featured.tours.${i}.title`),
    desc: t(`featured.tours.${i}.desc`),
    tags: JSON.parse(t(`featured.tours.${i}.tags`)),
  }));

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const s = slides[slide];

  return (
    <>
      <style>{`
        /* ── tokens ── */
        :root {
          --gold: #C8960C;
          --gold-light: #F0C040;
          --rust: #C8440A;
          --sand: #F5EDD6;
          --dark: #1A1A2E;
          --ink: #1a0d00;
        }

        /* ── hero ── */
        .hero-section {
          position: relative;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: background 1.2s ease;
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0.45);
        }
        .hero-content {
          position: relative; z-index: 10;
          text-align: center;
          padding: 6rem 1.5rem 10rem;
          max-width: 860px;
          margin: 0 auto;
        }
        .hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(200,150,12,0.18);
          border: 1px solid rgba(200,150,12,0.4);
          color: #F0C040;
          font-size: 0.7rem; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          padding: 0.4rem 1.2rem; border-radius: 999px; margin-bottom: 1.5rem;
        }
        .hero-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(2.4rem, 6vw, 4.5rem);
          font-weight: 700; color: #fff;
          line-height: 1.1; margin-bottom: 1rem;
          white-space: pre-line;
        }
        .hero-title span { color: var(--gold-light); }
        .hero-sub {
          font-size: 1.1rem; color: rgba(255,255,255,0.75);
          margin-bottom: 2.5rem;
        }
        .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }

        /* ── slide dots ── */
        .slide-dots {
          position: absolute; bottom: 5.5rem; left: 0; right: 0;
          display: flex; justify-content: center; gap: 8px; z-index: 10;
        }
        .slide-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: rgba(255,255,255,0.35); border: none; cursor: pointer; padding: 0;
          transition: all .3s;
        }
        .slide-dot.active { background: var(--gold-light); transform: scale(1.4); }

        /* ── stats bar ── */
        .stats-bar {
          position: absolute; bottom: 0; left: 0; right: 0;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(8px);
          border-top: 1px solid rgba(255,255,255,0.15);
          display: grid; grid-template-columns: repeat(4,1fr);
          text-align: center; padding: 1.25rem 0; z-index: 10;
        }
        .stat-num { font-size: 1.6rem; font-weight: 800; color: var(--gold-light); }
        .stat-label { font-size: 0.65rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: .08em; }

        /* ── buttons ── */
        .btn-gold {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--gold); color: #fff;
          font-weight: 700; font-size: 0.9rem;
          padding: 0.85rem 2rem; border-radius: 8px;
          text-decoration: none; border: none; cursor: pointer;
          transition: background .2s, transform .15s;
        }
        .btn-gold:hover { background: #b07e08; transform: translateY(-1px); }
        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent; color: #fff;
          font-weight: 700; font-size: 0.9rem;
          padding: 0.85rem 2rem; border-radius: 8px;
          text-decoration: none; border: 2px solid rgba(255,255,255,0.5);
          transition: border-color .2s, background .2s;
        }
        .btn-outline:hover { border-color: #fff; background: rgba(255,255,255,0.08); }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 6px;
          background: transparent; color: var(--gold);
          font-weight: 700; font-size: 0.85rem;
          padding: 0.7rem 1.6rem; border-radius: 8px;
          text-decoration: none; border: 2px solid var(--gold);
          transition: all .2s;
        }
        .btn-ghost:hover { background: var(--gold); color: #fff; }

        /* ── section shells ── */
        .section { padding: 5rem 1.5rem; }
        .section-sand { background: var(--sand); }
        .section-dark { background: var(--dark); }
        .section-white { background: #fff; }
        .container { max-width: 1200px; margin: 0 auto; }

        /* ── section header ── */
        .sec-eyebrow {
          display: inline-block;
          background: rgba(200,150,12,0.12);
          color: var(--gold); font-size: 0.68rem; font-weight: 700;
          letter-spacing: .14em; text-transform: uppercase;
          padding: 0.3rem 1rem; border-radius: 999px; margin-bottom: 0.75rem;
        }
        .sec-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 700; color: var(--ink);
          margin-bottom: 0.75rem; line-height: 1.2;
        }
        .sec-title-light { color: #fff; }
        .sec-body { color: #666; max-width: 640px; line-height: 1.7; }
        .text-center { text-align: center; }
        .mx-auto { margin-left: auto; margin-right: auto; }

        /* ── tour type grid ── */
        .type-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1rem; margin-top: 2rem;
        }
        @media(max-width:768px){ .type-grid { grid-template-columns: repeat(3,1fr); } }
        @media(max-width:480px){ .type-grid { grid-template-columns: repeat(2,1fr); } }
        .type-card {
          display: flex; flex-direction: column; align-items: center;
          background: #fff; border: 1px solid #e8e0d0;
          border-radius: 12px; overflow: hidden;
          text-decoration: none; color: var(--ink);
          transition: box-shadow .2s, transform .15s, border-color .2s;
          cursor: pointer;
        }
        .type-card:hover { box-shadow: 0 6px 24px rgba(200,150,12,0.18); transform: translateY(-2px); border-color: var(--gold); }
        .type-img { width: 100%; height: 90px; object-fit: cover; display: block; }
        .type-label { font-size: 0.75rem; font-weight: 600; text-align: center; padding: 0.6rem 0.4rem; }

        /* ── city pills ── */
        .city-pills { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-top: 1.5rem; justify-content: center; }
        .city-pill {
          display: inline-flex; align-items: center; gap: 0.4rem;
          background: #fff; border: 1px solid #ddd; border-radius: 999px;
          padding: 0.5rem 1.2rem; font-size: 0.82rem; font-weight: 600;
          color: var(--ink); text-decoration: none;
          transition: all .2s;
        }
        .city-pill span { background: var(--gold); color: #fff; font-size: 0.65rem; font-weight: 700; padding: 0.15rem 0.45rem; border-radius: 999px; }
        .city-pill:hover { border-color: var(--gold); color: var(--gold); }

        /* ── featured tours ── */
        .tours-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.5rem; margin-top: 2.5rem; }
        @media(max-width:900px){ .tours-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:600px){ .tours-grid { grid-template-columns: 1fr; } }
        .tour-card {
          background: #fff; border-radius: 14px; overflow: hidden;
          border: 1px solid #e8e0d0;
          transition: box-shadow .2s, transform .15s;
          display: flex; flex-direction: column;
        }
        .tour-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.12); transform: translateY(-3px); }
        .tour-img {
          height: 190px; background: linear-gradient(135deg, #c8960c22 0%, #c8440a22 100%);
          display: flex; align-items: center; justify-content: center;
          font-size: 3rem; color: var(--gold);
        }
        .tour-body { padding: 1.25rem; flex: 1; display: flex; flex-direction: column; }
        .tour-days { font-size: 0.68rem; color: #999; font-weight: 600; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 0.4rem; }
        .tour-title { font-family: Georgia, serif; font-size: 1.1rem; font-weight: 700; color: var(--ink); margin-bottom: 0.5rem; }
        .tour-desc { font-size: 0.82rem; color: #666; line-height: 1.6; flex: 1; margin-bottom: 1rem; }
        .tour-tags { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem; }
        .tour-tag { font-size: 0.65rem; background: #fef3c7; color: #92400e; padding: 0.2rem 0.6rem; border-radius: 999px; font-weight: 600; }
        .tour-link { font-size: 0.8rem; font-weight: 700; color: var(--gold); text-decoration: none; }
        .tour-link:hover { text-decoration: underline; }

        /* ── why us ── */
        .why-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-top: 2rem; }
        @media(max-width:900px){ .why-grid { grid-template-columns: repeat(2,1fr); } }
        @media(max-width:560px){ .why-grid { grid-template-columns: 1fr; } }
        .why-card {
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 1.5rem;
        }
        .why-card-title { font-weight: 700; color: var(--gold-light); margin-bottom: 0.5rem; font-size: 0.95rem; }
        .why-card-body { font-size: 0.82rem; color: rgba(255,255,255,0.65); line-height: 1.6; }

        /* ── testimonials ── */
        .test-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1.25rem; margin-top: 2rem; }
        @media(max-width:900px){ .test-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:600px){ .test-grid { grid-template-columns: 1fr; } }
        .test-card {
          background: #fff; border: 1px solid #e8e0d0; border-radius: 14px; padding: 1.5rem;
          display: flex; flex-direction: column; gap: 0.75rem;
        }
        .test-stars { color: var(--gold); font-size: 0.9rem; letter-spacing: 2px; }
        .test-text { font-size: 0.82rem; color: #555; line-height: 1.65; font-style: italic; flex: 1; }
        .test-author { display: flex; align-items: center; gap: 0.75rem; }
        .test-avatar {
          width: 38px; height: 38px; border-radius: 50%;
          background: var(--gold); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-weight: 700; font-size: 0.9rem; flex-shrink: 0;
        }
        .test-name { font-weight: 700; font-size: 0.82rem; color: var(--ink); }
        .test-meta { font-size: 0.7rem; color: #999; }

        /* ── parallax quote ── */
        .quote-band {
          padding: 4rem 1.5rem; text-align: center;
        }
        .quote-text {
          font-family: Georgia, serif; font-size: clamp(1.1rem, 2.5vw, 1.5rem);
          color: rgba(255,255,255,0.88); font-style: italic;
          max-width: 720px; margin: 0 auto 1.5rem;
        }

        /* ── CTA banner ── */
        .cta-band { background: var(--gold); padding: 4rem 1.5rem; text-align: center; }
        .cta-title { font-family: Georgia, serif; font-size: clamp(1.6rem,3vw,2.4rem); font-weight: 700; color: #fff; margin-bottom: 0.75rem; }
        .cta-sub { color: rgba(255,255,255,0.8); font-size: 1rem; margin-bottom: 2rem; }
        .cta-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
        .btn-white { display:inline-flex;align-items:center;gap:6px;background:#fff;color:var(--gold);font-weight:700;font-size:.9rem;padding:.85rem 2rem;border-radius:8px;text-decoration:none;transition:background .2s; }
        .btn-white:hover { background: #f5f5f5; }
        .btn-white-outline { display:inline-flex;align-items:center;gap:6px;background:transparent;color:#fff;font-weight:700;font-size:.9rem;padding:.85rem 2rem;border-radius:8px;text-decoration:none;border:2px solid rgba(255,255,255,0.7);transition:all .2s; }
        .btn-white-outline:hover { background: rgba(255,255,255,0.12); border-color:#fff; }

        /* ── misc ── */
        .divider { border: none; border-top: 1px solid #e8e0d0; margin: 3rem 0; }
        .mt-2 { margin-top: 2rem; }
        .mb-1 { margin-bottom: 1rem; }
      `}</style>

      <Navbar />
      <main>

        {/* ── HERO ── */}
        <section className="hero-section" style={{ background: s.bg }}>
          <div className="hero-overlay" />
          <div className="hero-content">
            <div className="hero-badge">✦ {t('hero.badge')}</div>
            <h1 className="hero-title">
              {s.headline.split('\n').map((line, i) => (
                <span key={i}>{i === 1 ? <><br /><span style={{ color: s.accent }}>{line}</span></> : line}</span>
              ))}
            </h1>
            <p className="hero-sub">{s.sub}</p>
            <div className="hero-btns">
              <Link href={`/${locale}${s.cta.href}`} className="btn-gold">{s.cta.label} →</Link>
              <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer" className="btn-outline">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp Us
              </a>
            </div>
          </div>

          {/* slide dots */}
          <div className="slide-dots">
            {slides.map((_, i) => (
              <button key={i} className={`slide-dot${i === slide ? ' active' : ''}`} onClick={() => setSlide(i)} aria-label={`Slide ${i + 1}`} />
            ))}
          </div>

          {/* stats bar */}
          <div className="stats-bar" style={{ gridTemplateColumns: `repeat(${stats.length},1fr)` }}>
            {stats.map((st, i) => (
              <div key={i}>
                <div className="stat-num">{st.num}</div>
                <div className="stat-label">{st.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TOUR TYPES ── */}
        <section className="section section-sand">
          <div className="container">
            <div className="text-center">
              <span className="sec-eyebrow">{t('types.eyebrow')}</span>
              <h2 className="sec-title">{t('types.title')}</h2>
              <p className="sec-body mx-auto">{t('types.body')}</p>
            </div>
            <div className="type-grid">
              {TOUR_TYPES.map((t, i) => (
                <Link key={i} href={`/${locale}${t.href}`} className="type-card">
                  <img src={t.img} alt={t.label} className="type-img" />
                  <span className="type-label">{t2(`types.labels.${t.label}`) || t.label}</span>
                </Link>
              ))}
            </div>

            <hr className="divider" />

            {/* departure cities */}
            <div className="text-center">
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: '1.1rem', color: 'var(--ink)', marginBottom: '0.25rem' }}>{t('types.depart_title')}</h3>
              <div className="city-pills">
                {CITIES.map((c, i) => (
                  <Link key={i} href={`/${locale}/tours?from=${c.name.toLowerCase()}`} className="city-pill">
                    {t('types.depart_from')} {c.name} <span>{c.count}</span>
                  </Link>
                ))}
              </div>
              <div className="mt-2">
                <Link href={`/${locale}/tours`} className="btn-gold">{t('types.see_all')}</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED TOURS ── */}
        <section className="section section-white">
          <div className="container">
            <div className="text-center">
              <span className="sec-eyebrow">{t('featured.eyebrow')}</span>
              <h2 className="sec-title">{t('featured.title')}</h2>
              <p className="sec-body mx-auto">{t('featured.body')}</p>
            </div>
            <div className="tours-grid">
              {FEATURED_TOURS_I18N.map((tour, i) => (
                <div key={i} className="tour-card">
                  <div className="tour-img" style={{backgroundImage: tour.img ? "url("+tour.img+")" : "none", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                  <div className="tour-body">
                    <div className="tour-days">{tour.days}</div>
                    <div className="tour-title">{tour.title}</div>
                    <p className="tour-desc">{tour.desc}</p>
                    <div className="tour-tags">
                      {tour.tags.map((tag, j) => <span key={j} className="tour-tag">{tag}</span>)}
                    </div>
                    <Link href={`/${locale}${tour.href}`} className="tour-link">{t('featured.view_itinerary')} →</Link>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <Link href={`/${locale}/tours`} className="btn-ghost">{t('featured.browse_all')}</Link>
            </div>
          </div>
        </section>

        {/* ── QUOTE BAND ── */}
        <div className="quote-band" style={{background: "linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(/images/hero-quote.jpg) center/cover no-repeat"}}>
          <p className="quote-text">{t('quote.text')}</p>
          <Link href={`/${locale}/about`} className="btn-outline" style={{ display: 'inline-flex', borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
            {t('quote.link')}
          </Link>
        </div>

        {/* ── WHY US ── */}
        <section className="section section-dark">
          <div className="container">
            <div className="text-center">
              <span className="sec-eyebrow">{t('why.eyebrow')}</span>
              <h2 className="sec-title sec-title-light">{t('why.title')}</h2>
              <p className="sec-body mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {t('why.body')}
              </p>
            </div>
            <div className="why-grid">
              {WHY_US.map((w, i) => (
                <div key={i} className="why-card">
                  <div className="why-card-title">{w.title}</div>
                  <div className="why-card-body">{w.body}</div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <Link href={`/${locale}/contact`} className="btn-gold">{t('why.cta')} →</Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="section section-sand">
          <div className="container">
            <div className="text-center">
              <span className="sec-eyebrow">{t('testimonials.eyebrow')}</span>
              <h2 className="sec-title">{t('testimonials.title')}</h2>
              <p className="sec-body mx-auto">{t('testimonials.body')}</p>
            </div>
            <div className="test-grid">
              {TESTIMONIALS.map((r, i) => (
                <div key={i} className="test-card">
                  <div className="test-stars">★★★★★</div>
                  <p className="test-text">"{r.text}"</p>
                  <div className="test-author">
                    <div className="test-avatar">{r.name[0]}</div>
                    <div>
                      <div className="test-name">{r.name}</div>
                      <div className="test-meta">{r.country} · {r.tour}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-2">
              <Link href={`/${locale}/reviews`} className="btn-ghost">{t('testimonials.read_more')}</Link>
            </div>
          </div>
        </section>

        {/* ── CTA BAND ── */}
        <section className="cta-band">
          <div className="container">
            <h2 className="cta-title">{t('cta.title')}</h2>
            <p className="cta-sub">{t('cta.sub')}</p>
            <div className="cta-btns">
              <Link href={`/${locale}/contact`} className="btn-white">{t('cta.book')} →</Link>
              <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer" className="btn-white-outline">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                WhatsApp us
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
