"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";

const STORAGE_KEY = "rendercv-session-warning-dismissed";

export default function SessionWarningBanner() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored !== "true") {
      setDismissed(false);
    }
  }, []);

  const dismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  if (dismissed) return null;

  return (
    <div className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-800">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Your resume data is only stored in this browser session. Download
            your PDF or copy the YAML to save your work.
          </span>
        </div>
        <button
          onClick={dismiss}
          className="shrink-0 rounded p-1 hover:bg-amber-100"
          aria-label="Dismiss warning"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
