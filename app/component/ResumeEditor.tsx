"use client";

import { useState, useMemo } from "react";
import type {
  Resume,
  ResumeFormData,
  TemplateType,
  ThemeType,
} from "../types/resume";

import ResumeHeaderEditable from "./ResumeHeader";
import ResumeSkillsView from "./ResumeSkillsView";
import ResumeExperience from "./ResumeExperience";
import ResumeEducation from "./ResumeEducation";
import ResumeProjects from "./ResumeProjects";

interface ResumeEditorProps {
  resume: Resume;
  onSave: (updatedData: ResumeFormData) => Promise<void>; // only form data
  template?: TemplateType;
  theme?: ThemeType;
}

export default function ResumeEditor({ resume, onSave }: ResumeEditorProps) {
  const [data, setData] = useState<ResumeFormData>(resume.data);
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<"edit" | "preview">("edit");

  const memoizedData = useMemo(() => data, [data]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(data);
      setMode("preview");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => setData(resume.data);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* LEFT PANEL: Editor */}
      <aside className="w-full md:w-1/2 p-8 bg-white shadow-lg overflow-y-auto flex flex-col gap-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-3xl font-semibold text-gray-800">
            {mode === "edit" ? "Edit Resume" : "Preview Mode"}
          </h2>
          <div className="flex gap-3">
            <button
              onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition text-gray-800 font-medium"
            >
              {mode === "edit" ? "Preview" : "Edit"}
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || mode === "preview"}
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleReset}
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition disabled:opacity-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Editable Sections */}
        <div className="flex flex-col gap-6">
          <ResumeHeaderEditable
            data={memoizedData}
            onChange={setData}
            mode={mode}
          />
          <ResumeSkillsView
            data={memoizedData}
            onChange={setData}
            mode={mode}
          />
          <ResumeExperience
            data={memoizedData}
            onChange={setData}
            mode={mode}
          />
          <ResumeEducation data={memoizedData} onChange={setData} mode={mode} />
          <ResumeProjects data={memoizedData} onChange={setData} mode={mode} />
        </div>
      </aside>

      {/* RIGHT PANEL: Live Preview */}
      <section className="w-full md:w-1/2 p-8 bg-gray-100 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 text-center text-gray-700">
            Live Preview
          </h2>

          <div className="flex flex-col gap-6">
            <ResumeHeaderEditable
              data={memoizedData}
              onChange={() => {}}
              mode="preview"
            />
            <ResumeSkillsView
              data={memoizedData}
              onChange={() => {}}
              mode="preview"
            />
            <ResumeExperience
              data={memoizedData}
              onChange={() => {}}
              mode="preview"
            />
            <ResumeEducation
              data={memoizedData}
              onChange={() => {}}
              mode="preview"
            />
            <ResumeProjects
              data={memoizedData}
              onChange={() => {}}
              mode="preview"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
