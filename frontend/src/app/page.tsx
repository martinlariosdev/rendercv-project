"use client";

import { useState } from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  FileText,
  Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SessionWarningBanner from "@/components/SessionWarningBanner";
import PersonalInfoForm from "@/components/forms/PersonalInfoForm";
import SectionManager from "@/components/forms/SectionManager";
import DesignPanel from "@/components/forms/DesignPanel";
import YamlPreview from "@/components/YamlPreview";
import PdfPreview from "@/components/PdfPreview";
import ErrorBoundary from "@/components/ErrorBoundary";
import type { ValidationError } from "@/lib/apiClient";

type MobileTab = "edit" | "yaml" | "preview";

function buildErrorMap(errors: ValidationError[]): Record<string, string> {
  const map: Record<string, string> = {};
  for (const err of errors) {
    map[err.location] = err.message;
  }
  return map;
}

export default function Home() {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
    []
  );

  // Dev mode toggle — controls YAML panel visibility
  const [devMode, setDevMode] = useState(false);

  // Panel collapse state (desktop)
  const [leftOpen, setLeftOpen] = useState(true);
  const [centerOpen, setCenterOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);

  // Mobile tab
  const [mobileTab, setMobileTab] = useState<MobileTab>("edit");

  // Build visible panels list for desktop grid
  const visiblePanels = [
    leftOpen ? "left" : null,
    devMode && centerOpen ? "center" : null,
    rightOpen ? "right" : null,
  ].filter(Boolean);

  const errorMap = buildErrorMap(validationErrors);

  // Mobile tabs — only show YAML tab in dev mode
  const mobileTabs = [
    { key: "edit" as const, label: "Edit", icon: FileText },
    ...(devMode
      ? [
          {
            key: "yaml" as const,
            label: "YAML",
            icon: () => (
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            ),
          },
        ]
      : []),
    { key: "preview" as const, label: "Preview", icon: Eye },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        pdfBlob={pdfBlob}
        setPdfBlob={setPdfBlob}
        setGenerating={setGenerating}
        setGenerateError={setGenerateError}
        setValidationErrors={setValidationErrors}
        devMode={devMode}
        setDevMode={setDevMode}
      />
      <SessionWarningBanner />

      {/* Mobile tab bar */}
      <div className="flex border-b border-gray-200 md:hidden">
        {mobileTabs.map(({ key, label, icon: Icon }) => (
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
            <PersonalInfoForm errors={errorMap} />
            <hr className="my-6 border-gray-200" />
            <SectionManager errors={errorMap} />
            <hr className="my-6 border-gray-200" />
            <DesignPanel />
          </div>
        )}
        {mobileTab === "yaml" && devMode && (
          <div className="h-[calc(100vh-12rem)]">
            <YamlPreview />
          </div>
        )}
        {mobileTab === "preview" && (
          <div className="h-[calc(100vh-12rem)]">
            <ErrorBoundary>
              <PdfPreview
                pdfBlob={pdfBlob}
                generating={generating}
                error={generateError}
              />
            </ErrorBoundary>
          </div>
        )}
      </div>

      {/* Desktop layout */}
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
          {devMode && (
            <button
              onClick={() => setCenterOpen((v) => !v)}
              className="rounded p-1.5 text-gray-500 hover:bg-gray-200"
              title={centerOpen ? "Collapse YAML" : "Expand YAML"}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </button>
          )}
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
              visiblePanels.length === 0
                ? "1fr"
                : visiblePanels.map(() => "1fr").join(" "),
          }}
        >
          {leftOpen && (
            <div className="overflow-auto border-r border-gray-200 bg-white p-4">
              <PersonalInfoForm errors={errorMap} />
              <hr className="my-6 border-gray-200" />
              <SectionManager errors={errorMap} />
              <hr className="my-6 border-gray-200" />
              <DesignPanel />
            </div>
          )}

          {devMode && centerOpen && (
            <div className="overflow-hidden border-r border-gray-200 bg-white">
              <YamlPreview />
            </div>
          )}

          {rightOpen && (
            <div className="overflow-hidden bg-white">
              <ErrorBoundary>
                <PdfPreview
                  pdfBlob={pdfBlob}
                  generating={generating}
                  error={generateError}
                />
              </ErrorBoundary>
            </div>
          )}
        </div>

        {visiblePanels.length === 0 && (
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
