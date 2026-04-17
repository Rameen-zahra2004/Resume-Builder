
// types/canva.ts

export type TemplateType =
  | "modern"
  | "classic"
  | "simple"
  | "elegant"
  | "professional"
  | "minimal"
  | "creative-photo"
  | "premium-elegant"
  | "sidebar-bold"
  | "tech-grid"
  | "creative"   ;

export type ElementType = "text" | "shape";

export interface Element {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;        // for text elements
  color?: string;          // text/shape color
  fontSize?: number;
  fontFamily?: string;     // optional font family
  fontWeight?: number;     // optional font weight
  borderRadius?: number;
  zIndex?: number;
  options?: string[];      // for dropdown/select elements
}

export interface CanvasTemplate {
  id: string;              // unique template ID
  name: string;            // template display name
  type: TemplateType;      // must match TemplateType
  thumbnail?: string;      // optional thumbnail path
  layout: Element[];       // array of elements
}
