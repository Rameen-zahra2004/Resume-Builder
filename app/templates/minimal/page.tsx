"use client";

import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Save, RefreshCcw, Download } from "lucide-react";
import jsPDF from "jspdf";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";

import type { Resume, ResumeFormData } from "../../types/resume";
import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { useToast } from "../../component/ui/use-toast";

/* ===== Components ===== */
import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

/* ===== Section styles ===== */
const sectionStyles = {
  summary: "bg-white text-black",
  skills: "bg-white text-black",
  experience: "bg-white text-black",
  education: "bg-white text-black",
  projects: "bg-white text-black",
};

/* ===== Props ===== */
interface MinimalTemplateProps {
  resume?: Resume;
  template?: Resume["template"]; // ✅ optional to satisfy TemplateDefinition
}

const MinimalTemplate: React.FC<MinimalTemplateProps> = ({
  resume,
  template,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  /* ===== State ===== */
  const [data, setData] = useState<ResumeFormData>(
    () =>
      resume?.data ?? {
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
      }
  );
  const [isSaving, setIsSaving] = useState(false);

  /* ===== Save Resume ===== */
  const handleSaveResume = async () => {
    setIsSaving(true);
    try {
      if (resume) {
        await dispatch(
          updateResume({ ...resume, data, updatedAt: new Date().toISOString() })
        ).unwrap();
      } else {
        const newResume: Resume = {
          id: Date.now(),
          template: template ?? "minimal",
          theme: "blue",
          title: data.name || "Untitled Resume",
          data,
          updatedAt: new Date().toISOString(),
        };
        await dispatch(addResume(newResume)).unwrap();
      }

      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
        variant: "success",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "Unable to save resume.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ===== Edit / Reset / Back / PDF ===== */
  const handleEdit = () => {
    if (!resume) {
      toast({
        title: "Save required",
        description: "Please save the resume before editing.",
        variant: "destructive",
      });
      return;
    }
    router.push(`/resume/${resume.id}/edit`);
  };

  const handleReset = () => {
    setData(
      resume?.data ?? {
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
      }
    );
    toast({ title: "Reset complete", description: "All fields restored." });
  };

  const handleExportPDF = () => {
    const element = document.getElementById("resume-preview");
    if (!element) return;

    const pdf = new jsPDF("p", "pt", "a4");
    pdf.html(element, {
      margin: 20,
      html2canvas: { scale: 0.6, backgroundColor: "#ffffff", useCORS: true },
      callback: (doc) => doc.save(`${data.name || "resume"}.pdf`),
    });
  };

  const handleBack = () => {
    if (confirm("Go back? Unsaved changes may be lost.")) router.back();
  };

  /* ===== Autosave locally ===== */
  useEffect(() => {
    localStorage.setItem("minimal-resume-autosave", JSON.stringify(data));
  }, [data]);

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-gray-100 p-6 md:p-10 space-y-8 text-gray-800">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 font-medium hover:text-black"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleSaveResume}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800"
          >
            <Pencil size={16} /> Edit
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            <RefreshCcw size={16} /> Reset
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
          >
            <Download size={16} /> PDF
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* EDITOR */}
        <div className="space-y-6">
          <ResumeHeaderEditable data={data} onChange={setData} />

          <section className={`p-6 rounded-xl shadow ${sectionStyles.summary}`}>
            <label htmlFor="summary" className="block font-semibold mb-2">
              Professional Summary
            </label>
            <textarea
              id="summary"
              rows={4}
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              className="w-full p-3 rounded border"
            />
          </section>

          <section className={`p-6 rounded-xl shadow ${sectionStyles.skills}`}>
            <h2 className="font-semibold mb-2">Skills</h2>
            <ResumeSkillsView data={data} onChange={setData} />
          </section>

          <section
            className={`p-6 rounded-xl shadow ${sectionStyles.experience}`}
          >
            <h2 className="font-semibold mb-2">Experience</h2>
            <ResumeExperienceView
              experience={data.experience}
              onChange={(experience) => setData({ ...data, experience })}
            />
          </section>

          <section
            className={`p-6 rounded-xl shadow ${sectionStyles.education}`}
          >
            <h2 className="font-semibold mb-2">Education</h2>
            <ResumeEducation data={data} onChange={setData} />
          </section>

          <section
            className={`p-6 rounded-xl shadow ${sectionStyles.projects}`}
          >
            <h2 className="font-semibold mb-2">Projects</h2>
            <ResumeProjects data={data} onChange={setData} />
          </section>
        </div>

        {/* PREVIEW */}
        <div
          id="resume-preview"
          className="bg-white p-6 rounded-xl shadow-xl sticky top-6 max-h-[90vh] overflow-auto"
        >
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
};

export default memo(MinimalTemplate);
