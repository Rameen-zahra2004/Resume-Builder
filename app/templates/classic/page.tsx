"use client";

import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { addResume, updateResume } from "../../store/redux/resumeSlice";
import { createResume } from "../../types/resume";
import type { Resume, ResumeFormData, TemplateType } from "../../types/resume";
import type { AppDispatch } from "../../store/store";
import { useToast } from "../../component/ui/use-toast";

import ResumeSaveEditButtons from "../../component/ResumeButton";
import ResumeHeaderEditable from "../../component/ResumeHeader";
import ResumeSkillsView from "../../component/ResumeSkillsView";
import ResumeExperienceView from "../../component/ResumeExperienceView";
import ResumeEducation from "../../component/ResumeEducation";
import ResumeProjects from "../../component/ResumeProjects";
import ResumePreview from "../../component/ResumePreview";

interface ClassicPageProps {
  resume?: Resume;
  template?: TemplateType; // optional for new resumes
}

export default function ClassicPage({
  resume,
  template = "classic",
}: ClassicPageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ------------------ INITIAL DATA ------------------
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

  // ------------------ SAVE ------------------
  const handleSave = async (): Promise<void> => {
    setIsSaving(true);
    try {
      if (resume) {
        // Update existing resume
        await dispatch(updateResume({ ...resume, data })).unwrap();
      } else {
        // Create new resume
        const newResume = await dispatch(
          addResume(
            createResume(data, template, data.name || "Untitled Resume")
          )
        ).unwrap();
        router.push(`/resume/${newResume.id}/edit`);
      }
      toast({
        title: "Resume saved",
        description: "Your resume has been saved successfully.",
        variant: "success",
      });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        title: "Save failed",
        description: "Something went wrong while saving.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // ------------------ RESET ------------------
  const handleReset = (): void => {
    setData(initialData);
    toast({ title: "Changes reset" });
  };

  // ------------------ RENDER ------------------
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* LEFT SIDE – EDITOR */}
      <aside className="w-full md:w-1/2 p-6 space-y-6 bg-gray-50 overflow-y-auto">
        <h2 className="text-3xl font-bold text-gray-800">
          {resume ? "Edit Resume" : "New Resume"}
        </h2>

        <ResumeSaveEditButtons
          isEditing={isEditing}
          isSaving={isSaving}
          onSave={handleSave}
          onEdit={() => setIsEditing(true)}
          onExport={() => window.print()}
          onReset={handleReset}
        />

        <div className="p-6 bg-white rounded-xl shadow">
          <ResumeHeaderEditable data={data} onChange={setData} />
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <ResumeSkillsView data={data} onChange={setData} />
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <ResumeExperienceView
            experience={data.experience}
            onChange={(experience) => setData({ ...data, experience })}
          />
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <ResumeEducation data={data} onChange={setData} />
        </div>

        <div className="p-6 bg-white rounded-xl shadow">
          <ResumeProjects data={data} onChange={setData} />
        </div>
      </aside>

      {/* RIGHT SIDE – PREVIEW */}
      <section className="w-full md:w-1/2 p-6 bg-gray-100">
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-3xl font-bold mb-6 text-center">Live Preview</h2>
          <ResumePreview data={data} />
        </div>
      </section>
    </div>
  );
}
