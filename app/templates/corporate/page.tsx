"use client";

import React, {
  memo,
  useState,
  useDeferredValue,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";

import type { Resume, ResumeFormData } from "../../types/resume";
import type { AppDispatch } from "../../store/store";

import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { useToast } from "../../component/ui/use-toast";

import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperience from "../../component/ResumeExperience";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";
import { normalizeResume } from "../../utils/normalizeREsume";

/* ---------------------------------- */
/* Constants                           */
/* ---------------------------------- */
const STORAGE_KEY = "professional-resume-autosave";

/* ---------------------------------- */
/* UI Helpers                          */
/* ---------------------------------- */
const SectionTitle = ({ title }: { title: string }) => (
  <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800 border-l-4 border-indigo-600 pl-3 mb-4">
    {title}
  </h2>
);

const EditableSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <section className="p-6 bg-indigo-50 rounded-2xl shadow-md space-y-4 hover:shadow-lg transition">
    <SectionTitle title={title} />
    {children}
  </section>
);

/* ---------------------------------- */
/* Main Component                     */
/* ---------------------------------- */
const ProfessionalTemplate: React.FC<{ resume?: Resume }> = ({ resume }) => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  /* ---------------------------------- */
  /* State                               */
  /* ---------------------------------- */
  const [resumeData, setResumeData] = useState<Required<ResumeFormData>>(() => {
    if (typeof window === "undefined") return normalizeResume();
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeResume(JSON.parse(saved)) : normalizeResume();
  });

  const [errors, setErrors] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  /* ---------------------------------- */
  /* Autosave                            */
  /* ---------------------------------- */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(resumeData));
  }, [resumeData]);

  /* ---------------------------------- */
  /* Smooth Preview                      */
  /* ---------------------------------- */
  const deferredResumeData = useDeferredValue(resumeData);

  /* ---------------------------------- */
  /* Change Handler                       */
  /* ---------------------------------- */
  const handleChange = useCallback((next: ResumeFormData) => {
    setResumeData(normalizeResume(next));
  }, []);

  /* ---------------------------------- */
  /* Validation                          */
  /* ---------------------------------- */
  const validate = (): boolean => {
    const issues: string[] = [];
    if (!resumeData.name.trim()) issues.push("Name is required.");
    if (!resumeData.title.trim()) issues.push("Title is required.");
    if (resumeData.summary.trim().length < 20)
      issues.push("Summary must be at least 20 characters.");
    setErrors(issues);
    return issues.length === 0;
  };

  /* ---------------------------------- */
  /* Actions                             */
  /* ---------------------------------- */
  const handleSave = async () => {
    if (!validate()) return;
    setIsSaving(true);
    try {
      const payload: Resume = {
        id: resume?.id || Date.now(),
        template: "professional",
        theme: "blue",
        title: resumeData.name || "Untitled Resume",
        data: resumeData,
        updatedAt: new Date().toISOString(),
      };

      if (resume?.id) {
        await dispatch(updateResume(payload)).unwrap();
        toast({
          title: "Resume Updated",
          description: "Your resume has been successfully updated.",
          variant: "success",
        });
      } else {
        // NEW RESUME: Save and redirect to edit page
        const newResume = await dispatch(addResume(payload)).unwrap();
        toast({
          title: "Resume Saved",
          description: "Your resume has been successfully saved.",
          variant: "success",
        });
        router.push(`/resume/${newResume.id}/edit`);
        return; // stop here to avoid extra toast
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Save Failed",
        description: "Something went wrong while saving the resume.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setResumeData(normalizeResume());
    toast({ title: "Changes reset" });
  };

  const handleExportPDF = () => {
    if (!validate()) return;
    const doc = new jsPDF("portrait", "pt", "a4");
    const content = document.getElementById("resume-preview");
    if (!content) return;
    doc.html(content, {
      callback: (doc) => doc.save(`${resumeData.name || "resume"}.pdf`),
      margin: [20, 20, 20, 20],
      html2canvas: { scale: 0.57 },
    });
  };

  const handleBack = () => {
    if (confirm("Your changes are autosaved. Do you want to go back?"))
      router.back();
  };

  /* ---------------------------------- */
  /* Render                               */
  /* ---------------------------------- */
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-100 to-gray-200 py-10">
      <div className="max-w-[1600px] mx-auto px-4 grid grid-cols-1 xl:grid-cols-2 gap-10">
        {/* ================= LEFT — EDITOR ================= */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 space-y-8 overflow-y-auto max-h-[90vh]">
          {/* Back Button */}
          <div className="mb-6">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 border border-indigo-400 text-indigo-700 font-semibold rounded-lg hover:bg-indigo-100 transition"
            >
              ← Back
            </button>
          </div>

          {/* Header */}
          <EditableSection title="Header">
            <ResumeHeaderEditable data={resumeData} onChange={handleChange} />
          </EditableSection>

          {/* Summary */}
          <EditableSection title="Professional Summary">
            <textarea
              value={resumeData.summary}
              onChange={(e) =>
                handleChange({ ...resumeData, summary: e.target.value })
              }
              className={`w-full h-24 p-3 rounded-lg border focus:ring-2 ${
                errors.some((e) => e.toLowerCase().includes("summary"))
                  ? "border-red-500 focus:ring-red-400"
                  : "border-indigo-300 focus:ring-indigo-400"
              }`}
              placeholder="Write a concise professional summary"
            />
          </EditableSection>

          {/* Skills */}
          <EditableSection title="Core Skills">
            <ResumeSkillsView data={resumeData} onChange={handleChange} />
          </EditableSection>

          {/* Experience */}
          <EditableSection title="Experience">
            <ResumeExperience data={resumeData} onChange={handleChange} />
          </EditableSection>

          {/* Education */}
          <EditableSection title="Education">
            <ResumeEducation data={resumeData} onChange={handleChange} />
          </EditableSection>

          {/* Projects */}
          <EditableSection title="Projects">
            <ResumeProjects data={resumeData} onChange={handleChange} />
          </EditableSection>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
              <ul className="list-disc ml-5 space-y-1">
                {errors.map((err) => (
                  <li key={err}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition"
            >
              Reset
            </button>
            <button
              type="button"
              onClick={handleExportPDF}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
            >
              Export as PDF
            </button>
          </div>
        </div>

        {/* ================= RIGHT — PREVIEW ================= */}
        <div className="sticky top-10 max-h-[90vh] overflow-auto">
          <div
            className="bg-white rounded-3xl shadow-2xl p-6"
            id="resume-preview"
          >
            <ResumePreview data={deferredResumeData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(ProfessionalTemplate);
