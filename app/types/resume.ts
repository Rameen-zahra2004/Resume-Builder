

import type React from "react";

/* =============================
   Base Types
============================= */

export type ID = string | number;

/* =============================
   Theme Types
============================= */

export const THEME_TYPES = ["blue", "green", "red", "purple"] as const;
export type ThemeType = (typeof THEME_TYPES)[number]; // now includes "purple"


/* =============================
   Template Types
============================= */

export const TEMPLATE_TYPES = [
  "modern",
  "classic",
  "elegant",
  "premium-elegant",
  "sidebar-bold",
  "tech-grid",
  "corporate",
  "professional",
  "creative-photo",
  "minimal",
 
] as const;

export type TemplateType = (typeof TEMPLATE_TYPES)[number];

/* =============================
   Reusable Resume Models
============================= */

export interface Skill {
  name: string;
  level?: number; // 1–5
}

/* =============================
   Resume Sections
============================= */

export interface Experience {
  id?: ID;
  role: string;
  position?: string;
  company: string;
  level?: "Junior" | "Mid" | "Senior" | "Lead";
  location?: string;
  startDate?: string;
  endDate?: string;
  startMonth?: string;
  startYear?: string;
  endMonth?: string;
  endYear?: string;
  description?: string;
  achievements?: string[];
  skills?: string[];
  attachments?: File[];
  
}

export interface Education {
  id?: ID;
  degree: string;
  institution: string;
  fieldOfStudy?: string;
  startDate?: string;
  endDate?: string;
  gpa?: string;
  honors?: string[];
  courses?: string[];
 certifications?: (string | File)[]; 
  type?: "Full-time" | "Part-time" | "Online" | "Bootcamp";
  description?: string;
  level?: "Metric" | "Intermediate" | "Bachelor" | "Master" | "PhD" | "Diploma";
}


export interface Project {
  id?: ID;
  name: string;
  link?: string;
  links?: string[];
  description?: string;
  type?: "personal" | "work" | "academic";
  role?: string;
  techStack?: string[];
  startDate?: string;
  endDate?: string;
  attachments?: string[];
}

/* =============================
   Resume Form Data
============================= */

export interface ResumeFormData {
  name?: string;
  title?: string;
  summary?: string;

  skills: Skill[];
  experience: Experience[];
  education: Education[];
  projects: Project[];

  photo?: string;
  email?: string;
  phone?: string;
  location?: string;
}

/* =============================
   Resume Object
============================= */

export interface Resume {
  id: number;
  template: TemplateType;
  theme: ThemeType;
  title: string;
  updatedAt: string;
  data: ResumeFormData;
  aiToolsEnabled?: boolean;
}

/* =============================
   Helpers
============================= */

export const createEmptyResumeData = (): ResumeFormData => ({
  skills: [],
  experience: [],
  education: [],
  projects: [],
});
export interface Attachment {
  name: string;
  url: string; // or object URL
}

/* =============================
   Resume Factory
============================= */

export const createResume = (
  data: ResumeFormData,
  template: TemplateType,
  title: string = data.name || "Untitled Resume",
  theme?: ThemeType,                 // ✅ ADD THIS
  existingResume?: Resume
): Resume => {
  return {
    id: existingResume?.id ?? Date.now(),
    template,
    theme: existingResume?.theme ?? theme ?? "blue", // ✅ FIX
    title,
    updatedAt: new Date().toISOString(),
    data: {
      ...createEmptyResumeData(),
      ...data,
    },
    aiToolsEnabled: existingResume?.aiToolsEnabled ?? false,
  };
};


/* =============================
   Template Definitions
============================= */

export interface PreviewProps {
  resume: Resume;
}

export interface TemplateDefinition {
  name: string;
  id: string; // unique identifier
  type: TemplateType;
  component: React.ComponentType<{ resume: Resume }>;
  preview?: React.ComponentType<PreviewProps>;
  description?: string;
}

/* =============================
   Advanced Canvas / Drag Templates
============================= */

export type ElementType = "text" | "shape";

export interface Element {
  id: ID;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;

  content?: string;
  color?: string;
  fontSize?: number;
  fontFamily?: string;
  fontWeight?: number;
  borderRadius?: number;
  zIndex?: number;

  options?: string[];
}

export interface CanvasTemplate {
  id: ID;
  name: string;
  type: TemplateType;
  thumbnail?: string;
  layout: Element[];
}
