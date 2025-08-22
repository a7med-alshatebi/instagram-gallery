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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-2"
          onClick={closeModal}
        >
          <div
            className="bg-gradient-to-br from-white via-indigo-50 to-pink-50 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-md mx-auto p-3 sm:p-6 relative border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white text-indigo-500 hover:text-pink-500 rounded-full w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center text-lg sm:text-xl shadow-md focus:outline-none transition-colors duration-200"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={post.media_url ? post.media_url : (post.thumbnail_url ? post.thumbnail_url : "")}
                alt={post.caption || "Instagram media"}
                className="w-full max-h-48 sm:max-h-72 object-contain rounded-xl mb-2 sm:mb-3 border border-gray-100"
                width={500}
                height={500}
                loading="lazy"
              />
              {post.caption && (
                <div className="text-sm sm:text-base font-semibold px-2 sm:px-3 py-1 sm:py-2 rounded mb-2 bg-gradient-to-r from-pink-100 via-indigo-100 to-yellow-100 bg-clip-text text-transparent text-center">
                  {post.caption}
                </div>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-4 py-1 rounded-full bg-white shadow text-xs sm:text-sm mt-2 font-semibold bg-gradient-to-r from-pink-400 via-indigo-400 to-yellow-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 border border-gray-200"
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
