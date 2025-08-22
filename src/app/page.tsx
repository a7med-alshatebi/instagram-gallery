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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-pink-50 flex flex-col items-center py-12 px-4 font-sans relative">
      <header className="flex flex-col items-center mb-10 animate-fade-in">
        <span className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-400 via-pink-400 to-yellow-300 shadow-2xl mb-3 border-4 border-white">
          <FiInstagram className="text-white text-4xl drop-shadow-lg" />
        </span>
        <h1 className="text-5xl font-black tracking-tight text-gray-900 drop-shadow-lg mb-3">Instagram Gallery</h1>
        <p className="text-lg text-gray-500 font-medium">A modern, stylish showcase of your Instagram feed</p>
      </header>

      <button
        aria-label="Refresh Gallery"
        onClick={fetchMedia}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-tr from-yellow-300 via-pink-400 to-indigo-400 text-white p-5 rounded-full shadow-2xl hover:scale-110 transition-transform focus:outline-none border-4 border-white"
      >
        <FiRefreshCw className="text-3xl" />
      </button>

      <main className="w-full">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-400 mx-auto" />
            <span className="ml-4 text-xl text-gray-500">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-10 text-lg font-semibold">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 w-full max-w-7xl mx-auto">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => openModal(item)}
                className="group rounded-3xl overflow-hidden bg-white/90 backdrop-blur-lg shadow-2xl hover:shadow-3xl hover:scale-[1.05] transition-all border border-gray-200 flex flex-col focus:outline-none hover:ring-4 hover:ring-indigo-200"
              >
                  <Image
                    src={item.media_url ? item.media_url : (item.thumbnail_url ? item.thumbnail_url : "")}
                    alt={item.caption || "Instagram media"}
                    className="w-full h-72 object-cover group-hover:opacity-95 transition-opacity duration-200 rounded-t-3xl"
                    width={500}
                    height={500}
                    priority
                  />
                {item.caption && (
                  <div className="p-5 text-base text-gray-700 bg-gradient-to-t from-blue-50/80 to-transparent truncate font-semibold">
                    {item.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-16 text-sm text-gray-400 text-center">
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