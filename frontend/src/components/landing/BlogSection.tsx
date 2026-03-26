"use client";

import { motion } from "framer-motion";
import { ExternalLink, BookOpen } from "lucide-react";

const ARTICLES = [
  {
    title: "A Technical Guide to Multi-Agent Orchestration",
    author: "Daniel Dominguez",
    source: "Medium",
    url: "https://dominguezdaniel.medium.com/a-technical-guide-to-multi-agent-orchestration-5f979c831c0d",
    summary:
      "Deep dive into orchestration patterns, communication protocols, and best practices for coordinating multiple AI agents.",
  },
  {
    title: "How to Write a Good Spec for AI Agents",
    author: "Addy Osmani",
    source: "AddyOsmani.com",
    url: "https://addyosmani.com/blog/good-spec/",
    summary:
      "How to write structured specifications that serve as the source of truth for AI coding agents, covering inputs, outputs, and constraints.",
  },
  {
    title: "Spec-Driven Development with AI: An Open Source Toolkit",
    author: "Den Delimarsky",
    source: "GitHub Blog",
    url: "https://github.blog/ai-and-ml/generative-ai/spec-driven-development-with-ai-get-started-with-a-new-open-source-toolkit/",
    summary:
      "Introduces spec-driven development where specifications become living documents that guide AI agents through planning and code generation.",
  },
  {
    title: "Multi-Agent Orchestration: Running 10+ Claude Instances in Parallel",
    author: "bredmond1019",
    source: "DEV Community",
    url: "https://dev.to/bredmond1019/multi-agent-orchestration-running-10-claude-instances-in-parallel-part-3-29da",
    summary:
      "Practical tutorial on running multiple Claude Code instances as specialized subagents for parallel task execution.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function BlogSection() {
  return (
    <section id="blog" className="scroll-mt-20 bg-white px-6 py-24">
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-6 text-center">
          <div className="mb-4 inline-flex items-center gap-2 text-blue-600">
            <BookOpen className="h-5 w-5" />
          </div>
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            Learn the Patterns
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            This project was built following{" "}
            <span className="font-semibold text-slate-800">
              spec-driven development
            </span>{" "}
            and{" "}
            <span className="font-semibold text-slate-800">
              multi-agent orchestration
            </span>{" "}
            patterns. Here are the best resources to learn these approaches.
          </p>
        </motion.div>

        {/* Articles grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ARTICLES.map((article, i) => (
            <motion.a
              key={article.title}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="group flex flex-col rounded-xl border border-slate-200 bg-slate-50 p-6 transition-all hover:border-blue-200 hover:bg-white hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {article.source}
                </span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400 transition-colors group-hover:text-blue-500" />
              </div>
              <h3 className="mb-2 text-sm font-semibold leading-snug text-slate-800 group-hover:text-blue-600">
                {article.title}
              </h3>
              <p className="mb-4 flex-1 text-xs leading-relaxed text-slate-500">
                {article.summary}
              </p>
              <p className="text-xs text-slate-400">
                By {article.author}
              </p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
