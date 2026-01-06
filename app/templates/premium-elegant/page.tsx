"use client";

import React, { memo, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { jsPDF } from "jspdf";
import {
  ArrowLeft,
  Save,
  Download,
  RefreshCcw,
  Edit2,
  Eye,
} from "lucide-react";

import type { Resume, ResumeFormData } from "../../types/resume";
import type { AppDispatch } from "../../store/store";

import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { useToast } from "../../component/ui/use-toast";

import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

/* ---------------- NORMALIZE DATA ---------------- */
const normalizeResumeData = (data?: ResumeFormData): ResumeFormData => ({
  name: data?.name ?? "Your Name",
  title: data?.title ?? "Professional Title",
  summary: data?.summary ?? "",
  skills: Array.isArray(data?.skills) ? data.skills : [],
  experience: Array.isArray(data?.experience) ? data.experience : [],
  education: Array.isArray(data?.education)
    ? data.education.map((edu) => ({
        ...edu,
        certifications: Array.isArray(edu.certifications)
          ? edu.certifications.map((c) => (typeof c === "string" ? c : ""))
          : [],
      }))
    : [],
  projects: Array.isArray(data?.projects) ? data.projects : [],
  email: data?.email ?? "",
  phone: data?.phone ?? "",
  location: data?.location ?? "",
  photo: data?.photo ?? "",
});

interface PremiumElegantTemplateProps {
  resume?: Resume;
}

const PremiumElegantTemplate: React.FC<PremiumElegantTemplateProps> = ({
  resume,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const initialData = useMemo(
    () => normalizeResumeData(resume?.data),
    [resume]
  );

  const [resumeData, setResumeData] = useState<ResumeFormData>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      const payload: Resume = {
        id: resume?.id ?? Date.now(),
        template: "premium-elegant",
        theme: "blue",
        title: resumeData.name || "Untitled Resume",
        data: {
          ...resumeData,
          skills: resumeData.skills ?? [],
          experience: resumeData.experience ?? [],
          projects: resumeData.projects ?? [],
          education: resumeData.education.map((edu) => ({
            ...edu,
            certifications: (edu.certifications || []).map((c) =>
              typeof c === "string" ? c : ""
            ),
          })),
        },
        updatedAt: new Date().toISOString(),
      };

      if (resume?.id) {
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
    toast({
      title: "Reset",
      description: "All fields restored",
    });
  };

  /* ---------------- PDF EXPORT (BULLETPROOF) ---------------- */
  const handleExportPDF = async () => {
    const preview = document.getElementById("resume-preview");
    if (!preview) return;

    const clone = preview.cloneNode(true) as HTMLElement;

    // Force PDF-safe styles
    clone.style.background = "#ffffff";
    clone.style.color = "#000000";
    clone.style.boxShadow = "none";

    clone.querySelectorAll("*").forEach((node) => {
      const el = node as HTMLElement;
      el.style.backgroundColor = "transparent";
      el.style.color = "#000000";
      el.style.boxShadow = "none";
      el.style.filter = "none";
      el.style.borderColor = "#000000";
    });

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const pdf = new jsPDF("p", "pt", "a4");

    await pdf.html(clone, {
      margin: [24, 24, 24, 24],
      autoPaging: "text",
      html2canvas: {
        scale: 0.75,
        backgroundColor: "#ffffff",
        useCORS: true,
      },
    });

    document.body.removeChild(wrapper);
    pdf.save(`${resumeData.name || "resume"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setIsPreview((p) => !p)}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-lg font-semibold"
          >
            {isPreview ? <Edit2 size={16} /> : <Eye size={16} />}
            {isPreview ? "Edit" : "Preview"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving || isPreview}
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isPreview}
            className="flex items-center gap-2 px-5 py-2 bg-red-500 text-white rounded-lg font-semibold disabled:opacity-50"
          >
            <RefreshCcw size={16} /> Reset
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg font-semibold"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {!isPreview && (
          <div className="space-y-6">
            <ResumeHeaderEditable data={resumeData} onChange={setResumeData} />

            {/* SUMMARY */}
            <section className="p-6 bg-white rounded-xl shadow">
              <label
                htmlFor="summary"
                className="block text-lg font-semibold mb-3"
              >
                Professional Summary
              </label>
              <textarea
                id="summary"
                rows={4}
                value={resumeData.summary}
                onChange={(e) =>
                  setResumeData({
                    ...resumeData,
                    summary: e.target.value,
                  })
                }
                placeholder="Brief overview of your professional background"
                className="w-full p-3 rounded-lg border resize-none"
              />
            </section>

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
          className={`bg-white p-6 rounded-xl shadow overflow-auto ${
            isPreview ? "col-span-1 md:col-span-2" : "sticky top-6"
          }`}
        >
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
};

export default memo(PremiumElegantTemplate);
