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
  <div className="min-h-screen w-full font-sans flex flex-col items-center justify-center bg-gradient-to-br from-white via-indigo-50 to-pink-50">
      <header className="flex flex-col items-center mb-10 shadow-lg rounded-2xl px-8 py-6 bg-white/80">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-400 via-pink-400 to-yellow-300 shadow-lg mb-2 border-2 border-white">
          <FiInstagram className="text-white text-3xl drop-shadow" />
        </span>
  <h1 className="text-4xl font-extrabold tracking-tight mb-2 bg-gradient-to-r from-pink-400 via-indigo-400 to-yellow-300 bg-clip-text text-transparent">Insta Gallery</h1>
        <p className="text-base text-indigo-400 font-semibold">Your Instagram showcase</p>
      </header>

      <button
        aria-label="Refresh Gallery"
        onClick={fetchMedia}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-tr from-yellow-300 via-pink-400 to-indigo-400 text-white p-2 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none border-2 border-white animate-spin-slow"
      >
        <FiRefreshCw className="text-xl" />
      </button>

  <main className="w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl mx-auto">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl mx-auto">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openModal(item)}
                className="group rounded-2xl overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-pink-50 shadow-md hover:shadow-xl hover:scale-[1.04] transition-all border border-gray-200 flex flex-col focus:outline-none"
              >
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-64 object-cover group-hover:opacity-95 transition-opacity duration-200 rounded-t-2xl"
                    width={500}
                    height={500}
                    loading="lazy"
                  />
                {item.caption && (
                  <div className="p-4 text-base text-indigo-500 truncate font-semibold">
                    {item.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 text-sm text-gray-400 text-center shadow-lg rounded-xl px-8 py-4 bg-white/80">
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