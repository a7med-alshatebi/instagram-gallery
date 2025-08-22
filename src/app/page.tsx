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
    <div className="min-h-screen w-full font-sans relative flex flex-col items-center justify-center overflow-x-hidden bg-gradient-to-br from-pink-100 via-indigo-100 to-yellow-100">
      {/* Animated gradient shapes */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute left-10 top-10 w-96 h-96 bg-gradient-to-tr from-pink-400 via-yellow-300 to-indigo-400 opacity-30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute right-0 bottom-0 w-72 h-72 bg-gradient-to-br from-indigo-400 via-pink-400 to-yellow-300 opacity-20 rounded-full blur-2xl animate-pulse" />
      </div>

      <header className="flex flex-col items-center mb-10 z-10 animate-fade-in">
        <span className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 via-pink-400 to-yellow-400 shadow-2xl mb-4 border-4 border-white animate-bounce">
          <FiInstagram className="text-white text-5xl drop-shadow-lg" />
        </span>
        <h1 className="text-6xl font-extrabold tracking-tight bg-gradient-to-r from-pink-500 via-indigo-500 to-yellow-400 bg-clip-text text-transparent drop-shadow-2xl mb-4">Insta Gallery</h1>
        <p className="text-xl text-indigo-400 font-semibold bg-white/60 px-6 py-2 rounded-2xl shadow-lg backdrop-blur-md">Your vibrant Instagram showcase</p>
      </header>

      <button
        aria-label="Refresh Gallery"
        onClick={fetchMedia}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-tr from-yellow-300 via-pink-400 to-indigo-400 text-white p-2 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none border-2 border-white animate-spin-slow"
      >
        <FiRefreshCw className="text-xl" />
      </button>

      <main className="w-full z-10">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-pink-400 mx-auto" />
            <span className="ml-4 text-xl text-indigo-400 font-bold">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10 text-lg font-semibold bg-white/80 rounded-2xl shadow-lg max-w-md mx-auto">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full max-w-7xl mx-auto">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openModal(item)}
                className="group rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl shadow-2xl hover:shadow-3xl hover:scale-[1.07] transition-all border-2 border-pink-200 flex flex-col focus:outline-none hover:ring-4 hover:ring-indigo-200 relative"
              >
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-72 object-cover group-hover:opacity-90 transition-opacity duration-200 rounded-t-3xl border-b-4 border-indigo-100"
                    width={500}
                    height={500}
                    priority
                  />
                {item.caption && (
                  <div className="p-5 text-base text-pink-700 bg-gradient-to-t from-indigo-50/80 to-transparent truncate font-semibold backdrop-blur-md">
                    {item.caption}
                  </div>
                )}
                <span className="absolute top-4 right-4 bg-gradient-to-tr from-pink-400 to-yellow-300 text-white text-xs px-3 py-1 rounded-full shadow-lg font-bold opacity-80">NEW</span>
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 text-sm text-white text-center z-10 animate-fade-in-up bg-gradient-to-r from-pink-400 via-indigo-400 to-yellow-300 py-4 px-8 rounded-2xl shadow-xl fixed left-1/2 -translate-x-1/2 bottom-2 backdrop-blur-lg">
        <span className="inline-block align-middle mr-1">Powered by</span>
        <a href="https://nextjs.org" className="underline hover:text-indigo-100">Next.js</a>
        <span className="mx-1">·</span>
        <a href="https://tailwindcss.com" className="underline hover:text-pink-100">Tailwind CSS</a>
        <span className="mx-1">·</span>
        <a href="https://instagram.com" className="underline hover:text-yellow-100">Instagram API</a>
      </footer>
    </div>
  );
}