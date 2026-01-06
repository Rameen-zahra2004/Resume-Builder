
import type { Element } from "../types/canva";

// Example users (optional, only if you need user mock data)
export const users = [
  {
    id: "1",
    name: "Test User",
    email: "test@gmail.com",
    password: "123456",
  },
];

// In-memory storage for canvas elements
let savedElements: Element[] | null = null;

// Mock API for canvas save/load
export const mockApi = {
  save: async (elements: Element[]): Promise<boolean> => {
    savedElements = elements;
    return true;
  },
  load: async (): Promise<Element[] | null> => {
    return savedElements;
  },
};
