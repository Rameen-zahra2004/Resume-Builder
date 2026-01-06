// "use client";

// import { useParams } from "next/navigation";
// import { templates } from "../../data/template";
// import TemplateEditor from "../../component/TemplateEditor";

// export default function TemplatePage() {
//   const params = useParams();
//   const templateId = params.id;

//   const template = templates.find((t) => t.id === templateId);

//   if (!template) return <p className="p-6 text-red-500">Template not found</p>;

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <TemplateEditor template={template} />
//     </div>
//   );
// }
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  getTemplateById,
  TemplateId,
  TemplateDefinition,
} from "../../templates/index";
import { ThemeType } from "../../types/resume";
import { setCurrentResume } from "../../store/redux/resumeSlice";
import { Button } from "../../component/ui/button";
import { Spinner } from "../../component/ui/spinner";
import { ArrowLeft } from "lucide-react";

export default function TemplatePreviewPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const params = useParams();
  const templateId = params.templateId as TemplateId;

  const resume = useSelector((state: RootState) => state.resumes.currentResume);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTheme, setActiveTheme] = useState<ThemeType>(
    resume?.theme ?? "blue"
  );

  // Small loading delay for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [templateId, resume]);

  // Update resume theme in redux store
  const handleThemeChange = (theme: ThemeType) => {
    if (!resume) return;
    setActiveTheme(theme);
    dispatch(setCurrentResume({ ...resume, theme }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Spinner size={48} />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-700">
        <p className="text-xl font-semibold mb-4">No resume data available</p>
        <p>Please fill out your resume form first.</p>
        <Button className="mt-6" onClick={() => router.push("/")}>
          Back to Form
        </Button>
      </div>
    );
  }

  const template: TemplateDefinition = getTemplateById(templateId);
  const TemplateComponent = template.page;

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Header: Back Button + Template Name */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">{template.name}</h1>
        </div>

        {/* Theme Selector */}
        <div className="flex items-center gap-4">
          <span className="font-semibold">Theme:</span>
          {(["blue", "green", "red"] as ThemeType[]).map((t) => (
            <div
              key={t}
              onClick={() => handleThemeChange(t)}
              className={`
                w-8 h-8 rounded-full cursor-pointer border-2
                ${
                  activeTheme === t
                    ? "border-black scale-125"
                    : "border-gray-300"
                }
                ${
                  t === "blue"
                    ? "bg-blue-500"
                    : t === "green"
                    ? "bg-green-500"
                    : "bg-red-500"
                }
                transition-transform hover:scale-110
              `}
            />
          ))}
        </div>

        {/* Resume Preview Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-10">
          <TemplateComponent resume={{ ...resume, theme: activeTheme }} />
        </div>
      </div>
    </div>
  );
}
