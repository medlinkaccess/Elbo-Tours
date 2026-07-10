import Image from 'next/image';
import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WhatsAppButton from '@/components/chat/WhatsAppButton';
import { notFound } from 'next/navigation';
import { BlogJsonLd } from '@/components/JsonLd';

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

const BLOG_POSTS: Record<string, BlogPost> = {
  'best-marrakech-airport-transfer': {
    id: 'best-marrakech-airport-transfer',
    title: 'Best Marrakech Airport Transfer: Everything You Need to Know (2026)',
    titleFr: 'Meilleur Transfert Aéroport Marrakech : Tout Ce Que Vous Devez Savoir (2026)',
    excerpt: 'Compare taxis, shuttles and private transfers from Marrakech Menara Airport. Prices, travel times and tips for a stress-free arrival.',
    excerptFr: "Comparez taxis, navettes et transferts privés depuis l'aéroport de Marrakech. Prix, temps de trajet et conseils pour une arrivée sans stress.",
    category: 'Airport Transfer',
    date: '20 June 2026',
    image: '/images/hero-marrakech-transfer.jpg',
    content: [
      "You've just landed at Marrakech Menara Airport after a long flight. The last thing you want is to haggle with an unlicensed taxi driver or drag your luggage through a confusing arrivals hall. Getting your airport transfer right sets the tone for your entire Morocco trip.",
      'Marrakech Menara Airport (RAK) sits just 6 kilometres from Djemaa El Fna square — about a 15 to 25-minute drive depending on traffic. Despite the short distance, many visitors end up paying too much or waiting too long because they did not arrange transport in advance.',
      'Your options: Grand Taxis are large Mercedes sedans outside arrivals. You can hire one privately for 70–150 MAD, but drivers often overcharge tourists and negotiation is required. The Airport Bus (Line 19) runs to Djemaa El Fna for 30 MAD but has limited luggage space and drops you at a public square, not your hotel door.',
      'A pre-booked private transfer is what most experienced Morocco travellers choose. A professional driver meets you in arrivals with your name on a sign, helps with luggage, and takes you directly to your accommodation — no negotiation, no shared vehicles, no waiting. Elbo Tours offers fixed-price private transfers from 150 MAD with flight monitoring included.',
      'Important tip for medina arrivals: the Marrakech medina has very narrow streets — most vehicles cannot enter. Your driver will drop you at the nearest medina gate such as Bab Doukkala or Bab Laksour. With Elbo Tours, your driver knows exactly which gate is closest to your riad.',
      'Book in advance, especially for late-night arrivals or during peak season (March–May, October–November). Share your flight number so your driver can monitor delays. If you have more than 3 large bags, request a minivan rather than a sedan.',
    ],
    contentFr: [
      "Vous venez d'atterrir à l'aéroport de Marrakech Menara après un long vol. La dernière chose que vous souhaitez, c'est de négocier avec un chauffeur de taxi non agréé ou de traîner vos bagages dans un hall d'arrivée confus. Bien organiser votre transfert aéroport donne le bon ton à tout votre séjour au Maroc.",
      "L'aéroport Menara de Marrakech (RAK) se situe à seulement 6 kilomètres de la place Djemaa El Fna, soit environ 15 à 25 minutes en voiture selon la circulation. Malgré cette courte distance, beaucoup de visiteurs paient trop cher ou attendent trop longtemps faute d'avoir organisé leur transport à l'avance.",
      "Vos options : Les Grands Taxis sont de grandes Mercedes garées à la sortie des arrivées. Vous pouvez en louer un pour 70 à 150 MAD, mais les chauffeurs surfacturent souvent les touristes et une négociation s'impose. Le Bus Aéroport (Ligne 19) rejoint Djemaa El Fna pour 30 MAD mais la place pour les bagages est limitée et il vous dépose sur une place publique, pas devant votre hôtel.",
      "Un transfert privé réservé à l'avance est le choix de la plupart des voyageurs expérimentés au Maroc. Un chauffeur professionnel vous attend à la sortie des arrivées avec votre nom sur un panneau, vous aide avec les bagages et vous conduit directement à votre hébergement — sans négociation, sans partage, sans attente. Elbo Tours propose des transferts privés à prix fixe à partir de 150 MAD avec suivi de vol inclus.",
      "Important pour les arrivées en médina : les rues de la médina de Marrakech sont très étroites — la plupart des véhicules ne peuvent pas y entrer. Votre chauffeur vous déposera à la porte de médina la plus proche, comme Bab Doukkala ou Bab Laksour. Avec Elbo Tours, votre chauffeur connaît exactement quelle porte est la plus proche de votre riad.",
      "Réservez à l'avance, surtout pour les arrivées tardives ou en haute saison (mars-mai, octobre-novembre). Communiquez votre numéro de vol pour que votre chauffeur puisse suivre les retards. Si vous avez plus de 3 grands bagages, demandez un minivan plutôt qu'une berline.",
    ],
  },

  'best-desert-tour-from-marrakech': {
    id: 'best-desert-tour-from-marrakech',
    title: 'Best Desert Tour From Marrakech 2026: Sahara in 3, 5 or 7 Days',
    titleFr: 'Meilleur Circuit Désert Depuis Marrakech 2026 : Sahara en 3, 5 ou 7 Jours',
    excerpt: 'Planning a Sahara desert tour from Marrakech? Compare 3-day, 5-day and 7-day itineraries and what to expect at Merzouga.',
    excerptFr: "Vous planifiez un circuit désert depuis Marrakech ? Comparez les itinéraires de 3, 5 et 7 jours et découvrez Merzouga.",
    category: 'Desert Tours',
    date: '19 June 2026',
    image: '/images/hero-desert.jpg',
    content: [
      'The Sahara Desert is the reason many people visit Morocco. Golden dunes that stretch to the horizon, camel treks at sunset, nights in a luxury camp under a sky thick with stars — it is one of the most unforgettable travel experiences in the world.',
      "Merzouga and the Erg Chebbi dunes are Morocco's most famous desert destination, sitting roughly 550 kilometres southeast of Marrakech. The drive itself — crossing the High Atlas via Tizi n'Tichka, passing the UNESCO kasbah of Ait Ben Haddou, and descending into the palm-lined Draa Valley — is as spectacular as the destination.",
      '3-Day Desert Tour: The classic option. Day 1 takes you over the Atlas to Ait Ben Haddou and the Dades Gorge. Day 2 passes through the soaring Todra Gorge canyon before arriving at Merzouga for a sunset camel trek and a night in a luxury desert camp. Day 3 is the return journey to Marrakech.',
      '5-Day Tour: Adding two days transforms the experience — you can spend two nights in the desert, include a quad bike excursion in the dunes, and take a slower pace through the southern valleys.',
      '7-Day Marrakech to Fes via Desert: The most popular long-form route. Instead of returning to Marrakech, you continue north through the Ziz Palm Valley and arrive in Fes — Morocco\'s spiritual capital with its extraordinary 9th-century medina.',
      'Private tour vs group tour: Private tours offer flexible departure times, stops on your schedule, and your party only. For families, couples, or anyone who values flexibility, private is worth the difference. Elbo Tours specialises in private desert tours with vetted luxury camps — proper beds, hot showers, traditional Moroccan dinner, and live Gnawa music around the campfire.',
      'Best months: October, November, March, and April offer the most comfortable desert temperatures. Avoid July and August when Merzouga regularly exceeds 45°C.',
    ],
    contentFr: [
      "Le désert du Sahara est la raison pour laquelle de nombreuses personnes visitent le Maroc. Des dunes dorées à perte de vue, des randonnées à dos de chameau au coucher du soleil, des nuits dans un camp de luxe sous un ciel étoilé — c'est l'une des expériences de voyage les plus inoubliables au monde.",
      "Merzouga et les dunes de l'Erg Chebbi sont la destination désertique la plus célèbre du Maroc, à environ 550 kilomètres au sud-est de Marrakech. La route elle-même — traversant le Haut Atlas via Tizi n'Tichka, passant par la kasbah UNESCO d'Aït Ben Haddou et descendant dans la vallée du Draa bordée de palmiers — est aussi spectaculaire que la destination.",
      "Circuit Désert 3 Jours : L'option classique. Le jour 1 vous emmène au-delà de l'Atlas vers Aït Ben Haddou et les Gorges du Dadès. Le jour 2 traverse les majestueuses gorges du Todra avant d'arriver à Merzouga pour un trek en chameau au coucher du soleil et une nuit dans un camp de luxe. Le jour 3 est le voyage de retour vers Marrakech.",
      'Circuit 5 Jours : Ajouter deux jours transforme l\'expérience — vous pouvez passer deux nuits dans le désert, inclure une excursion en quad dans les dunes et prendre un rythme plus lent à travers les vallées du sud.',
      "Circuit 7 Jours Marrakech-Fès via le Désert : L'itinéraire long le plus populaire. Au lieu de retourner à Marrakech, vous continuez vers le nord à travers la vallée des palmiers du Ziz pour arriver à Fès — la capitale spirituelle du Maroc avec son extraordinaire médina du 9ème siècle.",
      "Circuit privé vs circuit en groupe : Les circuits privés offrent des horaires de départ flexibles, des arrêts selon votre programme et votre groupe uniquement. Pour les familles, les couples ou quiconque valorise la flexibilité, le privé vaut la différence de coût. Elbo Tours est spécialisé dans les circuits désert privés avec des camps de luxe sélectionnés.",
      'Meilleurs mois : Octobre, novembre, mars et avril offrent les températures désertiques les plus agréables. Évitez juillet et août lorsque Merzouga dépasse régulièrement 45°C.',
    ],
  },

  'morocco-itinerary-7-days': {
    id: 'morocco-itinerary-7-days',
    title: 'The Perfect Morocco Itinerary: 7 Days from Marrakech',
    titleFr: "L'Itinéraire Maroc Parfait : 7 Jours Depuis Marrakech",
    excerpt: 'The ultimate 7-day Morocco itinerary covering Marrakech, the Sahara desert, Fes, and more — with a private driver.',
    excerptFr: "L'itinéraire Maroc ultime de 7 jours : Marrakech, désert du Sahara, Fès et plus encore — avec chauffeur privé.",
    category: 'Travel Planning',
    date: '18 June 2026',
    image: '/images/hero-sahara.jpg',
    content: [
      "Seven days in Morocco is enough time to experience the country's greatest contrasts — ancient medinas and endless desert dunes, mountain passes and Atlantic coastlines, royal cities and Berber villages. But only if you plan it right.",
      'Day 1 — Arrive in Marrakech: Transfer from the airport to your riad in the medina. Head to Djemaa El Fna square at sunset — the greatest open-air theatre in the world, with snake charmers, musicians, and dozens of food stalls.',
      'Day 2 — Explore Marrakech: Visit the Bahia Palace, Saadian Tombs, the Mellah (old Jewish quarter), and the labyrinthine souks. Afternoon at Majorelle Garden. Rooftop dinner overlooking Djemaa El Fna.',
      "Day 3 — Marrakech to Dades Gorge: Cross the High Atlas via Tizi n'Tichka (2,260m). Stop at the UNESCO kasbah of Ait Ben Haddou (filming location for Gladiator and Game of Thrones). Drive through the Valley of Roses. Arrive at the dramatic red-rock Dades Gorge for sunset.",
      'Day 4 — Dades Gorge to Merzouga Sahara: Walk the 300-metre Todra Gorge canyon walls in the morning. Drive through the Ziz Palm Valley. Arrive Merzouga by afternoon — camel trek into the Erg Chebbi dunes at sunset. Overnight in a luxury desert camp with traditional dinner and live Gnawa music.',
      'Day 5 — Merzouga to Fes: Wake before sunrise for the Sahara at first light — the most photographed moment of the whole trip. Drive north through Rissani, the dramatic Ziz Gorges, and the cedar forests of Ifrane (watch for wild Barbary macaques). Arrive in Fes by evening.',
      "Day 6 — Explore Fes El Bali: The world's largest car-free urban area and a 9th-century city that has barely changed in a thousand years. Visit the Chouara Tanneries, Al-Qarawiyyin University (the oldest in the world), and the ornate Bou Inania Madrasa. Hire a local guide — the medina has 9,400 streets.",
      'Day 7 — Fes or Fly Home: Morning flight from Fes airport direct to Europe, or transfer to Casablanca (3.5 hours) for international connections. This one-way Marrakech-to-Fes route means you see twice the country without repeating roads.',
    ],
    contentFr: [
      "Sept jours au Maroc suffisent pour vivre les plus grands contrastes du pays — médinas anciennes et dunes de sable infinies, cols de montagne et côtes atlantiques, villes royales et villages berbères. Mais seulement si vous planifiez correctement.",
      'Jour 1 — Arrivée à Marrakech : Transfert de l\'aéroport à votre riad en médina. Direction la place Djemaa El Fna au coucher du soleil — le plus grand théâtre en plein air du monde, avec charmeurs de serpents, musiciens et dizaines d\'étals de nourriture.',
      'Jour 2 — Explorer Marrakech : Visitez le Palais Bahia, les Tombeaux Saâdiens, le Mellah (ancien quartier juif) et les souks labyrinthiques. Après-midi au Jardin Majorelle. Dîner sur les toits avec vue sur Djemaa El Fna.',
      "Jour 3 — Marrakech vers les Gorges du Dadès : Traversez le Haut Atlas via Tizi n'Tichka (2 260 m). Arrêt à la kasbah UNESCO d'Aït Ben Haddou (lieu de tournage de Gladiator et Game of Thrones). Traversée de la Vallée des Roses. Arrivée aux dramatiques Gorges du Dadès au coucher du soleil.",
      'Jour 4 — Gorges du Dadès vers le Sahara de Merzouga : Promenade dans les gorges du Todra (parois de 300 mètres) le matin. Route à travers la vallée des palmiers du Ziz. Arrivée à Merzouga l\'après-midi — trek en chameau dans les dunes de l\'Erg Chebbi au coucher du soleil. Nuit dans un camp de luxe avec dîner traditionnel et musique Gnawa en direct.',
      "Jour 5 — Merzouga vers Fès : Réveil avant l'aube pour voir le Sahara à la première lumière — le moment le plus photographié de tout le voyage. Route vers le nord à travers Rissani, les Gorges du Ziz et les forêts de cèdres d'Ifrane (guettez les macaques de Barbarie sauvages). Arrivée à Fès en soirée.",
      "Jour 6 — Explorer Fès El Bali : La plus grande zone urbaine sans voiture du monde, une ville du 9ème siècle qui n'a presque pas changé en mille ans. Visitez les Tanneries Chouara, l'Université Al-Qarawiyyin (la plus ancienne du monde) et la magnifique Medersa Bou Inania. Engagez un guide local — la médina compte 9 400 rues.",
      "Jour 7 — Fès ou Retour : Vol matinal depuis l'aéroport de Fès vers l'Europe, ou transfert vers Casablanca (3h30) pour les connexions internationales. Cet itinéraire aller simple Marrakech-Fès vous permet de voir deux fois plus de pays sans refaire la même route.",
    ],
  },

  'is-morocco-safe-for-tourists': {
    id: 'is-morocco-safe-for-tourists',
    title: 'Is Morocco Safe for Tourists in 2026? An Honest Guide',
    titleFr: 'Le Maroc Est-il Sûr pour les Touristes en 2026 ? Un Guide Honnête',
    excerpt: 'Morocco safety for solo travellers, women, and families — what to watch out for and how to travel smart, from local experts.',
    excerptFr: 'Sécurité au Maroc pour les voyageurs solo, les femmes et les familles — conseils pratiques d\'experts locaux.',
    category: 'Travel Tips',
    date: '17 June 2026',
    image: '/images/hero-essence.jpg',
    content: [
      'Morocco is one of the most-searched travel safety questions online — and one of the most misunderstood. The short answer is yes, Morocco is safe for tourists. Morocco consistently ranks as one of the safest countries in Africa and the Arab world for international visitors, welcoming over 13 million tourists per year.',
      'The real risks tourists face are not what most people imagine. Petty theft and pickpocketing is the most common issue — not violence. Djemaa El Fna in Marrakech, the Fes medina, and bus stations are the main hotspots. Keep your passport in your accommodation safe and carry only the cash you need.',
      'Unofficial guides and scams are the most common frustration for first-time visitors. In the medinas of Marrakech and Fes, strangers may offer to "help" with directions and then demand payment, or lead you to a shop where they earn commission. A polite but firm "No thank you" is enough. Having a private driver or guide from Elbo Tours means you never navigate these situations alone.',
      "Road safety is a genuine consideration. Morocco's mountain passes, particularly Tizi n'Tichka, require experience and care. This is a strong argument for using a professional private driver rather than renting a car for long inter-city journeys.",
      'For solo female travellers: many women travel Morocco solo every year with positive experiences. Dress modestly (cover shoulders and knees outside tourist areas), walk confidently, and avoid medina backstreets alone late at night. A private driver removes most situations where harassment can occur.',
      'For families: Morocco is an excellent family destination. Moroccans love children and they are welcomed warmly everywhere. Camel rides at Merzouga, the Barbary macaques in Ifrane, and quad biking in the Agafay Desert are huge hits with children.',
      'Quick safety tips: keep valuables in your accommodation safe, use official licensed guides and drivers, get travel insurance with medical evacuation cover, download an offline map (Maps.me works well), and have your accommodation address written in Arabic to show taxi drivers.',
    ],
    contentFr: [
      "Le Maroc est l'une des destinations pour lesquelles la sécurité est la plus recherchée en ligne — et l'une des plus mal comprises. La réponse courte est oui, le Maroc est sûr pour les touristes. Le Maroc se classe régulièrement parmi les pays les plus sûrs d'Afrique et du monde arabe pour les visiteurs internationaux, accueillant plus de 13 millions de touristes par an.",
      "Les vrais risques auxquels font face les touristes ne sont pas ce que la plupart des gens imaginent. Les petits vols et les pickpockets sont le problème le plus courant — pas la violence. La place Djemaa El Fna à Marrakech, la médina de Fès et les gares routières sont les principaux points chauds. Gardez votre passeport dans le coffre de votre hébergement et ne portez que l'argent liquide dont vous avez besoin.",
      "Les guides non officiels et les arnaques sont la frustration la plus courante des visiteurs novices. Dans les médinas de Marrakech et de Fès, des inconnus peuvent proposer de vous \"aider\" avec des directions puis réclamer un paiement, ou vous conduire dans une boutique où ils touchent une commission. Un \"Non merci\" poli mais ferme suffit. Avoir un chauffeur privé ou un guide d'Elbo Tours signifie que vous n'avez jamais à gérer ces situations seul.",
      "La sécurité routière est une vraie considération. Les cols de montagne du Maroc, notamment Tizi n'Tichka, nécessitent de l'expérience et de la prudence. C'est un argument solide pour utiliser un chauffeur privé professionnel plutôt que de louer une voiture pour les longs trajets inter-villes.",
      "Pour les voyageuses solo : de nombreuses femmes voyagent au Maroc en solo chaque année avec des expériences positives. Habillez-vous modestement (couvrez les épaules et les genoux hors des zones touristiques), marchez d'un pas assuré et évitez les ruelles de la médina seules tard le soir. Un chauffeur privé élimine la plupart des situations pouvant mener au harcèlement.",
      "Pour les familles : le Maroc est une excellente destination familiale. Les Marocains adorent les enfants et ils sont chaleureusement accueillis partout. Les balades en chameau à Merzouga, les macaques de Barbarie à Ifrane et le quad dans le désert d'Agafay sont des succès assurés auprès des enfants.",
      "Conseils de sécurité rapides : gardez vos objets de valeur dans le coffre de votre hébergement, utilisez des guides et chauffeurs officiels agréés, souscrivez une assurance voyage avec rapatriement médical, téléchargez une carte hors ligne (Maps.me fonctionne bien), et faites écrire l'adresse de votre hébergement en arabe pour la montrer aux chauffeurs de taxi.",
    ],
  },

  'best-time-to-visit-morocco': {
    id: 'best-time-to-visit-morocco',
    title: 'Best Time to Visit Morocco: Month by Month Guide 2026',
    titleFr: 'Meilleure Période pour Visiter le Maroc : Guide Mois par Mois 2026',
    excerpt: 'When is the best time to visit Morocco? A complete month-by-month guide covering weather, crowds, and the ideal season for desert tours.',
    excerptFr: 'Quelle est la meilleure période pour visiter le Maroc ? Guide complet mois par mois sur la météo, les foules et la saison idéale.',
    category: 'Travel Tips',
    date: '16 June 2026',
    image: '/images/hero-promo.jpg',
    content: [
      'Morocco is a year-round destination, but the timing of your visit makes a significant difference. The country spans Mediterranean coast, high mountain ranges, and Sahara Desert — each with its own climate.',
      'Best overall time: March to May and September to November are universally the best months. Temperatures are comfortable across all regions, the desert is warm but not dangerously hot, the Atlas passes are open, and wildflowers bloom in the valleys in spring.',
      "Spring (March–May): Peak season with perfect weather. The Valley of Roses blooms near Kelaat M'Gouna. Desert temperatures are ideal. Book tours and desert camps at least 3 weeks ahead.",
      'Summer (June–August): Marrakech and the desert get extremely hot — Merzouga regularly exceeds 45°C in July and August. However, coastal destinations like Essaouira are perfect in summer, cooled by Atlantic trade winds to around 25°C.',
      'Autumn (September–November): October is arguably the single best month to visit Morocco. Perfect temperatures everywhere including the desert. The date harvest season in the Draa and Ziz valleys. Fewer crowds than spring but similar weather.',
      'Winter (December–February): Cold nights in the desert (bring warm layers) but crystal clear skies and almost no other tourists. The almond trees in the Ourika Valley bloom in February. Morocco\'s Atlas ski resort at Oukaimeden is open. An underrated season for budget travellers.',
      'Best times for specific experiences: Sahara Desert Tours — October/November and March/April. Marrakech city — October through April. Atlas Mountains trekking — June through September (snow-free). Essaouira and the Atlantic coast — June through August. Families — March/May or October.',
    ],
    contentFr: [
      'Le Maroc est une destination accessible toute l\'année, mais le moment de votre visite fait une grande différence. Le pays s\'étend de la côte méditerranéenne aux hautes chaînes de montagnes en passant par le désert du Sahara — chacun avec son propre climat.',
      'Meilleure période globale : Mars à mai et septembre à novembre sont universellement les meilleurs mois. Les températures sont agréables dans toutes les régions, le désert est chaud mais pas dangereusement, les cols de l\'Atlas sont ouverts et les fleurs sauvages fleurissent dans les vallées au printemps.',
      "Printemps (mars-mai) : Haute saison avec une météo parfaite. La Vallée des Roses fleurit près de Kelaat M'Gouna. Les températures du désert sont idéales. Réservez vos circuits et camps du désert au moins 3 semaines à l'avance.",
      'Été (juin-août) : Marrakech et le désert deviennent extrêmement chauds — Merzouga dépasse régulièrement 45°C en juillet et août. Cependant, les destinations côtières comme Essaouira sont parfaites en été, rafraîchies par les vents alizés atlantiques à environ 25°C.',
      'Automne (septembre-novembre) : Octobre est sans doute le meilleur mois pour visiter le Maroc. Températures parfaites partout, y compris dans le désert. Saison de la récolte des dattes dans les vallées du Draa et du Ziz. Moins de foule qu\'au printemps mais météo similaire.',
      'Hiver (décembre-février) : Nuits froides dans le désert (prévoyez des vêtements chauds) mais ciel cristallin et presque aucun autre touriste. Les amandiers fleurissent dans la vallée de l\'Ourika en février. La station de ski de l\'Oukaimeden dans l\'Atlas est ouverte. Une saison sous-estimée pour les voyageurs avec un budget serré.',
      'Meilleures périodes pour des expériences spécifiques : Circuits désert Sahara — octobre/novembre et mars/avril. Ville de Marrakech — octobre à avril. Randonnée dans l\'Atlas — juin à septembre (sans neige). Essaouira et côte atlantique — juin à août. Familles — mars/mai ou octobre.',
    ],
  },

  'desert-camping-tips': {
    id: 'desert-camping-tips',
    title: 'Top 5 Tips for Desert Camping in Merzouga',
    titleFr: 'Top 5 Conseils pour le Camping dans le Désert de Merzouga',
    excerpt: 'Planning a trip to the Sahara? Here is everything you need to know about packing, stargazing, and riding camels.',
    excerptFr: "Vous prévoyez un voyage au Sahara ? Voici tout ce que vous devez savoir sur les bagages, l'observation des étoiles et les dromadaires.",
    category: 'Travel Tips',
    date: '15 June 2026',
    image: '/images/hero-desert.jpg',
    content: [
      'An overnight stay in the Erg Chebbi dunes near Merzouga is a highlight of any Moroccan adventure. However, sleeping in the desert requires some preparation to ensure you stay comfortable throughout the night.',
      '1. Pack Layers for the Night: While the Sahara is scorching hot during the day, temperatures drop drastically after sunset. Even in the summer, desert nights can feel chilly, so bring a warm fleece or jacket.',
      '2. Protect Your Electronics: Fine desert sand gets everywhere and can easily damage camera lenses and phone charging ports. Keep your devices in sealed ziplock bags when not in use.',
      '3. Stay Hydrated: Always bring more bottled water than you think you need. The dry desert air absorbs moisture rapidly from your body.',
      '4. Enjoy the Stargazing: Because there is virtually zero light pollution in the deep desert, you will see one of the clearest night skies of your life. Take some time to look up and experience the Milky Way.',
    ],
    contentFr: [
      "Un séjour d'une nuit dans les dunes de l'Erg Chebbi près de Merzouga est un moment fort de toute aventure marocaine. Cependant, dormir dans le désert nécessite une certaine préparation.",
      '1. Prévoyez des vêtements chauds pour la nuit : Alors que le Sahara est brûlant pendant la journée, les températures chutent considérablement après le coucher du soleil. Même en été, apportez une veste polaire.',
      '2. Protégez vos appareils électroniques : Le sable fin du désert s\'infiltre partout et peut endommager vos objectifs. Conservez vos téléphones dans des sacs hermétiques.',
      "3. Restez hydraté : Apportez toujours plus d'eau en bouteille que nécessaire. L'air sec du désert absorbe rapidement l'humidité de votre corps.",
      "4. Profitez des étoiles : En raison de l'absence de pollution lumineuse, vous verrez l'un des ciels nocturnes les plus clairs de votre vie.",
    ],
  },

  'marrakech-souks-guide': {
    id: 'marrakech-souks-guide',
    title: 'A Guide to Navigating the Souks of Marrakech',
    titleFr: 'Guide pour Naviguer dans les Souks de Marrakech',
    excerpt: 'Discover the art of haggling, the best spots to buy handmade spices, and how to avoid getting lost in the medina.',
    excerptFr: "Découvrez l'art du marchandage, les meilleurs endroits pour acheter des épices artisanales et comment ne pas vous perdre.",
    category: 'Guides',
    date: '10 June 2026',
    image: '/images/marrakech-souks.jpg',
    content: [
      'The souks of Marrakech are a sensory explosion of colors, smells, and sounds. While exciting, they can also feel overwhelming to first-time visitors.',
      "1. Getting Lost is Part of the Fun: The Medina is a massive labyrinth. Don't stress about getting lost; instead, embrace it as a way to discover hidden workshops and authentic courtyards.",
      '2. The Art of Haggling: Negotiation is expected. When a shopkeeper quotes a price, counter with 30% to 50% of their offer, and slowly work your way to a friendly middle ground.',
      '3. Be Polite but Firm: If you are not interested in an item, a polite "No, thank you" (or "La, Shukran" in Arabic) with a smile is enough to keep walking without being bothered.',
    ],
    contentFr: [
      "Les souks de Marrakech sont une explosion sensorielle de couleurs, d'odeurs et de sons. Bien qu'excitants, ils peuvent sembler impressionnants au début.",
      "1. Se perdre fait partie de l'expérience : La Médina est un immense labyrinthe. Ne stressez pas ; profitez-en plutôt pour découvrir des ateliers cachés.",
      "2. L'art du marchandage : La négociation est de mise. Lorsqu'un commerçant propose un prix, proposez 30 % à 50 % de son offre de départ.",
      '3. Soyez poli mais ferme : Si un article ne vous intéresse pas, un simple "Non, merci" ("La, Shukran" en arabe) avec un sourire suffit.',
    ],
  },

  'morocco-cultural-etiquette': {
    id: 'morocco-cultural-etiquette',
    title: 'What to Wear in Morocco: A Cultural Guide',
    titleFr: "Comment s'habiller au Maroc : Guide Culturel",
    excerpt: 'Travel respectfully while staying cool in the Moroccan heat. A complete guide to cultural clothing etiquette.',
    excerptFr: "Voyagez avec respect tout en restant au frais sous la chaleur marocaine. Un guide complet sur l'étiquette vestimentaire.",
    category: 'Culture',
    date: '02 June 2026',
    image: '/images/hero-sahara.jpg',
    content: [
      'Morocco is a deeply historical and conservative country where clothing carries cultural weight. Understanding what to wear helps you show respect to locals and avoids unwanted attention.',
      '1. Cover Shoulders and Knees: In public areas, both men and women should aim to cover their shoulders and knees. Loose, breathable linen trousers, maxi dresses, and t-shirts are excellent choices.',
      '2. Bring a Lightweight Scarf: For women, carrying a lightweight shawl or scarf is highly useful. You can use it to cover your head if visiting sacred religious sites, or shelter from sudden sun and wind.',
    ],
    contentFr: [
      "Le Maroc est un pays conservateur où les vêtements ont une importance culturelle. Comprendre comment s'habiller vous aide à montrer du respect.",
      '1. Couvrez les épaules et les genoux : Dans les espaces publics, hommes et femmes doivent couvrir leurs épaules et leurs genoux. Les pantalons en lin amples sont parfaits.',
      "2. Apportez une écharpe légère : Pour les femmes, un châle léger est très pratique pour couvrir la tête lors de visites de lieux sacrés.",
    ],
  },
};

export async function generateMetadata({ params }: { params: { locale: string; id: string } }): Promise<Metadata> {
  const post = BLOG_POSTS[params.id];
  if (!post) return { title: 'Article Not Found' };
  const title = params.locale === 'fr' ? post.titleFr || post.title : post.title;
  const description = params.locale === 'fr' ? post.excerptFr || post.excerpt : post.excerpt;
  return {
    title: `${title} | Elbo Tours Blog`,
    description,
    alternates: { canonical: `https://www.elbo-tours.com/${params.locale}/blog/${params.id}` },
    openGraph: {
      title,
      description,
      url: `https://www.elbo-tours.com/${params.locale}/blog/${params.id}`,
      type: 'article',
      images: [{ url: post.image, width: 1200, height: 630, alt: title }],
    },
  };
}

export default function BlogPostPage({ params }: { params: { locale: string; id: string } }) {
  const post = BLOG_POSTS[params.id];
  if (!post) notFound();

  const title = params.locale === 'fr' && post.titleFr ? post.titleFr : post.title;
  const content = params.locale === 'fr' && post.contentFr ? post.contentFr : post.content;

  return (
    <>
      <BlogJsonLd post={post} locale={params.locale} id={params.id} />
      <Navbar />
      <main className="pt-20 bg-white">
        <article className="max-w-4xl mx-auto px-4 py-12">
          <div className="mb-6">
            <Link href={`/${params.locale}/blog`} className="text-[#C8960C] hover:underline text-sm font-semibold flex items-center gap-1">
              ← {params.locale === 'fr' ? 'Retour au blog' : 'Back to Blog'}
            </Link>
          </div>
          <header className="mb-8">
            <span className="text-xs bg-[#FEF3C7] text-[#92400E] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
              {post.category}
            </span>
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A1A2E] mt-4 mb-4 leading-tight"
              style={{ fontFamily: 'var(--font-playfair),Georgia,serif' }}
            >
              {title}
            </h1>
            <p className="text-gray-400 text-sm">{post.date}</p>
          </header>
          <div className="relative h-[300px] sm:h-[450px] rounded-2xl overflow-hidden mb-10 shadow-md">
            <Image src={post.image} alt={title} fill sizes="(max-width: 768px) 100vw, 800px" className="object-cover" />
          </div>
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6 leading-relaxed">
            {content.map((paragraph, index) => (
              <p key={index} className="text-lg">
                {paragraph}
              </p>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-gray-500 mb-4">
              {params.locale === 'fr'
                ? "Besoin d'aide pour planifier votre propre aventure ? Contactez-nous !"
                : 'Need help planning your own Moroccan adventure? Reach out to us!'}
            </p>
            <a
              href={`https://wa.me/212665889258?text=Hi! I read your article "${title}" and want to plan a trip.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-xl transition-colors duration-200"
            >
              💬 {params.locale === 'fr' ? 'WhatsApp Expert Local' : 'WhatsApp Local Expert'}
            </a>
          </div>
        </article>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
