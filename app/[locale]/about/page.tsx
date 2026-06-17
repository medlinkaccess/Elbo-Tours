import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const isEn = locale === 'en';
  const title = isEn
    ? 'About Us | Elbo Tours – Private Tours & Transfers Morocco'
    : 'À propos | Elbo Tours – Circuits & Transferts Privés au Maroc';
  const description = isEn
    ? 'Learn about Elbo Tours — founded in Marrakech, serving travellers across Morocco since 2014 with private transfers and guided tours.'
    : 'Découvrez Elbo Tours — fondé à Marrakech, au service des voyageurs à travers le Maroc depuis 2014 avec des transferts privés et des circuits guidés.';
  return {
    title,
    description,
    alternates: {
      canonical: `https://elbo-tours.com/${locale}/about`,
      languages: { en: 'https://elbo-tours.com/en/about', fr: 'https://elbo-tours.com/fr/about' },
    },
    openGraph: { title, description, url: `https://elbo-tours.com/${locale}/about`, type: 'website' },
  };
}

export default function AboutPage() {
  const t = useTranslations('about');
  const locale = useLocale();
  const stats = t.raw('stats') as { icon: string; title: string; desc: string }[];

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[#1A1A2E] text-white text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('hero_title')}</h1>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto">{t('hero_sub')}</p>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="text-center mb-16">
                <p className="text-xl leading-relaxed text-gray-500">{t('intro')}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {stats.map((item, i) => (
                  <div key={i} className="text-center p-8 bg-[#FEF3C7]/40 rounded-2xl">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-[#1A1A2E] text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#1A1A2E] rounded-2xl p-10 text-center">
                <h2 className="font-display text-3xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('cta_title')}</h2>
                <Link href={`/${locale}/contact`} className="btn-gold inline-flex mt-2">{t('cta_btn')} →</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
