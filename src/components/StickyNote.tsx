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

  // Custom percentage bounds per paper texture type to keep text 100% inside white paper area
  const layoutConfigs = {
    1: {
      width: "w-56 sm:w-68 md:w-80",
      containerClass: "top-[16%] left-[12%] right-[12%] bottom-[14%]",
      titleColor: "text-amber-950 font-sans font-black text-[10px] sm:text-xs tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-lg md:text-xl font-bold leading-snug",
    },
    2: {
      width: "w-52 sm:w-64 md:w-76",
      containerClass: "top-[26%] left-[22%] right-[12%] bottom-[14%]",
      titleColor: "text-stone-950 font-sans font-black text-[10px] sm:text-xs tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-lg md:text-xl font-bold leading-tight",
    },
    3: {
      width: "w-56 sm:w-68 md:w-80",
      containerClass: "top-[22%] left-[18%] right-[10%] bottom-[12%]",
      titleColor: "text-rose-950 font-sans font-black text-[10px] sm:text-xs tracking-wider",
      textColor: "text-slate-900 font-['Patrick_Hand',cursive] text-base sm:text-lg md:text-xl font-bold leading-snug",
    },
    4: {
      width: "w-52 sm:w-64 md:w-72",
      containerClass: "top-[26%] left-[18%] right-[10%] bottom-[10%]",
      titleColor: "text-amber-950 font-sans font-black text-[10px] sm:text-xs tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-lg md:text-xl font-bold leading-tight",
    },
  };

  const config = layoutConfigs[item.paperType] || layoutConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20, rotate: item.rotation - 4 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: item.rotation }}
      whileHover={{ scale: 1.08, rotate: 0, zIndex: 25 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: item.floatDelay || 0,
      }}
      viewport={{ once: true }}
      className={`absolute ${item.positionClass} ${config.width} cursor-pointer select-none z-5 pointer-events-auto filter drop-shadow-md hover:drop-shadow-2xl transition-all duration-300`}
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

        {/* Text Overlay Positioned 100% Inside White Paper Surface */}
        <div className={`absolute ${config.containerClass} flex flex-col justify-center overflow-hidden`}>
          {item.title && (
            <div className={`uppercase mb-0.5 ${config.titleColor}`}>
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
