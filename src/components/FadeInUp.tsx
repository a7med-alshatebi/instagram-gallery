"use client";
import { ReactNode } from "react";

export default function FadeInUp({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`transition-all duration-300 opacity-0 translate-y-6 animate-fadeInUp ${className}`}
    >
      {children}
    </div>
  );
}

// Add this to your global CSS (e.g. globals.css):
// @keyframes fadeInUp {
//   0% { opacity: 0; transform: translateY(24px); }
//   100% { opacity: 1; transform: translateY(0); }
// }
// .animate-fadeInUp {
//   animation: fadeInUp 0.3s ease forwards;
// }
