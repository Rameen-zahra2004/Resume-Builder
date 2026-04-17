"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/app/store/store";
import { Resume, TemplateType } from "@/app/types/resume";
import ResumePreview from "@/app/component/ResumePreview";
import { updateResume } from "@/app/store/redux/resumeSlice";
import { useToast } from "@/app/component/ui/use-toast";
import { Button } from "@/app/component/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/app/component/ui/Select";

// List of templates with user-friendly names
const TEMPLATE_LIST: { id: TemplateType; name: string }[] = [
  { id: "modern", name: "Modern Template" },
  { id: "classic", name: "Classic Template" },
  { id: "minimal", name: "Minimal Template" },
  { id: "elegant", name: "Elegant Template" },
  { id: "premium-elegant", name: "Premium Elegant Template" },
  { id: "creative-photo", name: "Creative Photo Template" },
  { id: "sidebar-bold", name: "Sidebar Bold Template" },
  { id: "tech-grid", name: "TechGrid Template" },
  { id: "professional", name: "Professional Template" },
  { id: "corporate", name: "Corporate Template" },
];

// Map templates to preview styles
const TEMPLATE_STYLES: Record<TemplateType, string> = {
  modern: "bg-white text-gray-900 font-sans",
  classic: "bg-gray-50 text-gray-900 font-serif",
  minimal: "bg-white text-gray-800 font-sans border border-gray-200",
  elegant: "bg-gray-50 text-gray-800 font-serif italic",
  "premium-elegant": "bg-white text-gray-900 font-serif shadow-xl",
  "creative-photo": "bg-gray-50 text-gray-900 font-sans",
  "sidebar-bold":
    "bg-white text-gray-900 font-sans border-l-8 border-indigo-600",
  "tech-grid": "bg-gray-50 text-gray-800 font-mono",
  professional: "bg-white text-gray-900 font-sans shadow-md",
  corporate: "bg-gray-50 text-gray-900 font-sans border border-gray-300",
};

export default function ResumePreviewPage() {
  const params = useParams(); // expects /resume/:id/preview
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const resumeId = Number(params.id);

  // Redux state
  const resume = useSelector((state: RootState) =>
    state.resumes.items.find((r) => r.id === resumeId),
  );

  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("classic");

  useEffect(() => {
    if (resume) {
      setResumeData(resume);
      setSelectedTemplate(resume.template || "classic");
    }
  }, [resume]);

  if (!resumeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Resume not found...</p>
      </div>
    );
  }

  // Save handler
  const handleSave = async () => {
    if (!resumeData) return;
    setIsSaving(true);
    try {
      const updatedResume = { ...resumeData, template: selectedTemplate };
      await dispatch(updateResume(updatedResume)).unwrap();
      setResumeData(updatedResume);
      toast({
        title: "Resume Saved",
        description: "Your resume has been successfully saved.",
        variant: "success",
      });
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

  const handleSubmit = () => {
    toast({
      title: "Resume Submitted",
      description: "Your resume has been finalized successfully.",
      variant: "success",
    });
  };

  const handleBack = () => router.back();
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-10">
      {/* Header */}
      <div className="sticky top-0 bg-gray-50 z-20 max-w-7xl mx-auto flex flex-wrap justify-between items-center mb-8 gap-3 py-4 px-2 shadow-sm rounded-lg">
        <Button
          onClick={handleBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md"
        >
          ← Back
        </Button>

        <div className="flex gap-3 flex-wrap items-center">
          {/* Template Selector */}
          <Select
            value={selectedTemplate}
            onValueChange={(val) => setSelectedTemplate(val as TemplateType)}
          >
            <SelectTrigger className="w-56">
              {TEMPLATE_LIST.find((t) => t.id === selectedTemplate)?.name ||
                "Select Template"}
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_LIST.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>

          <Button
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white shadow-md"
          >
            Print
          </Button>

          <Button
            onClick={handleSubmit}
            className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md"
          >
            Submit
          </Button>
        </div>
      </div>

      {/* Resume Preview */}
      <div
        className={`rounded-3xl shadow-2xl p-6 max-w-6xl mx-auto print:max-w-[900px] transition-all duration-300 ${TEMPLATE_STYLES[selectedTemplate]}`}
      >
        <ResumePreview data={resumeData.data} template={selectedTemplate} />
      </div>
    </div>
  );
}
