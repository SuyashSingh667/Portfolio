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

// Pre-defined non-overlapping layout anchors for 5 cards with generous separation
const BASE_SPREAD_ANCHORS = [
  { x: 0, y: 0, r: 0 },         // Center card
  { x: -35, y: -22, r: -5 },    // Top-Left (wide corner)
  { x: 35, y: -22, r: 5 },      // Top-Right (wide corner)
  { x: -33, y: 22, r: 4 },      // Bottom-Left (wide corner)
  { x: 33, y: 22, r: -4 },      // Bottom-Right (wide corner)
];

const generateNonOverlappingTransforms = (items: PhotoStackItem[]) => {
  const displayedItems = items.slice(0, 5);

  return displayedItems.map((_, index) => {
    const anchor = BASE_SPREAD_ANCHORS[index % BASE_SPREAD_ANCHORS.length];
    return `translate(${anchor.x}vw, ${anchor.y}vh) rotate(${anchor.r}deg)`;
  });
};

const InteractivePhotoStack = React.forwardRef<
  HTMLDivElement,
  InteractivePhotoStackProps
>(({ items, title, className, ...props }, ref) => {
  const [topCardIndex, setTopCardIndex] = React.useState(0);
  const [isGroupHovered, setIsGroupHovered] = React.useState(false);
  const [clickedIndex, setClickedIndex] = React.useState<number | null>(null);
  // State to hold the current set of random positions
  const [spreadTransforms, setSpreadTransforms] = React.useState<string[]>([]);

  const displayedItems = items.slice(0, 5);
  const baseRotations = ["rotate-2", "-rotate-2", "rotate-3", "-rotate-3", "rotate-4"];

  const handleMouseEnter = () => {
    // Generate clean non-overlapping positions every time the mouse enters
    const newTransforms = generateNonOverlappingTransforms(items);
    setSpreadTransforms(newTransforms);
    setIsGroupHovered(true);
  };

  const handleCardClick = (index: number) => {
    if (isGroupHovered) {
      setClickedIndex(index);
      setTimeout(() => {
        setIsGroupHovered(false);
        setTopCardIndex(index);
        setClickedIndex(null);
      }, 700);
    } else {
      setTopCardIndex(index);
    }
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
        className="relative h-[380px] sm:h-[440px] md:h-[500px] w-full flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !clickedIndex && setIsGroupHovered(false)}
      >
        <div className="relative w-[280px] h-[200px] sm:w-[330px] sm:h-[235px] md:w-[370px] md:h-[260px]">
          {displayedItems.map((item, index) => {
            const isTopCard = index === topCardIndex;
            const numItems = displayedItems.length;
            let stackPosition = index - topCardIndex;
            if (stackPosition < 0) stackPosition += numItems;
            const isClicked = index === clickedIndex;
            // Use the dynamically generated transforms from state
            const transform = isGroupHovered
              ? spreadTransforms[index]
              : `translateY(${stackPosition * 0.4}rem) scale(${1 - stackPosition * 0.04})`;

            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "absolute inset-0 w-[280px] h-[200px] sm:w-[330px] sm:h-[235px] md:w-[370px] md:h-[260px] cursor-pointer rounded-2xl bg-white dark:bg-[#121214] p-2.5 shadow-2xl transition-all duration-500 ease-out border border-black/10 dark:border-white/10 backdrop-blur-md",
                  {
                    "rotate-0": isGroupHovered,
                    [baseRotations[stackPosition]]: !isGroupHovered && !isTopCard,
                    "hover:scale-105": isGroupHovered && !isClicked,
                    "animate-spin-y": isClicked,
                  }
                )}
                style={{
                  transform: transform,
                  zIndex: isClicked ? 200 : isGroupHovered ? (isTopCard ? 150 : 100 + (numItems - stackPosition)) : (isTopCard ? numItems : numItems - stackPosition),
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-between">
                  <div className="h-[78%] w-full bg-zinc-50 dark:bg-black/50 rounded-xl overflow-hidden flex items-center justify-center p-1 border border-black/5 dark:border-white/5 relative">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-full w-full object-contain rounded-lg transition-transform duration-300"
                    />
                  </div>
                  <div className="flex h-[22%] w-full items-center justify-between px-2 pt-1">
                    <div className="text-left max-w-[65%]">
                      <p className="font-mono text-[10px] sm:text-[11px] md:text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.name}
                      </p>
                      {item.issuer && (
                        <span className="text-[8px] sm:text-[9px] md:text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest block truncate">
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
                        className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[8px] sm:text-[9px] md:text-[10px] font-mono font-semibold uppercase tracking-wider bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-black/5 dark:border-white/10 transition-colors shrink-0 flex items-center gap-1"
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
