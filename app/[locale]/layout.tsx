import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import '@/app/globals.css';
import { LocalBusinessJsonLd } from '@/components/JsonLd';
import ChatWidget from '@/components/chat/ChatWidget';
import WhatsAppButton from '@/components/chat/WhatsAppButton';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const locales = ['en', 'fr'];

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const isEn = locale === 'en';
  return {
    title: {
      default: isEn
        ? 'Elbo Tours - Private Tours & Transfers Morocco'
        : 'Elbo Tours - Circuits & Transferts Prives au Maroc',
      template: '%s | Elbo Tours',
    },
    description: isEn
      ? 'Private tours and transfers across Morocco. Airport pickups, city-to-city routes, guided excursions. Book your Marrakech transfer or Morocco tour today.'
      : 'Circuits prives et transferts a travers le Maroc. Transferts aeroport, trajets ville a ville, excursions guidees. Reservez votre circuit ou transfert des aujourd hui.',
    keywords: isEn
      ? ['Morocco tours', 'Marrakech transfers', 'private driver Morocco', 'excursions Marrakech', 'minibus hire Morocco', 'Morocco private tours', 'desert tours Morocco', 'Sahara tour Marrakech', 'Fes Marrakech tour', 'Chefchaouen day trip']
      : ['circuits Maroc', 'transfert Marrakech', 'chauffeur prive Maroc', 'excursions Marrakech', 'minibus Maroc'],
    verification: {
      google: 'iTQF2H9rUjHNxX-0skrVJq9mPHYr48bemgtebTb5Fus',
    },
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
      images: [{ url: 'https://elbo-tours.com/images/og-default.jpg', width: 1200, height: 630, alt: 'Elbo Tours Morocco' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@elbotours',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: True },
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
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-F36KXEJZGS"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-F36KXEJZGS');
          `}
        </Script>
      </head>
      <body>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <LocalBusinessJsonLd />
        <ChatWidget />
        <WhatsAppButton />
      </body>
    </html>
  );
}
