"use client";

import React, { useState, memo } from "react";
import type { Resume, ResumeFormData } from "../../types/resume";

import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

import {
  ArrowLeft,
  Save,
  Download,
  User,
  Briefcase,
  BookOpen,
  Layout,
  Star,
  Edit,
  Eye,
} from "lucide-react";

/* ---------- Props ---------- */
interface TechGridTemplateProps {
  resume: Resume;
  onBack?: () => void;
  onSave?: (data: ResumeFormData) => void;
  onExportPDF?: (data: ResumeFormData) => void;
}

/* ---------- Safe fallback ---------- */
const EMPTY_DATA: ResumeFormData = {
  name: "Your Name",
  title: "Professional Title",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  email: "",
  phone: "",
  location: "",
  photo: "",
};

/* ---------- Section Card Component ---------- */
interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  isEditing: boolean;
  onToggleEdit: () => void;
  children: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  icon,
  isEditing,
  onToggleEdit,
  children,
}) => (
  <div className="bg-white rounded-3xl shadow-md p-6 hover:shadow-xl transition-all border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="text-blue-600">{icon}</div>
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <button
        type="button"
        onClick={onToggleEdit}
        className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition"
      >
        {isEditing ? <Eye size={18} /> : <Edit size={18} />}
        <span className="text-sm">{isEditing ? "Preview" : "Edit"}</span>
      </button>
    </div>
    {children}
  </div>
);

/* ---------- Main TechGrid Template Page ---------- */
const TechGridTemplatePage: React.FC<TechGridTemplateProps> = ({
  resume,
  onBack,
  onSave,
  onExportPDF,
}) => {
  const [resumeData, setResumeData] = useState<ResumeFormData>(
    resume?.data ?? EMPTY_DATA
  );

  // Track which sections are in edit mode
  const [editing, setEditing] = useState({
    header: true,
    summary: true,
    skills: true,
    experience: true,
    education: true,
    projects: true,
  });

  const toggleEdit = (section: keyof typeof editing) => {
    setEditing((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  /* ---------- Handlers ---------- */
  const handleSave = () => onSave?.(resumeData);
  const handleExport = () => onExportPDF?.(resumeData);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 md:p-10 max-w-7xl mx-auto">
      {/* LEFT PANEL: Form Sections */}
      <div className="md:w-1/2 flex flex-col gap-6">
        {/* Header Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack || (() => window.history.back())}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold transition"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
            >
              <Save size={16} /> Save
            </button>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* ---------- Sections ---------- */}
        <div className="flex flex-col gap-5">
          {/* Header */}
          <SectionCard
            title="Header"
            icon={<User size={24} />}
            isEditing={editing.header}
            onToggleEdit={() => toggleEdit("header")}
          >
            <ResumeHeaderEditable
              data={resumeData}
              onChange={setResumeData}
              mode={editing.header ? "edit" : "preview"}
            />
          </SectionCard>

          {/* Summary */}
          <SectionCard
            title="Summary"
            icon={<Star size={24} />}
            isEditing={editing.summary}
            onToggleEdit={() => toggleEdit("summary")}
          >
            <textarea
              value={resumeData.summary}
              onChange={(e) =>
                setResumeData({ ...resumeData, summary: e.target.value })
              }
              placeholder="Write your professional summary..."
              rows={4}
              readOnly={!editing.summary}
              className={`w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 resize-none transition ${
                editing.summary ? "" : "bg-gray-50 text-gray-500"
              }`}
            />
          </SectionCard>

          {/* Skills */}
          <SectionCard
            title="Skills"
            icon={<Layout size={24} />}
            isEditing={editing.skills}
            onToggleEdit={() => toggleEdit("skills")}
          >
            <ResumeSkillsView
              data={resumeData}
              onChange={setResumeData}
              mode={editing.skills ? "edit" : "preview"}
            />
          </SectionCard>

          {/* Experience */}
          <SectionCard
            title="Experience"
            icon={<Briefcase size={24} />}
            isEditing={editing.experience}
            onToggleEdit={() => toggleEdit("experience")}
          >
            <ResumeExperienceView
              experience={resumeData.experience}
              onChange={(experience) =>
                setResumeData({ ...resumeData, experience })
              }
              mode={editing.experience ? "edit" : "preview"}
            />
          </SectionCard>

          {/* Education */}
          <SectionCard
            title="Education"
            icon={<BookOpen size={24} />}
            isEditing={editing.education}
            onToggleEdit={() => toggleEdit("education")}
          >
            <ResumeEducation
              data={resumeData}
              onChange={setResumeData}
              mode={editing.education ? "edit" : "preview"}
            />
          </SectionCard>

          {/* Projects */}
          <SectionCard
            title="Projects"
            icon={<Layout size={24} />}
            isEditing={editing.projects}
            onToggleEdit={() => toggleEdit("projects")}
          >
            <ResumeProjects
              data={resumeData}
              onChange={setResumeData}
              mode={editing.projects ? "edit" : "preview"}
            />
          </SectionCard>
        </div>
      </div>

      {/* RIGHT PANEL: Live Preview */}
      <aside className="md:w-1/2 sticky top-6 h-fit">
        <ResumePreview data={resumeData} />
      </aside>
    </div>
  );
};

export default memo(TechGridTemplatePage);
