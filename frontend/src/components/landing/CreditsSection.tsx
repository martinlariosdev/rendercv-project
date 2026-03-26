"use client";

import { motion } from "framer-motion";
import { ExternalLink, Heart } from "lucide-react";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

const REPOS = [
  {
    name: "RenderCV",
    description:
      "The open-source engine that powers resume generation with Typst themes.",
    url: "https://github.com/rendercv/rendercv",
  },
  {
    name: "RenderCV Builder",
    description:
      "This project — the browser-based editor built entirely with AI prompts.",
    url: "https://github.com/martinlariosdev/rendercv-project",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function CreditsSection() {
  return (
    <section id="credits" className="scroll-mt-20 bg-slate-900 px-6 py-24">
      <div className="mx-auto max-w-screen-xl text-center">
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-12">
          <div className="mb-4 inline-flex items-center gap-2 text-rose-400">
            <Heart className="h-5 w-5" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
            Thank You
          </h2>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-400">
            This project wouldn&apos;t be possible without the incredible work
            of the{" "}
            <a
              href="https://github.com/rendercv/rendercv"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 underline decoration-blue-400/30 transition-colors hover:text-blue-300"
            >
              RenderCV
            </a>{" "}
            team. Their open-source resume engine is the foundation that makes
            beautiful PDF generation possible.
          </p>
        </motion.div>

        {/* Repo cards */}
        <div className="mx-auto mb-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
          {REPOS.map((repo, i) => (
            <motion.a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex flex-col items-center rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-center transition-all hover:border-slate-600 hover:bg-slate-800"
            >
              <GitHubIcon className="mb-3 h-8 w-8 text-slate-400 transition-colors group-hover:text-white" />
              <h3 className="mb-1 flex items-center gap-1.5 text-base font-semibold text-white">
                {repo.name}
                <ExternalLink className="h-3.5 w-3.5 text-slate-500 transition-colors group-hover:text-slate-300" />
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {repo.description}
              </p>
            </motion.a>
          ))}
        </div>

        {/* Closing note */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-sm text-slate-500"
        >
          Built with AI prompts &middot; Powered by{" "}
          <a
            href="https://claude.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 underline decoration-slate-600 hover:text-slate-300"
          >
            Claude
          </a>
        </motion.p>
      </div>
    </section>
  );
}
