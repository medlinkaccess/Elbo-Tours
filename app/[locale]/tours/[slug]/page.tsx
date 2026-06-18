'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './tour.module.css';
import { TourJsonLd } from '@/components/JsonLd';

// â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface ItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface RelatedTour {
  slug: string;
  title: string;
  priceFrom: number;
  priceDisplay: string | null;
  imageUrl: string | null;
  durationDays: number;
}

interface TourDetail {
  id: string;
  slug: string;
  category: string;
  priceFrom: number;
  priceDisplay: string | null;
  currency: string;
  durationDays: number;
  durationText: string | null;
  maxGroupSize: number | null;
  minGroupSize: number;
  featured: boolean;
  imageUrl: string | null;
  gallery: string[];
  tags: string[];
  departsFrom: string;
  destinationName: string | null;
  title: string;
  description: string;
  metaTitle: string;
  metaDesc: string;
  itinerary: ItineraryDay[];
  highlights: string[];
  includes: string[];
  excludes: string[];
  related: RelatedTour[];
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const WHATSAPP = '212665889258';

function formatPrice(tour: TourDetail): string {
  if (tour.priceDisplay) return tour.priceDisplay;
  if (tour.priceFrom && tour.priceFrom > 0)
    return `From â‚¬${tour.priceFrom.toLocaleString()}`;
  return 'Ask for price';
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    DAY_TRIP: 'Day Trip',
    MULTI_DAY: 'Multi-Day Tour',
    DESERT: 'Desert Tour',
    MOUNTAIN: 'Mountain Tour',
    CULTURAL: 'Cultural Tour',
    PRIVATE: 'Private Tour',
  };
  return map[cat] || cat;
}

// â”€â”€ Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function TourDetailPage() {
  const params = useParams();
  const locale = (params?.locale as string) || 'en';
  const slug = params?.slug as string;

  const [tour, setTour] = useState<TourDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeDay, setActiveDay] = useState(0);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    fetch(`/api/tours/${slug}?locale=${locale}`)
      .then(res => {
        if (!res.ok) throw new Error(res.status === 404 ? 'Tour not found' : 'Failed to load tour');
        return res.json();
      })
      .then((data: TourDetail) => {
        setTour(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug, locale]);

  // â”€â”€ Loading â”€â”€
  if (loading) {
    return (
      <div className={styles.loadingWrap}>
        <div className={styles.spinner} />
        <p>{locale === 'fr' ? 'Chargementâ€¦' : 'Loadingâ€¦'}</p>
      </div>
    );
  }

  // â”€â”€ Error / 404 â”€â”€
  if (error || !tour) {
    return (
      <div className={styles.errorWrap}>
        <h1>{error || 'Tour not found'}</h1>
        <Link href={`/${locale}/tours`}>
          â† {locale === 'fr' ? 'Retour aux circuits' : 'Back to tours'}
        </Link>
      </div>
    );
  }

  const whatsappMsg = encodeURIComponent(
    `Hi! I'm interested in the "${tour.title}" tour. Can you send me more details?`
  );
  const whatsappUrl = `https://wa.me/${WHATSAPP}?text=${whatsappMsg}`;

  return (
    <main className={styles.page}>
      {tour && <TourJsonLd tour={tour} locale={locale} />}
      {/* â”€â”€ Hero â”€â”€ */}
      <section className={styles.hero}>
        {(tour.imageUrl && tour.imageUrl !== "") ? (
          <Image
            src={tour.imageUrl}
            alt={tour.title}
            fill
            priority
            className={styles.heroImg}
            sizes="100vw"
          />
        ) : (
          <div className={styles.heroPlaceholder} />
        )}
        <div className={styles.heroOverlay}>
          <div className={styles.heroContent}>
            <div className={styles.heroBadges}>
              <span className={styles.badge}>{categoryLabel(tour.category)}</span>
              {tour.featured && (
                <span className={`${styles.badge} ${styles.badgeFeatured}`}>
                  {locale === 'fr' ? 'RecommandÃ©' : 'Featured'}
                </span>
              )}
            </div>
            <h1 className={styles.heroTitle}>{tour.title}</h1>
            <div className={styles.heroMeta}>
              {tour.durationText && <span>â± {tour.durationText}</span>}
              {tour.departsFrom && <span>ðŸ“ {locale === 'fr' ? 'DÃ©part de' : 'Departs from'} {tour.departsFrom}</span>}
              {tour.maxGroupSize && (
                <span>ðŸ‘¥ {locale === 'fr' ? 'Max' : 'Max'} {tour.maxGroupSize} {locale === 'fr' ? 'pers.' : 'people'}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* â”€â”€ Body â”€â”€ */}
      <div className={styles.body}>
        <div className={styles.main}>

          {/* Overview */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {locale === 'fr' ? 'AperÃ§u' : 'Overview'}
            </h2>
            <p className={styles.description}>{tour.description}</p>
          </section>

          {/* Highlights */}
          {tour.highlights.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === 'fr' ? 'Points forts' : 'Highlights'}
              </h2>
              <ul className={styles.highlightList}>
                {tour.highlights.map((h, i) => (
                  <li key={i} className={styles.highlightItem}>
                    <span className={styles.checkIcon}>âœ“</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Itinerary */}
          {tour.itinerary.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === 'fr' ? 'Programme' : 'Itinerary'}
              </h2>
              <div className={styles.itinerary}>
                {tour.itinerary.map((day, i) => (
                  <div key={i} className={styles.dayBlock}>
                    <button
                      className={`${styles.dayHeader} ${activeDay === i ? styles.dayHeaderActive : ''}`}
                      onClick={() => setActiveDay(activeDay === i ? -1 : i)}
                      aria-expanded={activeDay === i}
                    >
                      <span className={styles.dayNum}>
                        {locale === 'fr' ? 'Jour' : 'Day'} {day.day}
                      </span>
                      <span className={styles.dayTitle}>{day.title}</span>
                      <span className={styles.dayChevron}>{activeDay === i ? 'â–²' : 'â–½'}</span>
                    </button>
                    {activeDay === i && (
                      <div className={styles.dayBody}>
                        <p>{day.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Includes / Excludes */}
          {(tour.includes.length > 0 || tour.excludes.length > 0) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === 'fr' ? 'Inclus / Non inclus' : 'Included / Not included'}
              </h2>
              <div className={styles.inclusionsGrid}>
                {tour.includes.length > 0 && (
                  <div>
                    <h3 className={styles.inclusionsSubtitle}>
                      {locale === 'fr' ? 'âœ“ Inclus' : 'âœ“ Included'}
                    </h3>
                    <ul className={styles.inclusionList}>
                      {tour.includes.map((item, i) => (
                        <li key={i} className={styles.inclusionItem}>
                          <span className={styles.checkIcon}>âœ“</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div>
                    <h3 className={styles.inclusionsSubtitle}>
                      {locale === 'fr' ? 'âœ— Non inclus' : 'âœ— Not included'}
                    </h3>
                    <ul className={styles.inclusionList}>
                      {tour.excludes.map((item, i) => (
                        <li key={i} className={`${styles.inclusionItem} ${styles.exclusionItem}`}>
                          <span className={styles.xIcon}>âœ—</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Gallery */}
          {tour.gallery.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === 'fr' ? 'Galerie' : 'Gallery'}
              </h2>
              <div className={styles.gallery}>
                {tour.gallery.map((url, i) => (
                  <div key={i} className={styles.galleryItem}>
                    <Image src={url} alt={`${tour.title} photo ${i + 1}`} fill className={styles.galleryImg} sizes="(max-width: 768px) 50vw, 33vw" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* â”€â”€ Sidebar â”€â”€ */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>
                {locale === 'fr' ? 'Ã€ partir de' : 'Starting from'}
              </span>
              <span className={styles.price}>{formatPrice(tour)}</span>
              <span className={styles.priceSub}>
                {locale === 'fr' ? 'par personne' : 'per person'}
              </span>
            </div>

            <div className={styles.tourMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>
                  {locale === 'fr' ? 'DurÃ©e' : 'Duration'}
                </span>
                <span className={styles.metaVal}>
                  {tour.durationText || `${tour.durationDays} ${locale === 'fr' ? 'jours' : 'days'}`}
                </span>
              </div>
              {tour.departsFrom && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>
                    {locale === 'fr' ? 'DÃ©part' : 'Departs'}
                  </span>
                  <span className={styles.metaVal}>{tour.departsFrom}</span>
                </div>
              )}
              {tour.maxGroupSize && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>
                    {locale === 'fr' ? 'Groupe max' : 'Max group'}
                  </span>
                  <span className={styles.metaVal}>{tour.maxGroupSize}</span>
                </div>
              )}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              {locale === 'fr' ? 'ðŸ“² RÃ©server sur WhatsApp' : 'ðŸ“² Book via WhatsApp'}
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtnSecondary}
            >
              {locale === 'fr' ? 'ðŸ’¬ Demander un devis' : 'ðŸ’¬ Request a quote'}
            </a>
          </div>

          {/* Tags */}
          {tour.tags.length > 0 && (
            <div className={styles.tagsBlock}>
              {tour.tags.map(tag => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* â”€â”€ Related Tours â”€â”€ */}
      {tour.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.sectionTitle}>
            {locale === 'fr' ? 'Circuits similaires' : 'Similar tours'}
          </h2>
          <div className={styles.relatedGrid}>
            {tour.related.map(r => (
              <Link key={r.slug} href={`/${locale}/tours/${r.slug}`} className={styles.relatedCard}>
                <div className={styles.relatedImgWrap}>
                  {(r.imageUrl && r.imageUrl !== "") ? (
                    <Image src={r.imageUrl} alt={r.title} fill className={styles.relatedImg} sizes="300px" />
                  ) : (
                    <div className={styles.relatedImgPlaceholder} />
                  )}
                </div>
                <div className={styles.relatedInfo}>
                  <h3 className={styles.relatedTitle}>{r.title}</h3>
                  <span className={styles.relatedPrice}>
                    {r.priceDisplay || (r.priceFrom > 0 ? `From â‚¬${r.priceFrom}` : 'Ask for price')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

