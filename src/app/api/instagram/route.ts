import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) {
  return new Response(JSON.stringify({ error: 'Missing Instagram access token' }), { status: 400 });
  }
  // Instagram Basic Display API endpoint for recent media
  const baseUrl = `https://graph.instagram.com/me/media?fields=id,caption,media_url,thumbnail_url,permalink&access_token=${token}`;
  // Instagram Basic Display API endpoint for user profile
  const profileUrl = `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url,biography&access_token=${token}`;
  type InstagramMedia = {
    id: string;
    caption?: string;
    media_url: string;
    thumbnail_url?: string;
    permalink: string;
  };
  let allMedia: InstagramMedia[] = [];
  let profile: any = null;
  let nextUrl = baseUrl;
  try {
    // Fetch profile info
    const profileRes = await fetch(profileUrl);
    const profileData = await profileRes.json();
    if (!profileRes.ok) {
      return new Response(JSON.stringify({ error: profileData.error?.message || 'Failed to fetch Instagram profile' }), { status: profileRes.status });
    }
    profile = profileData;

    // Fetch media
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
    // Return both media and profile info
    return new Response(JSON.stringify({ data: allMedia, profile }), { status: 200 });
  } catch {
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
