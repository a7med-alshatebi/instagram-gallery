import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
  return new Response(JSON.stringify({ error: 'Missing Instagram access token' }), { status: 400 });
  }
  // Instagram Basic Display API endpoint for recent media
  const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,thumbnail_url,permalink&access_token=${token}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data.error?.message || 'Failed to fetch Instagram media' }), { status: res.status });
    }
    return new Response(JSON.stringify(data), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
