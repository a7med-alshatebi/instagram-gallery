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
              className="absolute top-2 right-2 sm:top-3 sm:right-3 text-indigo-400 hover:text-pink-500 bg-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg sm:text-xl shadow border border-gray-200 focus:outline-none transition-colors"
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
                className="inline-block text-indigo-500 underline text-xs sm:text-sm mt-2 hover:text-pink-500 transition-colors"
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
