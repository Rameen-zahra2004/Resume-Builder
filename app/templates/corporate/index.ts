
import CorporatePreview from "./preview";
import CorporatePage from "./page";
import type { TemplateDefinition } from "../index";

const corporate: TemplateDefinition = {
  id: "corporate",
  name: "Corporate",
  preview: CorporatePreview,
  page: CorporatePage,
  tags: ["corporate", "business", "formal"],
};

export default corporate;
