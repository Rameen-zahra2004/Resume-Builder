
"use client";

import React from "react";
import type { PreviewProps, Resume, TemplateType } from "../types/resume";


// Import Template Modules

import modern from "./modern";
import classic from "./classic";
import minimal from "./minimal";
import creativePhoto from "./creative-photo";
import premiumElegant from "./premium-elegant";
import sidebarBold from "./sidebar-bold";
import techGrid from "./tech-grid";
import professional from "./professional";
import corporate from "./corporate";

import elegant from "./elegant";
// Template Definition Type

export interface TemplateDefinition {
  id: TemplateType;
  name: string;
  preview: React.FC<PreviewProps>;
  page: React.FC<{ resume: Resume }>;
  tags?: string[];
}


// Template Registry (Single Source of Truth)

export const templateRegistry = {
  modern,
  classic,
  minimal,

  // Aliases (same template, different IDs)
  elegant,
  "premium-elegant": premiumElegant,
  "creative-photo": creativePhoto,
  "sidebar-bold": sidebarBold,
  "tech-grid": techGrid,
  professional,
  corporate,
} satisfies Record<string, TemplateDefinition>;


// DEV Runtime Validation

if (process.env.NODE_ENV === "development") {
  Object.entries(templateRegistry).forEach(([key, value]) => {
    if (!value?.id) console.warn(`⚠ Template "${key}" missing: id`);
    if (!value?.name) console.warn(`⚠ Template "${key}" missing: name`);
    if (!value?.preview) console.warn(`⚠ Template "${key}" missing: preview`);
    if (!value?.page) console.warn(`⚠ Template "${key}" missing: page`);
  });
}


// Helpers


/** Returns all templates as array */
export const getAllTemplates = (): TemplateDefinition[] =>
  Object.values(templateRegistry);

/** Safe getter with fallback */
export const getTemplateById = (id: TemplateType): TemplateDefinition => {
  return (
    templateRegistry[id] ??
    (() => {
      console.error(
        `❌ Template "${id}" not found. Falling back to "modern".`
      );
      return templateRegistry.modern;
    })()
  );
};

/** Auto-derived template ID type */
export type TemplateId = keyof typeof templateRegistry;
