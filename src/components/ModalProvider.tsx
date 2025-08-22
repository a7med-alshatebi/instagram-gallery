"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";


interface InstagramPost {
  id: string;
  media_url?: string;
  thumbnail_url?: string;
  caption?: string;
  permalink: string;
}

interface ModalContextType {
  post: InstagramPost | null;
  openModal: (post: InstagramPost) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error("useModal must be used within ModalProvider");
  return context;
}

export function ModalProvider({ children }: { children: ReactNode }) {
  const [post, setPost] = useState<InstagramPost | null>(null);
  const openModal = (p: InstagramPost) => setPost(p);
  const closeModal = () => setPost(null);

  return (
    <ModalContext.Provider value={{ post, openModal, closeModal }}>
      {children}
      {post && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-200 via-indigo-200 to-yellow-200 bg-opacity-60 backdrop-blur-xl animate-fade-in"
          onClick={closeModal}
        >
          <div
            className="bg-white/80 dark:bg-gray-900/80 rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6 relative border-4 border-pink-200 backdrop-blur-2xl animate-fade-in-up"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-pink-400 hover:text-indigo-500 bg-white/70 rounded-full w-10 h-10 flex items-center justify-center text-2xl shadow-lg border-2 border-yellow-200 focus:outline-none transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={post.media_url ? post.media_url : (post.thumbnail_url ? post.thumbnail_url : "")}
                alt={post.caption || "Instagram media"}
                className="w-full max-h-80 object-contain rounded-2xl mb-4 border-4 border-indigo-100 shadow-xl"
                width={500}
                height={500}
                priority
              />
              {post.caption && (
                <div className="text-base text-pink-700 bg-gradient-to-r from-indigo-50 via-pink-50 to-yellow-50 px-4 py-2 rounded-xl mb-3 shadow-md font-semibold backdrop-blur-md">
                  {post.caption}
                </div>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-pink-400 via-indigo-400 to-yellow-300 text-white font-bold px-5 py-2 rounded-full shadow-lg hover:scale-105 transition-transform text-sm mt-2"
              >
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
