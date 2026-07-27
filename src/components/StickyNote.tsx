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
      width: "w-72 sm:w-96 md:w-[440px]",
      containerClass: "top-[16%] left-[20%] right-[18%] bottom-[16%] rotate-[-3deg]",
      titleColor: "text-amber-950 font-sans font-black text-xs sm:text-sm md:text-base tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-lg md:text-xl font-extrabold leading-tight",
    },
    2: {
      width: "w-68 sm:w-90 md:w-[410px]",
      containerClass: "top-[16%] left-[32%] right-[20%] bottom-[16%] rotate-[11deg]",
      titleColor: "text-stone-950 font-sans font-black text-xs sm:text-sm md:text-base tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-sm sm:text-base md:text-lg font-extrabold leading-tight",
    },
    3: {
      width: "w-72 sm:w-96 md:w-[440px]",
      containerClass: "top-[20%] left-[24%] right-[16%] bottom-[12%] rotate-[-3.8deg]",
      titleColor: "text-rose-950 font-sans font-black text-xs sm:text-sm md:text-base tracking-wider",
      textColor: "text-slate-950 font-['Patrick_Hand',cursive] text-base sm:text-lg md:text-xl font-bold leading-tight",
    },
    4: {
      width: "w-68 sm:w-90 md:w-[410px]",
      containerClass: "top-[16%] left-[24%] right-[20%] bottom-[12%] rotate-[-2.5deg]",
      titleColor: "text-amber-950 font-sans font-black text-xs sm:text-sm md:text-base tracking-wider",
      textColor: "text-zinc-950 font-['Caveat',cursive] text-base sm:text-lg md:text-xl font-extrabold leading-snug",
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
