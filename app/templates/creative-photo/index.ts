
import CreativePhotoPreview from "./preview";
import CreativePhotoPage from "./page";
import type { TemplateDefinition } from "../index";

const creativePhoto: TemplateDefinition = {
  id: "creative-photo",
  name: "Creative Photo",
  preview: CreativePhotoPreview,
  page: CreativePhotoPage,
  tags: ["creative", "photo", "visual"],
};

export default creativePhoto;
