"use client";

import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2, FileX } from "lucide-react";
import dynamic from "next/dynamic";

interface PdfPreviewProps {
  pdfBlob: Blob | null;
  generating: boolean;
  error: string | null;
}

// Dynamically import the inner component that uses react-pdf, with SSR disabled
const PdfDocument = dynamic(() => import("./PdfDocument"), { ssr: false });

export default function PdfPreview({
  pdfBlob,
  generating,
  error,
}: PdfPreviewProps) {
  // Empty state
  if (!pdfBlob && !generating && !error) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-gray-400">
        <FileX className="mb-3 h-12 w-12" />
        <p className="text-sm">
          Fill out your resume and click &quot;Generate Preview&quot; to see a
          live preview here.
        </p>
      </div>
    );
  }

  // Loading
  if (generating) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-gray-500">
        <Loader2 className="mb-3 h-8 w-8 animate-spin" />
        <p className="text-sm">Generating PDF...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center text-red-500">
        <FileX className="mb-3 h-10 w-10" />
        <p className="text-sm font-medium">PDF generation failed</p>
        <p className="mt-1 text-xs text-red-400">{error}</p>
      </div>
    );
  }

  return <PdfDocument pdfBlob={pdfBlob} />;
}
