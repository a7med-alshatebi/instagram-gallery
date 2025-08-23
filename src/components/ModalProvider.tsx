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
          className="fixed inset-0 z-50 flex items-center justify-center px-2"
          style={{ background: "rgba(0,0,0,0.1)" }}
          onClick={closeModal}
        >
            <div
              className="bg-gradient-to-br from-pink-50 via-yellow-50 to-indigo-100 rounded-3xl shadow-2xl w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl mx-auto p-2 sm:p-8 md:p-12 relative border-0"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 bg-gradient-to-tr from-pink-400 via-indigo-400 to-yellow-300 text-white hover:text-pink-200 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-2xl sm:text-3xl shadow-lg focus:outline-none transition-colors duration-200 border-0"
              aria-label="Close"
            >
              <span className="block leading-none">×</span>
            </button>
            <div className="flex flex-col items-center w-full">
              <div className="w-full flex justify-center">
                <div className="relative w-full aspect-square sm:aspect-video bg-white rounded-2xl shadow-lg overflow-hidden border-0">
                  <Image
                    src={post.media_url ? post.media_url : (post.thumbnail_url ? post.thumbnail_url : "")}
                    alt={post.caption || "Instagram media"}
                    className="w-full h-full object-cover rounded-2xl border-0"
                    width={500}
                    height={500}
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-white/80 rounded-full px-3 py-1 text-xs font-bold text-indigo-500 shadow-md backdrop-blur-sm border border-indigo-100">
                    <span className="hidden sm:inline">Instagram Post</span>
                    <span className="sm:hidden">📸</span>
                  </div>
                </div>
              </div>
              {post.caption && (
                <div className="text-sm sm:text-base font-semibold px-2 sm:px-4 py-2 sm:py-3 rounded-xl mb-2 bg-gradient-to-r from-pink-100 via-indigo-100 to-yellow-100 bg-clip-text text-transparent text-center w-full">
                  {post.caption}
                </div>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 rounded-full bg-white shadow text-xs sm:text-sm mt-2 font-semibold bg-gradient-to-r from-pink-400 via-indigo-400 to-yellow-300 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200 border-0 w-full text-center"
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
