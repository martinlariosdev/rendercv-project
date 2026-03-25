"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { parseFromYaml } from "@/lib/yamlSerializer";
import { useResumeStore } from "@/store/resumeStore";

interface YamlImportModalProps {
  onClose: () => void;
}

export default function YamlImportModal({ onClose }: YamlImportModalProps) {
  const [yamlText, setYamlText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const setResumeData = useResumeStore((s) => s.setResumeData);

  const handleLoad = () => {
    try {
      setError(null);
      const data = parseFromYaml(yamlText);
      setResumeData(data);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid YAML");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Import YAML</h2>
          <button
            onClick={onClose}
            className="rounded p-1 hover:bg-gray-100"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-4">
          <textarea
            value={yamlText}
            onChange={(e) => setYamlText(e.target.value)}
            placeholder="Paste your RenderCV YAML here..."
            className="h-72 w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {error && (
            <p className="mt-2 text-sm text-red-600">{error}</p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-gray-200 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleLoad}
            disabled={!yamlText.trim()}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Load
          </button>
        </div>
      </div>
    </div>
  );
}
