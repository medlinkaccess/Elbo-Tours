import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'fr', 'es', 'ar'];

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  
  // Standard JavaScript validation instead of broken next-intl import
  const locale = (requested && locales.includes(requested)) ? requested : 'en';

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
