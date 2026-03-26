"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileText,
  Eye,
  Palette,
  GripVertical,
  Code,
  Globe,
  ArrowRight,
} from "lucide-react";

const FEATURES = [
  {
    icon: Eye,
    title: "Real-time PDF Preview",
    description: "Generate and preview your resume PDF directly in the browser",
  },
  {
    icon: FileText,
    title: "YAML Import & Export",
    description: "Import existing RenderCV YAML files or export your work",
  },
  {
    icon: Palette,
    title: "9 Professional Themes",
    description: "Choose from classic, ember, harvard, ink, and more Typst themes",
  },
  {
    icon: GripVertical,
    title: "Drag-and-Drop Sections",
    description: "Reorder resume sections with intuitive drag-and-drop",
  },
  {
    icon: Code,
    title: "Dev Mode",
    description: "Toggle live YAML editing for power users who want full control",
  },
  {
    icon: Globe,
    title: "Multi-Language Support",
    description: "Generate resumes in English or Spanish with locale-aware formatting",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
};

export default function ProductSection() {
  return (
    <section
      id="product"
      className="scroll-mt-20 bg-gradient-to-b from-blue-50 to-white px-6 py-24"
    >
      <div className="mx-auto max-w-screen-xl">
        {/* Header */}
        <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-slate-900 md:text-4xl">
            RenderCV Builder
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            A full-featured browser-based resume editor powered by RenderCV.
            Build, preview, and download beautiful PDF resumes in minutes.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-4 inline-flex rounded-lg bg-blue-100 p-2.5 text-blue-600">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-500">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/builder"
            className="group inline-flex items-center gap-2 rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25"
          >
            Start Building Your Resume
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
