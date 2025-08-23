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
  <div className="min-h-screen w-full font-sans flex flex-col items-center justify-center bg-gradient-to-br from-white via-pink-100 to-yellow-100">
  <header className="flex flex-col items-center mt-8 mb-10 shadow-2xl px-6 py-8 w-full max-w-3xl mx-auto border-0 relative">
    <span className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-pink-400 via-indigo-400 to-yellow-300 shadow-xl mb-4 border-0 animate-spin-slow">
      <FiInstagram className="text-white text-3xl sm:text-4xl drop-shadow-lg" />
    </span>
    <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-3 bg-gradient-to-r from-pink-500 via-indigo-500 to-yellow-400 bg-clip-text text-transparent text-center drop-shadow-lg">
      Insta Gallery
    </h1>
    <p className="text-base sm:text-lg font-semibold text-center bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-400 bg-clip-text text-transparent mb-2 drop-shadow">
      Discover &amp; share your Instagram moments in style
    </p>
    <div className="absolute top-4 right-4 hidden sm:block">
      <span className="px-4 py-1 rounded-full bg-white/70 text-xs font-bold text-pink-500 shadow border border-pink-100">Modern UI</span>
    </div>
  </header>

    <button
      aria-label="Refresh Gallery"
      onClick={fetchMedia}
      className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 z-50 bg-gradient-to-tr from-yellow-300 via-pink-400 to-indigo-400 text-white p-2 sm:p-3 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none border-2 border-white animate-spin-slow"
    >
      <FiRefreshCw className="text-lg sm:text-xl" />
    </button>

  <main className="w-full px-2 sm:px-0">
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="rounded-2xl bg-gradient-to-br from-gray-100 via-indigo-50 to-pink-50 shadow-md border border-gray-200 flex flex-col animate-pulse overflow-hidden relative"
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
          <div className="text-red-500 text-center py-10 text-lg font-semibold bg-white/80 rounded-2xl shadow-lg max-w-md mx-auto">{error}</div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 w-full max-w-2xl sm:max-w-4xl md:max-w-6xl mx-auto">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openModal(item)}
                className="group flex flex-col focus:outline-none rounded-3xl overflow-hidden border-0 shadow-lg bg-gradient-to-br from-pink-50 via-yellow-50 to-indigo-50 transition-transform duration-200 hover:scale-[1.04] hover:shadow-2xl relative"
              >
                <div className="relative w-full aspect-square sm:aspect-auto">
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-full object-cover rounded-3xl border-0"
                    width={500}
                    height={500}
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 right-2 bg-white/80 rounded-full px-3 py-1 text-xs font-bold text-pink-500 shadow-md backdrop-blur-sm border border-pink-100">
                    <span className="hidden sm:inline">Tap to view</span>
                    <span className="sm:hidden">👆</span>
                  </div>
                </div>
                {item.caption && (
                  <div className="px-3 py-2 text-xs sm:text-base text-indigo-500 font-semibold truncate bg-gradient-to-r from-pink-100 via-indigo-100 to-yellow-100 rounded-b-3xl border-t border-gray-100 mt-1">
                    {item.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

  <footer className="mt-10 sm:mt-16 text-xs sm:text-sm text-gray-400 text-center shadow-lg rounded-xl px-4 sm:px-8 py-3 sm:py-4 bg-white/80 w-full max-w-2xl mx-auto">
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