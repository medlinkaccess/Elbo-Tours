import { Metadata } from 'next';
import { unstable_setRequestLocale as setRequestLocale } from "next-intl/server";
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { tours, getTourBySlug } from '@/data/tours';

// ── Static params for all locales ─────────────────────────────────────────────
export async function generateStaticParams() {
  const locales = ['en', 'fr', 'es', 'ar']; // adjust to your locales
  return locales.flatMap(locale =>
    tours.map(tour => ({ locale, slug: tour.slug }))
  );
}

// ── SEO metadata ──────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string; locale: string };
}): Promise<Metadata> {
  setRequestLocale(params.locale);
  const tour = getTourBySlug(params.slug);
  if (!tour) return { title: 'Tour not found' };

  return {
    title: tour.metaTitle,
    description: tour.metaDescription,
    openGraph: {
      title: tour.metaTitle,
      description: tour.metaDescription,
      images: [{ url: tour.heroImage, width: 1200, height: 630 }],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: tour.metaTitle,
      description: tour.metaDescription,
    },
    alternates: {
      canonical: `https://www.elbotours.com/${params.locale}/tours/${params.slug}`,
    },
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function TourPage({
  params,
}: {
  params: { slug: string; locale: string };
}) {
  setRequestLocale(params.locale);
  const tour = getTourBySlug(params.slug);
  if (!tour) notFound();

  const locale = params.locale;

  // JSON-LD structured data for Google
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.metaDescription,
    touristType: tour.tags,
    itinerary: tour.itinerary.map(d => ({
      '@type': 'TouristAttraction',
      name: d.title,
      description: d.description,
    })),
    provider: {
      '@type': 'TravelAgency',
      name: 'Elbo Tours',
      url: 'https://www.elbotours.com',
    },
  };

  return (
    <>
      <style>{`
        :root {
          --gold: #C8960C;
          --gold-light: #F0C040;
          --sand: #F5EDD6;
          --dark: #1A1A2E;
          --ink: #1a0d00;
        }

        /* ── hero ── */
        .tour-hero {
          position: relative;
          height: 70vh; min-height: 420px;
          background: linear-gradient(135deg, #2d1b00 0%, #1a0a00 100%);
          display: flex; align-items: flex-end;
          overflow: hidden;
        }
        .tour-hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%);
        }
        .tour-hero-content {
          position: relative; z-index: 2;
          padding: 2.5rem 1.5rem;
          max-width: 900px; margin: 0 auto; width: 100%;
        }
        .tour-breadcrumb {
          display: flex; gap: 0.5rem; align-items: center;
          font-size: 0.72rem; color: rgba(255,255,255,0.6);
          margin-bottom: 1rem; flex-wrap: wrap;
        }
        .tour-breadcrumb a { color: rgba(255,255,255,0.6); text-decoration: none; }
        .tour-breadcrumb a:hover { color: var(--gold-light); }
        .tour-days-badge {
          display: inline-block;
          background: var(--gold); color: #fff;
          font-size: 0.68rem; font-weight: 700; letter-spacing: .08em; text-transform: uppercase;
          padding: 0.3rem 0.9rem; border-radius: 999px; margin-bottom: 0.75rem;
        }
        .tour-hero-title {
          font-family: Georgia, 'Times New Roman', serif;
          font-size: clamp(1.8rem, 4vw, 3rem);
          font-weight: 700; color: #fff; line-height: 1.15;
          margin-bottom: 0.75rem;
        }
        .tour-hero-tags { display: flex; flex-wrap: wrap; gap: 0.4rem; }
        .tour-hero-tag {
          font-size: 0.65rem; background: rgba(255,255,255,0.12); color: rgba(255,255,255,0.8);
          padding: 0.25rem 0.7rem; border-radius: 999px; border: 1px solid rgba(255,255,255,0.2);
        }

        /* ── layout ── */
        .tour-layout {
          max-width: 1100px; margin: 0 auto; padding: 3rem 1.5rem;
          display: grid; grid-template-columns: 1fr 320px; gap: 3rem; align-items: start;
        }
        @media(max-width:860px){ .tour-layout { grid-template-columns: 1fr; } }

        /* ── main col ── */
        .tour-section { margin-bottom: 2.5rem; }
        .tour-section-title {
          font-family: Georgia, serif; font-size: 1.3rem; font-weight: 700;
          color: var(--ink); margin-bottom: 1rem;
          padding-bottom: 0.5rem; border-bottom: 2px solid var(--gold);
          display: inline-block;
        }
        .tour-excerpt { font-size: 1rem; color: #444; line-height: 1.75; margin-bottom: 1rem; }

        /* highlights */
        .highlights-list { list-style: none; padding: 0; margin: 0; display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; }
        @media(max-width:560px){ .highlights-list { grid-template-columns: 1fr; } }
        .highlight-item { display: flex; align-items: flex-start; gap: 0.6rem; font-size: 0.85rem; color: #444; }
        .highlight-dot { width: 20px; height: 20px; border-radius: 50%; background: var(--gold); display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px; }
        .highlight-dot svg { width: 11px; height: 11px; }

        /* itinerary */
        .itinerary-list { list-style: none; padding: 0; margin: 0; position: relative; }
        .itinerary-list::before { content: ''; position: absolute; left: 28px; top: 0; bottom: 0; width: 2px; background: #e8e0d0; }
        .itin-item { display: flex; gap: 1.25rem; margin-bottom: 1.5rem; position: relative; }
        .itin-dot { width: 58px; flex-shrink: 0; display: flex; flex-direction: column; align-items: center; z-index: 1; }
        .itin-circle { width: 18px; height: 18px; border-radius: 50%; background: var(--gold); border: 3px solid #fff; box-shadow: 0 0 0 2px var(--gold); margin-top: 3px; }
        .itin-day { font-size: 0.62rem; font-weight: 700; color: var(--gold); text-transform: uppercase; letter-spacing: .06em; margin-top: 4px; text-align: center; }
        .itin-body { padding-bottom: 0.5rem; }
        .itin-title { font-weight: 700; font-size: 0.92rem; color: var(--ink); margin-bottom: 0.3rem; }
        .itin-desc { font-size: 0.82rem; color: #666; line-height: 1.6; }

        /* includes/excludes */
        .inc-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        @media(max-width:560px){ .inc-grid { grid-template-columns: 1fr; } }
        .inc-col-title { font-weight: 700; font-size: 0.85rem; color: var(--ink); margin-bottom: 0.5rem; }
        .inc-list { list-style: none; padding: 0; margin: 0; }
        .inc-list li { display: flex; gap: 0.5rem; font-size: 0.8rem; color: #555; margin-bottom: 0.4rem; align-items: flex-start; }
        .inc-icon-yes { color: #16a34a; font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }
        .inc-icon-no { color: #dc2626; font-size: 0.9rem; flex-shrink: 0; margin-top: 1px; }

        /* ── sidebar ── */
        .tour-sidebar { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 1.25rem; }
        .sidebar-card {
          background: #fff; border: 1px solid #e8e0d0; border-radius: 14px; padding: 1.5rem;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .sidebar-card-gold { background: var(--gold); border-color: var(--gold); }
        .sidebar-title { font-family: Georgia, serif; font-size: 1rem; font-weight: 700; color: var(--ink); margin-bottom: 0.75rem; }
        .sidebar-title-light { color: #fff; }
        .departs-list { list-style: none; padding: 0; margin: 0 0 1rem; }
        .departs-list li { font-size: 0.82rem; color: #555; padding: 0.3rem 0; border-bottom: 1px solid #f0ebe0; display: flex; align-items: center; gap: 0.4rem; }
        .departs-list li:last-child { border-bottom: none; }
        .btn-book {
          display: block; text-align: center;
          background: #fff; color: var(--gold);
          font-weight: 700; font-size: 0.9rem;
          padding: 0.9rem; border-radius: 8px;
          text-decoration: none; transition: background .2s;
        }
        .btn-book:hover { background: #f5f5f5; }
        .btn-wa {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: #25D366; color: #fff;
          font-weight: 700; font-size: 0.88rem;
          padding: 0.85rem; border-radius: 8px;
          text-decoration: none; transition: background .2s; margin-top: 0.6rem;
        }
        .btn-wa:hover { background: #1ebe5d; }
        .btn-enquire {
          display: block; text-align: center;
          background: var(--gold); color: #fff;
          font-weight: 700; font-size: 0.9rem;
          padding: 0.9rem; border-radius: 8px;
          text-decoration: none; transition: background .2s;
        }
        .btn-enquire:hover { background: #b07e08; }
        .sidebar-note { font-size: 0.72rem; color: rgba(255,255,255,0.75); text-align: center; margin-top: 0.6rem; }

        /* ── back link ── */
        .back-bar { background: var(--sand); padding: 0.9rem 1.5rem; }
        .back-link { display: inline-flex; align-items: center; gap: 0.4rem; font-size: 0.82rem; font-weight: 600; color: var(--gold); text-decoration: none; }
        .back-link:hover { text-decoration: underline; }

        /* ── other tours ── */
        .other-tours { background: var(--sand); padding: 3rem 1.5rem; }
        .other-title { font-family: Georgia, serif; font-size: 1.4rem; font-weight: 700; color: var(--ink); margin-bottom: 1.5rem; text-align: center; }
        .other-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1rem; max-width: 900px; margin: 0 auto; }
        @media(max-width:700px){ .other-grid { grid-template-columns: 1fr 1fr; } }
        @media(max-width:480px){ .other-grid { grid-template-columns: 1fr; } }
        .other-card {
          background: #fff; border: 1px solid #e8e0d0; border-radius: 10px; padding: 1rem;
          text-decoration: none; transition: box-shadow .2s, transform .15s; display: block;
        }
        .other-card:hover { box-shadow: 0 4px 16px rgba(200,150,12,0.15); transform: translateY(-2px); }
        .other-days { font-size: 0.62rem; color: #999; font-weight: 600; text-transform: uppercase; margin-bottom: 0.25rem; }
        .other-name { font-size: 0.85rem; font-weight: 700; color: var(--ink); line-height: 1.3; }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navbar />
      <main>

        {/* ── HERO ── */}
        <div className="tour-hero">
          <div className="tour-hero-overlay" />
          <div className="tour-hero-content">
            <nav className="tour-breadcrumb" aria-label="Breadcrumb">
              <Link href={`/${locale}`}>Home</Link>
              <span>›</span>
              <Link href={`/${locale}/tours`}>Tours</Link>
              <span>›</span>
              <span style={{ color: 'rgba(255,255,255,0.85)' }}>{tour.title}</span>
            </nav>
            <div className="tour-days-badge">⏱ {tour.days}</div>
            <h1 className="tour-hero-title">{tour.title}</h1>
            <div className="tour-hero-tags">
              {tour.tags.map((tag, i) => (
                <span key={i} className="tour-hero-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="tour-layout">

          {/* ── Main content ── */}
          <div>

            {/* Overview */}
            <div className="tour-section">
              <h2 className="tour-section-title">Overview</h2>
              <p className="tour-excerpt">{tour.excerpt}</p>
            </div>

            {/* Highlights */}
            <div className="tour-section">
              <h2 className="tour-section-title">Tour Highlights</h2>
              <ul className="highlights-list">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="highlight-item">
                    <span className="highlight-dot">
                      <svg fill="none" stroke="#fff" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    </span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Itinerary */}
            <div className="tour-section">
              <h2 className="tour-section-title">Day-by-Day Itinerary</h2>
              <ul className="itinerary-list">
                {tour.itinerary.map((d, i) => (
                  <li key={i} className="itin-item">
                    <div className="itin-dot">
                      <div className="itin-circle" />
                      <div className="itin-day">{d.day}</div>
                    </div>
                    <div className="itin-body">
                      <div className="itin-title">{d.title}</div>
                      <div className="itin-desc">{d.description}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Includes / Excludes */}
            <div className="tour-section">
              <h2 className="tour-section-title">What's Included</h2>
              <div className="inc-grid">
                <div>
                  <div className="inc-col-title">✅ Included</div>
                  <ul className="inc-list">
                    {tour.includes.map((item, i) => (
                      <li key={i}><span className="inc-icon-yes">✓</span>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="inc-col-title">❌ Not included</div>
                  <ul className="inc-list">
                    {tour.excludes.map((item, i) => (
                      <li key={i}><span className="inc-icon-no">✗</span>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

          </div>

          {/* ── Sidebar ── */}
          <aside className="tour-sidebar">

            {/* Book card */}
            <div className="sidebar-card sidebar-card-gold">
              <div className="sidebar-title sidebar-title-light">Ready to book?</div>
              <Link href={`/${locale}/contact?tour=${tour.slug}`} className="btn-book">
                Request a Quote →
              </Link>
              <a href={`https://wa.me/212665889258?text=Hi! I'm interested in the ${encodeURIComponent(tour.title)}`}
                target="_blank" rel="noopener noreferrer" className="btn-wa">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                WhatsApp Us
              </a>
              <p className="sidebar-note">Fast response · No obligation</p>
            </div>

            {/* Departs from */}
            <div className="sidebar-card">
              <div className="sidebar-title">Departs from</div>
              <ul className="departs-list">
                {tour.departsFrom.map((city, i) => (
                  <li key={i}>
                    <span>📍</span> {city}
                  </li>
                ))}
              </ul>
              <Link href={`/${locale}/contact?tour=${tour.slug}`} className="btn-enquire">
                Enquire about dates →
              </Link>
            </div>

            {/* Duration */}
            <div className="sidebar-card">
              <div className="sidebar-title">Tour details</div>
              <ul className="departs-list">
                <li><span>⏱</span> Duration: {tour.days}</li>
                <li><span>🚗</span> Private group only</li>
                <li><span>🗓</span> Any departure date</li>
                <li><span>✏️</span> Fully customisable</li>
              </ul>
            </div>

          </aside>
        </div>

        {/* ── Other tours ── */}
        <div className="other-tours">
          <h2 className="other-title">You might also like</h2>
          <div className="other-grid">
            {tours
              .filter(t => t.slug !== tour.slug)
              .slice(0, 3)
              .map((t, i) => (
                <Link key={i} href={`/${locale}/tours/${t.slug}`} className="other-card">
                  <div className="other-days">{t.days}</div>
                  <div className="other-name">{t.title}</div>
                </Link>
              ))}
          </div>
        </div>

      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
