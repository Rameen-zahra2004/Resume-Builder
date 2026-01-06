"use client";

import React, { memo, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import type {
  Resume,
  ResumeFormData,
  Experience,
  Education,
  Project,
} from "../../types/resume";

import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

import { ArrowLeft, Save, Download, Moon, Sun, RefreshCcw } from "lucide-react";
import { addResume, updateResume } from "../../store/redux/resumeSlice";
import type { AppDispatch } from "../../store/store";
import { useToast } from "../../component/ui/use-toast";

/* ---------- Props ---------- */
interface ProfessionalTemplatePageProps {
  resume?: Resume;
}

/* ---------- Default Resume Data ---------- */
const DEFAULT_RESUME: ResumeFormData = {
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

/* ---------- Skill Badge Colors ---------- */
const skillColors = [
  "bg-blue-100 text-blue-800",
  "bg-green-100 text-green-800",
  "bg-yellow-100 text-yellow-800",
  "bg-purple-100 text-purple-800",
  "bg-pink-100 text-pink-800",
];

/* ---------- Component ---------- */
const ProfessionalTemplatePage: React.FC<ProfessionalTemplatePageProps> = ({
  resume,
}) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const [resumeData, setResumeData] = useState<ResumeFormData>(
    resume?.data ?? DEFAULT_RESUME
  );
  const [darkMode, setDarkMode] = useState(false);
  const [initialData] = useState(resume?.data ?? DEFAULT_RESUME);
  const [isSaving, setIsSaving] = useState(false);

  /* ---------- Handlers ---------- */
  const handleSave = async () => {
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

      if (resume) {
        await dispatch(updateResume(payload)).unwrap();
        toast({
          title: "Saved",
          description: "Resume updated successfully",
          variant: "success",
        });
      } else {
        const newResume = await dispatch(addResume(payload)).unwrap();
        router.push(`/resume/${newResume.id}/edit`);
        toast({
          title: "Saved",
          description: "Resume created successfully",
          variant: "success",
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Save Failed",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setResumeData(initialData);
    toast({ title: "Reset", description: "All changes reverted" });
  };

  /* ---------- PDF Export ---------- */
  const handleExportPDF = async () => {
    const content = document.getElementById("resume-preview");
    if (!content) return;

    try {
      const clone = content.cloneNode(true) as HTMLElement;
      clone.style.backgroundColor = "#ffffff";
      clone.style.padding = "20px";
      clone.style.width = "800px";

      clone.querySelectorAll("*").forEach((el) => {
        const node = el as HTMLElement;
        node.style.boxShadow = "none";
        node.style.filter = "none";
        node.style.backgroundColor =
          node.style.backgroundColor || "transparent";
      });

      const wrapper = document.createElement("div");
      wrapper.style.position = "fixed";
      wrapper.style.left = "-9999px";
      wrapper.appendChild(clone);
      document.body.appendChild(wrapper);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("portrait", "pt", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resumeData.name || "resume"}.pdf`);

      document.body.removeChild(wrapper);
      toast({
        title: "PDF Exported",
        description: "Your resume has been exported successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "PDF Export Failed",
        description: "Something went wrong during export.",
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className={`${darkMode ? "dark" : ""} relative min-h-screen font-sans`}
    >
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#f5e8dc] shadow-md border-b border-gray-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center py-3 px-6 md:px-10">
          {/* Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>

          {/* Buttons */}
          <div className="flex gap-3 items-center">
            {/* Dark Mode */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="flex items-center gap-2 px-3 py-2 bg-white rounded-lg hover:bg-gray-100 transition"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium shadow-md transition disabled:opacity-50"
            >
              <Save size={16} /> {isSaving ? "Saving..." : "Save"}
            </button>

            {/* Reset */}
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-lg font-medium shadow-md transition"
            >
              <RefreshCcw size={16} /> Reset
            </button>

            {/* Export PDF */}
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-medium shadow-md transition"
            >
              <Download size={16} /> Export
            </button>
          </div>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="pt-24 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 px-4 md:px-10 pb-10">
        {/* ---------------- LEFT PANEL ---------------- */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <ResumeHeaderEditable data={resumeData} onChange={setResumeData} />

          {/* Summary */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Summary
            </h2>
            <textarea
              value={resumeData.summary}
              onChange={(e) =>
                setResumeData({ ...resumeData, summary: e.target.value })
              }
              placeholder="Write a concise professional summary..."
              rows={4}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-4 focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-gray-100 resize-none transition"
            />
          </section>

          {/* Skills */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {resumeData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    skillColors[idx % skillColors.length]
                  }`}
                >
                  {skill.name}
                </span>
              ))}
            </div>
            <ResumeSkillsView
              data={resumeData}
              onChange={setResumeData}
              maxSkills={20}
            />
          </section>

          {/* Experience */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Experience
            </h2>
            <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-4 pl-6">
              {resumeData.experience.map((exp: Experience, idx: number) => (
                <div key={idx} className="mb-6 relative">
                  <div className="absolute -left-3 top-1 w-6 h-6 bg-blue-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    {exp.position} @ {exp.company}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {exp.startDate} - {exp.endDate || "Present"}
                  </span>
                  <p className="mt-2 text-gray-600 dark:text-gray-200">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
            <ResumeExperienceView
              experience={resumeData.experience}
              onChange={(updated) =>
                setResumeData({ ...resumeData, experience: updated })
              }
            />
          </section>

          {/* Education */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Education
            </h2>
            <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-4 pl-6">
              {resumeData.education.map((edu: Education, idx: number) => (
                <div key={idx} className="mb-6 relative">
                  <div className="absolute -left-3 top-1 w-6 h-6 bg-purple-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    {edu.degree} @ {edu.institution}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {edu.startDate} - {edu.endDate || "Present"}
                  </span>
                  <p className="mt-2 text-gray-600 dark:text-gray-200">
                    {edu.description}
                  </p>
                </div>
              ))}
            </div>
            <ResumeEducation data={resumeData} onChange={setResumeData} />
          </section>

          {/* Projects */}
          <section className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
              Projects
            </h2>
            <div className="relative border-l-2 border-gray-300 dark:border-gray-600 ml-4 pl-6">
              {resumeData.projects.map((proj: Project, idx: number) => (
                <div key={idx} className="mb-6 relative">
                  <div className="absolute -left-3 top-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
                    {proj.name}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    {proj.startDate} - {proj.endDate || "Present"}
                  </span>
                  <p className="mt-2 text-gray-600 dark:text-gray-200">
                    {proj.description}
                  </p>
                </div>
              ))}
            </div>
            <ResumeProjects data={resumeData} onChange={setResumeData} />
          </section>
        </div>

        {/* ---------------- RIGHT PANEL ---------------- */}
        <div className="md:w-1/2 sticky top-24 h-fit">
          <div id="resume-preview">
            <ResumePreview data={resumeData} darkMode={darkMode} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default memo(ProfessionalTemplatePage);
