import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  titleFr?: string;
  excerpt: string;
  excerptFr?: string;
  category: string;
  date: string;
  image: string;
  content: string[];
  contentFr?: string[];
}

// Complete blog post data with articles
const BLOG_POSTS: Record<string, BlogPost> = {
  'desert-camping-tips': {
    id: 'desert-camping-tips',
    title: 'Top 5 Tips for Desert Camping in Merzouga',
    titleFr: 'Top 5 Conseils pour le Camping dans le Désert de Merzouga',
    excerpt: 'Planning a trip to the Sahara? Here is everything you need to know about packing, stargazing, and riding camels.',
    excerptFr: 'Vous prévoyez un voyage au Sahara ? Voici tout ce que vous devez savoir sur les bagages, l\'observation des étoiles et les dromadaires.',
    category: 'Travel Tips',
    date: '15 June 2026',
    image: '/images/hero-desert.jpg',
    content: [
      'An overnight stay in the Erg Chebbi dunes near Merzouga is a highlight of any Moroccan adventure. However, sleeping in the desert requires some preparation to ensure you stay comfortable throughout the night.',
      '1. Pack Layers for the Night: While the Sahara is scorching hot during the day, temperatures drop drastically after sunset. Even in the summer, desert nights can feel chilly, so bring a warm fleece or jacket.',
      '2. Protect Your Electronics: Fine desert sand gets everywhere and can easily damage camera lenses and phone charging ports. Keep your devices in sealed ziplock bags when not in use.',
      '3. Stay Hydrated: Always bring more bottled water than you think you need. The dry desert air absorbs moisture rapidly from your body.',
      '4. Enjoy the Stargazing: Because there is virtually zero light pollution in the deep desert, you will see one of the clearest night skies of your life. Take some time to look up and experience the Milky Way.'
    ],
    contentFr: [
      'Un séjour d\'une nuit dans les dunes de l\'Erg Chebbi près de Merzouga est un moment fort de toute aventure marocaine. Cependant, dormir dans le désert nécessite une certaine préparation.',
      '1. Prévoyez des vêtements chauds pour la nuit : Alors que le Sahara est brûlant pendant la journée, les températures chutent considérablement après le coucher du soleil. Même en été, apportez une veste polaire.',
      '2. Protégez vos appareils électroniques : Le sable fin du désert s\'infiltre partout et peut endommager vos objectifs. Conservez vos téléphones dans des sacs hermétiques.',
      '3. Restez hydraté : Apportez toujours plus d\'eau en bouteille que nécessaire. L\'air sec du désert absorbe rapidement l\'humidité de votre corps.',
      '4. Profitez des étoiles : En raison de l\'absence de pollution lumineuse, vous verrez l\'un des ciels nocturnes les plus clairs de votre vie.'
    ]
  },
  'marrakech-souks-guide': {
    id: 'marrakech-souks-guide',
    title: 'A Guide to Navigating the Souks of Marrakech',
    titleFr: 'Guide pour Naviguer dans les Souks de Marrakech',
    excerpt: 'Discover the art of haggling, the best spots to buy handmade spices, and how to avoid getting lost in the medina.',
    excerptFr: 'Découvrez l\'art du marchandage, les meilleurs endroits pour acheter des épices artisanales et comment ne pas vous perdre.',
    category: 'Guides',
    date: '10 June 2026',
    image: '/images/marrakech-souks.jpg',
    content: [
      'The souks of Marrakech are a sensory explosion of colors, smells, and sounds. While exciting, they can also feel overwhelming to first-time visitors.',
      '1. Getting Lost is Part of the Fun: The Medina is a massive labyrinth. Don\'t stress about getting lost; instead, embrace it as a way to discover hidden workshops and authentic courtyards.',
      '2. The Art of Haggling: Negotiation is expected. When a shopkeeper quotes a price, counter with 30% to 50% of their offer, and slowly work your way to a friendly middle ground.',
      '3. Be Polite but Firm: If you are not interested in an item, a polite "No, thank you" (or "La, Shukran" in Arabic) with a smile is enough to keep walking without being bothered.'
    ],
    contentFr: [
      'Les souks de Marrakech sont une explosion sensorielle de couleurs, d\'odeurs et de sons. Bien qu\'excitants, ils peuvent sembler impressionnants au début.',
      '1. Se perdre fait partie de l\'expérience : La Médina est un immense labyrinthe. Ne stressez pas ; profitez-en plutôt pour découvrir des ateliers cachés.',
      '2. L\'art du marchandage : La négociation est de mise. Lorsqu\'un commerçant propose un prix, proposez 30 % à 50 % de son offre de départ.',
      '3. Soyez poli mais ferme : Si un article ne vous intéresse pas, un simple "Non, merci" ("La, Shukran" en arabe) avec un sourire suffit.'
    ]
  },
  'morocco-cultural-etiquette': {
    id: 'morocco-cultural-etiquette',
    title: 'What to Wear in Morocco: A Cultural Guide',
    titleFr: 'Comment s\'habiller au Maroc : Guide Culturel',
    excerpt: 'Travel respectfully while staying cool in the Moroccan heat. A complete guide to cultural clothing etiquette.',
    excerptFr: 'Voyagez avec respect tout en restant au frais sous la chaleur marocaine. Un guide complet sur l\'étiquette vestimentaire.',
    category: 'Culture',
    date: '02 June 2026',
    image: '/images/hero-sahara.jpg',
    content: [
      'Morocco is a deeply historical and conservative country where clothing carries cultural weight. Understanding what to wear helps you show respect to locals and avoids unwanted attention.',
      '1. Cover Shoulders and Knees: In public areas, both men and women should aim to cover their shoulders and knees. Loose, breathable linen trousers, maxi dresses, and t-shirts are excellent choices.',
      '2. Bring a Lightweight Scarf: For women, carrying a lightweight shawl or scarf is highly useful. You can use it to cover your head if visiting sacred religious sites, or shelter from sudden sun and wind.'
    ],
    contentFr: [
      'Le Maroc est un pays conservateur où les vêtements ont une importance culturelle. Comprendre comment s\'habiller vous aide à montrer du respect.',
      '1. Couvrez les épaules et les genoux : Dans les espaces publics, hommes et femmes doivent couvrir leurs épaules et leurs genoux. Les pantalons en lin amples sont parfaits.',
      '2. Apportez une écharpe légère : Pour les femmes, un châle léger est très pratique pour couvrir la tête lors de visites de lieux sacrés.'
    ]
  }
};

// 1. DYNAMIC SEO METADATA FOR GOOGLE
export async function generateMetadata({ params }: { params: { locale: string; id: string } }): Promise<Metadata> {
  const post = BLOG_POSTS[params.id];
  if (!post) return { title: 'Article Not Found' };

  const title = params.locale === 'fr' ? post.titleFr : post.title;
  const description = params.locale === 'fr' ? post.excerptFr : post.excerpt;

  return {
    title: `${title} | Elbo Tours Blog`,
    description: description,
    alternates: {
      canonical: `https://elbo-tours.com/${params.locale}/blog/${params.id}`,
    },
    openGraph: {
      title: title,
      description: description,
      url: `https://elbo-tours.com/${params.locale}/blog/${params.id}`,
      type: 'article',
      images: [
        {
          url: post.image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
  };
}

// 2. ARTICLE PAGE COMPONENT (SERVER-SIDE RENDERED)
export default function BlogPostPage({ params }: { params: { locale: string; id: string } }) {
  const post = BLOG_POSTS[params.id];

  if (!post) {
    notFound();
  }

  const title = params.locale === 'fr' && post.titleFr ? post.titleFr : post.title;
  const content = params.locale === 'fr' && post.contentFr ? post.contentFr : post.content;

  return (
    <>
      <Navbar />
      <main className="pt-20 bg-white">
        <article className="max-w-4xl mx-auto px-4 py-12">
          {/* Back Button */}
          <div className="mb-6">
            <Link href={`/${params.locale}/blog`} className="text-[#C8960C] hover:underline text-sm font-semibold flex items-center gap-1">
              ← {params.locale === 'fr' ? 'Retour au blog' : 'Back to Blog'}
            </Link>
          </div>

          {/* Header Metadata */}
          <header className="mb-8">
            <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mt-4 mb-4 leading-tight" style={{fontFamily:'var(--font-playfair),Georgia,serif'}}>
              {title}
            </h1>
            <p className="text-gray-400 text-sm">{post.date}</p>
          </header>

          {/* Featured Image */}
          <div className="relative h-[300px] sm:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-md">
            <img src={post.image} alt={title} className="w-full h-full object-cover" />
          </div>

          {/* Rich Content Paragraphs */}
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6 leading-relaxed">
            {content.map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Social Share & Support CTA */}
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 mb-4">
              {params.locale === 'fr' 
                ? 'Besoin d\'aide pour planifier votre propre aventure ? Contactez-nous !' 
                : 'Need help planning your own Moroccan adventure? Reach out to us!'}
            </p>
            <a 
              href={`https://wa.me/212665889258?text=Hi! I read your article "${title}" and want to plan a trip.`}
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
            >
              💬 WhatsApp Local Expert
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}