import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'Contact Us | Elbo Tours – Morocco Tours & Transfers'
    : 'Contactez-nous | Elbo Tours – Circuits et Transferts au Maroc';
  const description = isEn
    ? 'Get in touch with Elbo Tours for private transfers and guided tours across Morocco. Offices in Marrakech and Casablanca, fast WhatsApp response.'
    : 'Contactez Elbo Tours pour vos transferts privés et circuits guidés au Maroc. Bureaux à Marrakech et Casablanca, réponse rapide sur WhatsApp.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/contact`,
      languages: { en: 'https://elbo-tours.com/en/contact', fr: 'https://elbo-tours.com/fr/contact' },
    },
    openGraph: { title, description, url: `https://elbo-tours.com/${locale}/contact`, type: 'website' },
  };
}

export default function ContactPage() {
  return <ContactClient />;
}
