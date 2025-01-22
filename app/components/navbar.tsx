"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Ensure hydration matches by waiting for the component to mount
  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    // Avoid rendering mismatched HTML during hydration
    return null;
  }

  return (
    <nav className="bg-[#00bcd4] shadow-lg">
      {" "}
      {/* Updated background color to match footer */}
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand Name */}
        <div className="text-2xl font-bold text-white">Melos</div>

        {/* Menu Icon for Mobile */}
        <button
          className="md:hidden block text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            )}
          </svg>
        </button>

        {/* Navbar Links */}
        <div
          className={`md:flex items-center gap-8 ${
            isOpen ? "block" : "hidden"
          } absolute md:static top-14 left-0 w-full md:w-auto bg-[#00bcd4] md:bg-transparent`} // Updated background color to match footer
        >
          <Link
            href="/"
            className="block px-4 py-2 text-lg text-white hover:text-cyan-200 transition duration-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-lg text-white hover:text-cyan-200 transition duration-300"
          >
            About
          </Link>
          <Link
            href="/convert"
            className="block px-4 py-2 text-lg text-white hover:text-cyan-200 transition duration-300"
          >
            Convert
          </Link>
          <Link
            href="/faq"
            className="block px-4 py-2 text-lg text-white hover:text-cyan-200 transition duration-300"
          >
            FAQ
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
