"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import Image from "next/image";


interface InstagramPost {
  id: string;
  media_url: string;
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-4 relative animate-fade-in">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 dark:hover:text-white text-xl"
              aria-label="Close"
            >
              ×
            </button>
              <Image
                src={post.media_url}
                alt={post.caption || "Instagram media"}
                className="w-full max-h-80 object-contain rounded-xl mb-4"
                width={500}
                height={500}
                priority
              />
            {post.caption && (
              <div className="text-base text-gray-700 dark:text-gray-300 mb-2">{post.caption}</div>
            )}
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 underline text-sm"
            >
              View on Instagram
            </a>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}
