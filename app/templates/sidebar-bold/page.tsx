"use client";

import React, { memo, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Save,
  Download,
  RefreshCcw,
  Edit2,
  Eye,
} from "lucide-react";

import type { Resume, ResumeFormData, ThemeType } from "../../types/resume";
import type { AppDispatch, RootState } from "../../store/store";

import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { useToast } from "../../component/ui/use-toast";

// Shared components
import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

/* ===== Theme Colors & Styles ===== */
const themeColors: Record<
  ThemeType,
  { bg: string; button: string; section: string }
> = {
  blue: {
    bg: "bg-gradient-to-r from-blue-50 via-blue-100 to-blue-200",
    button: "bg-blue-600 hover:bg-blue-700",
    section: "bg-blue-100",
  },
  red: {
    bg: "bg-gradient-to-r from-red-50 via-red-100 to-red-200",
    button: "bg-red-600 hover:bg-red-700",
    section: "bg-red-100",
  },
  green: {
    bg: "bg-gradient-to-r from-green-50 via-green-100 to-green-200",
    button: "bg-green-600 hover:bg-green-700",
    section: "bg-green-100",
  },
  purple: {
    bg: "bg-gradient-to-r from-purple-50 via-purple-100 to-purple-200",
    button: "bg-purple-600 hover:bg-purple-700",
    section: "bg-purple-100",
  },
};

/* ---------------- Normalize Resume Data ---------------- */
const normalizeResumeData = (data?: ResumeFormData): ResumeFormData => ({
  name: data?.name ?? "Your Name",
  title: data?.title ?? "Professional Title",
  summary: data?.summary ?? "",
  skills: Array.isArray(data?.skills) ? data.skills : [],
  experience: Array.isArray(data?.experience) ? data.experience : [],
  education: Array.isArray(data?.education) ? data.education : [],
  projects: Array.isArray(data?.projects) ? data.projects : [],
  email: data?.email ?? "",
  phone: data?.phone ?? "",
  location: data?.location ?? "",
  photo: data?.photo ?? "",
});

/* ---------------- SidebarBoldPage ---------------- */
const SidebarBoldPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const theme: ThemeType = "purple"; // Example: set purple as default theme

  // Redux store
  const existingResume = useSelector(
    (state: RootState) => state.resumes.items[0]
  );
  const initialData = useMemo(
    () => normalizeResumeData(existingResume?.data),
    [existingResume]
  );

  const [resumeData, setResumeData] = useState<ResumeFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Resume = {
        id: existingResume?.id ?? Date.now(),
        template: "sidebar-bold",
        theme,
        title: resumeData.name || "Untitled Resume",
        data: resumeData,
        updatedAt: new Date().toISOString(),
      };
      if (existingResume?.id) {
        await dispatch(updateResume(payload)).unwrap();
      } else {
        await dispatch(addResume(payload)).unwrap();
      }
      toast({
        title: "Saved",
        description: "Resume saved successfully",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setResumeData(initialData);
    toast({ title: "Reset", description: "All fields restored" });
  };

  /* ---------------- PDF EXPORT ---------------- */
  const handleExportPDF = async () => {
    const preview = document.getElementById("resume-preview");
    if (!preview) return;

    const clone = preview.cloneNode(true) as HTMLElement;
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.boxShadow = "none";

    clone.querySelectorAll("*").forEach((el) => {
      const node = el as HTMLElement;
      node.style.backgroundColor = "transparent";
      node.style.color = "#000000";
      node.style.boxShadow = "none";
      node.style.filter = "none";
      node.style.borderColor = "#000000";
    });

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const pdf = new jsPDF("p", "pt", "a4");
    await pdf.html(clone, {
      margin: [24, 24, 24, 24],
      html2canvas: { scale: 0.75, backgroundColor: "#ffffff", useCORS: true },
    });

    document.body.removeChild(wrapper);
    pdf.save(`${resumeData.name || "resume"}.pdf`);
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-10 space-y-10 ${themeColors[theme].bg}`}
    >
      {/* HEADER ACTIONS */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-100 transition"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsPreview((p) => !p)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition ${themeColors[theme].button}`}
          >
            {isPreview ? <Edit2 size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isPreview}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-white transition ${themeColors[theme].button} disabled:opacity-50`}
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isPreview}
            className="flex items-center gap-2 px-5 py-2 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 disabled:opacity-50 transition"
          >
            <RefreshCcw size={16} /> Reset
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* FORM + PREVIEW GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!isPreview && (
          <div className="space-y-6">
            <ResumeHeaderEditable data={resumeData} onChange={setResumeData} />

            {/* Summary */}
            <section
              className={`p-6 rounded-xl shadow-lg ${themeColors[theme].section} hover:shadow-2xl transition`}
            >
              <label
                className="block text-lg font-semibold mb-2"
                htmlFor="summary"
              >
                Professional Summary
              </label>
              <textarea
                id="summary"
                title="Enter your professional summary"
                placeholder="Write a short overview of your professional background"
                rows={4}
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData({ ...resumeData, summary: e.target.value })
                }
                className="w-full p-3 rounded-lg border resize-none focus:ring-2 focus:ring-indigo-400 transition"
              />
            </section>

            {/* Skills / Experience / Education / Projects */}
            <ResumeSkillsView data={resumeData} onChange={setResumeData} />
            <ResumeExperienceView
              experience={resumeData.experience}
              onChange={(experience) =>
                setResumeData({ ...resumeData, experience })
              }
            />
            <ResumeEducation data={resumeData} onChange={setResumeData} />
            <ResumeProjects data={resumeData} onChange={setResumeData} />
          </div>
        )}

        {/* PREVIEW */}
        <div
          id="resume-preview"
          className={`bg-white p-6 rounded-xl shadow-xl overflow-auto ${
            isPreview ? "col-span-1 md:col-span-2" : "sticky top-6"
          }`}
        >
          <ResumePreview data={resumeData} template="sidebar-bold" />
        </div>
      </div>
    </div>
  );
};

export default memo(SidebarBoldPage);
