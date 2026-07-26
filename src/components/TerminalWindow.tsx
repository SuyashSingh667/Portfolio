"use client";

import React, { useState, useRef, useEffect } from "react";
import "./TerminalWindow.css";

interface CommandLog {
  command: string;
  output: React.ReactNode;
}

export default function TerminalWindow() {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      command: "welcome",
      output: (
        <div className="text-xs space-y-1 my-1">
          <p className="text-purple-300 font-semibold">Welcome to Suyash's Interactive Terminal v2.4</p>
          <p className="text-zinc-400">Type <span className="text-emerald-400 font-bold">'help'</span> to view all available commands.</p>
        </div>
      ),
    },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [logs]);

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim().toLowerCase();
    if (!trimmed) return;

    let output: React.ReactNode = null;

    switch (trimmed) {
      case "help":
        output = (
          <div className="text-xs space-y-1 my-1">
            <p className="text-yellow-300 font-semibold">Available Commands:</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">skills</span> - Display core technical stack</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">projects</span> - View featured engineering projects</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">whoami</span> - About Suyash Singh</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">contact</span> - Get in touch &amp; socials</p>
            <p><span className="text-emerald-400 w-24 inline-block font-bold">clear</span> - Clear the terminal output</p>
          </div>
        );
        break;

      case "skills":
        output = (
          <div className="text-xs space-y-1 my-1">
            <p className="text-cyan-300 font-semibold">// Core Skillset Matrix:</p>
            <p className="text-zinc-300">Frontend: React.js, Next.js, TypeScript, Tailwind CSS, GSAP, Framer Motion</p>
            <p className="text-zinc-300">3D &amp; Graphics: WebGL, Three.js, GLSL Shaders, Canvas API</p>
            <p className="text-zinc-300">Backend &amp; DevOps: Node.js, Python, PostgreSQL, Docker, Git</p>
          </div>
        );
        break;

      case "projects":
        output = (
          <div className="text-xs space-y-1.5 my-1">
            <p className="text-indigo-300 font-semibold">// Featured Projects:</p>
            <p>🛰️ <span className="font-bold text-white">SkySentinel</span> - Space situational awareness &amp; orbit 3D telemetry</p>
            <p>🏫 <span className="font-bold text-white">Tribe</span> - Centralized campus event hub with AI calendar</p>
            <p>🗳️ <span className="font-bold text-white">VoteSamvidhan</span> - Blockchain election integrity &amp; voting portal</p>
          </div>
        );
        break;

      case "whoami":
        output = (
          <div className="text-xs space-y-1 my-1">
            <p className="text-emerald-300 font-semibold">Suyash Singh</p>
            <p className="text-zinc-300">Software Developer &amp; Creative Frontend Engineer.</p>
            <p className="text-zinc-400">Passionate about building high-performance web applications, interactive 3D graphics, and intuitive user experiences.</p>
          </div>
        );
        break;

      case "contact":
        output = (
          <div className="text-xs space-y-1 my-1">
            <p className="text-purple-300 font-semibold">Connect with me:</p>
            <p>📧 Email: <span className="text-white">suyashsingh.dev@gmail.com</span></p>
            <p>🐙 GitHub: <span className="text-sky-300">github.com/SuyashSingh667</span></p>
            <p>💼 LinkedIn: <span className="text-sky-300">linkedin.com/in/suyash-singh</span></p>
          </div>
        );
        break;

      case "clear":
        setLogs([]);
        setInputVal("");
        return;

      default:
        output = (
          <p className="text-xs text-red-400 my-0.5">
            command not found: {trimmed}. Type <span className="text-yellow-300 font-bold">'help'</span> for list of commands.
          </p>
        );
        break;
    }

    setLogs((prev) => [...prev, { command: inputVal, output }]);
    setInputVal("");
  };

  return (
    <div className="terminal-container" onClick={handleContainerClick}>
      <div className="container_terminal"></div>
      <div className="terminal_toolbar">
        <div className="butt">
          <button className="btn btn-color" title="Close"></button>
          <button className="btn" title="Minimize"></button>
          <button className="btn" title="Expand"></button>
        </div>
        <p className="user terminal-user-title">suyash@admin: ~</p>
      </div>

      <div className="terminal_body" ref={bodyRef}>
        {logs.map((log, idx) => (
          <div key={idx} className="mb-2">
            {log.command !== "welcome" && (
              <div className="terminal_promt mb-0.5">
                <span className="terminal_user">suyash@admin:</span>
                <span className="terminal_location">~</span>
                <span className="terminal_bling">$</span>
                <span className="text-white font-mono ml-1">{log.command}</span>
              </div>
            )}
            {log.output}
          </div>
        ))}

        {/* Input Prompt */}
        <form onSubmit={handleCommandSubmit} className="terminal_promt mt-1">
          <span className="terminal_user">suyash@admin:</span>
          <span className="terminal_location">~</span>
          <span className="terminal_bling">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="bg-transparent border-none outline-none text-white font-mono text-sm flex-1 ml-1"
            autoFocus
            spellCheck={false}
          />
          <span className="terminal_cursor"></span>
        </form>
      </div>
    </div>
  );
}
