"use client";

import React, { memo, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Save, RefreshCcw, Download } from "lucide-react";
import jsPDF from "jspdf";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../store/store";

import type { Resume, ResumeFormData, ThemeType } from "../../types/resume";
import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { useToast } from "../../component/ui/use-toast";

/* ===== Components ===== */
import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

/* ===== Section and Theme Styles ===== */
const themeColors: Record<
  ThemeType,
  { bg: string; text: string; button: string; section: string }
> = {
  blue: {
    bg: "bg-gradient-to-r from-blue-50 to-blue-100",
    text: "text-blue-900",
    button: "bg-blue-600 hover:bg-blue-700",
    section: "bg-blue-50",
  },
  red: {
    bg: "bg-gradient-to-r from-red-50 to-red-100",
    text: "text-red-900",
    button: "bg-red-600 hover:bg-red-700",
    section: "bg-red-50",
  },
  green: {
    bg: "bg-gradient-to-r from-green-50 to-green-100",
    text: "text-green-900",
    button: "bg-green-600 hover:bg-green-700",
    section: "bg-green-50",
  },
  purple: {
    bg: "bg-gradient-to-r from-purple-50 to-purple-100",
    text: "text-purple-900",
    button: "bg-purple-600 hover:bg-purple-700",
    section: "bg-purple-50",
  },
};

interface ElegantTemplateProps {
  resume?: Resume;
  template?: Resume["template"];
  theme?: ThemeType;
}

const ElegantTemplate: React.FC<ElegantTemplateProps> = ({
  resume,
  template = "elegant",
  theme = "blue",
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  /* ===== STATE ===== */
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

  /* ===== SAVE RESUME ===== */
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
          template,
          theme,
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

  /* ===== EDIT ===== */
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

  /* ===== RESET ===== */
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
    toast({
      title: "Reset complete",
      description: "All fields restored.",
    });
  };

  /* ===== EXPORT PDF ===== */
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

  /* ===== BACK ===== */
  const handleBack = () => {
    if (confirm("Go back? Unsaved changes may be lost.")) router.back();
  };

  /* ===== AUTOSAVE ===== */
  useEffect(() => {
    localStorage.setItem("elegant-resume-autosave", JSON.stringify(data));
  }, [data]);

  return (
    <div
      className={`max-w-6xl mx-auto min-h-screen p-6 md:p-12 space-y-10 ${themeColors[theme].bg} ${themeColors[theme].text}`}
    >
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
            className={`flex items-center gap-2 px-5 py-2 text-white rounded-lg shadow ${themeColors[theme].button} disabled:opacity-50`}
          >
            <Save size={16} /> {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-5 py-2 bg-gray-700 text-white rounded-lg shadow hover:bg-gray-800"
          >
            <Pencil size={16} /> Edit
          </button>

          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-5 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700"
          >
            <RefreshCcw size={16} /> Reset
          </button>

          <button
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
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

          {/* SUMMARY */}
          <section
            className={`p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${themeColors[theme].section}`}
          >
            <label
              htmlFor="summary"
              className="block font-semibold mb-2 text-lg"
            >
              Professional Summary
            </label>
            <textarea
              id="summary"
              title="Enter your professional summary"
              placeholder="Write a short professional summary..."
              rows={5}
              value={data.summary}
              onChange={(e) => setData({ ...data, summary: e.target.value })}
              className="w-full p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400"
            />
          </section>

          {/* SKILLS */}
          <section
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${themeColors[theme].section}`}
          >
            <h2 className="font-semibold mb-2 text-lg">Skills</h2>
            <ResumeSkillsView data={data} onChange={setData} />
          </section>

          {/* EXPERIENCE */}
          <section
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${themeColors[theme].section}`}
          >
            <h2 className="font-semibold mb-2 text-lg">Experience</h2>
            <ResumeExperienceView
              experience={data.experience}
              onChange={(experience) => setData({ ...data, experience })}
            />
          </section>

          {/* EDUCATION */}
          <section
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${themeColors[theme].section}`}
          >
            <h2 className="font-semibold mb-2 text-lg">Education</h2>
            <ResumeEducation data={data} onChange={setData} />
          </section>

          {/* PROJECTS */}
          <section
            className={`p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 ${themeColors[theme].section}`}
          >
            <h2 className="font-semibold mb-2 text-lg">Projects</h2>
            <ResumeProjects data={data} onChange={setData} />
          </section>
        </div>

        {/* PREVIEW */}
        <div
          id="resume-preview"
          className="bg-white p-8 rounded-xl shadow-xl sticky top-6 max-h-[90vh] overflow-auto scroll-smooth"
        >
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
};

export default memo(ElegantTemplate);
