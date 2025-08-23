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
          className="fixed inset-0 z-50 flex items-center justify-center px-2 backdrop-blur-sm"
          style={{ background: "rgba(220,220,220,0.5)" }}
          onClick={closeModal}
        >
            <div
              className="bg-gray-100 rounded-3xl shadow-2xl w-full max-w-[98vw] sm:max-w-xl md:max-w-2xl mx-auto p-2 sm:p-8 md:p-12 relative border border-gray-300"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-gray-800 text-gray-100 hover:bg-gray-700 hover:text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-lg sm:text-xl shadow-lg focus:outline-none transition-colors duration-200 border border-gray-700"
              aria-label="Close"
            >
              <span className="block leading-none">×</span>
            </button>
            <div className="flex flex-col items-center w-full">
              <div className="w-full flex justify-center">
                <div className="relative w-full aspect-square sm:aspect-video bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                  <Image
                    src={post.media_url ? post.media_url : (post.thumbnail_url ? post.thumbnail_url : "")}
                    alt={post.caption || "Instagram media"}
                    className="w-full h-full object-cover rounded-2xl border-0"
                    width={500}
                    height={500}
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-gray-200/80 rounded-full px-3 py-1 text-xs font-bold text-gray-700 shadow-md backdrop-blur-sm border border-gray-300">
                    <span className="hidden sm:inline">Instagram Post</span>
                    <span className="sm:hidden">📸</span>
                  </div>
                </div>
              </div>
              {post.caption && (
                <div className="text-sm sm:text-base font-semibold px-2 sm:px-4 py-2 sm:py-3 rounded-xl mb-2 text-gray-700 text-center w-full">
                  {post.caption}
                </div>
              )}
              <a
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full shadow-lg mt-3 font-bold text-gray-700 text-sm sm:text-base bg-gray-200 hover:bg-gray-300 transition-all duration-200 border border-gray-300 w-full text-center backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3h9A2.5 2.5 0 0 1 19 5.5v13A2.5 2.5 0 0 1 16.5 21h-9A2.5 2.5 0 0 1 5 18.5v-13A2.5 2.5 0 0 1 7.5 3zm0 0V2.25m9 0V3m-9 0h9m-9 0v.75m9-.75v.75M12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5zm0 0v.75m0 6v.75m-3.75-3.75h-.75m7.5 0h.75" />
                </svg>
                View on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
