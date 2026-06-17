export interface Tour {
  slug: string;
  type: "multiday" | "excursion";
  days: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  heroImage: string;
  tags: string[];
  highlights: string[];
  overview: string;
  itinerary: { day: string; title: string; description: string }[];
  includes: string[];
  excludes: string[];
  departsFrom: string[];
}

export const tours: Tour[] = [
  {
    slug: "grand-maroc",
    type: "multiday",
    days: "12–14 days",
    title: "Grand Maroc Tour",
    metaTitle: "Grand Maroc Tour | 12–14 Day Private Morocco Tour | Elbo Tours",
    metaDescription: "The most complete Morocco tour: imperial cities, Sahara desert, High Atlas, Atlantic coast and Chefchaouen in one epic private journey. Departs any day from any city.",
    excerpt: "Morocco in its entirety — four imperial cities, the Sahara, the Atlas mountains, the blue city of Chefchaouen and the Atlantic coast in one unforgettable private road trip.",
    heroImage: "/images/tours/grand-maroc.jpg",
    tags: ["Family", "Luxury", "Desert", "Culture", "Nature"],
    highlights: [
      "All four imperial cities: Marrakech, Fès, Meknès & Rabat",
      "Camel trek and overnight in a Sahara desert camp at Erg Chebbi",
      "Aït Benhaddou UNESCO World Heritage kasbah",
      "Chefchaouen — the iconic blue mountain city",
      "Roman ruins of Volubilis and the holy village of Moulay Idriss",
      "Atlantic coast stop in Asilah or Essaouira",
      "Tizi n\'Tichka mountain pass at 2,260 m — North Africa\'s highest road"
    ],
    overview: "The Grand Maroc Tour is for travellers who want to experience everything Morocco has to offer without leaving anything out. From the dizzying energy of Marrakech\'s Djemaa el-Fna to the silence of the Sahara at dawn, from the medieval labyrinths of Fès to the indigo-painted alleys of Chefchaouen — this journey connects the country\'s greatest highlights in a single, seamlessly organised private tour. Your dedicated driver handles all logistics; you simply absorb the landscapes, the history and the stories along the way.",
    itinerary: [
      { day: "Day 1", title: "Arrival in Casablanca – Rabat", description: "Picked up at Casablanca airport. Visit the spectacular Hassan II Mosque — the world\'s second largest, built above the Atlantic on reclaimed seafloor. Drive north to Rabat, Morocco\'s elegant capital, to see the Hassan Tower, the Mohamed V Mausoleum and the 12th-century Oudayas Kasbah overlooking the estuary." },
      { day: "Day 2", title: "Rabat – Asilah – Tangier", description: "Head north along the Atlantic coast, stopping in Asilah — a whitewashed Portuguese-walled town transformed each summer by a mural art festival. Continue to Tangier for the night." },
      { day: "Day 3", title: "Tangier city tour", description: "Discover Tangier\'s legendary character: Cap Spartel lighthouse where two oceans meet, the Hercules Caves, the newly restored Kasbah and Sultan\'s Palace museum, the Petit Socco square and the buzzing medina." },
      { day: "Day 4", title: "Tangier – Tetouan – Chefchaouen", description: "Drive the Mediterranean coast to Tetouan, former capital of the Spanish Protectorate with a UNESCO-listed medina. Continue into the Rif mountains to Chefchaouen." },
      { day: "Day 5", title: "Chefchaouen", description: "A full day in Morocco\'s most photographed city. Wander the indigo-blue lanes, climb to the Spanish mosque viewpoint, browse the craft-filled medina and take tea in the Andalusian-style Uta al-Hammam square." },
      { day: "Day 6", title: "Chefchaouen – Volubilis – Meknès – Fès", description: "Morning walk by the river where women wash clothes in the traditional way. Visit Volubilis — Morocco\'s best-preserved Roman ruins with intact mosaics and a triumphal arch. Stop in imperial Meknès to see the monumental Bab Mansour gate before arriving in Fès." },
      { day: "Day 7", title: "Fès medina", description: "A full day with a local guide inside Fès el-Bali — the world\'s largest living medieval city. Highlights include the Chouara tanneries, Attarine and Bou Inania madrasas, Al-Qarawiyyin mosque (the oldest university on earth), and the golden gates of the Royal Palace." },
      { day: "Day 8", title: "Fès – Ifrane – Midelt – Ziz Valley", description: "Cross the Middle Atlas through Ifrane, stop to spot Barbary macaques in the ancient cedar forests of Azrou, then descend through Midelt and the dramatic Ziz Valley palm grove toward the desert." },
      { day: "Day 9", title: "Erfoud – Merzouga Sahara", description: "Arrive at the edge of the Erg Chebbi dunes. Optional fossil quarry visit. At sunset, mount a camel for the ride into camp. Dinner under the stars in a traditional Berber haima tent." },
      { day: "Day 10", title: "Merzouga desert day", description: "Sunrise walk on the dunes. Visit Khamlia village to hear traditional Gnawa music. Explore the Hassi Labied oasis. Free afternoon for the pool, quad biking or simply doing nothing in the silence of the Sahara." },
      { day: "Day 11", title: "Desert – Todra – Dadès", description: "Depart via Rissani market. Walk inside the towering Todra Gorge canyon. Wind through the Valley of a Thousand Kasbahs and the Rose Valley to Dadès Gorge." },
      { day: "Day 12", title: "Dadès – Ouarzazate – Aït Benhaddou", description: "Morning walk in Dadès Gorge\'s \"Monkey Fingers\" rock formations. Continue to Ouarzazate film studios (Gladiator, Game of Thrones). Visit the UNESCO kasbah of Aït Benhaddou." },
      { day: "Day 13", title: "Tizi n\'Tichka – Marrakech", description: "Cross North Africa\'s highest road pass and descend into Marrakech. Optional detour to the secretive Telouet Glaoui Palace along the ancient caravan route." },
      { day: "Day 14", title: "Marrakech & departure", description: "Morning in Marrakech: Majorelle Garden, Saadian Tombs or a final wander through the souks. Transfer to the airport at your chosen time." }
    ],
    includes: [
      "Private vehicle (4×4 or minibus) with professional driver throughout",
      "All ground transfers between cities",
      "Hand-picked riads, hotels and desert camp accommodation",
      "Camel trek at Erg Chebbi",
      "Airport pickups and drop-offs",
      "Flexible daily schedule — no fixed group timetable"
    ],
    excludes: ["International flights", "Meals (unless specified)", "Travel insurance", "Entry fees to monuments", "Local guides (available on request)", "Gratuities"],
    departsFrom: ["Casablanca", "Tangier", "Marrakech", "Fès", "Rabat"]
  },
  {
    slug: "classic-morocco",
    type: "multiday",
    days: "9–12 days",
    title: "Classic Morocco — Imperial Cities & Sahara",
    metaTitle: "Classic Morocco Tour | Imperial Cities & Sahara Desert | 9–12 Days | Elbo Tours",
    metaDescription: "Private tour of Morocco\'s four imperial cities and the Sahara desert. Culture, history and desert magic from Casablanca to Marrakech via Fès, Meknès, Volubilis and Erg Chebbi.",
    excerpt: "Morocco\'s greatest hits in one balanced private journey — four imperial cities, Roman ruins and the golden dunes of the Sahara.",
    heroImage: "/images/tours/classic-morocco.jpg",
    tags: ["Family", "Culture", "Desert", "Luxury"],
    highlights: [
      "Hassan II Mosque in Casablanca — second largest in the world",
      "Rabat: Hassan Tower, royal mausoleum and Oudayas Kasbah",
      "Meknès and the Roman ruins of Volubilis",
      "Full day in Fès el-Bali with a local guide",
      "Camel trek and night under the stars at Erg Chebbi",
      "Aït Benhaddou UNESCO kasbah",
      "Marrakech: Djemaa el-Fna, souks, palaces and gardens"
    ],
    overview: "The Classic Morocco tour distils the country\'s most iconic experiences into a perfectly paced private itinerary. You will walk through cities that have shaped civilisations for over a thousand years, sleep under Saharan stars, and traverse mountain passes that once carried caravan trade between Africa and Europe. Every day reveals a different Morocco — and your private driver adapts the pace entirely to you.",
    itinerary: [
      { day: "Day 1", title: "Casablanca – Rabat", description: "Arrive and visit Casablanca\'s monumental Hassan II Mosque. Drive on to Rabat — the quiet, elegant capital — for the Hassan Tower, Mohamed V Mausoleum and the Oudayas Kasbah above the Atlantic." },
      { day: "Day 2", title: "Rabat – Meknès – Volubilis – Fès", description: "Explore Meknès — the least-visited imperial city — and its vast Bab Mansour gate. Visit the Roman ruins of Volubilis, with intact mosaics and the Arch of Caracalla. Arrive in Fès." },
      { day: "Day 3", title: "Fès city tour", description: "Full day with a local guide in Fès el-Bali: Chouara tanneries, Bou Inania madrasa, Al-Qarawiyyin mosque, the Mellah and panoramic views from the hillside fortress." },
      { day: "Day 4", title: "Fès – Ifrane – Midelt – Erg Chebbi", description: "Cross the Middle Atlas via Ifrane and the Azrou cedar forest with its Barbary macaques. Descend through the Ziz Valley to the foot of the Erg Chebbi dunes. Sunset camel ride into camp." },
      { day: "Day 5", title: "Merzouga desert", description: "Sunrise on the dunes. Visit Khamlia village for Gnawa music. Explore the Hassi Labied oasis. Free afternoon at the hotel pool or on a quad." },
      { day: "Day 6", title: "Desert – Todra – Dadès", description: "Leave Merzouga via Rissani. Walk through Todra Gorge. Follow the Kasbahs route through the Rose Valley to Dadès Gorge." },
      { day: "Day 7", title: "Dadès – Aït Benhaddou – Marrakech", description: "Cross the Rose Valley, visit Ouarzazate film studios and the UNESCO kasbah of Aït Benhaddou. Cross the High Atlas via Tizi n\'Tichka and arrive in Marrakech." },
      { day: "Day 8", title: "Marrakech city tour", description: "Full day in Marrakech with a local guide: Bahia Palace, Saadian Tombs, Ben Youssef Madrasa, the tanneries and the legendary Djemaa el-Fna square." },
      { day: "Day 9", title: "Marrakech – departure", description: "Free morning for last-minute shopping or a visit to the Majorelle Garden. Transfer to Casablanca or Marrakech airport." }
    ],
    includes: [
      "Private vehicle with professional driver",
      "All ground transport",
      "Riads, hotels and desert camp",
      "Camel trek",
      "Airport transfers"
    ],
    excludes: ["Flights", "Meals", "Insurance", "Entry fees", "Local guides (optional)", "Gratuities"],
    departsFrom: ["Casablanca", "Rabat", "Marrakech", "Fès"]
  }
];

export function getTourBySlug(slug: string): Tour | undefined {
  return tours.find(t => t.slug === slug);
}

export function getToursByType(type: "multiday" | "excursion"): Tour[] {
  return tours.filter(t => t.type === type);
}



