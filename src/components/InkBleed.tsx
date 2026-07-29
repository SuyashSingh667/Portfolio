"use client";

import React, { useEffect, useId, useLayoutEffect, useMemo, useRef } from "react";

// Spot blur — AE-style parameters.
const MAIN_RADIUS = 0;
const SECONDARY_RADIUS = 35;
const INVERT = true;
const BLUR_AMOUNT = 10;
const FRINGE = 5;

// Choker offsets
const LEFT_CHOKER_OFFSET = -10;
const RIGHT_CHOKER_OFFSET = 10;

// Goo pipeline
const GOO_BLUR = 6;
const THRESHOLD = 40;
const CUTOFF = -15;

// Cursor smoothing.
const FOLLOW = 0.3;
const INTENSITY_FOLLOW = 0.25;
const SETTLE_EPSILON = 0.4;

interface InkBleedProps {
  text?: string;
  color?: string;
  font?: React.CSSProperties & { variant?: string; fontSize?: string | number; fontWeight?: number | string };
  intensity?: number;
  tag?: string;
}

export default function InkBleed(props: InkBleedProps) {
  const mergedProps = { ...COMPONENT_DEFAULTS, ...props };
  const { text, color, font, intensity, tag } = mergedProps;
  const Tag = (tag ?? "div") as any;

  const intensityFactor = Math.max(0, Math.min(100, intensity ?? 25)) / 16.67;
  const intensityRef = useRef(intensityFactor);
  intensityRef.current = intensityFactor;

  const rawId = useId();
  const safeId = rawId.replace(/[:]/g, "");
  const filterGooId = `ink-goo-${safeId}`;
  const filterFringeId = `ink-fringe-${safeId}`;

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
  }, [chars.length]);

  const target = useRef({ x: -9999, y: -9999, on: 0 });
  const smooth = useRef({ x: -9999, y: -9999, on: 0 });
  const rafRef = useRef<number | null>(null);

  const render = () => {
    const { x: cx, y: cy, on } = smooth.current;
    const container = containerRef.current;
    if (container) {
      container.style.setProperty(
        "--spot-on",
        (on * intensityRef.current).toFixed(3)
      );
    }

    const ms = metrics.current;
    for (let i = 0; i < ms.length; i++) {
      const wrapEl = wrapRefs.current[i];
      const leftEl = leftRefs.current[i];
      const rightEl = rightRefs.current[i];
      const m = ms[i];
      if (!m || m.w === 0) continue;

      const mxBase = cx - m.left;
      const myActual = cy - m.top;
      if (wrapEl) {
        wrapEl.style.setProperty("--mx", `${mxBase.toFixed(1)}px`);
        wrapEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
      if (leftEl) {
        leftEl.style.setProperty(
          "--mx",
          `${(mxBase - LEFT_CHOKER_OFFSET).toFixed(1)}px`
        );
        leftEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
      if (rightEl) {
        rightEl.style.setProperty(
          "--mx",
          `${(mxBase - RIGHT_CHOKER_OFFSET).toFixed(1)}px`
        );
        rightEl.style.setProperty("--my", `${myActual.toFixed(1)}px`);
      }
    }
  };

  const stopLoop = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  };

  const tick = () => {
    const t = target.current;
    const s = smooth.current;
    s.x += (t.x - s.x) * FOLLOW;
    s.y += (t.y - s.y) * FOLLOW;
    s.on += (t.on - s.on) * INTENSITY_FOLLOW;
    render();
    const settled =
      Math.abs(t.x - s.x) < SETTLE_EPSILON &&
      Math.abs(t.y - s.y) < SETTLE_EPSILON &&
      Math.abs(t.on - s.on) < 0.005;
    if (settled && t.on === 0) {
      s.on = 0;
      render();
      rafRef.current = null;
      return;
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const startLoop = () => {
    if (rafRef.current !== null) return;
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => () => stopLoop(), []);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (target.current.on === 0) {
      smooth.current.x = e.clientX;
      smooth.current.y = e.clientY;
    }
    target.current.x = e.clientX;
    target.current.y = e.clientY;
    target.current.on = 1;
    startLoop();
  };

  const handleLeave = () => {
    target.current.on = 0;
    startLoop();
  };

  const typeface = font ?? {};
  const fontStyle = Object.fromEntries(
    Object.entries(typeface).filter(([k]) => k !== "textAlign")
  );

  const innerPct = (MAIN_RADIUS / SECONDARY_RADIUS) * 100;
  const sharpMask = INVERT
    ? `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 0)) at var(--mx, -9999px) var(--my, -9999px), transparent 0%, transparent ${innerPct}%, rgba(0,0,0,1) 100%)`
    : `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 0)) at var(--mx, -9999px) var(--my, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${innerPct}%, transparent 100%)`;
  const spotMask = INVERT
    ? `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 0)) at var(--mx, -9999px) var(--my, -9999px), rgba(0,0,0,1) 0%, rgba(0,0,0,1) ${innerPct}%, transparent 100%)`
    : `radial-gradient(circle calc(${SECONDARY_RADIUS}px * var(--spot-on, 0)) at var(--mx, -9999px) var(--my, -9999px), transparent 0%, transparent ${innerPct}%, rgba(0,0,0,1) 100%)`;

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
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      <svg
        style={{
          position: "absolute",
          width: 0,
          height: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <defs>
          <filter id={filterGooId}>
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation={GOO_BLUR}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values={`1 0 0 0 0
                       0 1 0 0 0
                       0 0 1 0 0
                       0 0 0 ${THRESHOLD} ${CUTOFF}`}
              result="goo"
            />
            <feComposite
              in="SourceGraphic"
              in2="goo"
              operator="atop"
            />
          </filter>

          <filter
            id={filterFringeId}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={`1 0 0 0 0
                       0 0 0 0 0
                       0 0 0 0 0
                       0 0 0 1 0`}
              result="rOnly"
            />
            <feOffset
              in="rOnly"
              dx={-FRINGE}
              dy="0"
              result="rShift"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={`0 0 0 0 0
                       0 1 0 0 0
                       0 0 0 0 0
                       0 0 0 1 0`}
              result="gOnly"
            />
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values={`0 0 0 0 0
                       0 0 0 0 0
                       0 0 1 0 0
                       0 0 0 1 0`}
              result="bOnly"
            />
            <feOffset
              in="bOnly"
              dx={FRINGE}
              dy="0"
              result="bShift"
            />
            <feBlend
              in="rShift"
              in2="gOnly"
              mode="screen"
              result="rg"
            />
            <feBlend
              in="rg"
              in2="bShift"
              mode="screen"
              result="rgb"
            />
          </filter>
        </defs>
      </svg>

      <div
        ref={containerRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{
          position: "relative",
          filter: `url(#${filterGooId})`,
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
            <span
              style={{
                ...baseLayer,
                maskImage: sharpMask,
                WebkitMaskImage: sharpMask,
              }}
            >
              {ch === " " ? " " : ch}
            </span>

            <span
              aria-hidden
              style={{
                ...absLayer,
                filter: `blur(${BLUR_AMOUNT}px)`,
                maskImage: spotMask,
                WebkitMaskImage: spotMask,
              }}
            >
              {ch === " " ? " " : ch}
            </span>

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
                willChange: "mask-image",
              }}
            >
              {ch === " " ? " " : ch}
            </span>

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
  intensity: 25,
  color: "#171717",
  font: {
    fontFamily: "Inter, sans-serif",
    variant: "Bold",
    fontSize: "56px",
    fontWeight: 700,
    lineHeight: "1em",
    letterSpacing: "0em",
  } as any,
  tag: "div",
};
