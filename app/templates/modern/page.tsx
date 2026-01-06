"use client";

import React, { memo, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Download, RefreshCcw, Pencil } from "lucide-react";
import { jsPDF } from "jspdf";
import { useDispatch } from "react-redux";

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

/* ---------------- COLLAPSIBLE CARD ---------------- */
const CollapsibleCardComponent: React.FC<{
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}> = ({ title, isOpen, onToggle, children }) => (
  <div className="rounded-xl bg-white shadow p-5">
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex justify-between items-center font-semibold text-gray-800"
    >
      {title} <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && <div className="mt-4">{children}</div>}
  </div>
);

const CollapsibleCard = memo(CollapsibleCardComponent);
CollapsibleCard.displayName = "CollapsibleCard";

/* ---------------- MODERN TEMPLATE ---------------- */
interface ModernTemplateProps {
  resume?: Resume;
}

const ModernTemplate: React.FC<ModernTemplateProps> = ({ resume }) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const initialData = useMemo<ResumeFormData>(
    () => ({
      name: resume?.data.name ?? "",
      title: resume?.data.title ?? "",
      summary: resume?.data.summary ?? "",
      skills: resume?.data.skills ?? [],
      experience: resume?.data.experience ?? [],
      education: resume?.data.education ?? [],
      projects: resume?.data.projects ?? [],
      email: resume?.data.email ?? "",
      phone: resume?.data.phone ?? "",
      location: resume?.data.location ?? "",
      photo: resume?.data.photo ?? "",
    }),
    [resume]
  );

  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(!resume);
  const [open, setOpen] = useState({
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
  });

  /* ---------------- SAVE ---------------- */
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload: Resume = {
        id: resume?.id ?? Date.now(),
        template: "modern",
        theme: "blue",
        title: data.name || "Untitled Resume",
        data,
        updatedAt: new Date().toISOString(),
      };

      if (resume) {
        await dispatch(updateResume(payload)).unwrap();
      } else {
        const created = await dispatch(addResume(payload)).unwrap();
        router.replace(`/resume/${created.id}/edit`);
      }

      toast({ title: "Saved successfully", variant: "success" });
      setIsEditing(false);
    } catch {
      toast({
        title: "Save failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  /* ---------------- RESET ---------------- */
  const handleReset = () => {
    setData(initialData);
    toast({ title: "Reset", description: "All changes reverted" });
  };

  /* ---------------- EXPORT PDF ---------------- */
  const handleExportPDF = async () => {
    const preview = document.getElementById("resume-preview");
    if (!preview) return;

    const clone = preview.cloneNode(true) as HTMLElement;
    makePdfSafe(clone);

    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.appendChild(clone);
    document.body.appendChild(wrapper);

    const pdf = new jsPDF("p", "pt", "a4");
    await pdf.html(clone, {
      margin: 24,
      autoPaging: "text",
      html2canvas: { scale: 0.75, backgroundColor: "#ffffff" },
    });

    document.body.removeChild(wrapper);
    pdf.save(`${data.name || "resume"}.pdf`);
  };

  /* ---------------- RENDER ---------------- */
  return (
    <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 min-h-screen">
      {/* LEFT PANEL */}
      <div className="space-y-6">
        {/* HEADER BUTTONS */}
        <div className="flex justify-between bg-white p-4 rounded-xl shadow">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex gap-2">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-1"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
            {isEditing && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-1 disabled:opacity-50"
              >
                <Save size={16} /> Save
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-4 py-2 bg-red-600 text-white rounded flex items-center gap-1"
            >
              <RefreshCcw size={16} /> Reset
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-green-600 text-white rounded flex items-center gap-1"
            >
              <Download size={16} /> PDF
            </button>
          </div>
        </div>

        {/* HEADER */}
        <ResumeHeaderEditable data={data} onChange={setData} />

        {/* COLLAPSIBLE SECTIONS */}
        <CollapsibleCard
          title="Summary"
          isOpen={open.summary}
          onToggle={() => setOpen({ ...open, summary: !open.summary })}
        >
          <label htmlFor="summary" className="block font-semibold mb-1">
            Professional Summary
          </label>
          <textarea
            id="summary"
            className="w-full border p-3 rounded focus:ring-2 focus:ring-indigo-400 resize-none"
            rows={3}
            disabled={!isEditing}
            value={data.summary}
            onChange={(e) => setData({ ...data, summary: e.target.value })}
            placeholder="Briefly describe your professional background"
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Skills"
          isOpen={open.skills}
          onToggle={() => setOpen({ ...open, skills: !open.skills })}
        >
          <ResumeSkillsView data={data} onChange={setData} />
        </CollapsibleCard>

        <CollapsibleCard
          title="Experience"
          isOpen={open.experience}
          onToggle={() => setOpen({ ...open, experience: !open.experience })}
        >
          <ResumeExperienceView
            experience={data.experience}
            onChange={(experience) => setData({ ...data, experience })}
          />
        </CollapsibleCard>

        <CollapsibleCard
          title="Education"
          isOpen={open.education}
          onToggle={() => setOpen({ ...open, education: !open.education })}
        >
          <ResumeEducation data={data} onChange={setData} />
        </CollapsibleCard>

        <CollapsibleCard
          title="Projects"
          isOpen={open.projects}
          onToggle={() => setOpen({ ...open, projects: !open.projects })}
        >
          <ResumeProjects data={data} onChange={setData} />
        </CollapsibleCard>
      </div>

      {/* RIGHT PANEL: PREVIEW */}
      <div
        id="resume-preview"
        className="bg-white rounded-xl shadow p-6 sticky top-6 max-h-[90vh] overflow-auto"
      >
        <ResumePreview data={data} />
      </div>
    </div>
  );
};

export default memo(ModernTemplate);
