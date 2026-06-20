"use client";
import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';

export default function ContactPage() {
  const t = useTranslations('contact');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="section-badge">{t('badge')}</span>
              <h1 className="font-display text-4xl font-bold text-[#1A1A2E] mt-2" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>{t('title')}</h1>
              <p className="text-gray-500 mt-4 max-w-xl mx-auto">{t('subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Form */}
              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                {sent ? (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="text-xl font-semibold text-[#1A1A2E] mb-2">Message sent!</h3>
                    <p className="text-gray-500">We will get back to you shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <input type="text" placeholder={t('name')} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C]" />
                    <input type="email" placeholder={t('email')} required className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C]" />
                    <input type="tel" placeholder={t('phone')} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C]" />
                    <input type="text" placeholder={t('destination')} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C]" />
                    <textarea placeholder={t('message')} rows={4} className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#C8960C] resize-none" />
                    <button type="submit" className="btn-gold w-full justify-center">{t('send')}</button>
                  </form>
                )}
              </div>

              {/* Info */}
              <div className="space-y-6">
                {[
                  {
                    icon: '📞', label: 'Phone',
                    items: (({ value: string; href?: string })[]) & typeof items; items: [
                      { value: '+212 665-889258', href: 'tel:+212665889258' },
                      { value: '+212 657-257106', href: 'tel:+212657257106' },
                      { value: '+212 522-713542', href: 'tel:+212522713542' },
                    ],
                  },
                  {
                    icon: '✉️', label: 'Email',
                    items: (({ value: string; href?: string })[]) & typeof items; items: [
                      { value: 'elbotours2025@gmail.com', href: 'mailto:elbotours2025@gmail.com' },
                    ],
                  },
                  {
                    icon: '📍', label: 'Location',
                    items: (({ value: string; href?: string })[]) & typeof items; items: [
                      { value: t('info.address_marrakech') },
                      { value: t('info.address_casablanca') },
                    ],
                  },
                  {
                    icon: '🕐', label: 'Hours',
                    items: (({ value: string; href?: string })[]) & typeof items; items: [ { value: t('info.hours') } ],
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 bg-gray-50 rounded-xl p-5">
                    <span className="text-2xl">{item.icon}</span>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">{item.label}</div>
                      {item.items.map((line: { value: string; href?: string }, j) => (
                        line.href ? (
                          <a key={j} href={line.href} className="font-semibold text-[#1A1A2E] hover:text-[#C8960C] block">{line.value}</a>
                        ) : (
                          <div key={j} className="font-semibold text-[#1A1A2E]">{line.value}</div>
                        )
                      ))}
                    </div>
                  </div>
                ))}
                <a href="https://wa.me/212665889258" target="_blank" rel="noopener noreferrer" className="btn-gold w-full justify-center mt-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  {t('whatsapp')}
                </a>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Marrakech Office</div>
                      <iframe
                        src="https://www.google.com/maps?q=31.634016,-8.054315&z=15&output=embed"
                        width="100%" height="220" style={{ border: 0, borderRadius: '12px' }}
                        loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        title="Marrakech Office Location"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">Casablanca Office</div>
                      <iframe
                        src="https://www.google.com/maps?q=33.572108,-7.553564&z=15&output=embed"
                        width="100%" height="220" style={{ border: 0, borderRadius: '12px' }}
                        loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                        title="Casablanca Office Location"
                      />
                    </div>
                  </div>
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



