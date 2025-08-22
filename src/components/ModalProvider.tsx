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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-lg max-w-md w-full mx-4 p-5 relative border border-gray-200"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-indigo-500 bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl shadow border border-gray-200 focus:outline-none transition-colors"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center">
              <Image
                src={post.media_url ? post.media_url : (post.thumbnail_url ? post.thumbnail_url : "")}
                alt={post.caption || "Instagram media"}
                className="w-full max-h-72 object-contain rounded-xl mb-3 border border-gray-100"
                width={500}
                height={500}
                loading="lazy"
              />
              {post.caption && (
                <div className="text-base text-gray-700 px-3 py-2 rounded mb-2 font-semibold">
                  {post.caption}
                </div>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-indigo-500 underline text-sm mt-2"
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
