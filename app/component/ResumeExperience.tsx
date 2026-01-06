"use client";

import React, { memo } from "react";
import type { ResumeFormData, Experience } from "../types/resume";
import { Trash2 } from "lucide-react";

interface ResumeExperienceProps {
  data: ResumeFormData;
  onChange?: (next: ResumeFormData) => void;
  mode?: "edit" | "preview"; // NEW: supports preview mode
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

const ResumeExperience: React.FC<ResumeExperienceProps> = ({
  data,
  onChange,
  mode = "edit",
}) => {
  const experienceList: Experience[] = data.experience ?? [];

  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    if (mode === "preview") return;
    const updated = [...experienceList];
    updated[index] = { ...updated[index], [field]: value };
    onChange?.({ ...data, experience: updated });
  };

  const handleAddExperience = () => {
    if (mode === "preview") return;
    const newItem: Experience = {
      id: Date.now(), // unique key for list
      role: "",
      company: "",
      startYear: "",
      endYear: "",
      description: "",
    };
    onChange?.({ ...data, experience: [...experienceList, newItem] });
  };

  const handleRemoveExperience = (index: number) => {
    if (mode === "preview") return;
    const updated = experienceList.filter((_, i) => i !== index);
    onChange?.({ ...data, experience: updated });
  };

  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold mb-4">Experience</h3>

      {experienceList.map((exp, index) => (
        <div
          key={exp.id}
          className="relative border border-gray-200 rounded-xl shadow-sm p-6 bg-white hover:shadow-md transition-shadow duration-200"
        >
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => handleRemoveExperience(index)}
              aria-label={`Remove experience ${index + 1}`}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform hover:scale-110"
            >
              <Trash2 size={20} />
            </button>
          )}

          {/* Role & Company */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <label
                htmlFor={`role-${exp.id}`}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Role
              </label>
              <input
                id={`role-${exp.id}`}
                type="text"
                placeholder="Frontend Developer"
                value={exp.role || ""}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                disabled={mode === "preview"}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-100"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor={`company-${exp.id}`}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Company
              </label>
              <input
                id={`company-${exp.id}`}
                type="text"
                placeholder="Company Name"
                value={exp.company || ""}
                onChange={(e) => handleChange(index, "company", e.target.value)}
                disabled={mode === "preview"}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex flex-col flex-1">
              <label
                htmlFor={`startYear-${exp.id}`}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Start Year
              </label>
              <select
                id={`startYear-${exp.id}`}
                aria-label="Start Year"
                value={exp.startYear || ""}
                onChange={(e) =>
                  handleChange(index, "startYear", e.target.value)
                }
                disabled={mode === "preview"}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-100"
              >
                <option value="">Start Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col flex-1">
              <label
                htmlFor={`endYear-${exp.id}`}
                className="text-sm font-medium text-gray-700 mb-1"
              >
                End Year
              </label>
              <select
                id={`endYear-${exp.id}`}
                aria-label="End Year"
                value={exp.endYear || ""}
                onChange={(e) => handleChange(index, "endYear", e.target.value)}
                disabled={mode === "preview"}
                className="border border-gray-300 p-3 rounded focus:ring-2 focus:ring-blue-300 transition disabled:bg-gray-100"
              >
                <option value="">End Year</option>
                <option value="Present">Present</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              htmlFor={`description-${exp.id}`}
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id={`description-${exp.id}`}
              placeholder="Describe your responsibilities and achievements..."
              value={exp.description || ""}
              onChange={(e) =>
                handleChange(index, "description", e.target.value)
              }
              disabled={mode === "preview"}
              className="w-full border p-3 rounded focus:ring-2 focus:ring-blue-300 transition resize-none disabled:bg-gray-100"
              rows={4}
            />
          </div>
        </div>
      ))}

      {mode === "edit" && (
        <button
          type="button"
          onClick={handleAddExperience}
          className="w-full md:w-auto px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg transition"
        >
          + Add Experience
        </button>
      )}
    </div>
  );
};

export default memo(ResumeExperience);
