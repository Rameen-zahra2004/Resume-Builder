
import TechGridPreview from "./preview";
import TechGridPage from "./page";
import type { TemplateDefinition } from "../index";

const techGrid: TemplateDefinition = {
  id: "tech-grid",
  name: "Tech Grid",
  preview: TechGridPreview,
  page: TechGridPage,
  tags: ["grid", "modern", "technical"],
};

export default techGrid;
