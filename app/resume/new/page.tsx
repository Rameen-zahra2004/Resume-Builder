"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { FileText, File, FileCheck, Cpu, Check } from "lucide-react";

import { addResume } from "@/app/store/redux/resumeSlice";
import { createResume } from "@/app/types/resume";
import type {
  TemplateType,
  ThemeType,
  ResumeFormData,
} from "@/app/types/resume";
import type { AppDispatch } from "@/app/store/store";

import type { LucideIcon } from "lucide-react";

const templates: { id: TemplateType; name: string; Icon: LucideIcon }[] = [
  { id: "modern", name: "Modern", Icon: FileText },
  { id: "classic", name: "Classic", Icon: File },
  { id: "minimal", name: "Minimal", Icon: FileText },
  { id: "elegant", name: "Elegant", Icon: FileCheck },
  { id: "premium-elegant", name: "Premium Elegant", Icon: FileCheck },
  { id: "creative-photo", name: "Creative Photo", Icon: Cpu },
  { id: "sidebar-bold", name: "Sidebar Bold", Icon: FileText },
  { id: "tech-grid", name: "TechGrid", Icon: Cpu },
  { id: "professional", name: "Professional", Icon: FileText },
  { id: "corporate", name: "Corporate", Icon: File },
];

const themes: ThemeType[] = ["blue", "green", "red"];

export default function NewResumePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const [theme, setTheme] = useState<ThemeType>("blue");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType | null>(
    null
  );

  const emptyData: ResumeFormData = {
    name: "",
    title: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    projects: [],
    photo: "",
    email: "",
    phone: "",
    location: "",
  };

  const handleCreate = async (template: TemplateType) => {
    setSelectedTemplate(template);

    const resume = await dispatch(
      addResume(createResume(emptyData, template, "Untitled Resume", theme))
    ).unwrap();

    router.push(`/resume/${resume.id}/edit`);
  };

  const themeClass = (t: ThemeType) =>
    t === "blue"
      ? "bg-blue-500"
      : t === "green"
      ? "bg-green-500"
      : "bg-red-500";

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-5xl font-bold text-center">
          Choose a Resume Template
        </h1>

        {/* TEMPLATE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {templates.map(({ id, name, Icon }) => (
            <div
              key={id}
              onClick={() => handleCreate(id)}
              className={`
                cursor-pointer relative p-6 rounded-xl bg-white border-2
                ${selectedTemplate === id ? "border-black" : "border-gray-200"}
                shadow hover:shadow-xl transition
              `}
            >
              <div className="h-24 rounded bg-gray-100 p-3 space-y-2">
                <motion.div
                  className={`h-2 w-2/3 rounded ${themeClass(theme)}`}
                />
                <div className="h-2 bg-gray-300 rounded" />
                <div className="h-2 bg-gray-300 rounded w-4/5" />
              </div>

              <div className="flex justify-center mt-4">
                <Icon size={36} />
              </div>

              <p className="text-center font-semibold mt-2">{name}</p>

              {selectedTemplate === id && (
                <span className="absolute top-3 right-3 bg-black p-1 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </span>
              )}
            </div>
          ))}
        </div>

        {/* THEME PICKER */}
        <div className="flex justify-center gap-6">
          {themes.map((t) => (
            <div
              key={t}
              onClick={() => setTheme(t)}
              className={`w-12 h-12 rounded-full cursor-pointer border-2
                ${theme === t ? "border-black scale-110" : "border-gray-300"}
                ${themeClass(t)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
