"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CrowdCanvas } from "@/components/CrowdCanvas";
import GradualBlur from "@/components/GradualBlur";
import InfiniteMenu from "@/components/InfiniteMenu";
import GlitterWrap from "@/components/GlitterWrap";
import TextPressure from "@/components/TextPressure";
import { ThemeToggleButton } from "@/components/ThemeToggle";
import { MusicToggleButton } from "@/components/MusicToggle";
import { Spotlight } from "@/components/ui/spotlight";
import PaperBinSkillset from "@/components/PaperBinSkillset";
import { StickyNote, StickyNoteItem } from "@/components/StickyNote";
import TerminalWindow from "@/components/TerminalWindow";
import MeshText from "@/components/MeshText";
import InteractiveAvatar3D from "@/components/InteractiveAvatar3D";
import { CinematicFooter } from "@/components/CinematicFooter";
import { motion, useScroll, useSpring } from "framer-motion";
import ImageTrail from "@/components/ImageTrail";
import LoadingScreen from "@/components/LoadingScreen";
import { InteractivePhotoStack, PhotoStackItem } from "@/components/ui/photo-stack";
import { preload } from "react-dom";
import { cn } from "@/lib/utils";



const STICKY_NOTES: StickyNoteItem[] = [
  {
    id: "note-1",
    title: "SPACE JUNK TRACKER",
    content: "I built SkySentinel to track satellites in Earth's orbit. No aliens found yet, but we are keeping a close eye on the space debris.",
    paperType: 1,
    rotation: 0,
    positionClass: "top-[-10%] left-[2%] sm:top-[-4%] sm:left-[-12%] md:left-[-18%] lg:left-[-24%] hidden sm:block",
    floatDelay: 0,
  },
  {
    id: "note-2",
    content: "I've written code for one of India's largest steel plants (Bokaro). Proving that software is just as heavy-duty as hardware.",
    paperType: 2,
    rotation: 0,
    positionClass: "top-[5%] right-[2%] sm:top-[-2%] sm:right-[-12%] md:right-[-18%] lg:right-[-24%] hidden sm:block",
    floatDelay: 0.15,
  },
  {
    id: "note-3",
    content: "I once built a blockchain voting system (VoteSamvidhan). Because paper ballots are so last century.",
    paperType: 3,
    rotation: 0,
    positionClass: "top-[60%] left-[2%] sm:top-[44%] sm:left-[-14%] md:left-[-20%] lg:left-[-26%] hidden sm:block",
    floatDelay: 0.3,
  },
  {
    id: "note-4",
    content: "As CodeChef President, I organized coding events for over 1,000 developers. The hardest part wasn't the algorithms; it was managing the vada pavs budget.",
    paperType: 4,
    rotation: 0,
    positionClass: "top-[65%] right-[2%] sm:top-[44%] sm:right-[-14%] md:right-[-20%] lg:right-[-26%] hidden sm:block",
    floatDelay: 0.45,
  },
];


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Project {
  title: string;
  description: string;
  image: string;
  link: string;
  github?: string;
  live?: string;
}

const projects: Project[] = [
  {
    title: "Tribe",
    description: "Centralised campus clubs and events hub with custom calendar-based planning, event discovery, and light AI recommendations.",
    image: "/images/projects/tribe_poster.jpg?v=10",
    link: "https://tribe-app-omega.vercel.app",
    github: "https://github.com/SuyashSingh667/TRIBE_BENNETT",
    live: "https://tribe-app-omega.vercel.app",
  },
  {
    title: "SkySentinel",
    description: "Space situational awareness platform monitoring satellite risks in Earth's orbit, integrating live TLE data with interactive 3D visualisation.",
    image: "/images/projects/skysentinel_yellow.jpg",
    link: "https://sky-sentinal.vercel.app",
    live: "https://sky-sentinal.vercel.app",
    github: "https://github.com/SuyashSingh667/SkySentinel",
  },
  {
    title: "VoteSamvidhan",
    description: "Blockchain-backed election integrity with constitutional literacy — secure digital voting, transparent verification, and real-time dashboards.",
    image: "/images/projects/votesamvidhan_poster.jpg?v=10",
    link: "https://votesamvidhan2.vercel.app",
    github: "https://github.com/SuyashSingh667/VoteSamvidhan",
    live: "https://votesamvidhan2.vercel.app",
  },
  {
    title: "Pram Engine",
    description: "A custom project engine providing VCR-style aesthetics and functionality. [Update this description with more details about what Pram Engine does!]",
    image: "/images/projectPosters/in_this_blue_vhs_style_image_remove_the_adobe_stock_watermark_and_the_vertical.jpg",
    link: "https://pram-engine.vercel.app/",
    github: "https://github.com/SuyashSingh667/PRAM-Engine",
    live: "https://pram-engine.vercel.app/",
  },
];

const experiences = [
  {
    num: "01",
    org: "IIT Kanpur",
    role: "Software Dev & Research Analytics Intern",
    desc: "Re-engineered the DoRA Giveaway Portal to streamline donor registration. Architected real-time analytical dashboards consuming REST endpoints for live CSR data tracking, and conducted quantitative analysis for 7 infrastructure project proposals.",
    tags: ["DoRA Portal Refactor", "CSR Analytics Dashboards", "RESTful API Integration", "Quantitative Research"],
  },
  {
    num: "02",
    org: "SAIL Bokaro Steel Plant",
    role: "Project Intern",
    desc: "Designed and deployed an NLP-based incident classification model under the CGM to categorize plant safety hazards in real time. Built an automated reporting and audit dashboard to replace manual incident-sorting workflows across departments.",
    tags: ["NLP & Classification", "Flask & Python", "Safety Audit Platform", "Process Digitization"],
  },
  {
    num: "03",
    org: "CodeChef Bennett University",
    role: "President — CodeChef Chapter",
    desc: "Led and organized 10+ coding contests and technical events with over 1000+ cumulative participants. Managed core team operations, event coordination, and marketing outreach.",
    tags: ["Leadership", "Event Management", "Operations"],
  },
  {
    num: "04",
    org: "Bennett University",
    role: "B.Tech Computer Science",
    desc: "Specialization in Cloud Computing. CGPA: 8.98 / 10. Relevant courses: Data Structures, Analysis of Algorithms, Design of Cloud Architectural Solutions, React, DBMS.",
    tags: ["Cloud Computing", "DSA & Algorithms", "React & DBMS"],
  },
];

const EXPERIENCE_IMAGES = [
  "/experience/WhatsApp Image 2026-07-19 at 22.37.57.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.57 (1).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.58.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.58 (1).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.59.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.59 (1).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.37.59 (2).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.00.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.00 (1).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.01.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.01 (1).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.01 (2).jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.03.jpeg",
  "/experience/WhatsApp Image 2026-07-19 at 22.38.03 (1).jpeg",
];

const SKILLS = [
  "Builds Things That Move", "React × Three.js", "Pixel-Perfect Obsessed",
  "Particle Systems Addict", "Cloud-Native Thinker", "Ships Fast, Breaks Nothing",
  "WebGL Experiments", "Steel Plant to Startups", "CodeChef Chapter Lead",
  "IIT Kanpur Research Intern", "Blockchain Voter Systems", "Satellite Tracker Builder",
];

const CERTIFICATIONS: PhotoStackItem[] = [
  {
    src: "/certificates/aws_cloud_architecting.png",
    name: "AWS Cloud Architecting",
    issuer: "AWS Academy",
    date: "03/07/2026",
    verifyUrl: "https://www.credly.com/go/Ds9fFCYf",
  },
  {
    src: "/certificates/aws_data_engineering.png",
    name: "AWS Data Engineering",
    issuer: "AWS Academy",
    date: "03/07/2026",
    verifyUrl: "https://www.credly.com/go/nKX4bjQt",
  },
  {
    src: "/certificates/aws_cloud_foundations.png",
    name: "AWS Cloud Foundations",
    issuer: "AWS Academy",
    date: "11/09/2025",
    verifyUrl: "https://www.credly.com/go/QnPOtGAS",
  },
  {
    src: "/certificates/google_operating_systems.png",
    name: "Operating Systems & Power User",
    issuer: "Google / Coursera",
    date: "03/06/2026",
    verifyUrl: "https://coursera.org/verify/YY8E4Q03JLI7",
  },
  {
    src: "/certificates/uva_design_thinking.png",
    name: "Design Thinking: Ideas to Action",
    issuer: "Univ. of Virginia",
    date: "03/07/2026",
    verifyUrl: "https://coursera.org/verify/2FF0XSLRGDK3",
  },
];

// ─── Reveal wrapper ───────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Marquee ──────────────────────────────────────────────────────────────────
function SkillsMarquee() {
  const doubled = [...SKILLS, ...SKILLS];
  return (
    <div className="overflow-hidden border-y border-black/6 dark:border-white/6 py-3.5 bg-[#fafafa] dark:bg-[#0c0c0c] transition-colors duration-500">
      <div className="flex animate-marquee whitespace-nowrap w-max">
        {doubled.map((skill, i) => (
          <span key={i} className="inline-flex items-center gap-5 px-5 text-[9px] font-mono uppercase tracking-[0.32em] text-zinc-400 dark:text-zinc-600">
            {skill}
            <span className="text-zinc-400 dark:text-zinc-600 text-[10px]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Bold editorial section header ────────────────────────────────────────────
function Chapter({ num, eyebrow, title, isMobile = false, children, className }: { num: string; eyebrow: string; title: string; isMobile?: boolean; children?: React.ReactNode; className?: string }) {
  const { resolvedTheme } = useTheme();
  const textColor = resolvedTheme === "dark" ? "#ffffff" : "#171717";

  return (
    <div className={cn("relative overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500 px-6 md:px-16 pt-12 pb-4 md:pt-20 md:pb-10", className)}>
      {/* Ghost number */}
      <span
        aria-hidden
        className="absolute right-0 top-1/2 -translate-y-1/2 select-none pointer-events-none font-black leading-none text-black/[0.035] dark:text-white/[0.035]"
        style={{ fontSize: "clamp(6rem, 22vw, 22rem)", lineHeight: 1 }}
      >
        {num}
      </span>
      <Reveal className="relative z-10 space-y-3">
        <span className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.38em] text-zinc-400 dark:text-zinc-500">
          <span className="w-5 h-px bg-zinc-400 dark:bg-zinc-500 inline-block" />
          {eyebrow}
        </span>
        <div className="w-full h-[90px] sm:h-[100px] md:h-[130px] lg:h-[160px] -ml-2 select-none">
          <MeshText
            text={title}
            color={textColor}
            colorSplit={true}
            font={{
              fontFamily: "Plus Jakarta Sans",
              variant: "Bold",
              fontSize: isMobile ? 64 : 160,
              textAlign: "left",
              fontWeight: 800,
              lineHeight: "1em",
              letterSpacing: "0em",
            }}
          />
        </div>
        {children}
      </Reveal>
    </div>
  );
}


const RadarChart = ({ 
  onHoverCategory 
}: { 
  onHoverCategory: (cat: string | null) => void 
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const axes = [
    { key: "Creative/3D", label: "Creative/3D", value: 96, angle: -Math.PI / 2, xAlign: "middle", yAlign: "bottom", dy: -15 },
    { key: "Frontend", label: "Frontend", value: 88, angle: -Math.PI / 2 + (2 * Math.PI / 5), xAlign: "start", yAlign: "middle", dx: 18, dy: -6 },
    { key: "Backend", label: "Backend", value: 82, angle: -Math.PI / 2 + (4 * Math.PI / 5), xAlign: "start", yAlign: "middle", dx: 18, dy: 6 },
    { key: "Architecture", label: "Architecture", value: 70, angle: -Math.PI / 2 + (6 * Math.PI / 5), xAlign: "end", yAlign: "middle", dx: -18, dy: 6 },
    { key: "Motion", label: "Motion", value: 80, angle: -Math.PI / 2 + (8 * Math.PI / 5), xAlign: "end", yAlign: "middle", dx: -18, dy: -6 },
  ];

  const cx = 230;
  const cy = 230;
  const r = 165;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const points = axes.map(axis => {
    const valR = r * (axis.value / 100);
    const x = cx + valR * Math.cos(axis.angle);
    const y = cy + valR * Math.sin(axis.angle);
    return `${x},${y}`;
  }).join(" ");

  const handleHover = (cat: string | null) => {
    setActiveCategory(cat);
    onHoverCategory(cat);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 select-none transform scale-[0.7] md:scale-100 origin-center">
      <svg width="460" height="460" className="overflow-visible">
        {/* Grid outline lines */}
        {gridLevels.map((level, i) => (
          <polygon
            key={i}
            points={axes.map(axis => {
              const gr = r * level;
              const x = cx + gr * Math.cos(axis.angle);
              const y = cy + gr * Math.sin(axis.angle);
              return `${x},${y}`;
            }).join(" ")}
            fill="none"
            className="stroke-black/[0.06] dark:stroke-white/[0.06]"
            strokeWidth="1"
          />
        ))}

        {/* Concentric circles overlay */}
        {gridLevels.map((level, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={r * level}
            fill="none"
            className="stroke-black/[0.03] dark:stroke-white/[0.03] stroke-dasharray-[2_4]"
            strokeWidth="1.2"
          />
        ))}

        {/* Axis lines */}
        {axes.map((axis, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + r * Math.cos(axis.angle)}
            y2={cy + r * Math.sin(axis.angle)}
            className="stroke-black/[0.09] dark:stroke-white/[0.09]"
            strokeWidth="1.2"
          />
        ))}

        {/* Filled Expertise Shape */}
        <polygon
          points={points}
          fill="rgba(113, 113, 122, 0.12)"
          className="stroke-[#171717] dark:stroke-white transition-all duration-300"
          strokeWidth="2.5"
          style={{
            filter: activeCategory ? "drop-shadow(0 0 12px rgba(113, 113, 122, 0.4))" : "none"
          }}
        />

        {/* Outer points (interactive targets) */}
        {axes.map((axis, i) => {
          const valR = r * (axis.value / 100);
          const x = cx + valR * Math.cos(axis.angle);
          const y = cy + valR * Math.sin(axis.angle);
          const isActive = activeCategory === axis.key;
          return (
            <g 
              key={i}
              onMouseEnter={() => handleHover(axis.key)}
              onMouseLeave={() => handleHover(null)}
              className="cursor-pointer"
            >
              <circle
                cx={x}
                cy={y}
                r="6.5"
                className="fill-[#171717] dark:fill-white transition-all duration-300"
                style={{
                  transform: isActive ? "scale(1.5)" : "scale(1)",
                  transformOrigin: `${x}px ${y}px`
                }}
              />
              <circle
                cx={x}
                cy={y}
                r="18"
                fill="transparent"
              />
            </g>
          );
        })}

        {/* Labels */}
        {axes.map((axis, i) => {
          const labelR = r + 22;
          const x = cx + labelR * Math.cos(axis.angle) + (axis.dx || 0);
          const y = cy + labelR * Math.sin(axis.angle) + (axis.dy || 0);
          const isActive = activeCategory === axis.key;
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor={axis.xAlign as any}
              dominantBaseline={axis.yAlign as any}
              onMouseEnter={() => handleHover(axis.key)}
              onMouseLeave={() => handleHover(null)}
              className={`font-mono text-[12px] md:text-[13px] font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer ${
                isActive 
                  ? "text-[#171717] dark:text-white" 
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              {axis.label}
            </text>
          );
        })}
      </svg>
      <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400 max-w-[240px] text-center leading-relaxed h-[24px]">
        {activeCategory ? (
          <span>Focus: <strong className="text-[#171717] dark:text-white">{activeCategory}</strong> highlighted.</span>
        ) : (
          <span>Hover categories to filter skillset.</span>
        )}
      </div>
    </div>
  );
};

// ─── Rich Lightweight Markdown Renderer for Chat ─────────────────────────────
function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let listType: 'ul' | 'ol' | null = null;

  const flushList = () => {
    if (listItems.length > 0 && listType) {
      const ListTag = listType;
      elements.push(
        <ListTag
          key={`list-${elements.length}`}
          className={listType === 'ul' ? 'list-disc pl-4 space-y-1.5 my-2 text-zinc-700 dark:text-zinc-200' : 'list-decimal pl-4 space-y-1.5 my-2 text-zinc-700 dark:text-zinc-200'}
        >
          {listItems}
        </ListTag>
      );
      listItems = [];
      listType = null;
    }
  };

  const inlineFormat = (str: string): React.ReactNode => {
    // Regex for: markdown links [text](url), bold **text**, code `text`, raw URLs, and emails
    const regex = /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|(https?:\/\/[^\s)]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let key = 0;

    while ((match = regex.exec(str)) !== null) {
      // Text before match
      if (match.index > lastIndex) {
        parts.push(str.slice(lastIndex, match.index));
      }

      if (match[2] && match[3]) {
        // Markdown Link: [text](url)
        const linkText = match[2];
        const linkUrl = match[3];
        parts.push(
          <a
            key={`link-${key++}`}
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium inline-flex items-center gap-0.5"
          >
            {linkText}
          </a>
        );
      } else if (match[4]) {
        // Bold: **text**
        parts.push(<strong key={`b-${key++}`} className="font-bold text-zinc-900 dark:text-zinc-100">{match[4]}</strong>);
      } else if (match[5]) {
        // Code: `text`
        parts.push(
          <code key={`code-${key++}`} className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[11px] text-zinc-800 dark:text-zinc-200 border border-black/5 dark:border-white/5">
            {match[5]}
          </code>
        );
      } else if (match[6]) {
        // Raw URL
        const rawUrl = match[6];
        parts.push(
          <a
            key={`rawurl-${key++}`}
            href={rawUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium break-all"
          >
            {rawUrl}
          </a>
        );
      } else if (match[7]) {
        // Email
        const email = match[7];
        parts.push(
          <a
            key={`mail-${key++}`}
            href={`mailto:${email}`}
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80 transition-opacity font-medium"
          >
            {email}
          </a>
        );
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < str.length) {
      parts.push(str.slice(lastIndex));
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    // Bullet list: * item or - item
    const bulletMatch = trimmed.match(/^[*\-]\s+(.+)/);
    if (bulletMatch) {
      if (listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(<li key={`li-${idx}`} className="leading-relaxed">{inlineFormat(bulletMatch[1])}</li>);
      return;
    }

    // Numbered list: 1. item
    const numMatch = trimmed.match(/^\d+\.\s+(.+)/);
    if (numMatch) {
      if (listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(<li key={`li-${idx}`} className="leading-relaxed">{inlineFormat(numMatch[1])}</li>);
      return;
    }

    // Regular line
    flushList();

    if (trimmed === '') {
      elements.push(<div key={`sp-${idx}`} className="h-2" />);
    } else {
      elements.push(<p key={`p-${idx}`} className="my-1 leading-relaxed text-zinc-700 dark:text-zinc-200">{inlineFormat(trimmed)}</p>);
    }
  });

  flushList();
  return <div className="space-y-1 text-[13px] md:text-sm">{elements}</div>;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Home() {
  // Preload heavy assets as high priority so they load before the visual intro finishes
  preload("/images/peeps/all-peeps.png", { as: "image", fetchPriority: "high" });
  preload("/images/projects/tribe_poster.jpg?v=10", { as: "image", fetchPriority: "high" });
  preload("/images/projects/skysentinel_yellow.jpg", { as: "image", fetchPriority: "high" });

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loadingFinished, setLoadingFinished] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  // Physics Sandbox Panel States
  const [gravityY, setGravityY] = useState(3.0);
  const [gravityX, setGravityX] = useState(0.0);
  const [bounciness, setBounciness] = useState(0.32);
  const [explodeTrigger, setExplodeTrigger] = useState(0);
  const [vacuumTrigger, setVacuumTrigger] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [resetKey, setResetKey] = useState(0);
  const [hasClickedProject, setHasClickedProject] = useState(true);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const footerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined" && !sessionStorage.getItem("has_visited_portfolio")) {
      sessionStorage.setItem("has_visited_portfolio", "true");
      setTheme("light");
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Hide nav bar when CinematicFooter (contact section) is in view
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsFooterVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, [mounted]);

  // Show suyash.dev only while hero section is visible
  useEffect(() => {
    if (!heroRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.05 }
    );
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [mounted]);



  // ─── Section Tracking & Refresh Scroll Restoration ──────────────────────────
  useEffect(() => {
    if (typeof window === "undefined") return;

    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }

    const resetToHero = () => {
      sessionStorage.clear();
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    };

    resetToHero();
    const t1 = setTimeout(resetToHero, 50);
    const t2 = setTimeout(resetToHero, 200);
    const t3 = setTimeout(resetToHero, 500);
    const t4 = setTimeout(resetToHero, 1000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Hey! I'm Suyash's AI clone. Ask me anything about his work, experience, or skills!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatLogRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat internally
  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatMessages, chatLoading]);

  const sendMessageText = async (text: string) => {
    if (chatLoading) return;
    const newMessages = [...chatMessages, { role: "user" as const, content: text }];
    setChatMessages(newMessages);
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch response: ${res.status}`);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No readable stream available");
      
      const decoder = new TextDecoder("utf-8");
      let currentReply = "";
      let buffer = "";

      // Initialize the assistant message so we can stream into it
      setChatMessages([...newMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || ""; // Keep incomplete lines in the buffer
        
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6);
            if (dataStr === "[DONE]") continue;
            try {
              const data = JSON.parse(dataStr);
              const text = data.response !== undefined 
                ? data.response 
                : (data.candidates?.[0]?.content?.parts?.[0]?.text || "");
              if (text) {
                currentReply += text;
                setChatMessages(prev => {
                  const updatedMsgs = [...prev];
                  const lastMsg = updatedMsgs[updatedMsgs.length - 1];
                  if (lastMsg.role === "assistant") {
                    lastMsg.content = currentReply;
                  }
                  return updatedMsgs;
                });
              }
            } catch (e) {
              // Ignore incomplete JSON chunks (SSE can sometimes split)
            }
          }
        }
      }
    } catch (err: any) {
      console.error(err);
      const errorMessage = err?.message || "Oops, network issue! Could you try sending that again?";
      setChatMessages([...newMessages, { role: "assistant", content: `Error: ${errorMessage}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;
    const userMsg = chatInput.trim();
    setChatInput("");
    await sendMessageText(userMsg);
  };


  // GSAP horizontal pin for Experiences
  useEffect(() => {
    if (typeof window === "undefined") return;

    let ctx: gsap.Context | null = null;

    const initGSAP = () => {
      if (ctx) ctx.revert();

      ctx = gsap.context(() => {
        const container = cardsContainerRef.current;
        if (!container) return;

        ScrollTrigger.refresh();

        const getXTranslation = () => {
          if (!container || !container.parentElement) return 0;
          const dist = container.scrollWidth - container.parentElement.clientWidth;
          return dist > 0 ? -dist : 0;
        };

        const anim = gsap.to(container, {
          x: getXTranslation,
          ease: "none",
          force3D: true, // Hardware acceleration
        });

        ScrollTrigger.create({
          trigger: "#experiences",
          start: "top top",
          end: () => {
            if (!container || !container.parentElement) return "+=1000";
            const dist = container.scrollWidth - container.parentElement.clientWidth;
            return `+=${Math.max(dist, 100)}`;
          },
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          anticipatePin: 1,
          animation: anim,
          invalidateOnRefresh: true,
        });

        setTimeout(() => ScrollTrigger.refresh(), 100);
      });
    };

    const timer1 = setTimeout(initGSAP, 100);
    const timer2 = setTimeout(initGSAP, 500);
    const timer3 = setTimeout(initGSAP, 1200);

    const handleResize = () => {
      initGSAP();
    };
    window.addEventListener("resize", handleResize);
    window.addEventListener("load", handleResize);

    if (document.fonts) {
      document.fonts.ready.then(initGSAP);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("load", handleResize);
      if (ctx) ctx.revert();
      const triggerEl = document.getElementById("experiences");
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === triggerEl) t.kill(true);
      });
    };
  }, []);

  const menuItems = useMemo(() => {
    const baseItems = projects.map((p) => ({
      image: p.image,
      link: p.link,
      github: p.github,
      live: p.live,
      title: p.title,
      description: p.description,
    }));
    
    // Create a larger array so adjacent instances on the 3D sphere don't repeat the same project
    // Putting baseItems[0] (Tribe) at index 9 ensures it is exactly in the center by default!
    return [
      baseItems[1], baseItems[2], baseItems[3], baseItems[0],
      baseItems[3], baseItems[1], baseItems[0], baseItems[2],
      baseItems[2], baseItems[0], baseItems[1], baseItems[3],
      baseItems[0], baseItems[3], baseItems[2], baseItems[1],
    ];
  }, []);

  const CATEGORIES: Record<string, string[]> = {
    "Creative/3D": ["WebGL", "Three.js", "Shaders"],
    "Frontend": ["React", "Next.js", "Tailwind"],
    "Backend": ["PostgreSQL", "Docker", "Python"],
    "Architecture": ["TypeScript", "Node.js", "Git"],
    "Motion": ["GSAP", "Framer", "Figma"]
  };
  const highlightedSkills = hoveredCategory ? CATEGORIES[hoveredCategory] || [] : [];

  return (
    <main className="min-h-screen w-full bg-[#fafafa] text-[#171717] transition-colors duration-500 dark:bg-[#0a0a0a] dark:text-[#ededed] overflow-x-hidden">
      <LoadingScreen onFinish={() => setLoadingFinished(true)} />


      {/* Scroll progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-zinc-850 dark:bg-zinc-150 origin-left z-[300]"
        style={{ scaleX }}
      />

      {/* Gradual blur at the very top (absolute, not fixed) */}
      <GradualBlur position="top" height="6rem" strength={2} divCount={6} curve="bezier" exponential zIndex={20} />

      {/* ── Nav ──────────────────────────────────────────────────────────────── */}
      <header className={`fixed top-0 left-0 z-[200] flex w-full items-center justify-between px-6 py-5 md:px-16 transition-all duration-500 ${isFooterVisible ? 'opacity-0 -translate-y-full pointer-events-none' : 'opacity-100 translate-y-0'}`}>
        <a href="#" className={`font-mono text-[11px] font-bold tracking-widest uppercase transition-all duration-500 ${isHeroVisible ? 'opacity-70 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}>
          suyash.dev
        </a>
        <nav className="hidden md:flex items-center gap-7">
          {[["#top","Home"],["#work","Work"],["#experiences","Exp"],["#skillset","Skills"],["#certifications","Certs"],["#about","About"],["#contact","Contact"]].map(([href, label]) => (
            <a key={href} href={href} className="text-[9px] font-mono uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity duration-200">
              {label}
            </a>
          ))}
          <MusicToggleButton />
          <ThemeToggleButton className="scale-90" />
        </nav>
        <div className="md:hidden flex items-center gap-3">
          <MusicToggleButton />
          <ThemeToggleButton className="scale-90" />
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════════════
          HERO — cinematic dark, always
      ════════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        id="hero"
        className="relative h-[65vh] md:min-h-screen w-full flex flex-col bg-[#fafafa] dark:bg-[#080808] text-[#171717] dark:text-white overflow-hidden transition-colors duration-500"
      >
        {/* Stars */}
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
          <GlitterWrap
            particleCount={150}
            speed={4}
            starSize={12}
            glitterIntensity={4}
            trailAmount={96}
            color1={resolvedTheme === "dark" ? "#ffffff" : "#171717"}
            color2={resolvedTheme === "dark" ? "#d4d4d4" : "#a3a3a3"}
            color3={resolvedTheme === "dark" ? "#a3a3a3" : "#737373"}
          />
        </div>



        {/* Massive name — centred */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center -mt-10 px-4">
          <motion.span
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 0.3, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="font-mono text-[9px] uppercase tracking-[0.42em] text-[#171717]/35 dark:text-white/30 mb-5 block"
          >
            Portfolio
          </motion.span>

          <motion.div
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-[90%] md:w-full max-w-6xl select-none mx-auto h-[50px] md:h-[clamp(90px,15vw,220px)]"
          >
            <TextPressure
              text="SUYASH"
              flex width weight italic
              alpha={false} stroke={false}
              textColor={resolvedTheme === "dark" ? "#ffffff" : "#171717"}
              minFontSize={12}
            />
          </motion.div>


        </div>

        {/* Crowd canvas */}
        <div className="relative z-0 h-[25vh] md:h-[42vh] origin-bottom w-[200%] -left-[50%] md:w-full md:left-0 transform scale-[0.5] md:scale-100">
          <div className="absolute inset-0">
            <CrowdCanvas src="/images/peeps/all-peeps.png" rows={15} cols={7} />
          </div>
          {/* Fade bottom of crowd into next section */}
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-[#fafafa] dark:to-[#080808] transition-colors duration-500 pointer-events-none" />
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#171717]/25 to-transparent dark:from-white/25"
          />
          <span className="text-[7px] font-mono uppercase tracking-[0.4em] text-[#171717]/20 dark:text-white/20">Scroll</span>
        </motion.div>
      </section>

      {/* Skills marquee */}
      <SkillsMarquee />

      {/* ════════════════════════════════════════════════════════════════════════
          01 — WORK
      ════════════════════════════════════════════════════════════════════════ */}
      <section id="work" className="relative w-full flex flex-col bg-[#fafafa] dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-x-hidden">
        <Chapter num="01" eyebrow="Selected Work" title="Projects." isMobile={isMobile} />

        <div className="relative w-full h-[46vh] sm:h-[58vh] md:h-screen overflow-hidden">
          {/* Instruction Badge matching Experience section */}
          <div className="absolute top-6 left-6 md:left-16 z-30 pointer-events-none select-none hidden md:block">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/12 bg-white/85 dark:bg-black/85 backdrop-blur-xl shadow-lg transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-650 dark:bg-zinc-250"></span>
              </span>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] font-semibold text-zinc-700 dark:text-zinc-200">
                Drag sphere or click to view project
              </span>
            </div>
          </div>

          <InfiniteMenu 
            items={menuItems} 
            scale={isMobile ? 0.48 : (typeof window !== "undefined" && window.innerWidth / window.innerHeight < 1.6 ? 0.75 : 0.85)} 
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════════
          02 — EXPERIENCES
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 overflow-x-hidden flex flex-col">
        <Chapter num="02" eyebrow="Journey" title="Experience." isMobile={isMobile} />

        <section
          id="experiences"
          className="relative z-20 min-h-[90vh] md:min-h-screen w-full bg-white dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-hidden flex items-center"
        >
          <ImageTrail items={EXPERIENCE_IMAGES} variant={1} />

          {/* Floating Instruction Badge matching Projects section */}
          <div className="absolute top-6 left-6 md:left-16 z-30 pointer-events-none select-none hidden md:block">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/12 bg-white/85 dark:bg-black/85 backdrop-blur-xl shadow-lg transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-650 dark:bg-zinc-250"></span>
              </span>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] font-semibold text-zinc-700 dark:text-zinc-200">
                Move cursor to reveal images
              </span>
            </div>
          </div>

          <div className="w-full overflow-hidden relative z-10 py-8">
            <div
              ref={cardsContainerRef}
              className="flex gap-0 pl-6 md:pl-16 transform-gpu items-center"
              style={{ 
                willChange: "transform",
                paddingRight: "8vw"
              }}
            >
              {experiences.map((item, idx) => (
                <div
                  key={idx}
                  className="experience-card w-[85vw] sm:w-[50vw] md:w-[42vw] lg:w-[35vw] shrink-0 flex flex-col justify-between border-r border-black/8 dark:border-white/8 pr-8 md:pr-14 mr-8 md:mr-14 min-h-[42vh] md:min-h-[48vh]"
                >
                  {/* Top */}
                  <div>
                    <span className="card-num text-[clamp(2.5rem,6vw,7rem)] font-black leading-none text-black/[0.06] dark:text-white/[0.05] select-none block -mb-2 md:-mb-3">
                      {item.num}
                    </span>
                    <span className="card-role text-[8.5px] md:text-[9.5px] font-mono uppercase tracking-[0.28em] text-[#171717] dark:text-[#ededed] block mb-1.5 md:mb-2 font-semibold">
                      {item.role}
                    </span>
                    <h3 className="card-org text-xl md:text-3xl lg:text-4xl font-black tracking-tight text-[#171717] dark:text-white mb-2 md:mb-4 leading-tight">
                      {item.org}
                    </h3>
                    <p className="card-desc text-xs md:text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-[360px]">
                      {item.desc}
                    </p>
                  </div>

                  {/* Bottom — tags */}
                  <div className="flex flex-wrap gap-1.5 md:gap-2 mt-4 md:mt-6">
                    {item.tags.map((tag) => (
                      <span key={tag} className="card-tag px-2.5 md:px-3 py-0.5 md:py-1 border border-black/10 dark:border-zinc-800 rounded-full text-[8px] md:text-[9px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          03 — SKILLSET
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 overflow-x-hidden flex flex-col">
        <Chapter num="03" eyebrow="Skills" title="Skills." isMobile={isMobile} />

        <section
          id="skillset"
          className="relative flex-1 bg-white dark:bg-zinc-950 border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-hidden pt-2 md:pt-4 pb-4 md:pb-8 flex flex-col min-h-[85vh] md:min-h-[90vh]"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.045) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Floating Instruction Badge */}
          <div className="absolute top-6 left-6 md:left-16 z-30 pointer-events-none select-none hidden md:block">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/12 bg-white/85 dark:bg-black/85 backdrop-blur-xl shadow-lg transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-650 dark:bg-zinc-250"></span>
              </span>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] font-semibold text-zinc-700 dark:text-zinc-200">
                Grab & toss the paper balls
              </span>
            </div>
          </div>

          {/* Warm glow */}
          <div 
            className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] pointer-events-none transform-gpu"
            style={{ background: 'radial-gradient(circle, rgba(113, 113, 122, 0.12) 0%, transparent 60%)' }} 
          />

          <div className="w-full max-w-[1380px] mx-auto px-6 md:px-16 flex-1 flex justify-center items-center relative z-10">
            {/* Centered 3D Paper Bin / Dustbin Skillset Canvas */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: "-60px" }}
              className="w-full max-w-[1000px] h-[65vh] md:h-[80vh] relative"
            >
              {/* Sticky Notes Snug & Random Around the Dustbin */}
              {STICKY_NOTES.map((note) => (
                <StickyNote key={note.id} item={note} />
              ))}

              <div className="absolute inset-0">
                <PaperBinSkillset 
                  theme={resolvedTheme} 
                  gravityY={gravityY}
                  gravityX={gravityX}
                  bounciness={bounciness}
                  explodeTrigger={explodeTrigger}
                  vacuumTrigger={vacuumTrigger}
                  resetKey={resetKey}
                  highlightedSkills={highlightedSkills}
                />
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          04 — CERTIFICATIONS
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 overflow-x-hidden flex flex-col">
        <Chapter num="04" eyebrow="Licenses & Certs" title="Certs." isMobile={isMobile} />

        <section
          id="certifications"
          className="relative min-h-[90vh] md:min-h-screen py-16 md:py-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 transition-colors duration-500 overflow-hidden flex flex-col items-center justify-center"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        >
          {/* Floating Instruction Badge */}
          <div className="absolute top-6 left-6 md:left-16 z-30 pointer-events-none select-none hidden md:block">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-black/10 dark:border-white/12 bg-white/85 dark:bg-black/85 backdrop-blur-xl shadow-lg transition-all duration-300">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-zinc-650 dark:bg-zinc-250"></span>
              </span>
              <span className="font-mono text-[10px] md:text-xs uppercase tracking-[0.22em] font-semibold text-zinc-700 dark:text-zinc-200">
                Scroll over the certificate · Click to cycle
              </span>
            </div>
          </div>

          <div className="w-full max-w-5xl mx-auto px-6 flex items-center justify-center relative z-10">
            <InteractivePhotoStack
              items={CERTIFICATIONS}
              title={
                <div className="flex flex-col items-center gap-1 mt-12 md:mt-16 pb-6">
                  <span className="font-mono text-[11px] md:text-xs uppercase tracking-[0.32em] font-semibold text-zinc-500 dark:text-zinc-400">
                    Verified Licenses & Accomplishments
                  </span>
                </div>
              }
            />
          </div>
        </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          05 — ABOUT (full-screen 3D model)
      ════════════════════════════════════════════════════════════════════════ */}
      <div className="min-h-[100dvh] md:min-h-0 flex flex-col md:block">
        <Chapter num="05" eyebrow="About Me" title="Hello." isMobile={isMobile} />

        <section
          id="about"
          className="relative flex-1 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 lg:gap-12 px-2 md:px-16 lg:px-24 py-12 md:h-screen w-full overflow-hidden bg-[#fafafa] dark:bg-[#0a0a0a] border-b border-black/5 dark:border-white/5 transition-colors duration-500 md:py-0"
        >
          {/* Spotlight & Grid Background Overlay */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
            <div className="absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]" />
            <Spotlight
              className="-top-[60vh] left-0 md:-top-[50vh] md:left-0"
              fill={resolvedTheme === "dark" ? "white" : "rgba(113, 113, 122, 0.25)"}
            />
          </div>
          {/* Top Row/Left Column: 3D Avatar Canvas */}
          <div className="w-full md:w-[48%] h-[35vh] md:h-[88vh] relative flex items-center justify-center -translate-y-[10px]">
            <InteractiveAvatar3D autoRotate={false} wireframeMode={false} accentColor="#71717a" />
          </div>

          {/* Bottom Row/Right Column: Liquid Glass AI Chatbox (Subtle Version) */}
          <div className="relative z-20 w-full md:w-[480px] flex justify-center items-center h-[40vh] md:h-[560px]">
            <div className="w-[380px] md:w-[480px] h-[400px] md:h-[560px] transform scale-[0.8] md:scale-100 origin-center pointer-events-auto select-none liquid-glass-slab">
          <style dangerouslySetInnerHTML={{ __html: `
            .liquid-glass-slab {
              position: relative;
              --glass-bg: rgba(255, 255, 255, 0.02);
              --glass-bg-strong: rgba(255, 255, 255, 0.05);
              --glass-border: rgba(255, 255, 255, 0.1);
              --glass-border-hover: rgba(255, 255, 255, 0.18);
              --glass-highlight: rgba(255, 255, 255, 0.15);
              --text-primary: rgba(255, 255, 255, 0.9);
              --text-secondary: rgba(255, 255, 255, 0.6);
              --text-muted: rgba(255, 255, 255, 0.35);
              --chip-icon-bg: rgba(255, 255, 255, 0.04);
              --chip-icon-border: rgba(255, 255, 255, 0.1);
              --bubble-ai-bg: rgba(255, 255, 255, 0.02);
              --bubble-ai-border: rgba(255, 255, 255, 0.08);
              --bubble-user-bg: rgba(255, 255, 255, 0.07);
              --bubble-user-border: rgba(255, 255, 255, 0.15);
              --input-bg: rgba(255, 255, 255, 0.03);
              --input-border: rgba(255, 255, 255, 0.08);
              --send-btn-bg: rgba(255, 255, 255, 0.9);
              --send-btn-hover: #ffffff;
              --card-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.3), inset 0 1px 1px var(--glass-highlight), inset 0 -1px 2px rgba(0, 0, 0, 0.15);
              --border-gradient: linear-gradient(160deg, rgba(255,255,255,0.15), rgba(255,255,255,0) 28%, rgba(255,255,255,0) 65%, rgba(0,0,0,0.1) 100%);
            }

            /* Light theme overrides */
            .liquid-glass-slab-light {
              --glass-bg: rgba(255, 255, 255, 0.45);
              --glass-bg-strong: rgba(255, 255, 255, 0.75);
              --glass-border: rgba(0, 0, 0, 0.08);
              --glass-border-hover: rgba(0, 0, 0, 0.15);
              --glass-highlight: rgba(255, 255, 255, 0.6);
              --text-primary: #18181b;
              --text-secondary: #52525b;
              --text-muted: #a1a1aa;
              --chip-icon-bg: rgba(0, 0, 0, 0.03);
              --chip-icon-border: rgba(0, 0, 0, 0.08);
              --bubble-ai-bg: rgba(0, 0, 0, 0.03);
              --bubble-ai-border: rgba(0, 0, 0, 0.06);
              --bubble-user-bg: rgba(0, 0, 0, 0.05);
              --bubble-user-border: rgba(0, 0, 0, 0.1);
              --input-bg: rgba(0, 0, 0, 0.03);
              --input-border: rgba(0, 0, 0, 0.08);
              --send-btn-bg: #18181b;
              --send-btn-hover: #09090b;
              --card-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.06), inset 0 1px 1px var(--glass-highlight), inset 0 -1px 2px rgba(0, 0, 0, 0.05);
              --border-gradient: linear-gradient(160deg, rgba(255,255,255,0.65), rgba(255,255,255,0) 28%, rgba(255,255,255,0) 65%, rgba(0,0,0,0.04) 100%);
            }

            .liquid-glass-card {
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              height: 100%;
              width: 100%;
              border-radius: 24px;
              padding: 20px;
              background: var(--glass-bg);
              border: 1px solid var(--glass-border);
              box-shadow: var(--card-shadow);
              backdrop-filter: blur(16px) saturate(140%);
              -webkit-backdrop-filter: blur(16px) saturate(140%);
              color: var(--text-primary);
              overflow: hidden;
            }

            .liquid-glass-card::before {
              content: "";
              position: absolute;
              top: -30%; left: -20%;
              width: 70%; height: 70%;
              background: radial-gradient(circle, rgba(255,255,255,0.04), transparent 70%);
              pointer-events: none;
              transform: rotate(-20deg);
            }

            .liquid-glass-card::after {
              content: "";
              position: absolute;
              inset: 0;
              border-radius: inherit;
              padding: 1px;
              background: var(--border-gradient);
              -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
              -webkit-mask-composite: xor;
              mask-composite: exclude;
              pointer-events: none;
            }

            .liquid-chip {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 10px 12px;
              border-radius: 14px;
              background: var(--glass-bg);
              border: 1px solid var(--glass-border);
              color: var(--text-primary);
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              text-align: left;
              backdrop-filter: blur(8px);
              -webkit-backdrop-filter: blur(8px);
              transition: background 0.2s ease, transform 0.15s ease, border-color 0.2s ease;
            }

            .liquid-chip:hover {
              background: var(--glass-bg-strong);
              border-color: var(--glass-border-hover);
              transform: translateY(-0.5px);
            }

            .liquid-chip:active { transform: translateY(0) scale(0.98); }

            .liquid-chip-icon {
              width: 22px;
              height: 22px;
              flex-shrink: 0;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: var(--chip-icon-bg);
              border: 1px solid var(--chip-icon-border);
            }

            .liquid-input-bar {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 4px 6px 4px 14px;
              border-radius: 999px;
              background: var(--input-bg);
              border: 1px solid var(--input-border);
              backdrop-filter: blur(10px);
              -webkit-backdrop-filter: blur(10px);
            }

            .liquid-send-btn {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              background: var(--send-btn-bg);
              border: none;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              flex-shrink: 0;
              transition: transform 0.15s ease, background 0.2s ease;
            }
            .liquid-send-btn:hover { background: var(--send-btn-hover); }
            .liquid-send-btn:active { transform: scale(0.92); }
            .liquid-send-btn:disabled { opacity: 0.25; cursor: not-allowed; }

            .liquid-bubble-ai {
              background: var(--bubble-ai-bg);
              border: 1px solid var(--bubble-ai-border);
              backdrop-filter: blur(6px);
              border-radius: 16px;
              border-bottom-left-radius: 4px;
            }

            .liquid-bubble-user {
              background: var(--bubble-user-bg);
              border: 1px solid var(--bubble-user-border);
              backdrop-filter: blur(6px);
              border-radius: 16px;
              border-bottom-right-radius: 4px;
            }
          ` }} />

          <div suppressHydrationWarning className={`liquid-glass-card ${mounted && resolvedTheme === "light" ? "liquid-glass-slab-light" : ""}`}>
            {/* Header */}
            <div className="flex items-center justify-between mb-3 flex-shrink-0">
              <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
                <svg className="w-3.5 h-3.5 text-zinc-500 dark:text-white/70" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l1.6 5.4L19 9l-5.4 1.6L12 16l-1.6-5.4L5 9l5.4-1.6L12 2z"/>
                  <path d="M19 15l.8 2.6L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.4L19 15z" opacity="0.7"/>
                </svg>
                <span className="text-[11px] font-sans font-medium tracking-widest uppercase opacity-70">Curious? Ask!</span>
              </div>

            </div>

            {/* Dynamic Content Area */}
            {chatMessages.length <= 1 ? (
              /* Hero Intro & Suggestion Chips Grid */
              <div className="flex-1 flex flex-col justify-center my-auto transition-all duration-300">
                <div className="text-center mb-5">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-1 select-none text-zinc-800 dark:text-white/90">Hello.</h2>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">How can I help you today?</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <button 
                    onClick={() => sendMessageText("Who is Suyash?")}
                    className="liquid-chip"
                  >
                    <span className="liquid-chip-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 1.7-2.5 2-2.5 4" strokeLinecap="round"/><circle cx="12" cy="17" r="0.4" fill="currentColor"/></svg>
                    </span>
                    Who is Suyash?
                  </button>
                  <button 
                    onClick={() => sendMessageText("Summarize his skillset")}
                    className="liquid-chip"
                  >
                    <span className="liquid-chip-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    Summarize skills
                  </button>
                  <button 
                    onClick={() => sendMessageText("Describe past projects")}
                    className="liquid-chip"
                  >
                    <span className="liquid-chip-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M9 18a6 6 0 1 1 6 0" strokeLinecap="round"/><path d="M9.5 21h5" strokeLinecap="round"/><path d="M12 3v2" strokeLinecap="round"/></svg>
                    </span>
                    Describe projects
                  </button>
                  <button 
                    onClick={() => sendMessageText("How can I contact him?")}
                    className="liquid-chip"
                  >
                    <span className="liquid-chip-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><path d="M9 8l-4 4 4 4" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 8l4 4-4 4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                    How to contact?
                  </button>
                </div>
              </div>
            ) : (
              /* Active Chat Message Log */
              <div ref={chatLogRef} className="flex-1 overflow-y-auto pr-1 my-3 space-y-4 scrollbar-thin">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex flex-col max-w-[85%] ${
                      msg.role === "user" ? "ml-auto items-end" : "items-start"
                    }`}
                  >
                    <div
                      className={`px-4 py-2.5 text-xs md:text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "liquid-bubble-user text-zinc-800 dark:text-white"
                          : "liquid-bubble-ai text-zinc-700 dark:text-white/90"
                      }`}
                    >
                      {msg.role === 'user' ? msg.content : renderMarkdown(msg.content)}
                    </div>
                  </div>
                ))}
                
                {chatLoading && (
                  <div className="flex flex-col max-w-[85%] items-start">
                    <div className="px-5 py-3.5 liquid-bubble-ai flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 dark:bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                )}


              </div>
            )}

            {/* Input Bar */}
            <form onSubmit={handleSendMessage} className="liquid-input-bar mt-auto flex-shrink-0">
              <svg className="w-4.5 h-4.5 text-zinc-400 dark:text-white/40 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7"/>
                <path d="M21 21l-4.3-4.3" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={chatLoading}
                className="flex-1 bg-transparent border-none outline-none text-xs md:text-sm text-zinc-800 dark:text-white placeholder-zinc-400 dark:placeholder-white/30 focus:ring-0 focus:outline-none py-2"
              />
              <button
                type="submit"
                disabled={chatLoading || !chatInput.trim()}
                className="liquid-send-btn"
                aria-label="Send message"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="w-4 h-4 text-white dark:text-zinc-800">
                  <path d="M5 12h14" strokeLinecap="round"/>
                  <path d="M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
        </div>
      </section>
      </div>

      {/* ════════════════════════════════════════════════════════════════════════
          05 — CONTACT / CINEMATIC FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <div ref={footerRef}>
        <CinematicFooter />
      </div>
    </main>
  );
}
