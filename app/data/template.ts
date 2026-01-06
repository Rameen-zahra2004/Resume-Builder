
export type TemplateType =
  | "tech-grid"
  | "modern"
  | "classic"
  | "elegant"
  | "premium-elegant"
  | "sidebar-bold"
  | "corporate"
  | "professional"
  | "creative-photo"
  | "minimal";
export interface TemplateItem {
  id: string;
  name: string;
  description?: string;
  type: TemplateType;
  image?: string;
}

export const templates: TemplateItem[] = [
  { id: "modern", name: "Modern Resume", description: "A clean, modern layout", type: "modern", image: "/templates/modern1.png" },
  { id: "classic", name: "Classic Resume", description: "Traditional, professional layout", type: "classic", image: "/templates/classic1.png" },
  { id: "elegant", name: "Elegant Resume", description: "Minimal and stylish", type: "elegant", image: "/templates/elegant1.png" },
  { id: "premium-elegant", name: "Premium Elegant", description: "Premium, refined style", type: "premium-elegant", image: "/templates/premium-elegant1.png" },
  { id: "sidebarbold", name: "Sidebar Bold", description: "Bold sidebar layout", type: "sidebar-bold", image: "/templates/sidebarbold1.png" },
  { id: "techgrid", name: "Tech Grid", description: "Grid layout for tech resumes", type: "tech-grid", image: "/templates/techgrid1.png" },
  { id: "corporate", name: "Corporate Resume", description: "Professional corporate style", type: "corporate", image: "/templates/corporate1.png" },
  { id: "professional", name: "Professional Resume", description: "Standard professional resume", type: "professional", image: "/templates/professional1.png" },
  { id: "creative-photo", name: "Creative Photo", description: "Photo-based creative layout", type: "creative-photo", image: "/templates/creative-photo1.png" },
  { id: "minimal", name: "Minimal Resume", description: "Simple, minimal design", type: "minimal", image: "/templates/minimal1.png" },
];
