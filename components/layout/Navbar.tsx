'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { GB, FR } from 'country-flag-icons/react/3x2';

export default function Navbar() {
  const t = useTranslations('nav');
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === 'en' ? 'fr' : 'en';

  const localeFlags = { en: GB, fr: FR };
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  const links = [
    { href: `/${locale}`, label: t('home') },
    { href: `/${locale}/tours`, label: t('tours') },
    { href: `/${locale}/transfers`, label: locale === 'fr' ? 'Transferts' : 'Transfers' },
    { href: `/${locale}/fleet`, label: t('fleet') },
    { href: `/${locale}/about`, label: t('about') },
    { href: `/${locale}/blog`, label: 'Blog' }, // Added Blog Link here
    { href: `/${locale}/contact`, label: t('contact') },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-28">
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Elbo Tours"
              width={220}
              height={160}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === l.href
                    ? 'text-[#C8960C] font-semibold'
                    : 'text-gray-700 hover:text-[#C8960C]'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <a href={`tel:${t('phone')}`} className="text-sm font-semibold text-[#1A1A2E] flex items-center gap-2">
              <svg className="w-4 h-4 text-[#C8960C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {t('phone')}
            </a>
            <Link href={switchPath} className="text-xs font-bold border border-gray-300 rounded px-2 py-1 text-gray-600 hover:border-[#C8960C] hover:text-[#C8960C] transition-colors uppercase">
              {(() => { const Flag = localeFlags[otherLocale]; return <Flag className="w-5 h-3.5 rounded-sm" />; })()} <span>{otherLocale}</span>
            </Link>
            <Link href={`/${locale}/contact`} className="btn-gold !py-2.5 !px-5 text-sm">
              {t('book')}
            </Link>
          </div>

          <button className="lg:hidden p-2 text-[#1A1A2E]" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block text-sm font-medium text-gray-700 py-2 hover:text-[#C8960C]" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href={switchPath} className="text-xs font-bold border border-gray-300 rounded px-3 py-2 uppercase text-gray-600 flex items-center gap-1.5">{(() => { const Flag = localeFlags[otherLocale]; return <Flag className="w-5 h-3.5 rounded-sm" />; })()} <span>{otherLocale}</span></Link>
            <Link href={`/${locale}/contact`} className="btn-gold !py-2 !px-5 text-sm" onClick={() => setOpen(false)}>{t('book')}</Link>
          </div>
        </div>
      )}
    </header>
  );
}