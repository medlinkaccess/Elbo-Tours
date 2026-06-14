export interface Tour {
  slug: string;
  days: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  heroImage: string; // replace with your real image paths
  tags: string[];
  highlights: string[];
  itinerary: { day: string; title: string; description: string }[];
  includes: string[];
  excludes: string[];
  departsFrom: string[];
}

export const tours: Tour[] = [
  {
    slug: 'grand-maroc',
    days: '12–14 days',
    title: 'Grand Maroc Tour',
    metaTitle: 'Grand Maroc Tour | 12–14 Day Private Morocco Tour | Elbo Tours',
    metaDescription:
      'Explore all of Morocco in one epic private journey — imperial cities, Sahara desert dunes, Atlas mountains and the Atlantic coast. Fully tailor-made from any city.',
    excerpt:
      'The most complete Morocco experience: imperial cities, magical desert, Atlas mountains and the Atlantic coast — all in one unforgettable private journey.',
    heroImage: '/images/tours/grand-maroc.jpg',
    tags: ['Family', 'Luxury', 'Desert', 'Culture', 'Nature'],
    highlights: [
      'Visit all 4 imperial cities: Marrakech, Fès, Meknès & Rabat',
      'Night in a Sahara desert camp at Erg Chebbi',
      'Cross the High Atlas via the Tizi n\'Tichka pass',
      'Explore the ancient Kasbahs of the Draa valley',
      'Walk the blue streets of Chefchaouen',
      'Atlantic coast stop at Essaouira or Asilah',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival & Marrakech medina', description: 'Arrive in Marrakech. Your driver meets you at the airport or riad. Evening walk through Djemaa el-Fna square and the souks.' },
      { day: 'Day 2', title: 'Marrakech in depth', description: 'Full day in Marrakech — Bahia Palace, Saadian Tombs, Ben Youssef Madrasa, and the tanneries of the leather quarter.' },
      { day: 'Day 3', title: 'Over the Atlas to Ouarzazate', description: 'Drive south through the Tizi n\'Tichka mountain pass (2,260 m). Stop at Aït Benhaddou UNESCO kasbah. Arrive Ouarzazate.' },
      { day: 'Day 4', title: 'Draa Valley & rose-filled Dadès', description: 'Wind through the Valley of a Thousand Kasbahs along the Draa river. Overnight in Dadès gorge.' },
      { day: 'Day 5', title: 'Todra Gorge to Merzouga', description: 'Walk the towering Todra Gorge canyon walls, then continue east to Merzouga on the edge of the Sahara.' },
      { day: 'Day 6', title: 'Sahara — sunrise, camels & camp', description: 'Optional sunrise dune climb. Camel trek at sunset into Erg Chebbi. Overnight in a luxury desert camp under the stars.' },
      { day: 'Day 7', title: 'North towards Fès', description: 'Depart the desert. Drive through the Middle Atlas cedar forests and Berber market towns. Arrive Fès.' },
      { day: 'Day 8', title: 'Fès el-Bali — the ancient medina', description: 'Full day with a local guide in the UNESCO-listed Fès medina — tanneries, madrasas, spice souks and the Al-Qarawiyyin mosque.' },
      { day: 'Day 9', title: 'Meknès, Volubilis & Moulay Idriss', description: 'Visit Roman ruins at Volubilis, the holy town of Moulay Idriss, and imperial Meknès. Continue to Rabat or Chefchaouen.' },
      { day: 'Day 10', title: 'Chefchaouen — the blue city', description: 'Wander the famously photogenic blue-painted streets of Chaouen. Afternoon free to explore at your own pace.' },
      { day: 'Day 11', title: 'Atlantic coast & Asilah', description: 'Drive the coast to Asilah — a whitewashed Portuguese port town famous for its murals and relaxed pace.' },
      { day: 'Day 12', title: 'Essaouira or return to Marrakech', description: 'Option to extend to the windy Atlantic gem of Essaouira, or begin your return to Marrakech for departure.' },
    ],
    includes: [
      'Private 4×4 or minibus with professional driver-guide',
      'All ground transport throughout',
      'Hand-picked riads, hotels and desert camp (as per itinerary)',
      'Camel trek at Erg Chebbi',
      'Local guides at key sites',
      'Transfers to/from airport',
    ],
    excludes: [
      'International flights',
      'Meals (except where noted)',
      'Personal travel insurance',
      'Entry fees to monuments',
      'Tips (optional)',
    ],
    departsFrom: ['Marrakech', 'Casablanca', 'Tangier', 'Fès', 'Rabat'],
  },
  {
    slug: 'great-south',
    days: '7–11 days',
    title: 'The Great South: Marrakech, Atlas & Merzouga Desert',
    metaTitle: 'Marrakech to Sahara Desert Tour | 7–11 Days | Elbo Tours Morocco',
    metaDescription:
      'Private tour from Marrakech through the High Atlas, Kasbahs route and Draa Valley to the Sahara dunes of Merzouga. Fully customisable, departing any day.',
    excerpt:
      'Sahara dunes, towering Atlas passes, ancient Kasbahs and rose valleys — the south of Morocco in one magic private road trip from Marrakech.',
    heroImage: '/images/tours/great-south.jpg',
    tags: ['Adventure', 'Desert', 'Nature', 'Relax'],
    highlights: [
      'Cross the dramatic Tizi n\'Tichka mountain pass',
      'Aït Benhaddou UNESCO World Heritage kasbah',
      'Valley of a Thousand Kasbahs along the Draa',
      'Todra Gorge canyon walk',
      'Camel trek and desert camp at Erg Chebbi',
      'Rose Valley and Dadès gorge overnight',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Marrakech to Ouarzazate', description: 'Depart Marrakech over the High Atlas via Tizi n\'Tichka. Stop at the famous Aït Benhaddou kasbah, used as a film set for Game of Thrones and Gladiator.' },
      { day: 'Day 2', title: 'Draa Valley & Dadès Gorge', description: 'Follow the Valley of a Thousand Kasbahs south along the Draa river. Overnight in the dramatic Dadès gorge.' },
      { day: 'Day 3', title: 'Todra Gorge to Merzouga', description: 'Morning walk inside the narrow Todra canyon. Afternoon drive across the Tafilalet plains to Merzouga.' },
      { day: 'Day 4', title: 'Sahara — sunrise, dunes & camp', description: 'Free morning in Merzouga. Sunset camel trek into Erg Chebbi. Dinner and overnight in a tented desert camp.' },
      { day: 'Day 5', title: 'Return via southern route', description: 'Sunrise over the dunes. Drive back toward Marrakech via a different route through the south, seeing palm oases and Berber villages.' },
    ],
    includes: [
      'Private 4×4 with professional driver-guide',
      'All ground transport',
      'Riads, guesthouses and luxury desert camp',
      'Camel trek at Erg Chebbi',
      'Airport transfers',
    ],
    excludes: [
      'Flights',
      'Meals',
      'Insurance',
      'Entry fees',
      'Gratuities',
    ],
    departsFrom: ['Marrakech'],
  },
  {
    slug: 'north-morocco',
    days: '7–10 days',
    title: 'Discover the North of Morocco',
    metaTitle: 'North Morocco Tour | Tangier, Chefchaouen & Asilah | Elbo Tours',
    metaDescription:
      'Private tour of northern Morocco — Tangier, Tetouan, Chefchaouen blue city, Roman Volubilis and the art town of Asilah. Depart any day from Tangier or Casablanca.',
    excerpt:
      'Tangier\'s golden light, Chefchaouen\'s indigo alleys, Roman ruins, and the mural-painted walls of Asilah — the north of Morocco at its most authentic.',
    heroImage: '/images/tours/north-morocco.jpg',
    tags: ['Culture', 'Family', 'Luxury', 'Nature'],
    highlights: [
      'Tangier medina and Cap Spartel — where Atlantic meets Mediterranean',
      'Blue city of Chefchaouen',
      'Roman ruins at Volubilis',
      'Tetouan UNESCO medina',
      'Art murals of Asilah',
      'Larache and the ancient Phoenician port of Lixus',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Tangier arrival', description: 'Meet your driver at Tangier port or airport. Explore the casbah and medina. Sunset at Cap Spartel lighthouse.' },
      { day: 'Day 2', title: 'Tetouan — UNESCO medina', description: 'Drive to Tetouan, whose medina is a UNESCO World Heritage Site with strong Andalusian influence.' },
      { day: 'Day 3', title: 'Chefchaouen', description: 'Full day in the famous blue mountain city. Wander the dyed lanes, visit the Spanish mosque viewpoint, explore the central plaza.' },
      { day: 'Day 4', title: 'Volubilis & Moulay Idriss', description: 'Visit the best-preserved Roman ruins in Morocco and the holy hilltop village of Moulay Idriss.' },
      { day: 'Day 5', title: 'Asilah & Larache', description: 'Walk the whitewashed ramparts and colourful street-art murals of Asilah. Visit Lixus Phoenician ruins near Larache.' },
      { day: 'Day 6', title: 'Return to Tangier or continue south', description: 'Return transfer to Tangier port/airport, or extend your trip southward to Rabat and Casablanca.' },
    ],
    includes: [
      'Private vehicle with driver-guide',
      'All transfers and ground transport',
      'Hand-picked riads and boutique hotels',
      'Airport/port pickup and drop-off',
    ],
    excludes: ['Flights', 'Meals', 'Insurance', 'Entry fees', 'Gratuities'],
    departsFrom: ['Tangier', 'Casablanca', 'Rabat'],
  },
  {
    slug: 'marrakech-fes-desert',
    days: '3–6 days',
    title: 'Getaway: Marrakech to Fès via the Sahara',
    metaTitle: 'Marrakech to Fès via Sahara Desert | 3–6 Day Tour | Elbo Tours',
    metaDescription:
      'Private transfer tour from Marrakech to Fès through the Sahara — Atlas mountains, Erg Chebbi dunes, Ziz Valley and cedar forests. Perfect short break.',
    excerpt:
      'From Marrakech to ancient Fès via the Sahara — Atlas passes, Berber villages, golden dunes and the Ziz palm valley in one perfectly-paced short escape.',
    heroImage: '/images/tours/marrakech-fes.jpg',
    tags: ['Adventure', 'Culture', 'Desert', 'Nature', 'Luxury'],
    highlights: [
      'Aït Benhaddou kasbah stop',
      'Erg Chebbi Sahara dunes',
      'Camel trek and optional desert camp',
      'Ziz Valley palm oasis drive',
      'Middle Atlas cedar forests',
      'Arrive into ancient Fès',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Marrakech → Ouarzazate → Dadès', description: 'Early start over the High Atlas. Stop at Aït Benhaddou. Continue to Boumalne Dadès for the night.' },
      { day: 'Day 2', title: 'Todra Gorge → Merzouga Sahara', description: 'Todra canyon walk in the morning. Arrive Merzouga by afternoon. Sunset camel ride into Erg Chebbi. Desert camp overnight.' },
      { day: 'Day 3', title: 'Merzouga → Erfoud → Midelt → Fès', description: 'Sunrise on the dunes. Drive north through the Ziz Valley and cedar-forested Middle Atlas. Arrive Fès by evening.' },
    ],
    includes: [
      'Private 4×4 with driver-guide',
      'All transfers',
      'Riad/hotel accommodation',
      'Camel trek at Erg Chebbi',
      'Desert camp (standard or luxury)',
    ],
    excludes: ['Flights', 'Meals', 'Insurance', 'Entry fees', 'Gratuities'],
    departsFrom: ['Marrakech'],
  },
  {
    slug: 'classic-morocco',
    days: '9–12 days',
    title: 'Classic Morocco: Desert & Imperial Cities',
    metaTitle: 'Classic Morocco Tour | Imperial Cities & Sahara | 9–12 Days | Elbo Tours',
    metaDescription:
      'The classic Morocco tour: four imperial cities plus the Sahara desert in one private journey full of culture, history and magic. Departing from any city.',
    excerpt:
      'Morocco\'s greatest hits — four imperial cities and the Sahara in one perfectly balanced private tour full of culture, spice and desert magic.',
    heroImage: '/images/tours/classic-morocco.jpg',
    tags: ['Family', 'Culture', 'Desert', 'Luxury'],
    highlights: [
      'Marrakech, Fès, Meknès and Rabat — all 4 imperial cities',
      'Sahara dunes of Erg Chebbi',
      'Aït Benhaddou UNESCO kasbah',
      'Roman ruins of Volubilis',
      'Fès el-Bali medina with local guide',
      'Flexible pace — you set the speed',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Arrival in Casablanca or Marrakech', description: 'Meet your guide. Transfer to your riad. Evening to settle in and explore the first medina.' },
      { day: 'Day 2–3', title: 'Marrakech', description: 'Two full days — palaces, Majorelle garden, souks, food tour at Djemaa el-Fna.' },
      { day: 'Day 4', title: 'South to Ouarzazate', description: 'Atlas crossing, Aït Benhaddou stop, Ouarzazate film studios if interested.' },
      { day: 'Day 5–6', title: 'Desert at Merzouga', description: 'Dadès gorge, Todra canyon, then the Sahara. Camel trek and desert camp.' },
      { day: 'Day 7', title: 'Drive north to Fès', description: 'Through Ziz Valley and Middle Atlas cedar forests to imperial Fès.' },
      { day: 'Day 8', title: 'Fès medina', description: 'Full day with a local guide in one of the world\'s oldest medieval cities.' },
      { day: 'Day 9', title: 'Meknès, Volubilis & Rabat', description: 'Roman ruins, imperial Meknès gate, then on to the relaxed capital Rabat.' },
      { day: 'Day 10', title: 'Rabat & return', description: 'Rabat\'s kasbah and Hassan Tower. Return transfer to Casablanca or Marrakech for departure.' },
    ],
    includes: [
      'Private vehicle with professional driver-guide',
      'All ground transport',
      'Riads and desert camp accommodation',
      'Camel trek',
      'Local guides in Fès and Marrakech',
      'Airport transfers',
    ],
    excludes: ['Flights', 'Meals', 'Insurance', 'Entry fees', 'Gratuities'],
    departsFrom: ['Marrakech', 'Casablanca', 'Rabat', 'Fès'],
  },
  {
    slug: 'berber-villages',
    days: '10–12 days',
    title: 'Berber Villages Tour',
    metaTitle: 'Berber Villages Tour Morocco | 10–12 Days | Atlas & Sahara | Elbo Tours',
    metaDescription:
      'Immerse yourself in Berber culture on a private Morocco tour through the Middle Atlas, Berber market towns, cedar forests, lakes and the Erg Chebbi Sahara.',
    excerpt:
      'A slow, immersive journey through the heart of Berber Morocco — market villages, cedar forests, mountain lakes, waterfalls and the Sahara at journey\'s end.',
    heroImage: '/images/tours/berber-villages.jpg',
    tags: ['Adventure', 'Family', 'Nature', 'Culture', 'Desert'],
    highlights: [
      'Weekly Berber souks (market days) in small Atlas towns',
      'Ifrane — Morocco\'s "Little Switzerland"',
      'Azrou cedar forest and Barbary macaque monkeys',
      'Lakes of the Middle Atlas: Dayet Aoua & Aguelmame Azigza',
      'Ouzoud waterfalls — the highest in North Africa',
      'Erg Chebbi Sahara dunes',
    ],
    itinerary: [
      { day: 'Day 1', title: 'Marrakech arrival', description: 'Arrive Marrakech. Evening in the medina.' },
      { day: 'Day 2', title: 'Ouzoud Waterfalls', description: 'Drive to the spectacular 110m Ouzoud waterfalls. Swim in the pools, spot Barbary macaques on the cliffs.' },
      { day: 'Day 3', title: 'Middle Atlas — Khénifra & Berber souk', description: 'Visit a weekly Berber market. Drive through forested plateaus to Khénifra, heart of Zayane Berber country.' },
      { day: 'Day 4', title: 'Azrou cedar forest & Ifrane', description: 'Walk through ancient cedar forest. Visit Azrou\'s Barbary apes. See the alpine town of Ifrane.' },
      { day: 'Day 5', title: 'Atlas lakes & Midelt', description: 'Dayet Aoua and Aguelmame Azigza crater lakes. Picnic in the countryside. Overnight Midelt.' },
      { day: 'Day 6', title: 'Ziz Valley & Errachidia', description: 'Dramatic Ziz gorge and palm grove. Arrive Errachidia.' },
      { day: 'Day 7–8', title: 'Merzouga — Sahara', description: 'Merzouga dunes. Camel trek, desert camp, sunrise on Erg Chebbi.' },
      { day: 'Day 9', title: 'Dadès & Draa Valley', description: 'Return west via Rose Valley and the Draa kasbah route.' },
      { day: 'Day 10', title: 'Ouarzazate & Aït Benhaddou', description: 'Film city Ouarzazate. UNESCO kasbah at Aït Benhaddou.' },
      { day: 'Day 11', title: 'Return to Marrakech', description: 'Cross the Atlas and return to Marrakech. Farewell dinner in the medina.' },
    ],
    includes: [
      'Private 4×4 with Berber driver-guide',
      'All transport throughout',
      'Guesthouses, riads and desert camp',
      'Camel trek',
      'Airport transfers',
    ],
    excludes: ['Flights', 'Meals', 'Insurance', 'Entry fees', 'Gratuities'],
    departsFrom: ['Marrakech', 'Casablanca'],
  },
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}
