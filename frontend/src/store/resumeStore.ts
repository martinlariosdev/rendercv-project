import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  ResumeData,
  CvData,
  DesignConfig,
  SectionEntry,
  SectionType,
  EducationEntry,
  ExperienceEntry,
  NormalEntry,
  PublicationEntry,
  OneLineEntry,
  BulletEntry,
} from "@/types/resume";
import { DEFAULT_RESUME } from "@/types/resume";

// Helper: create an empty entry for a given section type
function createEmptyEntry(type: SectionType): SectionEntry {
  switch (type) {
    case "education":
      return { institution: "", area: "" } as EducationEntry;
    case "experience":
      return { company: "", position: "" } as ExperienceEntry;
    case "publications":
      return { title: "", authors: [] } as PublicationEntry;
    case "skills":
      return { label: "", details: "" } as OneLineEntry;
    case "projects":
    case "certificates":
    case "awards":
    case "extracurricular":
      return { name: "" } as NormalEntry;
    case "custom":
    default:
      return { bullet: "" } as BulletEntry;
  }
}

interface ResumeStore {
  resumeData: ResumeData;

  // Actions
  updatePersonalInfo: (info: Partial<CvData>) => void;
  addSection: (key: string, type: SectionType) => void;
  removeSection: (sectionKey: string) => void;
  updateSectionEntry: (
    sectionKey: string,
    index: number,
    entry: SectionEntry
  ) => void;
  addEntryToSection: (sectionKey: string, entry: SectionEntry) => void;
  removeEntryFromSection: (sectionKey: string, index: number) => void;
  reorderSections: (newOrder: string[]) => void;
  updateDesign: (design: Partial<DesignConfig>) => void;
  setResumeData: (data: ResumeData) => void;
  resetResume: () => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resumeData: DEFAULT_RESUME,

      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            cv: {
              ...state.resumeData.cv,
              ...info,
            },
          },
        })),

      addSection: (key, type) =>
        set((state) => {
          const currentSections = state.resumeData.cv?.sections ?? {};
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: {
                  ...currentSections,
                  [key]: [createEmptyEntry(type)],
                },
              },
            },
          };
        }),

      removeSection: (sectionKey) =>
        set((state) => {
          const currentSections = { ...state.resumeData.cv?.sections };
          delete currentSections[sectionKey];
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: currentSections,
              },
            },
          };
        }),

      updateSectionEntry: (sectionKey, index, entry) =>
        set((state) => {
          const currentSections = state.resumeData.cv?.sections ?? {};
          const entries = [...(currentSections[sectionKey] ?? [])];
          if (index >= 0 && index < entries.length) {
            entries[index] = entry;
          }
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: {
                  ...currentSections,
                  [sectionKey]: entries,
                },
              },
            },
          };
        }),

      addEntryToSection: (sectionKey, entry) =>
        set((state) => {
          const currentSections = state.resumeData.cv?.sections ?? {};
          const entries = [...(currentSections[sectionKey] ?? []), entry];
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: {
                  ...currentSections,
                  [sectionKey]: entries,
                },
              },
            },
          };
        }),

      removeEntryFromSection: (sectionKey, index) =>
        set((state) => {
          const currentSections = state.resumeData.cv?.sections ?? {};
          const entries = [...(currentSections[sectionKey] ?? [])];
          if (index >= 0 && index < entries.length) {
            entries.splice(index, 1);
          }
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: {
                  ...currentSections,
                  [sectionKey]: entries,
                },
              },
            },
          };
        }),

      reorderSections: (newOrder) =>
        set((state) => {
          const currentSections = state.resumeData.cv?.sections ?? {};
          const reordered: Record<string, SectionEntry[]> = {};
          for (const key of newOrder) {
            if (currentSections[key]) {
              reordered[key] = currentSections[key];
            }
          }
          return {
            resumeData: {
              ...state.resumeData,
              cv: {
                ...state.resumeData.cv,
                sections: reordered,
              },
            },
          };
        }),

      updateDesign: (design) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            design: {
              ...state.resumeData.design,
              ...design,
            },
          },
        })),

      setResumeData: (data) =>
        set(() => ({
          resumeData: data,
        })),

      resetResume: () =>
        set(() => ({
          resumeData: DEFAULT_RESUME,
        })),
    }),
    {
      name: "rendercv-resume-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
