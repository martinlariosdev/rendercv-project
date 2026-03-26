"use client";

import { Plus, Trash2 } from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import type {
  EducationEntry,
  ExperienceEntry,
  NormalEntry,
  PublicationEntry,
  OneLineEntry,
  BulletEntry,
  SectionEntry,
} from "@/types/resume";

const inputBase =
  "w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2";
const inputNormal = `${inputBase} border-gray-300 focus:ring-blue-500`;
const inputError = `${inputBase} border-red-400 focus:ring-red-500`;
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

// ---------------------------------------------------------------------------
// Shared: HighlightsList
// ---------------------------------------------------------------------------

function HighlightsList({
  highlights,
  onChange,
}: {
  highlights: string[];
  onChange: (h: string[]) => void;
}) {
  const update = (idx: number, val: string) => {
    const copy = [...highlights];
    copy[idx] = val;
    onChange(copy);
  };
  const remove = (idx: number) => onChange(highlights.filter((_, i) => i !== idx));
  const add = () => onChange([...highlights, ""]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className={labelClass}>Highlights</label>
        <button
          onClick={add}
          type="button"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {highlights.map((h, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              className={inputNormal}
              value={h}
              onChange={(e) => update(idx, e.target.value)}
              placeholder="Highlight"
            />
            <button
              onClick={() => remove(idx)}
              type="button"
              className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared: AuthorsList
// ---------------------------------------------------------------------------

function AuthorsList({
  authors,
  onChange,
}: {
  authors: string[];
  onChange: (a: string[]) => void;
}) {
  const update = (idx: number, val: string) => {
    const copy = [...authors];
    copy[idx] = val;
    onChange(copy);
  };
  const remove = (idx: number) => onChange(authors.filter((_, i) => i !== idx));
  const add = () => onChange([...authors, ""]);

  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className={labelClass}>Authors</label>
        <button
          onClick={add}
          type="button"
          className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
        >
          <Plus className="h-3 w-3" /> Add
        </button>
      </div>
      <div className="space-y-1.5">
        {authors.map((a, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              type="text"
              className={inputNormal}
              value={a}
              onChange={(e) => update(idx, e.target.value)}
              placeholder="Author name"
            />
            <button
              onClick={() => remove(idx)}
              type="button"
              className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helper to look up errors for a section entry field
// ---------------------------------------------------------------------------

function useEntryError(
  errors: Record<string, string>,
  sectionKey: string,
  index: number
) {
  return (field: string) =>
    errors[`cv.sections.${sectionKey}.${index}.${field}`];
}

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

function EducationEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as EducationEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  const update = (field: string, value: unknown) => {
    updateSectionEntry(sectionKey, index, { ...entry, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Institution</label>
          <input className={err("institution") ? inputError : inputNormal} value={entry.institution ?? ""} onChange={(e) => update("institution", e.target.value)} />
          <FieldError message={err("institution")} />
        </div>
        <div>
          <label className={labelClass}>Area</label>
          <input className={err("area") ? inputError : inputNormal} value={entry.area ?? ""} onChange={(e) => update("area", e.target.value)} />
          <FieldError message={err("area")} />
        </div>
        <div>
          <label className={labelClass}>Degree</label>
          <input className={err("degree") ? inputError : inputNormal} value={entry.degree ?? ""} onChange={(e) => update("degree", e.target.value)} />
          <FieldError message={err("degree")} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={err("location") ? inputError : inputNormal} value={entry.location ?? ""} onChange={(e) => update("location", e.target.value)} />
          <FieldError message={err("location")} />
        </div>
        <div>
          <label className={labelClass}>Start Date</label>
          <input className={err("start_date") ? inputError : inputNormal} placeholder="YYYY-MM" value={entry.start_date ?? ""} onChange={(e) => update("start_date", e.target.value)} />
          <FieldError message={err("start_date")} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input className={err("end_date") ? inputError : inputNormal} placeholder="YYYY-MM or present" value={entry.end_date ?? ""} onChange={(e) => update("end_date", e.target.value)} />
          <FieldError message={err("end_date")} />
        </div>
      </div>
      <HighlightsList
        highlights={entry.highlights ?? []}
        onChange={(h) => update("highlights", h)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Experience
// ---------------------------------------------------------------------------

function ExperienceEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as ExperienceEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  const update = (field: string, value: unknown) => {
    updateSectionEntry(sectionKey, index, { ...entry, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Company</label>
          <input className={err("company") ? inputError : inputNormal} value={entry.company ?? ""} onChange={(e) => update("company", e.target.value)} />
          <FieldError message={err("company")} />
        </div>
        <div>
          <label className={labelClass}>Position</label>
          <input className={err("position") ? inputError : inputNormal} value={entry.position ?? ""} onChange={(e) => update("position", e.target.value)} />
          <FieldError message={err("position")} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={err("location") ? inputError : inputNormal} value={entry.location ?? ""} onChange={(e) => update("location", e.target.value)} />
          <FieldError message={err("location")} />
        </div>
        <div>
          <label className={labelClass}>Summary</label>
          <input className={err("summary") ? inputError : inputNormal} value={entry.summary ?? ""} onChange={(e) => update("summary", e.target.value)} />
          <FieldError message={err("summary")} />
        </div>
        <div>
          <label className={labelClass}>Start Date</label>
          <input className={err("start_date") ? inputError : inputNormal} placeholder="YYYY-MM" value={entry.start_date ?? ""} onChange={(e) => update("start_date", e.target.value)} />
          <FieldError message={err("start_date")} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input className={err("end_date") ? inputError : inputNormal} placeholder="YYYY-MM or present" value={entry.end_date ?? ""} onChange={(e) => update("end_date", e.target.value)} />
          <FieldError message={err("end_date")} />
        </div>
      </div>
      <HighlightsList
        highlights={entry.highlights ?? []}
        onChange={(h) => update("highlights", h)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Normal / Projects / Certificates / Awards / Extracurricular
// ---------------------------------------------------------------------------

function ProjectEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as NormalEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  const update = (field: string, value: unknown) => {
    updateSectionEntry(sectionKey, index, { ...entry, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Name</label>
          <input className={err("name") ? inputError : inputNormal} value={entry.name ?? ""} onChange={(e) => update("name", e.target.value)} />
          <FieldError message={err("name")} />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input className={err("location") ? inputError : inputNormal} value={entry.location ?? ""} onChange={(e) => update("location", e.target.value)} />
          <FieldError message={err("location")} />
        </div>
        <div>
          <label className={labelClass}>Summary</label>
          <input className={err("summary") ? inputError : inputNormal} value={entry.summary ?? ""} onChange={(e) => update("summary", e.target.value)} />
          <FieldError message={err("summary")} />
        </div>
        <div>
          <label className={labelClass}>Start Date</label>
          <input className={err("start_date") ? inputError : inputNormal} placeholder="YYYY-MM" value={entry.start_date ?? ""} onChange={(e) => update("start_date", e.target.value)} />
          <FieldError message={err("start_date")} />
        </div>
        <div>
          <label className={labelClass}>End Date</label>
          <input className={err("end_date") ? inputError : inputNormal} placeholder="YYYY-MM or present" value={entry.end_date ?? ""} onChange={(e) => update("end_date", e.target.value)} />
          <FieldError message={err("end_date")} />
        </div>
      </div>
      <HighlightsList
        highlights={entry.highlights ?? []}
        onChange={(h) => update("highlights", h)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skills (OneLineEntry)
// ---------------------------------------------------------------------------

function SkillsEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as OneLineEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  const update = (field: string, value: string) => {
    updateSectionEntry(sectionKey, index, { ...entry, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <div>
        <label className={labelClass}>Label</label>
        <input className={err("label") ? inputError : inputNormal} value={entry.label ?? ""} onChange={(e) => update("label", e.target.value)} />
        <FieldError message={err("label")} />
      </div>
      <div>
        <label className={labelClass}>Details</label>
        <input className={err("details") ? inputError : inputNormal} value={entry.details ?? ""} onChange={(e) => update("details", e.target.value)} />
        <FieldError message={err("details")} />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Publications
// ---------------------------------------------------------------------------

function PublicationEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as PublicationEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  const update = (field: string, value: unknown) => {
    updateSectionEntry(sectionKey, index, { ...entry, [field]: value });
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Title</label>
          <input className={err("title") ? inputError : inputNormal} value={entry.title ?? ""} onChange={(e) => update("title", e.target.value)} />
          <FieldError message={err("title")} />
        </div>
        <div>
          <label className={labelClass}>Journal</label>
          <input className={err("journal") ? inputError : inputNormal} value={entry.journal ?? ""} onChange={(e) => update("journal", e.target.value)} />
          <FieldError message={err("journal")} />
        </div>
        <div>
          <label className={labelClass}>DOI</label>
          <input className={err("doi") ? inputError : inputNormal} value={entry.doi ?? ""} onChange={(e) => update("doi", e.target.value)} />
          <FieldError message={err("doi")} />
        </div>
        <div>
          <label className={labelClass}>URL</label>
          <input className={err("url") ? inputError : inputNormal} value={entry.url ?? ""} onChange={(e) => update("url", e.target.value)} />
          <FieldError message={err("url")} />
        </div>
        <div>
          <label className={labelClass}>Date</label>
          <input className={err("date") ? inputError : inputNormal} placeholder="YYYY-MM" value={entry.date ?? ""} onChange={(e) => update("date", e.target.value)} />
          <FieldError message={err("date")} />
        </div>
        <div>
          <label className={labelClass}>Summary</label>
          <input className={err("summary") ? inputError : inputNormal} value={entry.summary ?? ""} onChange={(e) => update("summary", e.target.value)} />
          <FieldError message={err("summary")} />
        </div>
      </div>
      <AuthorsList
        authors={entry.authors ?? []}
        onChange={(a) => update("authors", a)}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bullet
// ---------------------------------------------------------------------------

function BulletEntryForm({
  sectionKey,
  index,
  errors,
}: {
  sectionKey: string;
  index: number;
  errors: Record<string, string>;
}) {
  const entry = useResumeStore(
    (s) => (s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? {}) as BulletEntry
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);
  const err = useEntryError(errors, sectionKey, index);

  return (
    <div>
      <label className={labelClass}>Bullet</label>
      <input
        className={err("bullet") ? inputError : inputNormal}
        value={entry.bullet ?? ""}
        onChange={(e) =>
          updateSectionEntry(sectionKey, index, { ...entry, bullet: e.target.value })
        }
      />
      <FieldError message={err("bullet")} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text (plain string entries)
// ---------------------------------------------------------------------------

function TextEntryForm({
  sectionKey,
  index,
}: {
  sectionKey: string;
  index: number;
}) {
  const entry = useResumeStore(
    (s) => s.resumeData.cv?.sections?.[sectionKey]?.[index] ?? ""
  );
  const updateSectionEntry = useResumeStore((s) => s.updateSectionEntry);

  return (
    <div>
      <label className={labelClass}>Text</label>
      <input
        className={inputNormal}
        value={typeof entry === "string" ? entry : ""}
        onChange={(e) =>
          updateSectionEntry(sectionKey, index, e.target.value)
        }
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section type detection
// ---------------------------------------------------------------------------

const SECTION_TYPE_MAP: Record<string, string> = {
  education: "education",
  experience: "experience",
  projects: "projects",
  skills: "skills",
  publications: "publications",
  certificates: "projects",
  awards: "projects",
  extracurricular: "projects",
};

function detectEntryType(sectionKey: string, entry: SectionEntry): string {
  if (typeof entry === "string") return "text";
  const mapped = SECTION_TYPE_MAP[sectionKey];
  if (mapped) return mapped;
  if ("institution" in entry) return "education";
  if ("company" in entry) return "experience";
  if ("title" in entry && "authors" in entry) return "publications";
  if ("label" in entry && "details" in entry) return "skills";
  if ("bullet" in entry) return "bullet";
  if ("name" in entry) return "projects";
  return "bullet";
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getEntryForm(
  sectionKey: string,
  entry: SectionEntry,
  index: number,
  errors: Record<string, string> = {}
) {
  const type = detectEntryType(sectionKey, entry);

  switch (type) {
    case "education":
      return <EducationEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "experience":
      return <ExperienceEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "projects":
      return <ProjectEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "skills":
      return <SkillsEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "publications":
      return <PublicationEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "bullet":
      return <BulletEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
    case "text":
      return <TextEntryForm key={index} sectionKey={sectionKey} index={index} />;
    default:
      return <BulletEntryForm key={index} sectionKey={sectionKey} index={index} errors={errors} />;
  }
}
