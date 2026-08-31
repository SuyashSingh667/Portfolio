"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

// Define the props for the component
export interface PhotoStackItem {
  src: string;
  name: string;
  issuer?: string;
  date?: string;
  verifyUrl?: string;
}

export interface InteractivePhotoStackProps {
  items: PhotoStackItem[];
  title?: React.ReactNode;
  className?: string;
}

// Pre-defined non-overlapping layout anchors for cards with generous, balanced spacing
// Anchor 0 is always the active top card (front and center)
const SPREAD_ANCHORS = [
  { x: 0, y: 0, r: 0 },         // 0: Active Top Card (Center)
  { x: -30, y: -16, r: -4 },    // 1: Top-Left
  { x: 30, y: -16, r: 4 },      // 2: Top-Right
  { x: -28, y: 17, r: 3 },      // 3: Bottom-Left
  { x: 28, y: 17, r: -3 },      // 4: Bottom-Right
  { x: 0, y: 22, r: -2 },       // 5: Bottom-Center
];

const InteractivePhotoStack = React.forwardRef<
  HTMLDivElement,
  InteractivePhotoStackProps
>(({ items, title, className, ...props }, ref) => {
  const [topCardIndex, setTopCardIndex] = React.useState(0);
  const [isGroupHovered, setIsGroupHovered] = React.useState(false);

  const displayedItems = items;
  const numItems = displayedItems.length;
  const baseRotations = ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3", "rotate-2", "-rotate-2"];

  const handleCardClick = (index: number) => {
    // Instantly bring the clicked certificate to the top/center
    setTopCardIndex(index);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center gap-6 w-full select-none",
        className,
      )}
      {...props}
    >
      <div
        className="relative h-[260px] sm:h-[480px] md:h-[550px] w-full flex items-center justify-center"
        onMouseEnter={() => setIsGroupHovered(true)}
        onMouseLeave={() => setIsGroupHovered(false)}
      >
        <div className="relative w-[260px] h-[180px] sm:w-[430px] sm:h-[305px] md:w-[530px] md:h-[370px]">
          {displayedItems.map((item, index) => {
            const isTopCard = index === topCardIndex;
            // Calculate relative offset from the currently active top card
            const relIndex = (index - topCardIndex + numItems) % numItems;
            const anchor = SPREAD_ANCHORS[relIndex % SPREAD_ANCHORS.length];

            // When hovered: relIndex 0 is front & center, other cards spread to corners
            // When stacked: relIndex 0 is on top, others stacked behind with subtle translateY & scale
            const transform = isGroupHovered
              ? `translate(${anchor.x}vw, ${anchor.y}vh) rotate(${anchor.r}deg)${isTopCard ? " scale(1.04)" : ""}`
              : `translateY(${relIndex * 0.5}rem) scale(${1 - relIndex * 0.04})`;

            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "absolute inset-0 w-[260px] h-[180px] sm:w-[430px] sm:h-[305px] md:w-[530px] md:h-[370px] cursor-pointer rounded-2xl md:rounded-3xl bg-white dark:bg-[#121214] p-2.5 md:p-3.5 shadow-2xl transition-all duration-500 ease-out border border-black/10 dark:border-white/10 backdrop-blur-md",
                  {
                    "rotate-0": isGroupHovered,
                    [baseRotations[relIndex]]: !isGroupHovered && !isTopCard,
                    "hover:scale-[1.06] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.45)]": isGroupHovered && !isTopCard,
                  }
                )}
                style={{
                  transform: transform,
                  zIndex: isTopCard ? 200 : (numItems - relIndex),
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-between">
                  <div className="h-[80%] w-full bg-zinc-50 dark:bg-black/50 rounded-xl md:rounded-2xl overflow-hidden flex items-center justify-center p-1.5 border border-black/5 dark:border-white/5 relative">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-full w-full object-contain rounded-lg md:rounded-xl transition-transform duration-300"
                    />
                  </div>
                  <div className="flex h-[20%] w-full items-center justify-between px-2.5 pt-1.5">
                    <div className="text-left max-w-[70%]">
                      <p className="font-mono text-xs sm:text-sm md:text-[15px] uppercase tracking-wider font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </p>
                      {item.issuer && (
                        <span className="text-[9px] sm:text-[11px] md:text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block truncate">
                          {item.issuer}
                        </span>
                      )}
                    </div>
                    {item.verifyUrl && (
                      <a
                        href={item.verifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[9px] sm:text-[10px] md:text-xs font-mono font-semibold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-black/5 dark:border-white/10 transition-colors shrink-0 flex items-center gap-1.5"
                      >
                        Verify <span>↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {title && (
        <div className="text-center">
          {typeof title === "string" ? (
            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {title}
            </h3>
          ) : (
            title
          )}
        </div>
      )}
    </div>
  );
});

InteractivePhotoStack.displayName = "InteractivePhotoStack";

export { InteractivePhotoStack };
