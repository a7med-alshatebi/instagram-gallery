import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
  return new Response(JSON.stringify({ error: 'Missing Instagram access token' }), { status: 400 });
  }
  // Instagram Basic Display API endpoint for recent media
  const baseUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_url,thumbnail_url,permalink&access_token=${token}`;
  type InstagramMedia = {
    id: string;
    caption?: string;
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
  };
  let allMedia: InstagramMedia[] = [];
  let nextUrl = baseUrl;
  try {
    while (nextUrl) {
      const res = await fetch(nextUrl);
      const data = await res.json();
      if (!res.ok) {
        return new Response(JSON.stringify({ error: data.error?.message || 'Failed to fetch Instagram media' }), { status: res.status });
      }
      if (Array.isArray(data.data)) {
        allMedia = allMedia.concat(data.data);
      }
      // Instagram Basic Display API uses 'paging.next' for pagination
      nextUrl = data.paging?.next || null;
    }
    // Always return { data: [...] } for frontend compatibility
    return new Response(JSON.stringify({ data: allMedia }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
