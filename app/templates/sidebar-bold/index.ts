import SidebarBoldPreview from "./preview";
import SidebarBoldPage from "./page";
import type { TemplateDefinition } from "../index";

const sidebarBold: TemplateDefinition = {
  id: "sidebar-bold",                // Unique template ID
  name: "Sidebar Bold",             // Display name
  page: SidebarBoldPage,            // The page component for editing
  preview: SidebarBoldPreview,      // The preview component for display
  tags: ["sidebar", "bold", "modern"], // Optional tags for filtering
};

export default sidebarBold;

