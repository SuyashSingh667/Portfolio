"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StickyNoteItem {
  id: string;
  title?: string;
  content: string;
  paperType: 1 | 2 | 3 | 4; // 1: grid tape strip, 2: kraft torn grid, 3: index card paperclip, 4: notebook torn sheet
  rotation: number; // degrees e.g. -6, 5, -4
  positionClass: string; // tailwind absolute position
  floatDelay?: number;
}

export function StickyNote({ item }: { item: StickyNoteItem }) {
  const noteSrc = `/notes/paper_note_${item.paperType}.png`;

  // Custom padding & sizing per paper texture type to align text perfectly inside white paper boundaries
  const layoutConfigs = {
    1: {
      width: "w-56 sm:w-72 md:w-84",
      padding: "px-10 py-7 sm:px-12 sm:py-9",
      titleColor: "text-amber-950 font-black text-xs sm:text-sm tracking-wider",
      textColor: "text-zinc-950 font-mono text-xs sm:text-sm md:text-base font-bold leading-snug",
    },
    2: {
      width: "w-52 sm:w-64 md:w-76",
      padding: "pt-12 pb-8 px-8 sm:pt-14 sm:pb-10 sm:px-10",
      titleColor: "text-stone-950 font-black text-xs sm:text-sm tracking-wider",
      textColor: "text-zinc-950 font-mono text-xs sm:text-sm md:text-base font-black leading-snug",
    },
    3: {
      width: "w-56 sm:w-72 md:w-84",
      padding: "pt-10 pb-6 px-10 sm:pt-12 sm:pb-8 sm:px-12",
      titleColor: "text-rose-950 font-black text-xs sm:text-sm tracking-wider",
      textColor: "text-slate-950 font-sans text-xs sm:text-sm md:text-base font-bold leading-snug",
    },
    4: {
      width: "w-52 sm:w-64 md:w-72",
      padding: "pt-14 pb-8 px-8 sm:pt-16 sm:pb-10 sm:px-10",
      titleColor: "text-amber-950 font-black text-xs sm:text-sm tracking-wider",
      textColor: "text-zinc-950 font-mono text-xs sm:text-sm md:text-base font-bold leading-snug",
    },
  };

  const config = layoutConfigs[item.paperType] || layoutConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20, rotate: item.rotation - 4 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: item.rotation }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 40 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: item.floatDelay || 0,
      }}
      viewport={{ once: true }}
      className={`absolute ${item.positionClass} ${config.width} cursor-pointer select-none z-20 pointer-events-auto filter drop-shadow-md hover:drop-shadow-2xl transition-all duration-300`}
      style={{
        transformOrigin: "center center",
      }}
    >
      {/* Subtle Floating Ambient Animation */}
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.floatDelay ? item.floatDelay * 2 : 0,
        }}
        className="relative w-full h-auto"
      >
        {/* Photorealistic Paper Texture Image */}
        <img
          src={noteSrc}
          alt="Paper note texture"
          className="w-full h-auto object-contain pointer-events-none block"
          loading="eager"
        />

        {/* Text Overlay Positioned Over Paper Surface */}
        <div className={`absolute inset-0 flex flex-col justify-center ${config.padding}`}>
          {item.title && (
            <div className={`font-mono text-[9px] sm:text-[10px] uppercase mb-1 ${config.titleColor}`}>
              {item.title}
            </div>
          )}
          <p className={`${config.textColor}`}>
            {item.content}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
