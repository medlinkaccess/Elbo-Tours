import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function AboutPage() {
  const locale = useLocale();
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-16 bg-[#1A1A2E] text-white text-center">
          <h1 className="font-display text-4xl sm:text-5xl font-bold" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>About Elbo Tours</h1>
          <p className="text-gray-300 mt-4 max-w-xl mx-auto">Your trusted private transport partner across Morocco since 2014.</p>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="prose prose-lg max-w-none text-gray-600">
              <div className="text-center mb-16">
                <p className="text-xl leading-relaxed text-gray-500">
                  Elbo Tours was founded in Marrakech with a simple mission: to provide travellers with safe, comfortable and affordable private transport throughout Morocco.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[
                  { icon: '🏆', title: '10+ Years', desc: 'Serving travellers from across the world with premium transport services.' },
                  { icon: '🌍', title: '3 Languages', desc: 'Our drivers speak English, French and Arabic for seamless communication.' },
                  { icon: '⭐', title: '5,000+ Clients', desc: 'Thousands of happy travellers have trusted us with their Moroccan journey.' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-8 bg-[#FEF3C7]/40 rounded-2xl">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h3 className="font-bold text-[#1A1A2E] text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
              <div className="bg-[#1A1A2E] rounded-2xl p-10 text-center">
                <h2 className="font-display text-3xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>Ready to travel with us?</h2>
                <Link href={`/${locale}/contact`} className="btn-gold inline-flex mt-2">Get a Free Quote →</Link>
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
