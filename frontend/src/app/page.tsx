"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Columns3,
  FileText,
  Code2,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SessionWarningBanner from "@/components/SessionWarningBanner";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import SectionManager from "@/components/forms/SectionManager";
import DesignPanel from "@/components/forms/DesignPanel";
import YamlPreview from "@/components/YamlPreview";
import PdfPreview from "@/components/PdfPreview";

type MobileTab = "edit" | "yaml" | "preview";

export default function Home() {
  // PDF state
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);

  // Panel collapse state (desktop)
  const [leftOpen, setLeftOpen] = useState(true);
  const [centerOpen, setCenterOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Mobile tab
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");

  // Count open panels for grid layout
  const openCount = [leftOpen, centerOpen, rightOpen].filter(Boolean).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        pdfBlob={pdfBlob}
        setPdfBlob={setPdfBlob}
        setGenerating={setGenerating}
        setGenerateError={setGenerateError}
      />
      <SessionWarningBanner />

      {/* Mobile tab bar */}
      <div className="flex border-b border-gray-200 md:hidden">
        {(
          [
            { key: "edit", label: "Edit", icon: FileText },
            { key: "yaml", label: "YAML", icon: Code2 },
            { key: "preview", label: "Preview", icon: Eye },
          ] as const
        ).map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setMobileTab(key)}
            className={`flex flex-1 items-center justify-center gap-1.5 py-2.5 text-sm font-medium ${
              mobileTab === key
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Mobile content */}
      <div className="flex-1 md:hidden">
        {mobileTab === "edit" && (
          <div className="overflow-auto p-4">
            <PersonalInfoForm />
            <hr className="my-6 border-gray-200" />
            <SectionManager />
            <hr className="my-6 border-gray-200" />
            <DesignPanel />
          </div>
        )}
        {mobileTab === "yaml" && (
          <div className="h-[calc(100vh-12rem)]">
            <YamlPreview />
          </div>
        )}
        {mobileTab === "preview" && (
          <div className="h-[calc(100vh-12rem)]">
            <PdfPreview
              pdfBlob={pdfBlob}
              generating={generating}
              error={generateError}
            />
          </div>
        )}
      </div>

      {/* Desktop three-panel layout */}
      <div className="hidden flex-1 md:flex">
        {/* Panel toggle strip */}
        <div className="flex shrink-0 flex-col items-center gap-1 border-r border-gray-200 bg-gray-50 px-1 py-2">
          <button
            onClick={() => setLeftOpen((v) => !v)}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
            title={leftOpen ? "Collapse editor" : "Expand editor"}
          >
            {leftOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={() => setCenterOpen((v) => !v)}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
            title={centerOpen ? "Collapse YAML" : "Expand YAML"}
          >
            <Columns3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setRightOpen((v) => !v)}
            className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
            title={rightOpen ? "Collapse preview" : "Expand preview"}
          >
            {rightOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRightOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Panels container */}
        <div
          className="flex flex-1 overflow-hidden"
          style={{
            display: "grid",
            gridTemplateColumns:
              openCount === 0
                ? "1fr"
                : [
                    leftOpen ? "1fr" : "",
                    centerOpen ? "1fr" : "",
                    rightOpen ? "1fr" : "",
                  ]
                    .filter(Boolean)
                    .join(" "),
          }}
        >
          {/* Left panel: Form editor */}
          {leftOpen && (
            <div className="overflow-auto border-r border-gray-200 bg-white p-4">
              <PersonalInfoForm />
              <hr className="my-6 border-gray-200" />
              <SectionManager />
              <hr className="my-6 border-gray-200" />
              <DesignPanel />
            </div>
          )}

          {/* Center panel: YAML preview */}
          {centerOpen && (
            <div className="overflow-hidden border-r border-gray-200 bg-white">
              <YamlPreview />
            </div>
          )}

          {/* Right panel: PDF preview */}
          {rightOpen && (
            <div className="overflow-hidden bg-white">
              <PdfPreview
                pdfBlob={pdfBlob}
                generating={generating}
                error={generateError}
              />
            </div>
          )}
        </div>

        {/* Fallback when all panels collapsed */}
        {openCount === 0 && (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <p className="text-sm">
              All panels are collapsed. Use the toggle buttons on the left to
              expand a panel.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
