"use client";
import { useEffect, useState } from "react";
import { FiHeart, FiDownload, FiShare2 } from "react-icons/fi";
import { FiRefreshCw, FiInstagram } from "react-icons/fi";
import { useModal } from "../components/ModalProvider";
import Image from "next/image";

type InstagramMedia = {
  id: string;
  caption?: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
};

export default function Home() {
  const [media, setMedia] = useState<InstagramMedia[]>([]);
  type InstagramProfile = {
    id: string;
    username: string;
    account_type?: string;
    media_count?: number;
    profile_picture_url?: string;
    biography?: string;
  };
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const favs = localStorage.getItem("favorites");
      return favs ? JSON.parse(favs) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const downloadMedia = (url: string) => {
    fetch(url)
      .then((res) => res.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "instagram-media.jpg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
  };

  const sharePost = (permalink: string) => {
    if (navigator.share) {
      navigator.share({ url: permalink });
    } else {
      navigator.clipboard.writeText(permalink);
      alert("Link copied to clipboard!");
    }
  };

  const fetchMedia = () => {
    setLoading(true);
    setError(null);
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
        console.log("Instagram API response:", data);
        if (data.error) {
          setError(data.error);
        } else {
          setMedia(data.data || []);
          setProfile(data.profile || null);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load gallery");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMedia();
  const interval = setInterval(fetchMedia, 180000); // Refresh every 3 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full font-sans flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700">
      <header className="flex flex-col items-center mt-8 mb-10 shadow-none px-6 py-8 w-full max-w-3xl mx-auto border-0 relative bg-transparent">
        <span className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-800 shadow-lg mb-4 border-0">
          <FiInstagram className="text-gray-300 text-3xl sm:text-4xl" />
        </span>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 text-gray-200 text-center">
          Insta Gallery
        </h1>
        <p className="text-base sm:text-lg font-semibold text-center text-gray-400 mb-2">
          Discover &amp; share your Instagram moments in style
        </p>
        {/* User Profile Info */}
        {profile && (
          <div className="flex flex-col items-center justify-center mt-6">
            <img
              src={profile.profile_picture_url || "/avatar.png"}
              alt={profile.username ? `${profile.username} Avatar` : "User Avatar"}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-700 shadow-lg mb-2 object-cover bg-gray-700"
            />
                <a
                  href={`https://instagram.com/${profile.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow text-gray-200 font-bold text-base sm:text-lg mb-1 focus:outline-none focus:ring-2 focus:ring-gray-700 border border-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-13A2.5 2.5 0 0 1 7.5 3zm0 0V2.25m9 0V3m-9 0h9m-9 0v.75m9-.75v.75M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm0 0v.75m0 6v.75m-3.75-3.75h-.75m7.5 0h.75" />
                  </svg>
                  @{profile.username || "username"}
                </a>
            <p className="text-sm sm:text-base text-gray-400 text-center max-w-xs">{profile.biography || "No bio available."}</p>
          </div>
        )}
      </header>

    <button
      aria-label="Refresh Gallery"
      onClick={fetchMedia}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-gray-800 text-gray-200 p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-700 hover:text-white transition-transform focus:outline-none border border-gray-700"
    >
      <FiRefreshCw className="text-lg sm:text-xl" />
    </button>

  <main className="w-full px-2 sm:px-0"> 
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-xl sm:max-w-4xl md:max-w-6xl mx-auto justify-items-center">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-800 shadow-md border border-gray-700 flex flex-col animate-pulse overflow-hidden relative w-full"
              >
                <div className="relative w-full h-64 sm:h-auto aspect-[4/5] sm:aspect-square bg-gray-200 rounded-2xl">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 opacity-60 animate-shimmer" />
                </div>
                <div className="px-2 py-1">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-rose-400 text-center py-10 text-lg font-semibold bg-gray-800/80 rounded-2xl shadow-lg max-w-md mx-auto">{error}</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-xl sm:max-w-4xl md:max-w-6xl mx-auto justify-items-center">
            {media.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col focus:outline-none rounded-2xl bg-gray-800 shadow-md border border-gray-700 overflow-hidden transition-transform duration-200 hover:scale-[1.03] hover:shadow-lg relative w-full"
              >
                <div className="relative w-full h-64 sm:h-auto aspect-[4/5] sm:aspect-square cursor-pointer" onClick={() => openModal(item)}>
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl border-0"
                    width={300}
                    height={400}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-gray-900/80 rounded-full px-2 py-1 text-xs font-bold text-gray-200 shadow backdrop-blur-sm border border-gray-700">
                    <span className="hidden sm:inline">Tap to view</span>
                    <span className="sm:hidden">👆</span>
                  </div>
                </div>
                <div className="flex items-center justify-between w-full px-2 py-2 gap-2">
                  <button
                    aria-label={favorites.includes(item.id) ? "Unfavorite" : "Favorite"}
                    onClick={() => toggleFavorite(item.id)}
                    className={`flex items-center justify-center rounded-full p-2 transition-colors duration-200 border border-gray-700 shadow ${favorites.includes(item.id) ? 'bg-rose-600 text-white' : 'bg-gray-900 text-gray-300 hover:bg-rose-600 hover:text-white'} w-9 h-9 sm:w-10 sm:h-10`}
                  >
                    <FiHeart className="text-lg sm:text-xl" />
                  </button>
                  <button
                    aria-label="Download"
                    onClick={() => downloadMedia(item.media_url)}
                    className="flex items-center justify-center rounded-full p-2 transition-colors duration-200 border border-gray-700 shadow bg-gray-900 text-gray-300 hover:bg-blue-600 hover:text-white w-9 h-9 sm:w-10 sm:h-10"
                  >
                    <FiDownload className="text-lg sm:text-xl" />
                  </button>
                  <button
                    aria-label="Share"
                    onClick={() => sharePost(item.permalink)}
                    className="flex items-center justify-center rounded-full p-2 transition-colors duration-200 border border-gray-700 shadow bg-gray-900 text-gray-300 hover:bg-green-600 hover:text-white w-9 h-9 sm:w-10 sm:h-10"
                  >
                    <FiShare2 className="text-lg sm:text-xl" />
                  </button>
                </div>
                {item.caption && (
                  <div className="px-2 py-1 text-xs sm:text-base text-gray-300 font-semibold truncate bg-gray-900 rounded-b-xl sm:rounded-b-2xl border-t border-gray-700 mt-1">
                    {item.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

  <footer className="mt-10 sm:mt-16 text-xs sm:text-sm text-gray-400 text-center shadow-lg rounded-xl px-4 sm:px-8 py-3 sm:py-4 bg-gray-900/80 w-full max-w-2xl mx-auto">
        <span className="inline-block align-middle mr-1">Powered by</span>
        <a href="https://nextjs.org" className="underline hover:text-indigo-400">Next.js</a>
        <span className="mx-1">·</span>
        <a href="https://tailwindcss.com" className="underline hover:text-pink-400">Tailwind CSS</a>
        <span className="mx-1">·</span>
        <a href="https://instagram.com" className="underline hover:text-yellow-400">Instagram API</a>
      </footer>
    </div>
  );
}