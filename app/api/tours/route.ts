import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'tours.json');

function readTours() {
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function writeTours(tours: any[]) {
  writeFileSync(DATA_FILE, JSON.stringify(tours, null, 2));
}

export async function GET() {
  const tours = readTours();
  return NextResponse.json(tours);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const tours = readTours();
  const newTour = {
    ...body,
    id: Date.now().toString(),
    createdAt: new Date().toISOString().split('T')[0],
  };
  tours.push(newTour);
  writeTours(tours);
  return NextResponse.json(newTour, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const tours = readTours();
  const idx = tours.findIndex((t: any) => t.id === body.id);
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  tours[idx] = { ...tours[idx], ...body };
  writeTours(tours);
  return NextResponse.json(tours[idx]);
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const tours = readTours();
  const filtered = tours.filter((t: any) => t.id !== id);
  writeTours(filtered);
  return NextResponse.json({ ok: true });
}
