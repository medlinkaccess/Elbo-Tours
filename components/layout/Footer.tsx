import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';

export default function Footer() {
  const t = useTranslations('footer');
  const nav = useTranslations('nav');
  const locale = useLocale();

  return (
    <footer className="bg-[#1A1A2E] text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <Image
              src="https://elbo-tours.com/wp-content/uploads/2026/04/WhatsApp-Image-2026-04-02-at-01.39.26-Photoroom.png"
              alt="Elbo Tours"
              width={130}
              height={46}
              className="h-11 w-auto object-contain mb-4 brightness-0 invert"
            />
            <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{t('desc')}</p>
            <div className="flex gap-4 mt-5">
              <a href="https://wa.me/212665889258" className="w-9 h-9 rounded-full border border-gray-600 flex items-center justify-center hover:border-[#C8960C] hover:text-[#C8960C] transition-colors text-gray-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}`} className="hover:text-[#C8960C] transition-colors">{nav('home')}</Link></li>
              <li><Link href={`/${locale}/tours`} className="hover:text-[#C8960C] transition-colors">{nav('tours')}</Link></li>
              <li><Link href={`/${locale}/fleet`} className="hover:text-[#C8960C] transition-colors">{nav('fleet')}</Link></li>
              <li><Link href={`/${locale}/about`} className="hover:text-[#C8960C] transition-colors">{nav('about')}</Link></li>
              <li><Link href={`/${locale}/contact`} className="hover:text-[#C8960C] transition-colors">{nav('contact')}</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2"><span className="text-[#C8960C] mt-0.5">📍</span> Marrakech, Morocco</li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">📞</span><a href="tel:+212665889258" className="hover:text-[#C8960C]">+212 665-889258</a></li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">✉️</span><a href="mailto:contact@elbo-tours.com" className="hover:text-[#C8960C]">contact@elbo-tours.com</a></li>
              <li className="flex items-start gap-2"><span className="text-[#C8960C]">🕐</span> 7 days, 8am – 9pm</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-sm text-gray-500">
          <p>{t('copyright')}</p>
        </div>
      </div>
    </footer>
  );
}

