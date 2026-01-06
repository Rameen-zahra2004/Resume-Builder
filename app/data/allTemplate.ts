
import type { TemplateDefinition } from "../types/resume";

/* ===== Pages ===== */
import ClassicPage from "../templates/classic/page";
import ModernPage from "../templates/modern/page";
import CorporatePage from "../templates/corporate/page";
import CreativePhotoPage from "../templates/creative-photo/page";
import MinimalPage from "../templates/minimal/page";
import PremiumElegantPage from "../templates/premium-elegant/page";
import SidebarBoldPage from "../templates/sidebar-bold/page";
import TechGridPage from "../templates/tech-grid/page";

/* ===== Previews ===== */
import ClassicPreview from "../templates/classic/preview";
import ModernPreview from "../templates/modern/preview";
import CorporatePreview from "../templates/corporate/preview";
import CreativePhotoPreview from "../templates/creative-photo/preview";
import MinimalPreview from "../templates/minimal/preview";
import PremiumElegantPreview from "../templates/premium-elegant/preview";
import SidebarBoldPreview from "../templates/sidebar-bold/preview";
import TechGridPreview from "../templates/tech-grid/preview";

export const templateList: TemplateDefinition[] = [
  {
    id: "classic",
    type: "classic",
    name: "Classic",
    component: ClassicPage,
    preview: ClassicPreview,
    description: "A traditional, structured resume layout.",
  },
  {
    id: "modern",
    type: "modern",
    name: "Modern",
    component: ModernPage,
    preview: ModernPreview,
    description: "A clean, sharp modern-style resume template.",
  },
  {
    id: "corporate",
    type: "corporate",
    name: "Corporate",
    component: CorporatePage,
    preview: CorporatePreview,
    description: "A formal corporate layout for professional roles.",
  },
  {
    id: "creative-photo",
    type: "creative-photo",
    name: "Creative Photo",
    component: CreativePhotoPage,
    preview: CreativePhotoPreview,
    description: "A creative template featuring a profile photo and bold design.",
  },
  {
    id: "minimal",
    type: "minimal",
    name: "Minimal",
    component: MinimalPage,
    preview: MinimalPreview,
    description: "Minimalistic layout focusing on readability and simplicity.",
  },
  {
    id: "premium-elegant",
    type: "premium-elegant",
    name: "Premium Elegant",
    component: PremiumElegantPage,
    preview: PremiumElegantPreview,
    description: "A premium elegant resume with luxury typography.",
  },
  {
    id: "sidebar-bold",
    type: "sidebar-bold",
    name: "Sidebar Bold",
    component: SidebarBoldPage,
    preview: SidebarBoldPreview,
    description: "A bold layout with a strong sidebar structure.",
  },
  {
    id: "tech-grid",
    type: "tech-grid",
    name: "Tech Grid",
    component: TechGridPage,
    preview: TechGridPreview,
    description: "A grid-based modern tech-focused resume template.",
  },
];
