path = r"E:\projects\Elbo-Tours\app\api\upload\route.ts"

content = """import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    const dataUri = `data:${mimeType};base64,${base64}`;

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'djrfxijvs';
    const apiKey = process.env.CLOUDINARY_API_KEY!;
    const apiSecret = process.env.CLOUDINARY_API_SECRET!;

    console.log('[upload] cloudName:', cloudName);
    console.log('[upload] apiKey prefix:', apiKey?.slice(0, 6));

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = 'elbo-tours';
    const signStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha256').update(signStr).digest('hex');

    const form = new FormData();
    form.append('file', dataUri);
    form.append('api_key', apiKey);
    form.append('timestamp', timestamp);
    form.append('folder', folder);
    form.append('signature', signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: form }
    );

    const data = await res.json();
    console.log('[upload] cloudinary status:', res.status, JSON.stringify(data).slice(0, 200));

    if (!res.ok) {
      return NextResponse.json({ error: data.error?.message || 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({ url: data.secure_url });
  } catch (err) {
    console.error('[upload] error:', err);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
"""

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("OK: upload route updated with fallback cloud name + logging")
