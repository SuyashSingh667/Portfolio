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

  // Custom percentage bounds & matching text rotation angles per paper texture type
  const layoutConfigs = {
    1: {
      width: "w-72 sm:w-88 md:w-[420px]",
      containerClass: "top-[38%] left-[16%] right-[16%] bottom-[12%] rotate-[0deg]",
      titleColor: "text-amber-950 font-sans font-black text-[9px] sm:text-[10px] md:text-xs tracking-wider mb-1",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-sm sm:text-[15px] md:text-base font-extrabold leading-tight md:leading-snug",
    },
    2: {
      width: "w-64 sm:w-80 md:w-[370px]",
      containerClass: "top-[30%] left-[26%] right-[20%] bottom-[10%] rotate-[6.5deg]",
      titleColor: "text-stone-950 font-sans font-black text-[10px] sm:text-xs md:text-sm tracking-wider mb-1",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-[17px] md:text-[19px] font-extrabold leading-tight md:leading-[1.3]",
    },
    3: {
      width: "w-60 sm:w-72 md:w-[340px]",
      containerClass: "top-[35%] left-[28%] right-[8%] bottom-[6%] rotate-[-6deg]",
      titleColor: "text-rose-950 font-sans font-black text-[9px] sm:text-[10px] md:text-xs tracking-wider mb-1",
      textColor: "text-slate-950 font-['Patrick_Hand',cursive] text-sm sm:text-base md:text-lg font-bold leading-tight md:leading-snug",
    },
    4: {
      width: "w-72 sm:w-88 md:w-[420px]",
      containerClass: "top-[26%] left-[26%] right-[18%] bottom-[8%] rotate-[3.5deg]",
      titleColor: "text-amber-950 font-sans font-black text-[10px] sm:text-[11px] md:text-[13px] tracking-wider mb-1",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-[15px] sm:text-[17px] md:text-[20px] font-extrabold leading-[1.6] md:leading-[1.65]",
    },
  };

  const config = layoutConfigs[item.paperType] || layoutConfigs[1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20, rotate: item.rotation - 4 }}
      whileInView={{ opacity: 1, scale: 1, y: 0, rotate: item.rotation }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay: item.floatDelay || 0,
      }}
      viewport={{ once: true }}
      className={`absolute ${item.positionClass} ${config.width} select-none z-5 pointer-events-none filter drop-shadow-md`}
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

        {/* Text Overlay Positioned 100% Inside White Paper Surface */}
        <div className={`absolute ${config.containerClass} flex flex-col justify-start pt-2 overflow-hidden`}>
          {item.title && (
            <div className={`uppercase mb-0.5 ${config.titleColor}`}>
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
