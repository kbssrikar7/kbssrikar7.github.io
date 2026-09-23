import { NextResponse } from 'next/server';

// Only ever runs on Vercel - GitHub Pages is a static export with no server to
// hold UMAMI_API_KEY server-side, so this route exists purely so the site can
// fetch a live number without ever shipping that key to the browser. Both
// hosts' pages call this same Vercel URL directly (see visitor-count.tsx).
export const revalidate = 3600;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
  const websiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
  const apiKey = process.env.UMAMI_API_KEY;

  if (!websiteId || !apiKey) {
    return NextResponse.json({ visitors: null }, { headers: CORS_HEADERS });
  }

  const endAt = Date.now();
  const startAt = endAt - 10 * 365 * 24 * 60 * 60 * 1000; // effectively "all time"

  const res = await fetch(
    `https://api.umami.is/api/websites/${websiteId}/stats?startAt=${startAt}&endAt=${endAt}`,
    {
      headers: { Authorization: `Bearer ${apiKey}` },
      next: { revalidate: 3600 },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ visitors: null }, { headers: CORS_HEADERS });
  }

  const data = await res.json();
  const visitors = typeof data.visitors === 'number' ? data.visitors : null;

  return NextResponse.json({ visitors }, { headers: CORS_HEADERS });
}
