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

  // Custom padding & sizing per paper texture type to align text perfectly inside paper boundaries
  const layoutConfigs = {
    1: {
      width: "w-48 sm:w-56 md:w-60",
      padding: "px-5 py-4",
      titleColor: "text-amber-900 font-extrabold tracking-wider",
      textColor: "text-zinc-800 font-mono text-xs sm:text-sm font-semibold leading-snug",
    },
    2: {
      width: "w-44 sm:w-52 md:w-56",
      padding: "pt-7 pb-5 px-5",
      titleColor: "text-amber-950 font-black tracking-widest",
      textColor: "text-neutral-950 font-mono text-xs sm:text-sm font-bold leading-tight drop-shadow-xs",
    },
    3: {
      width: "w-48 sm:w-56 md:w-60",
      padding: "pt-6 pb-4 px-6",
      titleColor: "text-rose-900 font-extrabold tracking-wider",
      textColor: "text-slate-900 font-sans text-xs sm:text-sm font-semibold leading-snug",
    },
    4: {
      width: "w-44 sm:w-52 md:w-56",
      padding: "pt-8 pb-5 px-5",
      titleColor: "text-amber-950 font-extrabold tracking-wider",
      textColor: "text-zinc-900 font-mono text-xs sm:text-sm font-semibold leading-snug",
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
