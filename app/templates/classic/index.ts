
"use client";

import type { TemplateDefinition } from "../index";
import ClassicPreview from "./preview";
import ClassicPage from "./page";

const classic: TemplateDefinition = {
  id: "classic",
  name: "Classic",
  preview: ClassicPreview,
  page: ClassicPage,
  tags: ["traditional", "serif", "elegant"],
};

export default classic;

