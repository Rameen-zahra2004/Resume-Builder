"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import { RootState, AppDispatch } from "@/app/store/store";
import type { Resume } from "@/app/types/resume";
import ResumePreview from "@/app/component/ResumePreview";
import { updateResume } from "@/app/store/redux/resumeSlice";
import { useToast } from "@/app/component/ui/use-toast";
import { Button } from "@/app/component/ui/button";

export default function ResumePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const resumeId = Number(params.id);

  const resume = useSelector((state: RootState) =>
    state.resumes.items.find((r) => r.id === resumeId),
  );

  const [resumeData, setResumeData] = useState<Resume | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (resume) setResumeData(resume);
  }, [resume]);

  if (!resumeData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Resume not found...</p>
      </div>
    );
  }

  /* =========================
     SAVE HANDLER (SAFE)
  ========================= */
  const handleSave = async () => {
    setIsSaving(true);

    try {
      await dispatch(updateResume(resumeData)).unwrap();

      toast({
        title: "Resume Saved",
        description: "Your resume has been successfully saved.",
        variant: "default",
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

  const handleBack = () => router.back();
  const handlePrint = () => window.print();

  const handleSubmit = () => {
    toast({
      title: "Resume Submitted",
      description: "Your resume has been finalized successfully.",
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 md:px-10">
      {/* HEADER */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
        <Button
          onClick={handleBack}
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md"
        >
          ← Back
        </Button>

        <div className="flex gap-3">
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

      {/* PREVIEW */}
      <div className="bg-white rounded-3xl shadow-2xl p-6 max-w-5xl mx-auto print:max-w-[900px]">
        <ResumePreview data={resumeData.data} />
      </div>
    </div>
  );
}
