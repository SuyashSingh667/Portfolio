"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./LoadingScreen.css";

interface LoadingScreenProps {
  onFinish?: () => void;
}

const IMAGES = [
  "/images/projects/tribe_poster.png",
  "/images/projects/skysentinel_poster.png",
  "/images/projects/votesamvidhan_poster.png",
  "/images/projectPosters/in_this_blue_vhs_style_image_remove_the_adobe_stock_watermark_and_the_vertical.png",
];

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Helper to ensure scroll is always 100% enabled
  const forceEnableScroll = () => {
    document.body.style.overflow = "";
    document.body.style.overflowY = "";
    document.documentElement.style.overflow = "";
    document.documentElement.style.overflowY = "";
  };

  useEffect(() => {
    // Lock scroll during loading
    document.body.style.overflow = "hidden";
    return () => {
      forceEnableScroll();
    };
  }, []);

  useEffect(() => {
    if (isFinished) return;
    
    // Cycle every 0.8s (800ms)
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev === IMAGES.length - 1) {
          clearInterval(interval);
          // Wait a tiny bit longer on the last image before fading out
          setTimeout(() => setIsFinished(true), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isFinished]);

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={() => {
      forceEnableScroll();
      setIsVisible(false);
      if (onFinish) onFinish();
    }}>
      {!isFinished && (
        <motion.div
          key="loader-container"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] pointer-events-none select-none bg-white flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Images Layer (Behind) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence>
              <motion.img
                key={currentIndex}
                src={IMAGES[currentIndex]}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Project Poster"
              />
            </AnimatePresence>
          </div>

          {/* Knockout Mask Layer (Front) - White background with Black text (mix-blend-screen) */}
          <div className="absolute inset-0 bg-white flex items-center justify-center mix-blend-screen pointer-events-none">
            <h1 
              className="font-black text-black tracking-tighter leading-none select-none text-center"
              style={{ fontSize: "clamp(5rem, 25vw, 40rem)", fontFamily: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" }}
            >
              SUYASH
            </h1>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
