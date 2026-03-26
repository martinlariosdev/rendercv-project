"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { ColorsConfig, TypographyConfig, PageConfig, SupportedLocale } from "@/types/resume";

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-xs font-medium text-gray-600 mb-1";

const THEMES = [
  "classic",
  "ember",
  "engineeringclassic",
  "engineeringresumes",
  "harvard",
  "ink",
  "moderncv",
  "opal",
  "sb2nov",
];

const FONTS = [
  "Source Sans 3",
  "Roboto",
  "Lato",
  "Open Sans",
  "Raleway",
  "Merriweather",
  "Ubuntu",
  "Nunito",
  "PT Sans",
];

const ALIGNMENTS = ["left", "justified", "justified-with-no-hyphenation"];
const PAGE_SIZES = ["us-letter", "a4"];
const LANGUAGES: { value: SupportedLocale; label: string }[] = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
];

export default function DesignPanel() {
  const design = useResumeStore((s) => s.resumeData.design ?? {});
  const updateDesign = useResumeStore((s) => s.updateDesign);
  const locale = useResumeStore((s) => s.resumeData.locale);
  const updateLocale = useResumeStore((s) => s.updateLocale);

  const colors: ColorsConfig = design.colors ?? {};
  const typography: TypographyConfig = design.typography ?? {};
  const page: PageConfig = design.page ?? {};

  const setColor = (key: keyof ColorsConfig, value: string) => {
    updateDesign({ colors: { ...colors, [key]: value } });
  };

  const setTypography = (key: keyof TypographyConfig, value: string) => {
    updateDesign({ typography: { ...typography, [key]: value } });
  };

  const setPage = (key: keyof PageConfig, value: string) => {
    updateDesign({ page: { ...page, [key]: value } });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-semibold text-gray-800">Design</h3>

      {/* Theme selector */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Theme
        </label>
        <div className="grid grid-cols-3 gap-2">
          {THEMES.map((theme) => (
            <button
              key={theme}
              onClick={() => updateDesign({ theme })}
              className={`rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                design.theme === theme
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {theme}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Colors
        </label>
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["body", "Body"],
              ["name", "Name"],
              ["section_titles", "Section Titles"],
              ["links", "Links"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={colors[key] || "#000000"}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="h-8 w-8 shrink-0 cursor-pointer rounded border border-gray-300"
                />
                <input
                  type="text"
                  className={inputClass}
                  value={colors[key] ?? ""}
                  onChange={(e) => setColor(key, e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Typography
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Font Family</label>
            <select
              className={inputClass}
              value={typography.font_family ?? ""}
              onChange={(e) => setTypography("font_family", e.target.value)}
            >
              <option value="">Default</option>
              {FONTS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Alignment</label>
            <select
              className={inputClass}
              value={typography.alignment ?? ""}
              onChange={(e) => setTypography("alignment", e.target.value)}
            >
              <option value="">Default</option>
              {ALIGNMENTS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Line Spacing</label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. 1.2"
              value={typography.line_spacing ?? ""}
              onChange={(e) => setTypography("line_spacing", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Language */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Language
        </label>
        <select
          className={inputClass}
          value={locale?.language ?? "english"}
          onChange={(e) =>
            updateLocale({ language: e.target.value as SupportedLocale })
          }
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Page */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Page
        </label>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className={labelClass}>Size</label>
            <select
              className={inputClass}
              value={page.size ?? ""}
              onChange={(e) => setPage("size", e.target.value)}
            >
              <option value="">Default</option>
              {PAGE_SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {(
            [
              ["top_margin", "Top Margin"],
              ["bottom_margin", "Bottom Margin"],
              ["left_margin", "Left Margin"],
              ["right_margin", "Right Margin"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className={labelClass}>{label}</label>
              <input
                type="text"
                className={inputClass}
                placeholder="e.g. 2cm"
                value={page[key] ?? ""}
                onChange={(e) => setPage(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
