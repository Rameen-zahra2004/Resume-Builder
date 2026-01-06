
import type { CanvasTemplate } from "../types/resume";

export const creativeTemplates: CanvasTemplate[] = [
  {
    id: "creative-1",
    type: "creative-photo", // ✅ must match TemplateType
    name: "Creative Layout",
    layout: [
      {
        id: "creative-name",
        type: "text",
        x: 50,
        y: 60,
        width: 600,
        height: 70,
        content: "Your Name",
        fontSize: 36,
        fontFamily: "'Poppins', sans-serif",
        color: "#333",
      },
      {
        id: "creative-title",
        type: "text",
        x: 50,
        y: 130,
        width: 600,
        height: 40,
        content: "Creative Designer",
        fontSize: 20,
        fontFamily: "'Poppins', sans-serif",
        color: "#555",
      },
      {
        id: "creative-summary",
        type: "text",
        x: 50,
        y: 190,
        width: 600,
        height: 140,
        content: "Summary here...",
        fontFamily: "'Poppins', sans-serif",
        fontSize: 14,
      },
      {
        id: "creative-skills",
        type: "text",
        x: 50,
        y: 350,
        width: 600,
        height: 80,
      },
    ],
  },
];
