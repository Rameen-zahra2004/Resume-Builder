import type { CanvasTemplate } from "../types/resume";

export const minimalTemplates: CanvasTemplate[] = [
  {
    id: "minimal-1",        // string ID ✅
    type: "minimal",         // valid TemplateType ✅
    name: "Minimal Layout",
    layout: [
      {
        id: "minimal-name",
        type: "text",
        x: 70,
        y: 40,
        width: 600,
        height: 60,
        fontSize: 34,
        fontFamily: "Inter, sans-serif",
        fontWeight: 600,
        content: "Your Name",
      },
      {
        id: "minimal-title",
        type: "text",
        x: 70,
        y: 110,
        width: 600,
        height: 30,
        fontSize: 18,
        fontFamily: "Inter, sans-serif",
        content: "Professional Title",
      },
      {
        id: "minimal-summary",
        type: "text",
        x: 70,
        y: 170,
        width: 600,
        height: 120,
        fontSize: 14,
        fontFamily: "Inter, sans-serif",
        content: "Write your summary...",
      },
      {
        id: "minimal-skills",
        type: "text",
        x: 70,
        y: 320,
        width: 600,
        height: 70,
        content: "",
      },
    ],
  },
];

