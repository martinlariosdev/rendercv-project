"use client";

import { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import {
  ChevronDown,
  ChevronRight,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useResumeStore } from "@/store/resumeStore";
import { getEntryForm } from "./EntryForms";
import type {
  SectionType,
  SectionEntry,
  EducationEntry,
  ExperienceEntry,
  NormalEntry,
  PublicationEntry,
  OneLineEntry,
  BulletEntry,
} from "@/types/resume";

const SECTION_TYPES: { value: SectionType; label: string }[] = [
  { value: "education", label: "Education" },
  { value: "experience", label: "Experience" },
  { value: "projects", label: "Projects" },
  { value: "skills", label: "Skills" },
  { value: "publications", label: "Publications" },
  { value: "certificates", label: "Certificates" },
  { value: "awards", label: "Awards" },
  { value: "extracurricular", label: "Extracurricular" },
  { value: "custom", label: "Custom" },
];

function createEmptyEntry(sectionKey: string): SectionEntry {
  const map: Record<string, () => SectionEntry> = {
    education: () => ({ institution: "", area: "" } as EducationEntry),
    experience: () => ({ company: "", position: "" } as ExperienceEntry),
    publications: () => ({ title: "", authors: [] } as PublicationEntry),
    skills: () => ({ label: "", details: "" } as OneLineEntry),
  };
  const factory = map[sectionKey];
  if (factory) return factory();
  // For projects, certificates, awards, extracurricular, and unknown
  return { name: "" } as NormalEntry;
}

function detectSectionDisplayType(sectionKey: string, entries: SectionEntry[]): string {
  if (entries.length === 0) return sectionKey;
  const first = entries[0];
  if (typeof first === "string") return "text";
  if ("institution" in first) return "education";
  if ("company" in first) return "experience";
  if ("title" in first && "authors" in first) return "publications";
  if ("label" in first && "details" in first) return "skills";
  if ("bullet" in first) return "bullet";
  return "projects";
}

interface SectionManagerProps {
  errors?: Record<string, string>;
}

export default function SectionManager({ errors = {} }: SectionManagerProps) {
  const sections = useResumeStore((s) => s.resumeData.cv?.sections ?? {});
  const addSection = useResumeStore((s) => s.addSection);
  const removeSection = useResumeStore((s) => s.removeSection);
  const reorderSections = useResumeStore((s) => s.reorderSections);
  const addEntryToSection = useResumeStore((s) => s.addEntryToSection);
  const removeEntryFromSection = useResumeStore(
    (s) => s.removeEntryFromSection
  );

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Object.keys(sections))
  );
  const [showAddMenu, setShowAddMenu] = useState(false);

  const sectionKeys = Object.keys(sections);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleAddSection = (type: SectionType) => {
    let key = type as string;
    if (type === "custom") {
      const name = window.prompt("Enter section name:");
      if (!name) return;
      key = name.toLowerCase().replace(/\s+/g, "_");
    }
    if (sections[key]) {
      alert(`Section "${key}" already exists.`);
      return;
    }
    addSection(key, type);
    setExpandedSections((prev) => new Set(prev).add(key));
    setShowAddMenu(false);
  };

  const handleDeleteSection = (key: string) => {
    if (window.confirm(`Delete section "${key}"?`)) {
      removeSection(key);
      setExpandedSections((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }
  };

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const newOrder = [...sectionKeys];
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);
    reorderSections(newOrder);
  };

  const handleAddEntry = (sectionKey: string) => {
    const entries = sections[sectionKey] ?? [];
    // Detect type from existing entries or section key
    let entry: SectionEntry;
    if (entries.length > 0) {
      const type = detectSectionDisplayType(sectionKey, entries);
      if (type === "text") {
        entry = "";
      } else if (type === "bullet") {
        entry = { bullet: "" } as BulletEntry;
      } else {
        entry = createEmptyEntry(
          type === "education" || type === "experience" || type === "publications" || type === "skills"
            ? type
            : sectionKey
        );
      }
    } else {
      entry = createEmptyEntry(sectionKey);
    }
    addEntryToSection(sectionKey, entry);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-gray-800">Sections</h3>
        <div className="relative">
          <button
            onClick={() => setShowAddMenu(!showAddMenu)}
            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" /> Add Section
          </button>
          {showAddMenu && (
            <div className="absolute right-0 z-20 mt-1 w-48 rounded-md border border-gray-200 bg-white py-1 shadow-lg">
              {SECTION_TYPES.map((st) => (
                <button
                  key={st.value}
                  onClick={() => handleAddSection(st.value)}
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  {st.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="sections">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className="space-y-2"
            >
              {sectionKeys.map((key, idx) => {
                const entries = sections[key] ?? [];
                const isExpanded = expandedSections.has(key);

                return (
                  <Draggable key={key} draggableId={key} index={idx}>
                    {(dragProvided) => (
                      <div
                        ref={dragProvided.innerRef}
                        {...dragProvided.draggableProps}
                        className="rounded-lg border border-gray-200 bg-white"
                      >
                        {/* Section header */}
                        <div className="flex items-center gap-2 px-3 py-2">
                          <span
                            {...dragProvided.dragHandleProps}
                            className="cursor-grab text-gray-400"
                          >
                            <GripVertical className="h-4 w-4" />
                          </span>
                          <button
                            onClick={() => toggleSection(key)}
                            className="flex flex-1 items-center gap-1 text-left"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-4 w-4 text-gray-500" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-sm font-semibold capitalize text-gray-800">
                              {key.replace(/_/g, " ")}
                            </span>
                            <span className="ml-1 text-xs text-gray-400">
                              ({entries.length})
                            </span>
                          </button>
                          <button
                            onClick={() => handleDeleteSection(key)}
                            className="rounded p-1 text-red-500 hover:bg-red-50"
                            aria-label={`Delete ${key}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Section entries */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 px-3 pb-3 pt-2">
                            <div className="space-y-4">
                              {entries.map((entry, entryIdx) => (
                                <div
                                  key={entryIdx}
                                  className="relative rounded-md border border-gray-100 bg-gray-50 p-3"
                                >
                                  <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-medium text-gray-500">
                                      Entry {entryIdx + 1}
                                    </span>
                                    <button
                                      onClick={() =>
                                        removeEntryFromSection(key, entryIdx)
                                      }
                                      className="rounded p-1 text-red-500 hover:bg-red-50"
                                      aria-label="Remove entry"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                  {getEntryForm(key, entry, entryIdx, errors)}
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => handleAddEntry(key)}
                              className="mt-3 inline-flex items-center gap-1 rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200"
                            >
                              <Plus className="h-3 w-3" /> Add Entry
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
