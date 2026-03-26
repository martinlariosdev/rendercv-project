"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock, GitCommit, Zap, Download } from "lucide-react";
import { getDownloadCount } from "@/lib/apiClient";

const TECH_STACK = [
  {
    name: "Next.js 16",
    description: "React framework with App Router for the frontend",
    url: "https://nextjs.org",
    logo: (
      <svg viewBox="0 0 180 180" className="h-10 w-10" fill="currentColor">
        <mask id="a" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
          <circle cx="90" cy="90" r="90" fill="#fff" />
        </mask>
        <g mask="url(#a)">
          <circle cx="90" cy="90" r="90" fill="currentColor" />
          <path d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z" fill="url(#nextGrad1)" />
          <rect x="115" y="54" width="12" height="72" fill="url(#nextGrad2)" />
        </g>
        <defs>
          <linearGradient id="nextGrad1" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="nextGrad2" x1="121" y1="54" x2="120.799" y2="106.875" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fff" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    ),
  },
  {
    name: "FastAPI",
    description: "Python backend for PDF generation via RenderCV",
    url: "https://fastapi.tiangolo.com",
    logo: (
      <svg viewBox="0 0 154 154" className="h-10 w-10" fill="none">
        <circle cx="77" cy="77" r="77" fill="#05998b" />
        <path d="M81.375 18.667l-38.75 70H77V130l38.75-70H81.375V18.667z" fill="#fff" />
      </svg>
    ),
  },
  {
    name: "Tailwind CSS v4",
    description: "Utility-first CSS framework for styling",
    url: "https://tailwindcss.com",
    logo: (
      <svg viewBox="0 0 54 33" className="h-8 w-12" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C36.756 3.11 33.692 0 27 0zM13.5 16.2C6.3 16.2 1.8 19.8 0 27c2.7-3.6 5.85-4.95 9.45-4.05 2.054.514 3.522 2.004 5.147 3.653C17.244 29.29 20.308 32.4 27 32.4c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.514-3.522-2.004-5.147-3.653C23.256 19.31 20.192 16.2 13.5 16.2z"
          fill="#38bdf8"
        />
      </svg>
    ),
  },
  {
    name: "Zustand",
    description: "Lightweight state management with session persistence",
    url: "https://zustand.docs.pmnd.rs",
    logo: (
      <svg viewBox="0 0 100 100" className="h-10 w-10">
        <circle cx="50" cy="50" r="48" fill="#443d30" />
        <ellipse cx="38" cy="42" rx="5" ry="6" fill="#fff" />
        <ellipse cx="62" cy="42" rx="5" ry="6" fill="#fff" />
        <ellipse cx="38" cy="43" rx="2.5" ry="3" fill="#1a1a1a" />
        <ellipse cx="62" cy="43" rx="2.5" ry="3" fill="#1a1a1a" />
        <path d="M40 60 Q50 68 60 60" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "RenderCV",
    description: "LaTeX/Typst resume engine powering PDF generation",
    url: "https://github.com/rendercv/rendercv",
    logo: (
      <svg viewBox="0 0 100 100" className="h-10 w-10" fill="none">
        <rect x="5" y="5" width="90" height="90" rx="12" fill="#2563eb" />
        <path d="M25 30h50M25 45h35M25 60h45M25 75h25" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "Docker",
    description: "Containerized backend deployment",
    url: "https://www.docker.com",
    logo: (
      <svg viewBox="0 0 128 128" className="h-10 w-10">
        <path
          d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.4-3.4 9.1-3 13.4.3 3.2 1.5 6.4 3.5 8.9-1.7 1 -3.5 1.7-5.3 2.3-3.2 1-6.6 1.6-10 1.6H.4l-.2 1.9c-.5 6.5.5 13.1 3.2 19.1l1.1 2.2.1.2c7.6 12.5 21.1 17.8 35.8 17.8 27.5 0 49.8-12.6 60.3-39.7 7 .1 14.3-1.7 17.8-8.8l.9-1.8-1.6-1.1zM28 39.9h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H28c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm13.8 0h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H41.8c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm0-13.8h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H41.8c-.5 0-.9-.4-.9-.9V27c0-.5.4-.9.9-.9zm13.8 13.8h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H55.6c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm-41.4 0h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H14.2c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm13.8 0h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H28c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm41.4 0h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H69.4c-.5 0-.9-.4-.9-.9V40.8c0-.5.4-.9.9-.9zm0-13.8h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H69.4c-.5 0-.9-.4-.9-.9V27c0-.5.4-.9.9-.9zm-13.8 0h10.3c.5 0 .9.4.9.9v10.3c0 .5-.4.9-.9.9H55.6c-.5 0-.9-.4-.9-.9V27c0-.5.4-.9.9-.9z"
          fill="#1d63ed"
        />
      </svg>
    ),
  },
];

const AGENTS = [
  { id: 1, name: "Planner", description: "Designed the architecture and defined the 6-agent workflow" },
  { id: 2, name: "Backend", description: "Built FastAPI server, Pydantic models, and Docker setup" },
  { id: 3, name: "Frontend", description: "Created Next.js app, components, and Zustand store" },
  { id: 4, name: "Integration", description: "Connected frontend to backend API and PDF generation" },
  { id: 5, name: "UX Polish", description: "Added validation errors, dev mode, locale support" },
  { id: 6, name: "Deploy", description: "Prepared Docker, Vercel, and Railway configurations" },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function TechStackSection() {
  const [downloads, setDownloads] = useState<number | null>(null);

  useEffect(() => {
    getDownloadCount()
      .then((data) => setDownloads(data.count))
      .catch(() => setDownloads(null));
  }, []);

  return (
    <section id="tech-stack" className="scroll-mt-20 bg-slate-50 px-6 py-24">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            How We Built This
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A modern tech stack orchestrated by a multi-agent AI workflow — each
            agent specialized in a different part of the system.
          </p>
        </motion.div>

        {/* Build Stats */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mx-auto mb-16 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {[
            {
              icon: Clock,
              value: "~6 hours",
              label: "of active prompting",
            },
            {
              icon: GitCommit,
              value: "16 commits",
              label: "across 2 days",
            },
            {
              icon: Zap,
              value: "6 agents",
              label: "working in parallel",
            },
            {
              icon: Download,
              value: downloads !== null ? String(downloads) : "—",
              label: "resumes downloaded",
            },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="flex flex-col items-center rounded-xl border border-blue-100 bg-blue-50/50 p-5 text-center"
            >
              <stat.icon className="mb-2 h-5 w-5 text-blue-500" />
              <span className="text-2xl font-bold text-slate-900">
                {stat.value}
              </span>
              <span className="text-xs text-slate-500">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Tech Stack Grid */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.1 }} className="mb-20">
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Tech Stack
          </h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {TECH_STACK.map((tech, i) => (
              <motion.a
                key={tech.name}
                href={tech.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group flex flex-col items-center rounded-xl border border-slate-200 bg-white p-6 text-center shadow-sm transition-all hover:border-blue-200 hover:shadow-md"
              >
                <div className="mb-3 text-slate-800 transition-transform group-hover:scale-110">{tech.logo}</div>
                <h4 className="mb-1 text-sm font-semibold text-slate-800 group-hover:text-blue-600">
                  {tech.name}
                </h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  {tech.description}
                </p>
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Multi-Agent Flow */}
        <motion.div {...fadeUp} transition={{ duration: 0.5, delay: 0.2 }}>
          <h3 className="mb-8 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Multi-Agent Workflow
          </h3>

          {/* Horizontal flow — desktop */}
          <div className="hidden lg:block">
            <div className="flex items-start justify-between">
              {AGENTS.map((agent, i) => (
                <div key={agent.id} className="flex items-start">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.4, delay: i * 0.12 }}
                    className="flex w-36 flex-col items-center text-center"
                  >
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-lg font-bold text-white shadow-md shadow-blue-600/20">
                      {agent.id}
                    </div>
                    <h4 className="mb-1 text-sm font-semibold text-slate-800">
                      {agent.name}
                    </h4>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {agent.description}
                    </p>
                  </motion.div>

                  {/* Arrow connector */}
                  {i < AGENTS.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.12 + 0.2 }}
                      className="mt-5 flex items-center px-2"
                    >
                      <div className="h-0.5 w-6 bg-slate-300" />
                      <div className="h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-slate-300" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Vertical flow — mobile/tablet */}
          <div className="lg:hidden">
            <div className="flex flex-col items-center gap-4">
              {AGENTS.map((agent, i) => (
                <div key={agent.id} className="flex flex-col items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="flex w-full max-w-sm items-center gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                      {agent.id}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-slate-800">
                        {agent.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {agent.description}
                      </p>
                    </div>
                  </motion.div>

                  {/* Vertical connector */}
                  {i < AGENTS.length - 1 && (
                    <div className="flex flex-col items-center">
                      <div className="h-4 w-0.5 bg-slate-300" />
                      <div className="h-0 w-0 border-x-[5px] border-t-[8px] border-x-transparent border-t-slate-300" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
