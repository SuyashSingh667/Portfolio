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

// Helper function to generate a random number in a range
const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

// Helper function to generate a set of non-overlapping positions
const generateNonOverlappingTransforms = (items: PhotoStackItem[]) => {
  const positions: { x: number; y: number; r: number }[] = [];
  const displayedItems = items.slice(0, 5);

  const cardWidthVW = 22;
  const cardHeightVH = 38;
  const maxRetries = 100;

  displayedItems.forEach(() => {
    let newPos;
    let collision;
    let retries = 0;

    do {
      collision = false;
      const x = random(-35, 35); // vw
      const y = random(-20, 20); // vh
      const r = random(-20, 20); // deg
      newPos = { x, y, r };

      for (const pos of positions) {
        const dx = Math.abs(newPos.x - pos.x);
        const dy = Math.abs(newPos.y - pos.y);
        if (dx < cardWidthVW && dy < cardHeightVH) {
          collision = true;
          break;
        }
      }
      retries++;
    } while (collision && retries < maxRetries);
    
    positions.push(newPos);
  });

  return positions.map(pos => `translate(${pos.x}vw, ${pos.y}vh) rotate(${pos.r}deg)`);
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
  const baseRotations = ["rotate-2", "-rotate-2", "rotate-4", "-rotate-4", "rotate-6"];

  const handleMouseEnter = () => {
    // Generate new random positions every time the mouse enters
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
        "flex flex-col items-center justify-center gap-8 w-full select-none",
        className,
      )}
      {...props}
    >
      <div
        className="relative h-[420px] md:h-[480px] w-full flex items-center justify-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => !clickedIndex && setIsGroupHovered(false)}
      >
        <div className="relative h-80 w-64 md:h-96 md:w-72">
          {displayedItems.map((item, index) => {
            const isTopCard = index === topCardIndex;
            const numItems = displayedItems.length;
            let stackPosition = index - topCardIndex;
            if (stackPosition < 0) stackPosition += numItems;
            const isClicked = index === clickedIndex;
            // Use the dynamically generated transforms from state
            const transform = isGroupHovered
              ? spreadTransforms[index]
              : `translateY(${stackPosition * 0.5}rem) scale(${1 - stackPosition * 0.05})`;

            return (
              <div
                key={item.name}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "absolute inset-0 h-80 w-64 md:h-96 md:w-72 cursor-pointer rounded-2xl bg-white dark:bg-zinc-900/95 p-3 shadow-2xl transition-all duration-500 ease-out border border-black/10 dark:border-white/10 backdrop-blur-md",
                  {
                    "rotate-0": isGroupHovered,
                    [baseRotations[stackPosition]]: !isGroupHovered && !isTopCard,
                    "hover:scale-105": isGroupHovered && !isClicked,
                    "animate-spin-y": isClicked,
                  }
                )}
                style={{
                  transform: transform,
                  zIndex: isClicked ? 200 : isGroupHovered ? 100 : isTopCard ? numItems : numItems - stackPosition,
                }}
              >
                <div className="flex h-full w-full flex-col items-center justify-between">
                  <div className="h-[75%] w-full bg-zinc-100 dark:bg-zinc-950 rounded-xl overflow-hidden flex items-center justify-center border border-black/5 dark:border-white/5 relative">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                  <div className="flex h-[25%] flex-col items-center justify-center px-3 text-center">
                    <p className="font-mono text-xs uppercase tracking-wider font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {item.name}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {item.issuer && (
                        <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                          {item.issuer}
                        </span>
                      )}
                      {item.verifyUrl && (
                        <a
                          href={item.verifyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="text-[10px] font-mono text-blue-600 dark:text-blue-400 hover:underline uppercase tracking-wider font-semibold"
                        >
                          Verify ↗
                        </a>
                      )}
                    </div>
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
