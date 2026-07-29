"use client";

import { useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  direction?: "up" | "down";
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 4,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);

  // Configure spring parameters so it moves smoothly and reaches 100 cleanly
  const damping = 20 + 30 * (1 / duration);
  const stiffness = 80 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness,
  });

  const isInView = useInView(ref, { once: true, margin: "0px" });

  const getDecimalPlaces = (num: number) => {
    const str = num.toString();

    if (str.includes(".")) {
      const decimals = str.split(".")[1];

      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }

    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatValue = useCallback(
    (latest: number) => {
      const hasDecimals = maxDecimals > 0;

      const options = {
        useGrouping: !!separator,
        minimumFractionDigits: hasDecimals ? maxDecimals : 0,
        maximumFractionDigits: hasDecimals ? maxDecimals : 0,
      };

      const formattedNumber = Intl.NumberFormat("en-US", options).format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [maxDecimals, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(direction === "down" ? to : from);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    if (startWhen) {
      if (typeof onStart === "function") onStart();

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === "down" ? from : to);
      }, delay * 1000);

      return () => clearTimeout(timeoutId);
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart]);

  useEffect(() => {
    let hasEnded = false;

    const unsubscribe = springValue.on("change", (latest: number) => {
      const targetVal = direction === "down" ? from : to;
      const currentInt = Math.round(latest);

      if (ref.current) {
        ref.current.textContent = formatValue(latest);
      }

      // Trigger onEnd strictly when the target number (e.g. 100) is reached
      if (!hasEnded && currentInt === targetVal) {
        hasEnded = true;
        if (ref.current) {
          ref.current.textContent = formatValue(targetVal);
        }
        if (typeof onEnd === "function") {
          onEnd();
        }
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue, direction, from, to, onEnd]);

  return <span className={className} ref={ref}>{direction === "down" ? to : from}</span>;
}
