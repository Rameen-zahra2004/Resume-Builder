"use client";

import { useState, useCallback } from "react";
import ResumeForm from "./ResumeForm";
import ResumeEditor from "./ResumeEditor";
import TemplateSelector from "./TemplateSelector";
import { TemplateItem } from "../data/template";
import {
  Resume,
  ResumeFormData,
  ThemeType,
  TemplateType,
  Experience,
} from "../types/resume";

type TemplateEditorProps = {
  template: TemplateItem;
};

export default function TemplateEditor({ template }: TemplateEditorProps) {
  // Template + Theme State
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    template.type,
  );
  const [theme, setTheme] = useState<ThemeType>("blue");

  // Resume State
  const [resume, setResume] = useState<Resume>({
    id: 0,
    template: template.type,
    theme: "blue",
    title: `${template.name} Resume`,
    updatedAt: new Date().toISOString(),
    data: {
      name: "John Doe",
      title: "Frontend Developer",
      summary: "A professional developer with 3+ years experience.",
      skills: [{ name: "React" }, { name: "TypeScript" }, { name: "Next.js" }],
      experience: [
        {
          role: "Frontend Developer",
          company: "ABC Corp",
          startYear: "2021",
          endYear: "2023",
          description: "",
        } as Experience,
      ],
      projects: [],
      education: [],
    },
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // ===============================
  // MAIN SAVE FUNCTION (FULL RESUME)
  // ===============================
  const saveResume = useCallback(async (updated: Resume) => {
    setSaving(true);
    setSuccess(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Saved resume:", updated);
        setResume(updated);
        setSaving(false);
        setSuccess(true);

        setTimeout(() => setSuccess(false), 2000);
        resolve();
      }, 800);
    });
  }, []);

  // ===============================
  // ADAPTER for ResumeEditor
  // (IMPORTANT FIX)
  // ===============================
  const handleEditorSave = async (updatedData: ResumeFormData) => {
    const updatedResume: Resume = {
      ...resume,
      data: updatedData,
      updatedAt: new Date().toISOString(),
    };

    await saveResume(updatedResume);
  };

  // ===============================
  // Template Change
  // ===============================
  const handleTemplateChange = async (newTemplate: TemplateType) => {
    const updatedResume: Resume = {
      ...resume,
      template: newTemplate,
      updatedAt: new Date().toISOString(),
    };

    setSelectedTemplate(newTemplate);
    await saveResume(updatedResume);
  };

  // ===============================
  // Theme Change
  // ===============================
  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as ThemeType;

    const updatedResume: Resume = {
      ...resume,
      theme: newTheme,
      updatedAt: new Date().toISOString(),
    };

    setTheme(newTheme);
    await saveResume(updatedResume);
  };

  // ===============================
  // Form Change (LEFT FORM)
  // ===============================
  const handleFormChange = async (data: ResumeFormData) => {
    const updatedResume: Resume = {
      ...resume,
      data,
      updatedAt: new Date().toISOString(),
    };

    await saveResume(updatedResume);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-8">
      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-900">
        {template.name} Template
      </h1>

      {/* Template Selector */}
      <TemplateSelector
        selected={selectedTemplate}
        onSelect={handleTemplateChange}
      />

      {/* Theme Selector */}
      <div className="flex justify-center mt-10 mb-6 gap-4">
        <label className="font-medium text-gray-700">Theme:</label>
        <select
          value={theme}
          onChange={handleThemeChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="red">Red</option>
        </select>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* LEFT: FORM */}
        <div className="flex-1 bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-700">
            Build Your Resume
          </h2>

          <ResumeForm data={resume.data} onChange={handleFormChange} />

          {saving && (
            <p className="mt-4 text-blue-600 animate-pulse">Saving...</p>
          )}

          {success && (
            <p className="mt-4 text-green-600">Saved successfully!</p>
          )}
        </div>

        {/* RIGHT: PREVIEW */}
        <div className="flex-1 bg-gray-50 rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-700">
            Preview
          </h2>

          <ResumeEditor resume={resume} onSave={handleEditorSave} />
        </div>
      </div>
    </div>
  );
}
