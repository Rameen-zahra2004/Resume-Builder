
import type { CanvasTemplate, Element } from "../types/resume";

const CANVAS_MARGIN = 40;
const SPACING = 30; // Increased spacing for readability
const FULL_WIDTH = 760; // Make all elements equal width for professional alignment

const createTextElement = (
  id: string,
  content: string,
  y: number,
  height: number,
  fontSize: number,
  options?: string[]
): Element => ({
  id,
  type: "text",
  x: CANVAS_MARGIN,
  y,
  width: FULL_WIDTH,
  height,
  fontSize,
  content,
  options,
});

const generateLayout = (): Element[] => {
  let currentY = 50;

  const elements: Element[] = [];

  // NAME & TITLE
  elements.push(createTextElement("name", "Your Name Here", currentY, 70, 34));
  currentY += 70 + 5;

  elements.push(createTextElement("title", "Professional Title", currentY, 50, 22));
  currentY += 50 + 15;

  // CONTACT INFO
  elements.push(createTextElement("contactEmail", "Email: example@example.com", currentY, 35, 16));
  currentY += 35 + 5;

  elements.push(createTextElement("contactPhone", "Phone: +1234567890", currentY, 35, 16));
  currentY += 35 + 5;

  elements.push(createTextElement("contactAddress", "Address: City, Country", currentY, 35, 16));
  currentY += 35 + SPACING;

  // SUMMARY
  elements.push(createTextElement("summaryTitle", "Professional Summary", currentY, 45, 20));
  currentY += 45 + 10;

  elements.push(
    createTextElement(
      "summary",
      "A short professional summary highlighting key achievements, skills, and career goals. Write in concise, impactful sentences for maximum readability.",
      currentY,
      150,
      16
    )
  );
  currentY += 150 + SPACING;

  // EXPERIENCE
  elements.push(createTextElement("experienceTitle", "Experience", currentY, 45, 20));
  currentY += 45 + 10;

  elements.push(
    createTextElement(
      "experienceList",
      "Company A – Role\n• Responsibility 1\n• Responsibility 2\n\nCompany B – Role\n• Achievement 1\n• Achievement 2",
      currentY,
      200,
      16
    )
  );
  currentY += 200 + SPACING;

  // EDUCATION
  elements.push(createTextElement("educationTitle", "Education", currentY, 45, 20));
  currentY += 45 + 10;

  elements.push(
    createTextElement(
      "educationList",
      "Bachelor's in Computer Science – XYZ University\nCertifications: ABC, DEF",
      currentY,
      140,
      16
    )
  );
  currentY += 140 + SPACING;

  // SKILLS
  elements.push(createTextElement("skillsTitle", "Skills", currentY, 45, 20));
  currentY += 45 + 10;

  elements.push(
    createTextElement(
      "skillsList",
      "",
      currentY,
      160,
      16,
      ["JavaScript", "TypeScript", "React", "Node.js", "Python", "SQL", "Redux", "Tailwind CSS"]
    )
  );

  return elements;
};

export const modernTemplates: CanvasTemplate[] = [
  {
    id: "1",
    name: "LinkedIn-Style Resume",
    type: "modern",
    thumbnail: "/templates/modern.png",
    layout: generateLayout(),
  },
];
