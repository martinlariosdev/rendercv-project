import type { ResumeData } from "@/types/resume";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

/**
 * Generates a PDF from the given resume data by POSTing to the backend.
 * Supports an optional AbortSignal for cancellation.
 */
export async function generatePdf(
  resumeData: ResumeData,
  signal?: AbortSignal
): Promise<Blob> {
  const response = await fetch(`${API_URL}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(resumeData),
    signal,
  });

  if (!response.ok) {
    let message = "PDF generation failed";
    try {
      const errorBody = await response.json();
      message = errorBody.detail ?? errorBody.message ?? message;
    } catch {
      // response body was not JSON, keep default message
    }
    throw new ApiError(message, response.status);
  }

  return response.blob();
}

/**
 * Fetches the list of available themes from the backend.
 */
export async function fetchThemes(): Promise<string[]> {
  const response = await fetch(`${API_URL}/themes`);

  if (!response.ok) {
    throw new ApiError("Failed to fetch themes", response.status);
  }

  return response.json();
}

/**
 * Checks the health status of the backend API.
 */
export async function checkHealth(): Promise<{
  status: string;
  rendercv_version: string;
}> {
  const response = await fetch(`${API_URL}/health`);

  if (!response.ok) {
    throw new ApiError("Health check failed", response.status);
  }

  return response.json();
}
