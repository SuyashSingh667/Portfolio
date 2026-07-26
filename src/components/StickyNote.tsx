"use client";

import React from "react";
import { motion } from "framer-motion";

export interface StickyNoteItem {
  id: string;
  title?: string;
  content: string;
  paperType: 1 | 2 | 3 | 4; // 1: grid tape strip, 2: kraft torn grid, 3: index card paperclip, 4: notebook torn sheet
  rotation: number; // degrees e.g. -7, 5, -4
  positionClass: string; // tailwind absolute position
}

export function StickyNote({ item }: { item: StickyNoteItem }) {
  const noteSrc = `/notes/paper_note_${item.paperType}.png`;

  // Custom padding & sizing per paper texture type to align text perfectly inside paper boundaries
  const layoutConfigs = {
    1: {
      width: "w-52 sm:w-64",
      padding: "px-6 py-5",
      titleColor: "text-amber-900",
      textColor: "text-zinc-800 font-mono text-xs sm:text-sm font-semibold leading-snug",
    },
    2: {
      width: "w-48 sm:w-56",
      padding: "pt-8 pb-6 px-6",
      titleColor: "text-stone-900",
      textColor: "text-zinc-900 font-mono text-xs sm:text-sm font-medium leading-relaxed",
    },
    3: {
      width: "w-52 sm:w-60",
      padding: "pt-7 pb-5 px-6",
      titleColor: "text-rose-900",
      textColor: "text-slate-900 font-sans text-xs sm:text-sm font-medium leading-relaxed",
    },
    4: {
      width: "w-48 sm:w-56",
      padding: "pt-9 pb-6 px-6",
      titleColor: "text-amber-950",
      textColor: "text-zinc-900 font-mono text-xs sm:text-sm font-medium leading-relaxed",
    },
  };

  const config = layoutConfigs[item.paperType] || layoutConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: item.rotation - 5 }}
      whileInView={{ opacity: 1, scale: 1, rotate: item.rotation }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 40 }}
      transition={{ type: "spring", stiffness: 350, damping: 22 }}
      viewport={{ once: true }}
      className={`absolute ${item.positionClass} ${config.width} cursor-pointer select-none z-20 pointer-events-auto filter drop-shadow-md hover:drop-shadow-xl transition-all duration-200`}
      style={{
        transformOrigin: "center center",
      }}
    >
      <div className="relative w-full h-auto">
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
            <div className={`font-mono text-[10px] uppercase tracking-wider font-extrabold mb-1 ${config.titleColor}`}>
              {item.title}
            </div>
          )}
          <p className={`${config.textColor}`}>
            {item.content}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
