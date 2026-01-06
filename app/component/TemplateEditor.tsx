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
  // Template and theme state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>(
    template.type
  );
  const [theme, setTheme] = useState<ThemeType>("blue");

  // Resume state
  const [resume, setResume] = useState<Resume>({
    id: 0,
    template: selectedTemplate,
    theme,
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

  // Mock async save function
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
      }, 1000);
    });
  }, []);

  // Template change handler
  const handleTemplateChange = async (newTemplate: TemplateType) => {
    const updatedResume = { ...resume, template: newTemplate };
    setSelectedTemplate(newTemplate);
    await saveResume(updatedResume);
  };

  // Theme change handler
  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value as ThemeType;
    const updatedResume = { ...resume, theme: newTheme };
    setTheme(newTheme);
    await saveResume(updatedResume);
  };

  // Form change handler
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
        <label htmlFor="theme-select" className="font-medium text-gray-700">
          Theme:
        </label>
        <select
          id="theme-select"
          value={theme}
          onChange={handleThemeChange}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="blue">Blue</option>
          <option value="green">Green</option>
          <option value="red">Red</option>
        </select>
      </div>

      {/* Form + Preview */}
      <div className="flex flex-col md:flex-row gap-12">
        {/* Resume Form */}
        <div className="flex-1 bg-white rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all">
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

        {/* Resume Preview */}
        <div className="flex-1 bg-gray-50 rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all">
          <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-gray-700">
            Preview
          </h2>
          <ResumeEditor resume={resume} />
        </div>
      </div>
    </div>
  );
}
