
import ProfessionalPreview from "./preview";
import ProfessionalPage from "./page";
import type { TemplateDefinition } from "../index";

const professional: TemplateDefinition = {
  id: "professional",
  name: "Professional",
  preview: ProfessionalPreview,
  page: ProfessionalPage,
  tags: ["professional", "corporate", "clean"],
};

export default professional;
