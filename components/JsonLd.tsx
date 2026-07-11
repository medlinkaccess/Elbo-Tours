export function TourJsonLd({ tour, locale }: { tour: any; locale: string }) {
  const base = 'https://www.elbo-tours.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'TouristTrip',
    name: tour.title,
    description: tour.description,
    url: `${base}/${locale}/tours/${tour.slug}`,
    image: tour.imageUrl
      ? tour.imageUrl.startsWith('http')
        ? tour.imageUrl
        : `${base}${tour.imageUrl}`
      : undefined,
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
    url: 'https://www.elbo-tours.com',
    logo: 'https://www.elbo-tours.com/logos/elbo-logo.png',
    telephone: '+212665889258',
    additionalProperty: [
      { '@type': 'PropertyValue', name: 'phone2', value: '+212657257106' },
      { '@type': 'PropertyValue', name: 'phone3', value: '+212522713542' },
      { '@type': 'PropertyValue', name: 'phone4', value: '+212626553562' },
    ],
    email: 'elbotours2025@gmail.com',
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
    priceRange: '\u20ac\u20ac',
    currenciesAccepted: 'EUR, MAD',
    paymentAccepted: 'Cash, Bank Transfer, WhatsApp',
    areaServed: [
      { '@type': 'City', name: 'Marrakech' },
      { '@type': 'City', name: 'Casablanca' },
      { '@type': 'Country', name: 'Morocco' },
    ],
    sameAs: [
      'https://web.facebook.com/profile.php?id=61591918824325',
      'https://www.instagram.com/elbo_tours2026/',
      'https://www.youtube.com/channel/UCTeTlxxRzYHahE-D6TzPOlg',
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Morocco Tours & Transfers',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Private Tours Morocco' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Airport Transfers Marrakech' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Desert Tours Sahara' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'City to City Transfers Morocco' } },
      ],
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function TransfersJsonLd({ transfers, locale }: { transfers: any[]; locale: string }) {
  const base = 'https://www.elbo-tours.com';
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: transfers.map((t: any, i: number) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'Service',
        serviceType: t.type === 'AIRPORT' ? 'Airport Transfer' : 'City to City Transfer',
        name: t.title,
        description: t.description,
        provider: {
          '@type': 'TravelAgency',
          name: 'Elbo Tours',
          url: base,
          telephone: '+212665889258',
        },
        areaServed: {
          '@type': 'Place',
          name: t.fromLocation,
        },
        offers: {
          '@type': 'Offer',
          price: t.priceFrom > 0 ? t.priceFrom : undefined,
          priceCurrency: 'EUR',
          availability: 'https://schema.org/InStock',
          url: `${base}/${locale}/transfers`,
        },
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BlogJsonLd({ post, locale, id }: { post: any; locale: string; id: string }) {
  const base = 'https://www.elbo-tours.com';
  const title = locale === 'fr' && post.titleFr ? post.titleFr : post.title;
  const description = locale === 'fr' && post.excerptFr ? post.excerptFr : post.excerpt;
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description: description,
    image: post.image ? `${base}${post.image}` : undefined,
    datePublished: post.date,
    author: {
      '@type': 'Organization',
      name: 'Elbo Tours',
      url: base,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Elbo Tours',
      logo: {
        '@type': 'ImageObject',
        url: `${base}/logos/elbo-logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${base}/${locale}/blog/${id}`,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
