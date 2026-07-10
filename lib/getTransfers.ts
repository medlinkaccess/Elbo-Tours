import { sql } from '@/lib/db';

export interface TransferItem {
  id: string;
  slug: string;
  type: 'AIRPORT' | 'INTER_CITY';
  fromLocation: string;
  toLocation: string | null;
  priceFrom: number;
  image: string | null;
  active: boolean;
  flightTracking: boolean;
  meetAndGreet: boolean;
  featured: boolean;
  title: string;
  description: string;
}

export async function getTransfers(locale: string): Promise<TransferItem[]> {
  try {
    const rows = await sql`
      SELECT
        t.id, t.slug, t.type, t."fromLocation", t."toLocation",
        t."priceFrom", t."imageUrl" AS image, t.active,
        t."flightTracking", t."meetAndGreet", t.featured,
        COALESCE(
          (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = ${locale} LIMIT 1),
          (SELECT tt.title FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'en' LIMIT 1)
        ) AS title,
        COALESCE(
          (SELECT tt.description FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = ${locale} LIMIT 1),
          (SELECT tt.description FROM transfer_translations tt WHERE tt."transferId" = t.id AND tt.locale = 'en' LIMIT 1)
        ) AS description
      FROM transfers t
      WHERE t.active = true
      ORDER BY t."sortOrder" ASC, t."createdAt" DESC
    `;
    return rows as unknown as TransferItem[];
  } catch (err) {
    console.error('[getTransfers]', err);
    return [];
  }
}
