"use client";
import { useState } from "react";
import styles from "./tour.module.css";
import QuoteModal from "@/components/tours/QuoteModal";
import type { ItineraryDay } from "@/lib/getTourBySlug";

const WHATSAPP = "212665889258";

interface Props {
  tourId: string;
  tourTitle: string;
  itinerary: ItineraryDay[];
  locale: string;
}

/**
 * Client-side interactive pieces of the tour detail page: the itinerary
 * day accordion and the "Request a Quote" modal trigger. Split out from
 * the main page so the page itself can be a server component (for SEO),
 * while this part keeps its state/interactivity.
 */
export function ItineraryAccordion({ itinerary, locale }: { itinerary: ItineraryDay[]; locale: string }) {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div className={styles.itinerary}>
      {itinerary.map((day, i) => (
        <div key={i} className={styles.dayBlock}>
          <button
            className={styles.dayHeader + (activeDay === i ? " " + styles.dayHeaderActive : "")}
            onClick={() => setActiveDay(activeDay === i ? -1 : i)}
            aria-expanded={activeDay === i}
          >
            <span className={styles.dayNum}>
              {locale === "fr" ? "Jour" : "Day"} {day.day}
            </span>
            <span className={styles.dayTitle}>{day.title}</span>
            <span className={styles.dayChevron}>{activeDay === i ? "▲" : "▼"}</span>
          </button>
          {activeDay === i && (
            <div className={styles.dayBody}>
              <p>{day.description}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export function BookingActions({ tourId, tourTitle, locale }: { tourId: string; tourTitle: string; locale: string }) {
  const [showQuote, setShowQuote] = useState(false);

  const whatsappMsg = encodeURIComponent(
    "Hi! I am interested in the " + tourTitle + " tour. Can you send me more details?"
  );
  const whatsappUrl = "https://wa.me/" + WHATSAPP + "?text=" + whatsappMsg;

  return (
    <>
      <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={styles.ctaBtn}>
        {locale === "fr" ? "Reserver sur WhatsApp" : "Book via WhatsApp"}
      </a>
      <button
        onClick={() => setShowQuote(true)}
        className={styles.ctaBtnSecondary}
        style={{ cursor: "pointer", width: "100%", background: "#fff" }}
      >
        {locale === "fr" ? "Demander un devis" : "Request a Quote"}
      </button>
      {showQuote && (
        <QuoteModal tourId={tourId} tourTitle={tourTitle} onClose={() => setShowQuote(false)} />
      )}
    </>
  );
}
