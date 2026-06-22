import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "./tour.module.css";
import { TourJsonLd } from "@/components/JsonLd";
import { getTourBySlug } from "@/lib/getTourBySlug";
import { ItineraryAccordion, BookingActions } from "./TourInteractive";

interface PageProps {
  params: { locale: string; slug: string };
}

function formatPrice(tour: { priceDisplay: string | null; priceFrom: number }): string {
  if (tour.priceDisplay) return tour.priceDisplay;
  if (tour.priceFrom && tour.priceFrom > 0)
    return "From €" + tour.priceFrom.toLocaleString();
  return "Ask for price";
}

function categoryLabel(cat: string): string {
  const map: Record<string, string> = {
    DAY_TRIP: "Day Trip",
    MULTI_DAY: "Multi-Day Tour",
    DESERT: "Desert Tour",
    MOUNTAIN: "Mountain Tour",
    CULTURAL: "Cultural Tour",
    PRIVATE: "Private Tour",
  };
  return map[cat] || cat;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) {
    return { title: "Tour not found | Elbo Tours" };
  }

  const base = "https://www.elbo-tours.com";
  const title = (tour.metaTitle || tour.title) + " | Elbo Tours";
  const description = tour.metaDesc || tour.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}/tours/${slug}`,
      languages: {
        en: `${base}/en/tours/${slug}`,
        fr: `${base}/fr/tours/${slug}`,
      },
    },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${base}/${locale}/tours/${slug}`,
      siteName: "Elbo Tours",
      images: tour.imageUrl ? [{ url: tour.imageUrl, width: 1200, height: 630, alt: tour.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TourDetailPage({ params }: PageProps) {
  const { locale, slug } = params;
  const tour = await getTourBySlug(slug, locale);

  if (!tour) {
    notFound();
  }

  return (
    <main className={styles.page}>
      <TourJsonLd tour={tour} locale={locale} />

      <section className={styles.hero}>
        {tour.imageUrl && tour.imageUrl !== "" ? (
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
                <span className={styles.badge + " " + styles.badgeFeatured}>
                  {locale === "fr" ? "Recommande" : "Featured"}
                </span>
              )}
            </div>
            <h1 className={styles.heroTitle}>{tour.title}</h1>
            <div className={styles.heroMeta}>
              {tour.durationText && <span>🕐 {tour.durationText}</span>}
              {tour.departsFrom && (
                <span>📍 {locale === "fr" ? "Depart de" : "Departs from"} {tour.departsFrom}</span>
              )}
              {tour.maxGroupSize && (
                <span>👥 Max {tour.maxGroupSize} {locale === "fr" ? "pers." : "people"}</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className={styles.body}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              {locale === "fr" ? "Apercu" : "Overview"}
            </h2>
            <p className={styles.description}>{tour.description}</p>
          </section>

          {tour.highlights.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === "fr" ? "Points forts" : "Highlights"}
              </h2>
              <ul className={styles.highlightList}>
                {tour.highlights.map((h, i) => (
                  <li key={i} className={styles.highlightItem}>
                    <span className={styles.checkIcon}>✓</span>
                    {h}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {tour.itinerary.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === "fr" ? "Programme" : "Itinerary"}
              </h2>
              <ItineraryAccordion itinerary={tour.itinerary} locale={locale} />
            </section>
          )}

          {(tour.includes.length > 0 || tour.excludes.length > 0) && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === "fr" ? "Inclus / Non inclus" : "Included / Not included"}
              </h2>
              <div className={styles.inclusionsGrid}>
                {tour.includes.length > 0 && (
                  <div>
                    <h3 className={styles.inclusionsSubtitle}>
                      {locale === "fr" ? "✔ Inclus" : "✔ Included"}
                    </h3>
                    <ul className={styles.inclusionList}>
                      {tour.includes.map((item, i) => (
                        <li key={i} className={styles.inclusionItem}>
                          <span className={styles.checkIcon}>✓</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excludes.length > 0 && (
                  <div>
                    <h3 className={styles.inclusionsSubtitle}>
                      {locale === "fr" ? "✘ Non inclus" : "✘ Not included"}
                    </h3>
                    <ul className={styles.inclusionList}>
                      {tour.excludes.map((item, i) => (
                        <li key={i} className={styles.inclusionItem + " " + styles.exclusionItem}>
                          <span className={styles.xIcon}>✗</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {tour.gallery.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                {locale === "fr" ? "Galerie" : "Gallery"}
              </h2>
              <div className={styles.gallery}>
                {tour.gallery.map((url, i) => (
                  <div key={i} className={styles.galleryItem}>
                    <Image
                      src={url}
                      alt={tour.title + " photo " + (i + 1)}
                      fill
                      className={styles.galleryImg}
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <div className={styles.priceBlock}>
              <span className={styles.priceLabel}>
                {locale === "fr" ? "A partir de" : "Starting from"}
              </span>
              <span className={styles.price}>{formatPrice(tour)}</span>
              <span className={styles.priceSub}>
                {locale === "fr" ? "par personne" : "per person"}
              </span>
            </div>
            <div className={styles.tourMeta}>
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>
                  {locale === "fr" ? "Duree" : "Duration"}
                </span>
                <span className={styles.metaVal}>
                  {tour.durationText || (tour.durationDays + " " + (locale === "fr" ? "jours" : "days"))}
                </span>
              </div>
              {tour.departsFrom && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>
                    {locale === "fr" ? "Depart" : "Departs"}
                  </span>
                  <span className={styles.metaVal}>{tour.departsFrom}</span>
                </div>
              )}
              {tour.maxGroupSize && (
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>
                    {locale === "fr" ? "Groupe max" : "Max group"}
                  </span>
                  <span className={styles.metaVal}>{tour.maxGroupSize}</span>
                </div>
              )}
            </div>
            <BookingActions tourId={tour.id} tourTitle={tour.title} locale={locale} />
          </div>
          {tour.tags.length > 0 && (
            <div className={styles.tagsBlock}>
              {tour.tags.map((tag) => (
                <span key={tag} className={styles.tag}>{tag}</span>
              ))}
            </div>
          )}
        </aside>
      </div>

      {tour.related.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.sectionTitle}>
            {locale === "fr" ? "Circuits similaires" : "Similar tours"}
          </h2>
          <div className={styles.relatedGrid}>
            {tour.related.map((r) => (
              <Link key={r.slug} href={"/" + locale + "/tours/" + r.slug} className={styles.relatedCard}>
                <div className={styles.relatedImgWrap}>
                  {r.imageUrl && r.imageUrl !== "" ? (
                    <Image src={r.imageUrl} alt={r.title} fill className={styles.relatedImg} sizes="300px" />
                  ) : (
                    <div className={styles.relatedImgPlaceholder} />
                  )}
                </div>
                <div className={styles.relatedInfo}>
                  <h3 className={styles.relatedTitle}>{r.title}</h3>
                  <span className={styles.relatedPrice}>
                    {r.priceDisplay || (r.priceFrom > 0 ? "From €" + r.priceFrom : "Ask for price")}
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
