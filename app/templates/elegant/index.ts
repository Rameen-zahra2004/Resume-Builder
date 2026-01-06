"use client";

import ElegantPreview from "./preview";
import ElegantPage from "./page";
import type { TemplateDefinition } from "../index";

const elegant: TemplateDefinition = {
  id: "elegant",
  name: "Elegant",
  preview: ElegantPreview,
  page: ElegantPage, // simple, no wrapper needed
  tags: ["clean", "professional", "gray", "minimal"],
};

export default elegant;

