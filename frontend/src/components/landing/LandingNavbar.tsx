"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const NAV_LINKS = [
  { label: "Tech Stack", href: "#tech-stack" },
  { label: "Builder", href: "#product" },
  { label: "Credits", href: "#credits" },
];

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = 80; // navbar height
  const top = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/90 shadow-sm backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-screen-xl items-center justify-between px-6 py-4">
        {/* Brand */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`text-lg font-bold transition-colors ${
            scrolled ? "text-slate-800" : "text-white"
          }`}
        >
          RenderCV Builder
        </button>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.href}
              onClick={(e) => {
                e.preventDefault();
                smoothScrollTo(link.href.replace("#", ""));
              }}
              className={`text-sm font-medium transition-colors ${
                scrolled
                  ? "text-slate-600 hover:text-slate-900"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              {link.label}
            </button>
          ))}
        </div>

        {/* Desktop CTA buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <a
            href="https://www.linkedin.com/in/martin-larios/"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-full p-2 transition-colors ${
              scrolled
                ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            aria-label="LinkedIn"
          >
            <LinkedinIcon className="h-5 w-5" />
          </a>
          <Link
            href="/builder"
            className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Go to Builder
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`rounded-md p-2 md:hidden ${
            scrolled ? "text-slate-700" : "text-white"
          }`}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-slate-200/20 bg-white px-6 py-4 shadow-lg md:hidden">
          <div className="flex flex-col gap-3">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => {
                  setMenuOpen(false);
                  smoothScrollTo(link.href.replace("#", ""));
                }}
                className="text-left text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                {link.label}
              </button>
            ))}
            <hr className="border-slate-200" />
            <div className="flex items-center gap-3">
              <Link
                href="/builder"
                onClick={() => setMenuOpen(false)}
                className="flex-1 rounded-full bg-blue-600 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Go to Builder
              </Link>
              <a
                href="https://www.linkedin.com/in/martinlariosdev/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
