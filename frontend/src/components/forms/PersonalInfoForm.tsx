"use client";

import { useResumeStore } from "@/store/resumeStore";
import type { SocialNetworkName, SocialNetwork } from "@/types/resume";
import { Plus, Trash2 } from "lucide-react";

const SOCIAL_NETWORKS: SocialNetworkName[] = [
  "LinkedIn",
  "GitHub",
  "GitLab",
  "IMDB",
  "Instagram",
  "ORCID",
  "Mastodon",
  "StackOverflow",
  "ResearchGate",
  "YouTube",
  "Google Scholar",
  "Telegram",
  "WhatsApp",
  "Leetcode",
  "X",
  "Bluesky",
  "Reddit",
];

const inputClass =
  "w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const labelClass = "block text-sm font-medium text-gray-700 mb-1";

export default function PersonalInfoForm() {
  const cv = useResumeStore((s) => s.resumeData.cv);
  const updatePersonalInfo = useResumeStore((s) => s.updatePersonalInfo);

  const socialNetworks: SocialNetwork[] = cv?.social_networks ?? [];

  const updateField = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value });
  };

  const updateSocialNetwork = (
    index: number,
    field: keyof SocialNetwork,
    value: string
  ) => {
    const updated = [...socialNetworks];
    updated[index] = { ...updated[index], [field]: value } as SocialNetwork;
    updatePersonalInfo({ social_networks: updated });
  };

  const addSocialNetwork = () => {
    updatePersonalInfo({
      social_networks: [...socialNetworks, { network: "LinkedIn", username: "" }],
    });
  };

  const removeSocialNetwork = (index: number) => {
    const updated = socialNetworks.filter((_, i) => i !== index);
    updatePersonalInfo({ social_networks: updated });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-800">
        Personal Information
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            className={inputClass}
            value={cv?.name ?? ""}
            onChange={(e) => updateField("name", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Headline</label>
          <input
            type="text"
            className={inputClass}
            value={cv?.headline ?? ""}
            onChange={(e) => updateField("headline", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            type="email"
            className={inputClass}
            value={cv?.email ?? ""}
            onChange={(e) => updateField("email", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Phone</label>
          <input
            type="tel"
            className={inputClass}
            value={cv?.phone ?? ""}
            onChange={(e) => updateField("phone", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Location</label>
          <input
            type="text"
            className={inputClass}
            value={cv?.location ?? ""}
            onChange={(e) => updateField("location", e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass}>Website</label>
          <input
            type="url"
            className={inputClass}
            value={cv?.website ?? ""}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </div>
      </div>

      {/* Social Networks */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">
            Social Networks
          </label>
          <button
            onClick={addSocialNetwork}
            className="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            <Plus className="h-3 w-3" /> Add
          </button>
        </div>

        <div className="space-y-2">
          {socialNetworks.map((sn, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <select
                className="rounded-md border border-gray-300 px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sn.network}
                onChange={(e) =>
                  updateSocialNetwork(idx, "network", e.target.value)
                }
              >
                {SOCIAL_NETWORKS.map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Username"
                className={inputClass}
                value={sn.username}
                onChange={(e) =>
                  updateSocialNetwork(idx, "username", e.target.value)
                }
              />
              <button
                onClick={() => removeSocialNetwork(idx)}
                className="shrink-0 rounded p-1.5 text-red-500 hover:bg-red-50"
                aria-label="Remove social network"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
