'use client';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';

// Mock data for Moroccan travel blog posts
const BLOG_POSTS = [
  {
    id: 'best-marrakech-airport-transfer',
    title: 'Best Marrakech Airport Transfer: Everything You Need to Know (2026)',
    titleFr: 'Meilleur Transfert Aéroport Marrakech : Tout Ce Que Vous Devez Savoir (2026)',
    excerpt: 'Compare taxis, shuttles and private transfers from Marrakech Menara Airport. Prices, travel times and tips for a stress-free arrival.',
    excerptFr: "Comparez taxis, navettes et transferts privés depuis l'aéroport de Marrakech. Prix, temps de trajet et conseils pour une arrivée sans stress.",
    category: 'Airport Transfer',
    date: '20 June 2026',
    image: '/images/hero-marrakech-transfer.jpg',
  },
  {
    id: 'best-desert-tour-from-marrakech',
    title: 'Best Desert Tour From Marrakech 2026: Sahara in 3, 5 or 7 Days',
    titleFr: 'Meilleur Circuit Désert Depuis Marrakech 2026 : Sahara en 3, 5 ou 7 Jours',
    excerpt: 'Planning a Sahara desert tour from Marrakech? Compare 3-day, 5-day and 7-day itineraries and what to expect at Merzouga.',
    excerptFr: 'Vous planifiez un circuit désert depuis Marrakech ? Comparez les itinéraires de 3, 5 et 7 jours et découvrez Merzouga.',
    category: 'Desert Tours',
    date: '19 June 2026',
    image: '/images/hero-desert.jpg',
  },
  {
    id: 'morocco-itinerary-7-days',
    title: 'The Perfect Morocco Itinerary: 7 Days from Marrakech',
    titleFr: "L'Itinéraire Maroc Parfait : 7 Jours Depuis Marrakech",
    excerpt: 'The ultimate 7-day Morocco itinerary covering Marrakech, the Sahara desert, Fes, and more — with a private driver.',
    excerptFr: "L'itinéraire Maroc ultime de 7 jours : Marrakech, désert du Sahara, Fès et plus encore — avec chauffeur privé.",
    category: 'Travel Planning',
    date: '18 June 2026',
    image: '/images/hero-sahara.jpg',
  },
  {
    id: 'is-morocco-safe-for-tourists',
    title: 'Is Morocco Safe for Tourists in 2026? An Honest Guide',
    titleFr: 'Le Maroc Est-il Sûr pour les Touristes en 2026 ? Un Guide Honnête',
    excerpt: 'Morocco safety for solo travellers, women, and families — what to watch out for and how to travel smart, from local experts.',
    excerptFr: "Sécurité au Maroc pour les voyageurs solo, les femmes et les familles — conseils pratiques d'experts locaux.",
    category: 'Travel Tips',
    date: '17 June 2026',
    image: '/images/hero-essence.jpg',
  },
  {
    id: 'best-time-to-visit-morocco',
    title: 'Best Time to Visit Morocco: Month by Month Guide 2026',
    titleFr: 'Meilleure Période pour Visiter le Maroc : Guide Mois par Mois 2026',
    excerpt: 'When is the best time to visit Morocco? A complete month-by-month guide covering weather, crowds, and the ideal season for desert tours.',
    excerptFr: 'Quelle est la meilleure période pour visiter le Maroc ? Guide complet mois par mois sur la météo, les foules et la saison idéale.',
    category: 'Travel Tips',
    date: '16 June 2026',
    image: '/images/hero-promo.jpg',
  },
  {
    id: 'desert-camping-tips',
    title: 'Top 5 Tips for Desert Camping in Merzouga',
    titleFr: 'Top 5 Conseils pour le Camping dans le Désert de Merzouga',
    excerpt: 'Planning a trip to the Sahara? Here is everything you need to know about packing, stargazing, and riding camels.',
    excerptFr: "Vous prévoyez un voyage au Sahara ? Voici tout ce que vous devez savoir sur les bagages, l'observation des étoiles et les dromadaires.",
    category: 'Travel Tips',
    date: '15 June 2026',
    image: '/images/hero-desert.jpg',
  },
  {
    id: 'marrakech-souks-guide',
    title: 'A Guide to Navigating the Souks of Marrakech',
    titleFr: 'Guide pour Naviguer dans les Souks de Marrakech',
    excerpt: 'Discover the art of haggling, the best spots to buy handmade spices, and how to avoid getting lost in the medina.',
    excerptFr: "Découvrez l'art du marchandage, les meilleurs endroits pour acheter des épices artisanales et comment ne pas vous perdre.",
    category: 'Guides',
    date: '10 June 2026',
    image: '/images/marrakech-souks.jpg',
  },
  {
    id: 'morocco-cultural-etiquette',
    title: 'What to Wear in Morocco: A Cultural Guide',
    titleFr: "Comment s'habiller au Maroc : Guide Culturel",
    excerpt: 'Travel respectfully while staying cool in the Moroccan heat. A complete guide to cultural clothing etiquette.',
    excerptFr: "Voyagez avec respect tout en restant au frais sous la chaleur marocaine. Un guide complet sur l'étiquette vestimentaire.",
    category: 'Culture',
    date: '02 June 2026',
    image: '/images/hero-sahara.jpg',
  },
];

export default function BlogClient() {
  const locale = useLocale();

  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* HERO BANNER */}
        <section className="relative py-20 bg-[#1A1A2E] overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at 20% 50%, #C8960C 0%, transparent 60%), radial-gradient(circle at 80% 50%, #C8440A 0%, transparent 60%)'}} />
          <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
            <span className="inline-flex items-center gap-2 bg-[#C8960C]/20 border border-[#C8960C]/40 text-[#F0C040] text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              ✍️ Elbo Tours Blog
            </span>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>
              Moroccan Travel Stories
            </h1>
            <p className="text-gray-300 text-lg max-w-xl mx-auto">
              Insights, tips, and cultural guides written by local experts to help you prepare for your journey.
            </p>
          </div>
        </section>

        {/* ARTICLES GRID */}
        <section className="py-16 bg-gray-50 min-h-[60vh]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {BLOG_POSTS.map((post) => {
                const title = locale === 'fr' ? post.titleFr : post.title;
                const excerpt = locale === 'fr' ? post.excerptFr : post.excerpt;

                return (
                  <article key={post.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col">
                    {/* Image Area */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      <img
                        src={post.image}
                        alt={title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    </div>

                    {/* Content Area */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider">
                          {post.category}
                        </span>
                        <span className="text-xs text-gray-400">
                          {post.date}
                        </span>
                      </div>

                      <h3 className="font-semibold text-xl text-[#1A1A2E] mb-2 leading-snug hover:text-[#C8960C] transition-colors">
                        <Link href={`/${locale}/blog/${post.id}`}>
                          {title}
                        </Link>
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed mb-5 flex-1">
                        {excerpt}
                      </p>

                      <div className="pt-4 border-t border-gray-100">
                        <Link href={`/${locale}/blog/${post.id}`} className="text-[#C8960C] text-sm font-semibold hover:underline flex items-center gap-1">
                          {locale === 'fr' ? 'Lire la suite' : 'Read Article'} →
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
