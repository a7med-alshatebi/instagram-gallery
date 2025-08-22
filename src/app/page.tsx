"use client";
import { useEffect, useState } from "react";

import { FiRefreshCw, FiInstagram } from "react-icons/fi";
import { Dialog, DialogTrigger, DialogContent, DialogClose } from "@radix-ui/react-dialog";

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
  const [selected, setSelected] = useState<InstagramMedia | null>(null);

  const fetchMedia = () => {
    setLoading(true);
    setError(null);
    fetch("/api/instagram")
      .then((res) => res.json())
      .then((data) => {
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
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#e0e7ff] to-[#f1f5f9] dark:from-gray-900 dark:via-indigo-900 dark:to-gray-800 flex flex-col items-center py-10 px-4 font-sans relative">
      <header className="flex flex-col items-center mb-8 animate-fade-in">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-400 shadow-lg mb-2">
          <FiInstagram className="text-white text-3xl" />
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white drop-shadow-sm mb-2">Instagram Gallery</h1>
        <p className="text-base text-gray-500 dark:text-gray-300">A modern, lightweight showcase of your Instagram feed</p>
      </header>

      <button
        aria-label="Refresh Gallery"
        onClick={fetchMedia}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-tr from-indigo-400 via-purple-400 to-pink-400 text-white p-4 rounded-full shadow-xl hover:scale-105 transition-transform focus:outline-none"
      >
        <FiRefreshCw className="text-2xl" />
      </button>

      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-400 mx-auto" />
          <span className="ml-4 text-lg text-gray-500 dark:text-gray-300">Loading...</span>
        </div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400 text-center py-10">{error}</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 w-full max-w-6xl">
            {media.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelected(item)}
                className="group rounded-2xl overflow-hidden bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-xl hover:shadow-2xl hover:scale-[1.04] transition-all border border-gray-100 dark:border-gray-800 flex flex-col focus:outline-none"
              >
                <img
                  src={item.media_url}
                  alt={item.caption || "Instagram media"}
                  className="w-full h-64 object-cover group-hover:opacity-95 transition-opacity duration-200"
                  loading="lazy"
                />
                {item.caption && (
                  <div className="p-4 text-sm text-gray-700 dark:text-gray-300 bg-gradient-to-t from-white/80 dark:from-gray-900/80 to-transparent truncate">
                    {item.caption}
                  </div>
                )}
              </button>
            ))}
          </div>
          <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
            <DialogContent className="max-w-lg w-full p-2 sm:p-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
              {selected && (
                <div className="flex flex-col sm:max-h-[80vh] max-h-[90vh] overflow-y-auto rounded-2xl">
                  <img
                    src={selected.media_url}
                    alt={selected.caption || 'Instagram media'}
                    className="w-full sm:max-h-[70vh] max-h-[40vh] object-contain rounded-t-2xl"
                    style={{ borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}
                  />
                  <div className="p-4 text-base text-gray-700 dark:text-gray-300">
                    {selected.caption}
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-2 px-4 pb-4">
                    <a
                      href={selected.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 underline text-sm"
                    >
                      View on Instagram
                    </a>
                    <DialogClose asChild>
                      <button className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 transition w-full sm:w-auto">Close</button>
                    </DialogClose>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </>
      )}
      <footer className="mt-12 text-xs text-gray-400 dark:text-gray-500 text-center">
        <span className="inline-block align-middle mr-1">Powered by</span>
        <a href="https://nextjs.org" className="underline hover:text-indigo-400">Next.js</a>
        <span className="mx-1">·</span>
        <a href="https://tailwindcss.com" className="underline hover:text-pink-400">Tailwind CSS</a>
        <span className="mx-1">·</span>
        <a href="https://instagram.com" className="underline hover:text-purple-400">Instagram API</a>
      </footer>
    </div>
  );
}