import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';
import ChatWidget from '@/components/ChatWidget';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const locales = ['en', 'fr'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en';
  return {
    title: {
      default: isEn
        ? 'Elbo Tours – Private Tours & Transfers Morocco'
        : 'Elbo Tours – Circuits & Transferts Privés au Maroc',
      template: '%s | Elbo Tours',
    },
    description: isEn
      ? 'Private tours and transfers across Morocco. Airport pickups, city-to-city routes, guided excursions. Book your Marrakech transfer or Morocco tour today.'
      : 'Circuits privés et transferts à travers le Maroc. Transferts aéroport, trajets ville à ville, excursions guidées. Réservez votre circuit ou transfert dès aujourd\'hui.',
    keywords: isEn
      ? ['Morocco tours', 'Marrakech transfers', 'private driver Morocco', 'excursions Marrakech', 'minibus hire Morocco']
      : ['circuits Maroc', 'transfert Marrakech', 'chauffeur privé Maroc', 'excursions Marrakech', 'minibus Maroc'],
    alternates: {
      canonical: `https://elbo-tours.com/${locale}`,
      languages: {
        en: 'https://elbo-tours.com/en',
        fr: 'https://elbo-tours.com/fr',
      },
    },
    openGraph: {
      type: 'website',
      locale: isEn ? 'en_US' : 'fr_FR',
      alternateLocale: isEn ? 'fr_FR' : 'en_US',
      siteName: 'Elbo Tours',
      url: `https://elbo-tours.com/${locale}`,
    },
    twitter: {
      card: 'summary_large_image',
      site: '@elbotours',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale)) notFound();
  const messages = await getMessages();
  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
