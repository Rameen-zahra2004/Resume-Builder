

import MinimalPreview from "./preview";
import MinimalPage from "./page";
import type { TemplateDefinition } from "../index";

const minimal: TemplateDefinition = {
  id: "minimal",
  name: "Minimal",
  preview: MinimalPreview,
  page: MinimalPage,
  tags: ["clean", "simple", "modern"],
};

export default minimal;
