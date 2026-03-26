import type { ResumeData } from "@/types/resume";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface ValidationError {
  location: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  validationErrors: ValidationError[];

  constructor(
    message: string,
    status: number,
    validationErrors: ValidationError[] = []
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.validationErrors = validationErrors;
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
    let validationErrors: ValidationError[] = [];
    try {
      const errorBody = await response.json();
      const detail = errorBody.detail;
      if (typeof detail === "object" && detail !== null) {
        message = detail.message ?? message;
        validationErrors = detail.validation_errors ?? [];
      } else if (typeof detail === "string") {
        message = detail;
      }
    } catch {
      // response body was not JSON, keep default message
    }
    throw new ApiError(message, response.status, validationErrors);
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
