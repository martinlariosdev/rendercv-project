"use client";

import { useState } from "react";
import { Upload, FileDown, RefreshCw, Eye } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { generatePdf, ApiError } from "@/lib/apiClient";
import type { ValidationError } from "@/lib/apiClient";
import YamlImportModal from "./YamlImportModal";

interface NavbarProps {
  pdfBlob: Blob | null;
  setPdfBlob: (blob: Blob | null) => void;
  setGenerating: (v: boolean) => void;
  setGenerateError: (e: string | null) => void;
  setValidationErrors: (errors: ValidationError[]) => void;
  devMode: boolean;
  setDevMode: (v: boolean) => void;
}

export default function Navbar({
  pdfBlob,
  setPdfBlob,
  setGenerating,
  setGenerateError,
  setValidationErrors,
  devMode,
  setDevMode,
}: NavbarProps) {
  const [showImport, setShowImport] = useState(false);
  const resumeData = useResumeStore((s) => s.resumeData);
  const resetResume = useResumeStore((s) => s.resetResume);

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateError(null);
    setValidationErrors([]);
    try {
      const blob = await generatePdf(resumeData);
      setPdfBlob(blob);
    } catch (err) {
      if (err instanceof ApiError) {
        setGenerateError(err.message);
        setValidationErrors(err.validationErrors);
      } else {
        setGenerateError(
          err instanceof Error ? err.message : "PDF generation failed"
        );
      }
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBlob) return;
    const firstName = (resumeData.cv?.name ?? "Resume").split(" ")[0];
    const lastName =
      (resumeData.cv?.name ?? "").split(" ").slice(1).join("_") || "CV";
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${firstName}_${lastName}_CV.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    if (window.confirm("Reset all resume data to defaults?")) {
      resetResume();
      setPdfBlob(null);
      setValidationErrors([]);
      setGenerateError(null);
    }
  };

  return (
    <>
      <nav className="border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between">
          <span className="text-lg font-bold text-gray-800">
            RenderCV Builder
          </span>

          <div className="flex items-center gap-2">
            {/* Dev Mode toggle */}
            <label className="inline-flex cursor-pointer items-center gap-2">
              <span className="text-xs font-medium text-gray-500">
                Dev Mode
              </span>
              <button
                role="switch"
                aria-checked={devMode}
                onClick={() => setDevMode(!devMode)}
                className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                  devMode ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    devMode ? "translate-x-[18px]" : "translate-x-[3px]"
                  }`}
                />
              </button>
            </label>

            <div className="mx-1 h-6 w-px bg-gray-200" />

            <button
              onClick={() => setShowImport(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import YAML</span>
            </button>

            <button
              onClick={handleGenerate}
              className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Eye className="h-4 w-4" />
              <span className="hidden sm:inline">Generate Preview</span>
            </button>

            <button
              onClick={handleDownload}
              disabled={!pdfBlob}
              className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 disabled:opacity-50"
            >
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </button>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </nav>

      {showImport && <YamlImportModal onClose={() => setShowImport(false)} />}
    </>
  );
}
