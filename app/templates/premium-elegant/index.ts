
import PremiumElegantPreview from "./preview";
import PremiumElegantPage from "./page";
import type { TemplateDefinition } from "../index";

const premiumElegant: TemplateDefinition = {
  id: "premium-elegant",
  name: "Premium Elegant",
  preview: PremiumElegantPreview,
  page: PremiumElegantPage,
  tags: ["luxury", "professional", "serif"],
};

export default premiumElegant;
