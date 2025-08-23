"use client";
import { useState } from "react";
import Image from "next/image";

interface ImageWithSpinnerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function ImageWithSpinner({ src, alt, width = 500, height = 500, className = "" }: ImageWithSpinnerProps) {
  const [loading, setLoading] = useState(true);
  return (
    <div className={`w-full h-full flex items-center justify-center relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <span className="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></span>
        </div>
      )}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`w-full h-full object-cover rounded-2xl border-0 ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
        onLoad={() => setLoading(false)}
      />
    </div>
  );
}
