// RenderCV v2.8 Schema Types

export type SocialNetworkName =
  | "LinkedIn"
  | "GitHub"
  | "GitLab"
  | "IMDB"
  | "Instagram"
  | "ORCID"
  | "Mastodon"
  | "StackOverflow"
  | "ResearchGate"
  | "YouTube"
  | "Google Scholar"
  | "Telegram"
  | "WhatsApp"
  | "Leetcode"
  | "X"
  | "Bluesky"
  | "Reddit";

export interface SocialNetwork {
  network: SocialNetworkName;
  username: string;
}

// --- Entry Types ---

export interface EducationEntry {
  institution: string;
  area: string;
  degree?: string;
  start_date?: string;
  end_date?: string;
  date?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface ExperienceEntry {
  company: string;
  position: string;
  start_date?: string;
  end_date?: string;
  date?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface NormalEntry {
  name: string;
  start_date?: string;
  end_date?: string;
  date?: string;
  location?: string;
  summary?: string;
  highlights?: string[];
}

export interface PublicationEntry {
  title: string;
  authors: string[];
  doi?: string;
  url?: string;
  journal?: string;
  date?: string;
  summary?: string;
}

export interface OneLineEntry {
  label: string;
  details: string;
}

export interface BulletEntry {
  bullet: string;
}

export type SectionEntry =
  | EducationEntry
  | ExperienceEntry
  | NormalEntry
  | PublicationEntry
  | OneLineEntry
  | BulletEntry
  | string;

export type SectionType =
  | "education"
  | "experience"
  | "projects"
  | "skills"
  | "publications"
  | "certificates"
  | "awards"
  | "extracurricular"
  | "custom";

// --- CV Data ---

export interface CvData {
  name?: string;
  headline?: string;
  location?: string;
  email?: string;
  phone?: string;
  website?: string;
  social_networks?: SocialNetwork[];
  sections?: Record<string, SectionEntry[]>;
}

// --- Design Config ---

export interface PageConfig {
  size?: string;
  top_margin?: string;
  bottom_margin?: string;
  left_margin?: string;
  right_margin?: string;
}

export interface ColorsConfig {
  body?: string;
  name?: string;
  headline?: string;
  connections?: string;
  section_titles?: string;
  links?: string;
  footer?: string;
}

export interface FontSizeConfig {
  body?: string;
  name?: string;
  headline?: string;
  connections?: string;
  section_titles?: string;
}

export interface TypographyConfig {
  font_family?: string;
  line_spacing?: string;
  alignment?: string;
  font_size?: FontSizeConfig;
}

export interface LinksConfig {
  underline?: boolean;
  show_external_link_icon?: boolean;
}

export interface HeaderConfig {
  alignment?: string;
}

export interface SectionTitlesConfig {
  type?: string;
}

export interface DesignConfig {
  theme?: string;
  page?: PageConfig;
  colors?: ColorsConfig;
  typography?: TypographyConfig;
  links?: LinksConfig;
  header?: HeaderConfig;
  section_titles?: SectionTitlesConfig;
}

// --- Top-Level Resume Data ---

export interface ResumeData {
  cv?: CvData;
  design?: DesignConfig;
}

// --- Default Resume ---

export const DEFAULT_RESUME: ResumeData = {
  cv: {
    name: "John Doe",
    headline: "Software Engineer",
    location: "San Francisco, CA",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    website: "https://johndoe.dev",
    social_networks: [
      { network: "LinkedIn", username: "johndoe" },
      { network: "GitHub", username: "johndoe" },
    ],
    sections: {
      education: [
        {
          institution: "University of California, Berkeley",
          area: "Computer Science",
          degree: "B.S.",
          start_date: "2016-09",
          end_date: "2020-05",
          location: "Berkeley, CA",
          highlights: [
            "Dean's List, Fall 2018 and Spring 2019",
            "GPA: 3.8/4.0",
          ],
        } as EducationEntry,
      ],
      experience: [
        {
          company: "Acme Corp",
          position: "Software Engineer",
          start_date: "2020-06",
          end_date: "present",
          location: "San Francisco, CA",
          summary: "Full-stack development for enterprise SaaS platform.",
          highlights: [
            "Built a real-time notification system serving 50k+ users",
            "Reduced API response times by 40% through query optimization",
          ],
        } as ExperienceEntry,
      ],
      skills: [
        { label: "Languages", details: "Python, TypeScript, Go, SQL" } as OneLineEntry,
        { label: "Frameworks", details: "React, Next.js, FastAPI, Django" } as OneLineEntry,
        { label: "Tools", details: "Docker, Kubernetes, AWS, Git" } as OneLineEntry,
      ],
    },
  },
  design: {
    theme: "classic",
  },
};
