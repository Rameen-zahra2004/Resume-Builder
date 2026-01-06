// data/classicTemplate.ts
import type { CanvasTemplate } from "../types/resume";

export const classicTemplates: CanvasTemplate[] = [
  {
    id: "classic-1",
    type: "classic",
    name: "Classic Layout",
    thumbnail: "/thumbnails/classic.png", // optional thumbnail path
    layout: [
      {
        id: "classic-name",
        type: "text",
        x: 50,
        y: 50,
        width: 600,
        height: 60,
        content: "Your Name",
        fontSize: 32,
        fontWeight: 700, // bold
        fontFamily: "Georgia, serif",
      },
      {
        id: "classic-title",
        type: "text",
        x: 50,
        y: 120,
        width: 600,
        height: 40,
        content: "Professional Title",
        fontSize: 20,
        fontWeight: 500, // semi-bold
        fontFamily: "Georgia, serif",
      },
      {
        id: "classic-summary",
        type: "text",
        x: 50,
        y: 180,
        width: 600,
        height: 120,
        content: "Write your summary here...",
        fontSize: 14,
        fontWeight: 400, // normal
        fontFamily: "Georgia, serif",
      },
      {
        id: "classic-skills",
        type: "text",
        x: 50,
        y: 340,
        width: 600,
        height: 80,
        content: "Add your skills here...",
        fontSize: 14,
        fontWeight: 400,
        fontFamily: "Georgia, serif",
      },
    ],
  },
];
