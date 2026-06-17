import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Elbo, a friendly travel assistant for Elbo Tours — a Moroccan travel company based in Marrakech.

You help customers with:
- Tours & itineraries: desert trips, imperial cities, coastal routes, day trips (Essaouira, Ouarzazate, Fes, Chefchaouen, etc.)
- Airport transfers: from/to Marrakech (RAK), Casablanca (CMN), Fes (FEZ), Tangier (TNG), Agadir (AGA), Nador (NDR)
- Pricing & booking: provide general price ranges and direct customers to contact us for exact quotes
- General Morocco travel tips: best time to visit, currency, customs, safety, packing, etc.

Always be warm, concise, and helpful. If you don't know something specific, invite them to WhatsApp or email us directly.
Contact: WhatsApp +212 665-889258 | info@elbotours.com`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages,
      ],
      max_tokens: 500,
    });
    return NextResponse.json({ reply: response.choices[0].message.content });
  } catch (error: any) {
    console.error('OpenAI error:', error?.message);
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}

