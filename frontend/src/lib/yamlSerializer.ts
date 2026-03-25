import yaml from "js-yaml";
import type { ResumeData } from "@/types/resume";

/**
 * Recursively removes undefined, null, empty strings, empty arrays,
 * and empty objects from a value before YAML serialization.
 */
function cleanObject(obj: unknown): unknown {
  if (obj === null || obj === undefined || obj === "") {
    return undefined;
  }

  if (Array.isArray(obj)) {
    const cleaned = obj
      .map((item) => cleanObject(item))
      .filter((item) => item !== undefined);
    return cleaned.length > 0 ? cleaned : undefined;
  }

  if (typeof obj === "object") {
    const cleaned: Record<string, unknown> = {};
    let hasKeys = false;

    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      const cleanedValue = cleanObject(value);
      if (cleanedValue !== undefined) {
        cleaned[key] = cleanedValue;
        hasKeys = true;
      }
    }

    return hasKeys ? cleaned : undefined;
  }

  // Primitives (number, boolean, string with content)
  return obj;
}

/**
 * Serializes ResumeData to a YAML string, omitting null/undefined values
 * and empty arrays/objects.
 */
export function serializeToYaml(resumeData: ResumeData): string {
  const cleaned = cleanObject(resumeData);
  if (cleaned === undefined) {
    return "";
  }
  return yaml.dump(cleaned, {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Parses a YAML string back into ResumeData for the import feature.
 * Throws an error if the YAML is invalid or does not match expected structure.
 */
export function parseFromYaml(yamlString: string): ResumeData {
  const parsed = yaml.load(yamlString);

  if (parsed === null || parsed === undefined) {
    return {};
  }

  if (typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Invalid resume YAML: expected a top-level object");
  }

  return parsed as ResumeData;
}
