const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: 'E:/projects/Elbo-Tours/.env.local' });
const sql = neon(process.env.DATABASE_URL);
const { randomUUID } = require('crypto');

async function seed() {
  const blogs = [
    { slug: 'desert-camping-tips', image: '/images/hero-desert.jpg',
      title: 'Top 5 Tips for Desert Camping in Merzouga', titleFr: 'Top 5 Conseils pour le Camping dans le Desert de Merzouga',
      excerpt: 'Planning a trip to the Sahara? Everything you need to know about packing, stargazing, and riding camels.',
      excerptFr: 'Vous prevoyez un voyage au Sahara ? Voici tout ce que vous devez savoir.',
      content: ['The Sahara desert is one of the most magical places on earth.','Pack light but smart - temperatures drop dramatically at night.','Book a guided camel trek for sunrise over the dunes.','Choose a camp with proper sleeping bags rated for cold nights.','Leave no trace and respect the desert ecosystem.'],
      contentFr: ['Le desert du Sahara est lun des endroits les plus magiques de la planete.','Emportez peu mais bien - les temperatures chutent considerablement la nuit.']
    },
    { slug: 'marrakech-souks-guide', image: '/images/marrakech-souks.jpg',
      title: 'A Guide to Navigating the Souks of Marrakech', titleFr: 'Guide pour Naviguer dans les Souks de Marrakech',
      excerpt: 'Discover the art of haggling, the best spots to buy handmade spices, and how to avoid getting lost in the medina.',
      excerptFr: 'Decouvrez lart du marchandage et les meilleurs endroits pour acheter des epices artisanales.',
      content: ['The souks of Marrakech are a labyrinth of colour, scent and sound.','Start at Djemaa el-Fna square and work your way inward.','Haggling is expected - start at 40% of the asking price.','The spice souk near the Mouassine mosque is unmissable.','Hire a local guide for your first visit to avoid getting lost.'],
      contentFr: ['Les souks de Marrakech sont un labyrinthe de couleurs, de parfums et de sons.','Commencez par la place Djemaa el-Fna et avancez vers linterieur.']
    },
    { slug: 'morocco-cultural-etiquette', image: '/images/hero-sahara.jpg',
      title: 'What to Wear in Morocco: A Cultural Guide', titleFr: 'Comment shabiller au Maroc : Guide Culturel',
      excerpt: 'Travel respectfully while staying cool in the Moroccan heat. A complete guide to cultural clothing etiquette.',
      excerptFr: 'Voyagez avec respect tout en restant au frais sous la chaleur marocaine.',
      content: ['Morocco is a Muslim country and modest dress is appreciated.','For women, covering shoulders and knees is recommended in medinas.','Men should avoid sleeveless tops in religious sites.','Light cotton fabrics work best in the summer heat.','A light scarf is useful for both sun protection and modesty.'],
      contentFr: ['Le Maroc est un pays musulman et une tenue vestimentaire modeste est appreciee.','Pour les femmes, couvrir les epaules et les genoux est recommande dans les medinas.']
    }
  ];

  for (const b of blogs) {
    const id = randomUUID();
    await sql.query('INSERT INTO blogs (id, slug, "imageUrl", status, "createdAt", "updatedAt") VALUES ($1,$2,$3,$4,NOW(),NOW()) ON CONFLICT (slug) DO NOTHING', [id, b.slug, b.image, 'PUBLISHED']);
    const row = await sql.query('SELECT id FROM blogs WHERE slug=$1', [b.slug]);
    const bid = row[0].id;
    await sql.query('DELETE FROM blog_translations WHERE "blogId"=$1', [bid]);
    await sql.query('INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,$3,$4,$5,$6)', [randomUUID(), bid, 'en', b.title, b.excerpt, b.content]);
    await sql.query('INSERT INTO blog_translations (id, "blogId", locale, title, excerpt, content) VALUES ($1,$2,$3,$4,$5,$6)', [randomUUID(), bid, 'fr', b.titleFr, b.excerptFr, b.contentFr]);
    console.log('seeded blog:', b.slug);
  }

  const fleet = [
    { slug: 'sedan', passengers: 3, bags: 3, image: '', name: 'Sedan', nameFr: 'Berline', desc: 'Comfortable sedan for up to 3 passengers.', descFr: 'Berline confortable pour 3 passagers.' },
    { slug: 'minivan', passengers: 6, bags: 6, image: '/images/fleet/minivan.jpg', name: 'Minivan', nameFr: 'Minivan', desc: 'Spacious minivan ideal for families and small groups.', descFr: 'Minivan spacieux ideal pour les familles et petits groupes.' },
    { slug: 'minibus', passengers: 14, bags: 14, image: '', name: 'Minibus', nameFr: 'Minibus', desc: 'Large minibus for groups up to 14 passengers.', descFr: 'Grand minibus pour les groupes jusqu a 14 passagers.' }
  ];

  for (const v of fleet) {
    const id = randomUUID();
    await sql.query('INSERT INTO fleet (id, slug, passengers, bags, price, image_url) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (slug) DO NOTHING', [id, v.slug, v.passengers, v.bags, null, v.image]);
    const row = await sql.query('SELECT id FROM fleet WHERE slug=$1', [v.slug]);
    const fid = row[0].id;
    await sql.query('DELETE FROM fleet_translations WHERE fleet_id=$1', [fid]);
    await sql.query('INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1,$2,$3,$4,$5)', [randomUUID(), fid, 'en', v.name, v.desc]);
    await sql.query('INSERT INTO fleet_translations (id, fleet_id, locale, name, description) VALUES ($1,$2,$3,$4,$5)', [randomUUID(), fid, 'fr', v.nameFr, v.descFr]);
    console.log('seeded fleet:', v.slug);
  }

  console.log('done');
}
seed().catch(console.error);
