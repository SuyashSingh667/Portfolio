"use client";

import React from 'react';
import { motion } from 'framer-motion';
import './CircularText.css';

interface CircularTextProps {
  text: string;
  spinDuration?: number;
  className?: string;
}

const CircularText: React.FC<CircularTextProps> = ({
  text,
  spinDuration = 20,
  className = ''
}) => {
  const baseText = text.trim() ? text.trim() : 'PROJECT';
  let fullText = baseText;
  while (fullText.length < 36) {
    fullText += ` • ${baseText}`;
  }
  fullText += ' • ';

  return (
    <div className="center-circular-wrapper">
      <motion.div
        className={`circular-text-container ${className}`}
        animate={{ rotate: 360 }}
        transition={{
          rotate: {
            duration: spinDuration,
            ease: 'linear',
            repeat: Infinity
          }
        }}
      >
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible">
          <path
            id="circlePath"
            d="M 250, 250 m -242, 0 a 242,242 0 1,1 484,0 a 242,242 0 1,1 -484,0"
            fill="none"
          />
          <text className="circular-text-path">
            <textPath href="#circlePath" startOffset="0%">
              {fullText}
            </textPath>
          </text>
        </svg>
      </motion.div>
    </div>
  );
};

export default CircularText;
