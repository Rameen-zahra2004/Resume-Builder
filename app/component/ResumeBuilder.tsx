"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";

import {
  Resume,
  ResumeFormData,
  TemplateType,
  ThemeType,
} from "../types/resume";

import {
  fetchResumes,
  addResume,
  updateResume,
  deleteResume,
} from "../store/redux/resumeSlice";

import TemplateRenderer from "./TemplateRenderer";
import ResumeForm from "./ResumeForm";
import ResumeExperience from "./ResumeExperience";
import ResumeSkills from "./ResumeSkills";
import ResumeEducation from "./ResumeEducation";
import ResumeProjects from "./ResumeProjects";

import { templateRegistry } from "../templates";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const defaultResumeData: ResumeFormData = {
  name: "",
  title: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
};

export default function ResumeBuilderPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items: resumes, loading } = useSelector(
    (state: RootState) => state.resumes
  );

  const [resumeData, setResumeData] = useState<ResumeFormData>({
    ...defaultResumeData,
  });
  const [template, setTemplate] = useState<TemplateType>("modern");
  const [theme, setTheme] = useState<ThemeType>("blue");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchResumes());
  }, [dispatch]);

  const handleChange = useCallback(
    (next: ResumeFormData) => setResumeData(next),
    []
  );

  const handleSave = async () => {
    setSaving(true);

    const fullResume: Resume = {
      id: editingId || Date.now(),
      template,
      theme,
      title: resumeData.name || "Untitled Resume",
      updatedAt: new Date().toISOString(),
      data: resumeData,
    };

    try {
      if (editingId) {
        await dispatch(updateResume(fullResume)).unwrap();
        setEditingId(null);
      } else {
        await dispatch(addResume(fullResume)).unwrap();
      }

      setResumeData({ ...defaultResumeData });
    } catch (err) {
      console.error("Failed to save resume:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (resume: Resume) => {
    setResumeData(resume.data);
    setTemplate(resume.template);
    setTheme(resume.theme);
    setEditingId(resume.id);
  };

  const handleDelete = async (id: number) => {
    await dispatch(deleteResume(id));
    if (editingId === id) {
      setEditingId(null);
      setResumeData({ ...defaultResumeData });
    }
  };

  const handlePDFDownload = async () => {
    if (!previewRef.current) return;

    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${resumeData.name || "resume"}-resume.pdf`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 p-6 max-w-7xl mx-auto">
      {/* ------------------------- */}
      {/* Sidebar Form */}
      {/* ------------------------- */}
      <div className="flex-1 space-y-6">
        <h1 className="text-3xl font-bold">
          {editingId ? "Edit Resume" : "Create Resume"}
        </h1>

        <ResumeForm data={resumeData} onChange={handleChange} />
        <ResumeExperience data={resumeData} onChange={handleChange} />
        <ResumeSkills data={resumeData} onChange={handleChange} />
        <ResumeEducation data={resumeData} onChange={handleChange} />
        <ResumeProjects data={resumeData} onChange={handleChange} />

        {/* Template & Theme Selectors */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="templateSelect" className="font-medium">
              Template
            </label>
            <select
              id="templateSelect"
              value={template}
              onChange={(e) => setTemplate(e.target.value as TemplateType)}
              className="border rounded px-2 py-1 w-full"
            >
              {(Object.keys(templateRegistry) as TemplateType[]).map((key) => (
                <option key={key} value={key}>
                  {templateRegistry[key].name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="themeSelect" className="font-medium">
              Theme
            </label>
            <select
              id="themeSelect"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeType)}
              className="border rounded px-2 py-1 w-full"
            >
              {["blue", "green", "red"].map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-4">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            {saving ? "Saving..." : "Save Resume"}
          </button>

          <button
            type="button"
            onClick={handlePDFDownload}
            className="px-6 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
          >
            Download PDF
          </button>
        </div>

        {/* Saved Resumes */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Saved Resumes</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-2">
              {resumes.map((r) => (
                <li
                  key={r.id}
                  className="p-2 border flex justify-between items-center rounded hover:shadow-sm transition"
                >
                  <span>{r.title}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(r)}
                      className="px-2 py-1 bg-yellow-400 rounded hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* ------------------------- */}
      {/* Resume Preview */}
      {/* ------------------------- */}
      <div
        ref={previewRef}
        className="flex-1 border rounded shadow p-4 max-h-[90vh] overflow-auto bg-white"
      >
        <TemplateRenderer
          templateId={template}
          resume={{
            id: editingId || Date.now(),
            template,
            theme,
            title: resumeData.name || "Preview Resume",
            updatedAt: new Date().toISOString(),
            data: resumeData,
          }}
        />
      </div>
    </div>
  );
}
