
import { useEffect, useState } from "react";

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

  useEffect(() => {
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">Instagram Gallery</h1>
      {loading ? (
        <div className="text-lg text-gray-500 dark:text-gray-300">Loading...</div>
      ) : error ? (
        <div className="text-red-500 dark:text-red-400">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl">
          {media.map((item) => (
            <a
              key={item.id}
              href={item.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg overflow-hidden shadow-lg bg-white dark:bg-gray-900 hover:scale-[1.03] transition-transform border border-gray-200 dark:border-gray-700"
            >
              <img
                src={item.media_url}
                alt={item.caption || "Instagram media"}
                className="w-full h-64 object-cover group-hover:opacity-90"
                loading="lazy"
              />
              {item.caption && (
                <div className="p-3 text-sm text-gray-700 dark:text-gray-300 truncate">
                  {item.caption}
                </div>
              )}
            </a>
          ))}
        </div>
      )}
      <footer className="mt-10 text-xs text-gray-400 dark:text-gray-500 text-center">
        Powered by Next.js & Tailwind CSS · Instagram API
      </footer>
    </div>
  );
}
