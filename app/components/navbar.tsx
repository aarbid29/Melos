"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }
  return (
    <header className="w-full py-6 px-8 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <WaveformIcon className="h-4 w-4 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-medium tracking-tight">Melos</h1>
      </div>

      <nav className="hidden md:flex items-center space-x-6">
        <a
          href="#"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Karaoke
        </a>
        <a
          href="#"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Examples
        </a>
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
};

// Waveform Icon component
const WaveformIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H2v-8z" />
    <path d="M6 8h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6V8z" />
    <path d="M10 4h2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2V4z" />
    <path d="M14 2h2a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2h-2V2z" />
    <path d="M18 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2V6z" />
  </svg>
);

export default Navbar;
