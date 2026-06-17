'use client';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';

// Mock data for Moroccan travel blog posts
const BLOG_POSTS = [
  {
    id: 'desert-camping-tips',
    title: 'Top 5 Tips for Desert Camping in Merzouga',
    titleFr: 'Top 5 Conseils pour le Camping dans le Désert de Merzouga',
    excerpt: 'Planning a trip to the Sahara? Here is everything you need to know about packing, stargazing, and riding camels.',
    excerptFr: 'Vous prévoyez un voyage au Sahara ? Voici tout ce que vous devez savoir sur les bagages, l\'observation des étoiles et les dromadaires.',
    category: 'Travel Tips',
    date: '15 June 2026',
    image: '/images/hero-desert.jpg', // Uses your existing desert image
  },
  {
    id: 'marrakech-souks-guide',
    title: 'A Guide to Navigating the Souks of Marrakech',
    titleFr: 'Guide pour Naviguer dans les Souks de Marrakech',
    excerpt: 'Discover the art of haggling, the best spots to buy handmade spices, and how to avoid getting lost in the medina.',
    excerptFr: 'Découvrez l\'art du marchandage, les meilleurs endroits pour acheter des épices artisanales et comment ne pas vous perdre.',
    category: 'Guides',
    date: '10 June 2026',
    image: '/images/marrakech-souks.jpg', // Uses your existing cities image
  },
  {
    id: 'morocco-cultural-etiquette',
    title: 'What to Wear in Morocco: A Cultural Guide',
    titleFr: 'Comment s\'habiller au Maroc : Guide Culturel',
    excerpt: 'Travel respectfully while staying cool in the Moroccan heat. A complete guide to cultural clothing etiquette.',
    excerptFr: 'Voyagez avec respect tout en restant au frais sous la chaleur marocaine. Un guide complet sur l\'étiquette vestimentaire.',
    category: 'Culture',
    date: '02 June 2026',
    image: '/images/hero-sahara.jpg', // Uses your existing sahara image
  }
];

export default function BlogPage() {
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