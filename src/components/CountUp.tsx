"use client";

import { animate } from "framer-motion";
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
  duration = 3.2,
  className = "",
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

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
    if (!startWhen) return;

    let controls: ReturnType<typeof animate> | null = null;

    const startTimeout = setTimeout(() => {
      if (typeof onStart === "function") onStart();

      const startVal = direction === "down" ? to : from;
      const endVal = direction === "down" ? from : to;

      controls = animate(startVal, endVal, {
        duration,
        ease: "linear", // Smooth linear curve so it doesn't slow down at 90%
        onUpdate(latest) {
          if (ref.current) {
            ref.current.textContent = formatValue(Math.round(latest));
          }
        },
        onComplete() {
          if (ref.current) {
            ref.current.textContent = formatValue(endVal);
          }
          if (typeof onEnd === "function") {
            onEnd();
          }
        },
      });
    }, delay * 1000);

    return () => {
      clearTimeout(startTimeout);
      if (controls) controls.stop();
    };
  }, [startWhen, direction, from, to, duration, delay, formatValue, onStart, onEnd]);

  return <span className={className} ref={ref}>{direction === "down" ? to : from}</span>;
}
