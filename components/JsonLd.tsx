export function TourJsonLd({ tour, locale }: { tour: any; locale: string }) {
  const base = 'https://elbo-tours.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    url: `${base}/${locale}/tours/${tour.slug}`,
    image: tour.imageUrl ? `${base}${tour.imageUrl}` : undefined,
    touristType: 'Tourists',
    provider: {
      '@type': 'TravelAgency',
      name: 'Elbo Tours',
      url: base,
      telephone: '+212665889258',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Marrakech',
        addressCountry: 'MA',
      },
    },
    offers: {
      '@type': 'Offer',
      price: tour.priceFrom > 0 ? tour.priceFrom : undefined,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: `${base}/${locale}/tours/${tour.slug}`,
    },
    duration: tour.durationDays ? `P${tour.durationDays}D` : undefined,
    itinerary: tour.itinerary?.map((day: any) => ({
      '@type': 'TouristAttraction',
      name: day.title,
      description: day.description,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function LocalBusinessJsonLd() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    name: 'Elbo Tours',
    url: 'https://elbo-tours.com',
    logo: 'https://elbo-tours.com/logos/elbo-logo.png',
    telephone: '+212665889258',
    email: 'contact@elbo-tours.com',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Marrakech',
      addressRegion: 'Marrakech-Safi',
      addressCountry: 'MA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 31.6295,
      longitude: -7.9811,
    },
    openingHours: 'Mo-Su 08:00-20:00',
    priceRange: '€€',
    sameAs: [
      'https://www.facebook.com/elbotours',
      'https://www.instagram.com/elbotours',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Morocco Tours & Transfers',
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}