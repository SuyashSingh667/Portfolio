"use client";

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";

// Spot blur — AE-style parameters.
const MAIN_RADIUS = 0;
const SECONDARY_RADIUS = 50;
const INVERT = true;
const BLUR_AMOUNT = 6;

// Choker offsets
const LEFT_CHOKER_OFFSET = -8;
const RIGHT_CHOKER_OFFSET = 8;

// Cursor smoothing.
const FOLLOW = 0.3;
const INTENSITY_FOLLOW = 0.25;

interface InkBleedProps {
  text?: string;
  color?: string;
  font?: React.CSSProperties & { variant?: string; fontSize?: string | number; fontWeight?: number | string };
  intensity?: number;
  tag?: string;
  className?: string;
  alwaysBleed?: boolean;
}

export default function InkBleed(props: InkBleedProps) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const { text, color, font, intensity, tag, className, alwaysBleed } = mergedProps;
  const Tag = (tag ?? "div") as any;

  const intensityFactor = Math.max(0, Math.min(100, intensity ?? 40)) / 16.67;
  const intensityRef = useRef(intensityFactor);
  intensityRef.current = intensityFactor;

  const chars = useMemo(() => Array.from((text as string) ?? ""), [text]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const wrapRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const leftRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const metrics = useRef<
    {
      cx: number;
      cy: number;
      w: number;
      h: number;
      left: number;
      top: number;
    }[]
  >([]);

  const measure = () => {
    metrics.current = wrapRefs.current.map((el) => {
      if (!el) return { cx: 0, cy: 0, w: 0, h: 0, left: 0, top: 0 };
      const r = el.getBoundingClientRect();
      return {
        cx: r.left + r.width / 2,
        cy: r.top + r.height / 2,
        w: r.width,
        h: r.height,
        left: r.left,
        top: r.top,
      };
    });
  };

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  const target = useRef({ x: -9999, y: -9999, on: alwaysBleed ? 1 : 0 });
  const smooth = useRef({ x: -9999, y: -9999, on: alwaysBleed ? 1 : 0 });
  const rafRef = useRef<number | null>(null);
  const timeRef = useRef(0);

  const render = () => {
    const container = containerRef.current;
    if (container) {
      const wave = alwaysBleed ? Math.sin(timeRef.current * 0.05) * 0.15 + 1.1 : smooth.current.on;
      const spotVal = wave * intensityRef.current;
      container.style.setProperty("--spot-on", spotVal.toFixed(3));
    }

    const ms = metrics.current;
    const { x: cx, y: cy } = smooth.current;

    for (let i = 0; i < ms.length; i++) {
      const wrapEl = wrapRefs.current[i];
      const leftEl = leftRefs.current[i];
      const rightEl = rightRefs.current[i];
      const m = ms[i];
      if (!m || m.w === 0) continue;

      const mxBase = cx !== -9999 ? cx - m.left : m.w / 2;
      const myActual = cy !== -9999 ? cy - m.top : m.h / 2;

      if (wrapEl) {
        wrapEl.style.setProperty("--mx", `${mxBase.toFixed(1)}px`);
        wrapEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
      if (leftEl) {
        leftEl.style.setProperty("--mx", `${(mxBase - LEFT_CHOKER_OFFSET).toFixed(1)}px`);
        leftEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
      if (rightEl) {
        rightEl.style.setProperty("--mx", `${(mxBase - RIGHT_CHOKER_OFFSET).toFixed(1)}px`);
        rightEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
    }
  };

  const isIntersectingRef = useRef(false);

  const tick = () => {
    if (!isIntersectingRef.current) {
        rafRef.current = requestAnimationFrame(tick);
        return;
    }

    timeRef.current += 1;
    const t = target.current;
    const s = smooth.current;

    if (t.x !== -9999) {
      s.x += (t.x - s.x) * FOLLOW;
      s.y += (t.y - s.y) * FOLLOW;
    }
    s.on += (t.on - s.on) * INTENSITY_FOLLOW;

    render();
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new IntersectionObserver(
        ([entry]) => {
            isIntersectingRef.current = entry.isIntersecting;
        },
        { threshold: 0 }
    );
    observer.observe(containerRef.current);

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    target.current.x = e.clientX;
    target.current.y = e.clientY;
    target.current.on = 1;
  };

  const handleLeave = () => {
    target.current.x = -9999;
    target.current.y = -9999;
    target.current.on = alwaysBleed ? 1 : 0;
  };

  const typeface = font ?? {};
  const fontStyle = Object.fromEntries(
    Object.entries(typeface).filter(([k]) => k !== "textAlign")
  );

  const innerPct = (MAIN_RADIUS / SECONDARY_RADIUS) * 100;
  const sharpMask = INVERT
    ? `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 1)) at var(--mx, 50%) var(--my, 50%), transparent 0%, transparent ${innerPct}%, rgba(0,0,0,1) 100%)`
    : `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 1)) at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${innerPct}%, transparent 100%)`;
  const spotMask = INVERT
    ? `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 1)) at var(--mx, 50%) var(--my, 50%), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${innerPct}%, transparent 100%)`
    : `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 1)) at var(--mx, 50%) var(--my, 50%), transparent 0%, transparent ${innerPct}%, rgba(0,0,0,1) 100%)`;

  const baseLayer: React.CSSProperties = {
    display: "inline-block",
    whiteSpace: "pre",
  };
  const absLayer: React.CSSProperties = {
    ...baseLayer,
    position: "absolute",
    top: 0,
    left: 0,
    pointerEvents: "none",
  };

  return (
    <Tag
      className={className}
      style={{
        position: "relative",
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "visible",
        userSelect: "none",
      }}
    >
      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          position: "relative",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          color: color ?? "#171717",
          ...fontStyle,
        }}
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              wrapRefs.current[i] = el;
            }}
            style={{
              position: "relative",
              display: "inline-block",
              whiteSpace: "pre",
              cursor: "default",
              overflow: "visible",
            }}
          >
            {/* Sharp base layer */}
            <span
              style={{
                ...baseLayer,
                maskImage: sharpMask,
                WebkitMaskImage: sharpMask,
              }}
            >
              {ch === " " ? " " : ch}
            </span>

            {/* Blur ink bleed layer */}
            <span
              aria-hidden
              style={{
                ...absLayer,
                filter: `blur(${BLUR_AMOUNT}px)`,
                maskImage: spotMask,
                WebkitMaskImage: spotMask,
                opacity: 0.8,
              }}
            >
              {ch === " " ? " " : ch}
            </span>

            {/* Left choker layer */}
            <span
              ref={(el) => {
                leftRefs.current[i] = el;
              }}
              aria-hidden
              style={{
                ...absLayer,
                left: LEFT_CHOKER_OFFSET,
                maskImage: spotMask,
                WebkitMaskImage: spotMask,
                opacity: 0.6,
                willChange: "mask-image",
              }}
            >
              {ch === " " ? " " : ch}
            </span>

            {/* Right choker layer */}
            <span
              ref={(el) => {
                rightRefs.current[i] = el;
              }}
              aria-hidden
              style={{
                ...absLayer,
                left: RIGHT_CHOKER_OFFSET,
                maskImage: spotMask,
                WebkitMaskImage: spotMask,
                opacity: 0.6,
                willChange: "mask-image",
              }}
            >
              {ch === " " ? " " : ch}
            </span>
          </span>
        ))}
      </div>
    </Tag>
  );
}

const COMPONENT_DEFAULTS = {
  text: "0%",
  intensity: 40,
  color: "#171717",
  font: {
    fontFamily: "Inter, sans-serif",
    variant: "Bold",
    fontSize: "96px",
    fontWeight: 700,
    lineHeight: "1em",
    letterSpacing: "0em",
  } as any,
  tag: "div",
  alwaysBleed: true,
};
