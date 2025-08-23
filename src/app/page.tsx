"use client";
import { useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { openModal } = useModal();

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
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-800 shadow-md border border-gray-700 flex flex-col animate-pulse overflow-hidden relative"
              >
                <div className="w-full h-64 bg-gray-200 rounded-t-2xl relative overflow-hidden">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-gray-200 via-indigo-100 to-pink-100 opacity-60 animate-shimmer" />
                </div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-rose-400 text-center py-10 text-lg font-semibold bg-gray-800/80 rounded-2xl shadow-lg max-w-md mx-auto">{error}</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 w-full max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto justify-items-center">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openModal(item)}
                className="group flex flex-col focus:outline-none rounded-2xl sm:rounded-3xl overflow-hidden border-0 shadow-lg bg-gray-800 transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl relative max-w-[90vw] sm:max-w-full"
              >
                <div className="relative w-full aspect-[4/5] sm:aspect-square">
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-full object-cover rounded-2xl sm:rounded-3xl border-0"
                    width={400}
                    height={500}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-gray-900/80 rounded-full px-2 py-1 text-xs font-bold text-gray-200 shadow-md backdrop-blur-sm border border-gray-700">
                    <span className="hidden sm:inline">Tap to view</span>
                    <span className="sm:hidden">👆</span>
                  </div>
                </div>
                {item.caption && (
                  <div className="px-2 py-1 text-xs sm:text-base text-gray-300 font-semibold truncate bg-gray-900 rounded-b-2xl sm:rounded-b-3xl border-t border-gray-700 mt-1">
                    {item.caption}
                  </div>
                )}
              </button>
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