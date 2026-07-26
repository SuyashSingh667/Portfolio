"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StickyNoteItem {
  id: string;
  title?: string;
  content: string;
  color: "yellow" | "mint" | "pink" | "purple" | "orange";
  rotation: number; // degrees e.g. -4, 3, -6, 5
  positionClass: string; // tailwind absolute position e.g. "top-4 left-4 md:left-8"
}

const colorStyles = {
  yellow: {
    bg: "bg-[#fef9c3] dark:bg-[#3f3b14]",
    text: "text-[#713f12] dark:text-[#fef08a]",
    tape: "bg-amber-400/40 border-amber-500/20",
    border: "border-amber-300/40 dark:border-amber-500/20",
    shadow: "shadow-amber-900/10 dark:shadow-black/40",
  },
  mint: {
    bg: "bg-[#dcfce7] dark:bg-[#143d23]",
    text: "text-[#14532d] dark:text-[#bbf7d0]",
    tape: "bg-emerald-400/40 border-emerald-500/20",
    border: "border-emerald-300/40 dark:border-emerald-500/20",
    shadow: "shadow-emerald-900/10 dark:shadow-black/40",
  },
  pink: {
    bg: "bg-[#fce7f3] dark:bg-[#4a1532]",
    text: "text-[#831843] dark:text-[#fbcfe8]",
    tape: "bg-pink-400/40 border-pink-500/20",
    border: "border-pink-300/40 dark:border-pink-500/20",
    shadow: "shadow-pink-900/10 dark:shadow-black/40",
  },
  purple: {
    bg: "bg-[#f3e8ff] dark:bg-[#341852]",
    text: "text-[#581c87] dark:text-[#e9d5ff]",
    tape: "bg-purple-400/40 border-purple-500/20",
    border: "border-purple-300/40 dark:border-purple-500/20",
    shadow: "shadow-purple-900/10 dark:shadow-black/40",
  },
  orange: {
    bg: "bg-[#ffedd5] dark:bg-[#472211]",
    text: "text-[#7c2d12] dark:text-[#fed7aa]",
    tape: "bg-orange-400/40 border-orange-500/20",
    border: "border-orange-300/40 dark:border-orange-500/20",
    shadow: "shadow-orange-900/10 dark:shadow-black/40",
  },
};

export function StickyNote({ item }: { item: StickyNoteItem }) {
  const style = colorStyles[item.color] || colorStyles.yellow;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotate: item.rotation - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: item.rotation }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      viewport={{ once: true }}
      className={`absolute ${item.positionClass} w-44 sm:w-52 p-4 rounded-lg border ${style.bg} ${style.text} ${style.border} ${style.shadow} shadow-lg cursor-pointer select-none z-20 pointer-events-auto transition-shadow`}
      style={{
        transformOrigin: "center center",
      }}
    >
      {/* Scotch Tape Accent at Top Center */}
      <div
        className={`absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-5 ${style.tape} border backdrop-blur-xs rounded-sm rotate-1 shadow-xs pointer-events-none`}
      />

      {/* Folded Bottom-Right Corner Accent */}
      <div className="absolute bottom-0 right-0 w-4 h-4 bg-black/10 dark:bg-white/10 rounded-tl-sm pointer-events-none" />

      {item.title && (
        <div className="font-mono text-[9px] uppercase tracking-widest font-extrabold opacity-75 mb-1">
          {item.title}
        </div>
      )}
      <p className="text-xs sm:text-sm font-medium leading-relaxed tracking-tight">
        {item.content}
      </p>
    </motion.div>
  );
}
