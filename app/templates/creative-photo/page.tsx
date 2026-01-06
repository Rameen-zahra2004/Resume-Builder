"use client";

import React, { useState, useMemo, memo } from "react";
import { useDispatch } from "react-redux";
import jsPDF from "jspdf";

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

interface CreativePhotoTemplateProps {
  resume?: Resume;
  editable?: boolean;
}

/* ---------------- PDF SAFE HELPER ---------------- */
function makePdfSafe(element: HTMLElement) {
  element.style.backgroundColor = "#ffffff";
  element.style.color = "#000000";
  element.style.boxShadow = "none";
  element.style.filter = "none";

  element.querySelectorAll("*").forEach((node) => {
    const el = node as HTMLElement;
    el.style.backgroundColor = "transparent";
    el.style.color = "#000000";
    el.style.borderColor = "#000000";
    el.style.boxShadow = "none";
    el.style.filter = "none";
  });
}

const CreativePhotoTemplate: React.FC<CreativePhotoTemplateProps> = ({
  resume,
  editable = true,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const initialData: ResumeFormData = useMemo(
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
      },
    [resume]
  );

  const [data, setData] = useState<ResumeFormData>(initialData);
  const [mode, setMode] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);

  const template: Resume["template"] = "creative-photo";
  const theme: Resume["theme"] = "blue";

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Resume = {
        id: resume?.id || Date.now(),
        template,
        theme,
        title: data.name || "Untitled Resume",
        data,
        updatedAt: new Date().toISOString(),
      };

      if (resume) {
        await dispatch(updateResume(payload)).unwrap();
      } else {
        await dispatch(addResume(payload)).unwrap();
      }

      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
        variant: "success",
      });

      setMode("preview");
    } catch (err) {
      console.error(err);
      toast({
        title: "Save failed",
        description: "Something went wrong while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setData(initialData);
    toast({ title: "Changes reset" });
  };

  /* ---------------- EXPORT PDF ---------------- */
  const handleExportPDF = async () => {
    const content = document.getElementById("resume-preview");
    if (!content) return;

    const clone = content.cloneNode(true) as HTMLElement;
    makePdfSafe(clone);

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const doc = new jsPDF("portrait", "pt", "a4");
    await doc.html(clone, {
      margin: [20, 20, 20, 20],
      html2canvas: { scale: 0.57, backgroundColor: "#ffffff" },
      callback: (doc) => doc.save(`${data.name || "resume"}.pdf`),
    });

    document.body.removeChild(wrapper);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-linear-to-r from-purple-50 to-white">
      {/* LEFT SIDE – EDITOR */}
      {editable && (
        <aside className="w-full md:w-1/2 p-6 space-y-6 bg-gray-50 overflow-y-auto shadow-lg">
          <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
            <h2 className="text-3xl font-bold text-gray-800 tracking-wide">
              {mode === "edit" ? "Edit Resume" : "Preview Resume"}
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setMode(mode === "edit" ? "preview" : "edit")}
                className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 transition font-medium"
              >
                {mode === "edit" ? "Preview" : "Edit"}
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || mode === "preview"}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 font-medium"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50 font-medium"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleExportPDF}
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition font-medium"
              >
                Export PDF
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-linear-to-r from-purple-200 to-purple-400 p-4 rounded-xl shadow-md">
              <ResumeHeaderEditable
                data={data}
                onChange={setData}
                mode={mode}
              />
            </div>

            <div className="bg-linear-to-r from-yellow-50 to-yellow-200 p-4 rounded-xl shadow-inner">
              <ResumeSkillsView data={data} onChange={setData} mode={mode} />
            </div>

            <div className="bg-linear-to-r from-blue-50 to-blue-200 p-4 rounded-xl shadow-md">
              <ResumeExperienceView
                experience={data.experience}
                onChange={(exp) => setData({ ...data, experience: exp })}
              />
            </div>

            <div className="bg-linear-to-r from-green-50 to-green-200 p-4 rounded-xl shadow-md">
              <ResumeEducation data={data} onChange={setData} mode={mode} />
            </div>

            <div className="bg-linear-to-r from-pink-50 to-pink-200 p-4 rounded-xl shadow-inner">
              <ResumeProjects data={data} onChange={setData} mode={mode} />
            </div>
          </div>
        </aside>
      )}

      {/* RIGHT SIDE – LIVE PREVIEW */}
      <section
        className="w-full md:w-1/2 p-6 bg-gray-100 flex justify-center items-start overflow-y-auto"
        id="resume-preview"
      >
        <div className="w-full max-w-[800px] bg-white p-12 rounded-xl shadow-2xl print:shadow-none">
          <ResumePreview data={data} />
        </div>
      </section>
    </div>
  );
};

export default memo(CreativePhotoTemplate);
