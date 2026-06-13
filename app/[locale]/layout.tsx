import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Playfair_Display } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

const locales = ['en', 'fr'];

export const metadata: Metadata = {
  title: { default: 'Elbo Tours – Private Transfers & Excursions Morocco', template: '%s | Elbo Tours' },
  description: 'Comfortable, reliable & premium private transfers and excursions in Morocco. Airport transfers, city transfers, guided tours. Book now.',
  keywords: ['Morocco tours','Marrakech transfers','private driver Morocco','excursions Marrakech','minibus hire Morocco'],
  openGraph: { type: 'website', locale: 'en_US', alternateLocale: 'fr_FR', siteName: 'Elbo Tours' },
};

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
      </body>
    </html>
  );
}
