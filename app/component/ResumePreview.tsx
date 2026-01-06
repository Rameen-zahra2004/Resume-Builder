"use client";

import React, { memo } from "react";
import Image from "next/image";
import type {
  ResumeFormData,
  Experience,
  Education,
  Project,
  TemplateType,
} from "../types/resume";
import { MapPin, Mail, Phone } from "lucide-react";
import { Button } from "./ui/button";

interface ResumePreviewProps {
  data: ResumeFormData;
  template?: TemplateType;
  darkMode?: boolean;
  onSave?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  data,
  template = "classic",
  darkMode = false,
  onSave,
}) => {
  // ======================
  // Template Styles
  // ======================
  const TEMPLATE_CLASSES: Record<TemplateType, string> = {
    modern: "font-sans text-gray-900 bg-white",
    classic: "font-serif text-gray-900 bg-gray-50",
    minimal: "font-sans text-gray-800 bg-white border border-gray-200",
    elegant: "font-serif italic text-gray-900 bg-gray-50",
    "premium-elegant": "font-serif text-gray-900 bg-white shadow-xl",
    "creative-photo":
      "font-sans text-gray-900 bg-gradient-to-r from-pink-50 to-purple-50",
    "sidebar-bold":
      "font-sans text-gray-900 border-l-8 border-indigo-600 bg-white",
    "tech-grid":
      "font-mono text-gray-800 bg-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4",
    professional: "font-sans text-gray-900 bg-white shadow-md rounded-xl",
    corporate:
      "font-sans text-gray-900 bg-gray-50 border border-gray-300 rounded-lg",
  };

  const skillBg = darkMode
    ? "bg-blue-700 text-blue-100"
    : "bg-blue-100 text-blue-800";
  const cardBg = darkMode
    ? "bg-gray-800 border-gray-700"
    : "bg-white border border-gray-200";

  // ======================
  // Keep sectionTitle for future template styles
  // ======================
  const sectionTitle = "text-lg font-semibold text-blue-600 uppercase mb-2";
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _unusedSectionTitle = sectionTitle;

  // ======================
  // Render
  // ======================
  return (
    <div
      className={`shadow-2xl rounded-2xl p-8 max-w-full print:max-w-[900px] transition-all duration-300 ${TEMPLATE_CLASSES[template]}`}
    >
      {/* ======================
          Example template switch
          ====================== */}
      {template === "sidebar-bold" ? (
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/3 p-4 border-r border-gray-200">
            {data.photo && (
              <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-2 border-indigo-600">
                <Image
                  src={data.photo}
                  alt={data.name || "Profile"}
                  width={128}
                  height={128}
                />
              </div>
            )}
            <h1 className="text-xl font-bold mt-2">{data.name}</h1>
            <p className="text-sm text-gray-600">{data.title}</p>

            {/* Contact Info */}
            <div className="mt-3 text-sm space-y-1">
              {data.email && (
                <div className="flex items-center gap-1">
                  <Mail size={14} /> {data.email}
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-1">
                  <Phone size={14} /> {data.phone}
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-1">
                  <MapPin size={14} /> {data.location}
                </div>
              )}
            </div>

            {/* Skills */}
            {data.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className={`${skillBg} px-2 py-1 rounded text-sm`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div className="w-2/3 p-4 flex flex-col gap-4">
            {data.summary && <p>{data.summary}</p>}
            {data.experience?.map((exp: Experience, i) => (
              <div key={i} className={`${cardBg} p-3 rounded`}>
                <h3 className="font-semibold">
                  {exp.role} @ {exp.company}
                </h3>
                <p className="text-sm text-gray-500">
                  {exp.startDate} – {exp.endDate || "Present"}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        // Default layout
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column */}
          <div className="md:w-1/3 flex flex-col gap-6">
            {data.photo && (
              <div className="w-32 h-32 mx-auto md:mx-0 relative rounded-full overflow-hidden border-2 border-blue-600">
                <Image
                  src={data.photo}
                  alt={data.name || "Profile"}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="text-blue-600 font-semibold">{data.title}</p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm">
              {data.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} /> {data.email}
                </div>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} /> {data.phone}
                </div>
              )}
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} /> {data.location}
                </div>
              )}
            </div>

            {/* Skills */}
            {data.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {data.skills.map((s, i) => (
                  <span
                    key={i}
                    className={`${skillBg} px-2 py-1 rounded text-sm`}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="md:w-2/3 flex flex-col gap-6">
            {data.summary && <p>{data.summary}</p>}
            {data.experience?.map((exp: Experience, i) => (
              <div key={i} className={`${cardBg} p-3 rounded`}>
                <h3 className="font-semibold">
                  {exp.role} @ {exp.company}
                </h3>
                <p className="text-sm text-gray-500">
                  {exp.startDate} – {exp.endDate || "Present"}
                </p>
                <p>{exp.description}</p>
              </div>
            ))}
            {data.education?.map((edu: Education, i) => (
              <div key={i} className={`${cardBg} p-3 rounded`}>
                <h3 className="font-semibold">
                  {edu.degree} – {edu.institution}
                </h3>
                <p className="text-sm text-gray-500">
                  {edu.startDate} – {edu.endDate || "Present"}
                </p>
              </div>
            ))}
            {data.projects?.map((proj: Project, i) => (
              <div key={i} className={`${cardBg} p-3 rounded`}>
                <h3 className="font-semibold">{proj.name}</h3>
                <p>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Optional Save Button */}
      {onSave && (
        <div className="mt-4 flex justify-end">
          <Button size="lg" onClick={onSave}>
            Save Resume
          </Button>
        </div>
      )}
    </div>
  );
};

export default memo(ResumePreview);
