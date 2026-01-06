"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { Eye, ArrowRight } from "lucide-react";

import type { ResumeFormData, Experience } from "../types/resume";
import { setCurrentDraft } from "../store/redux/resumeSlice";
import { Button } from "../component/ui/button";

interface ResumeFormProps {
  data: ResumeFormData;
  onChange: (data: ResumeFormData) => void;
}

export default function ResumeForm({ data, onChange }: ResumeFormProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [newExperience, setNewExperience] = useState<Experience>({
    role: "",
    company: "",
    startMonth: "",
    startYear: "",
    endMonth: "",
    endYear: "",
    description: "",
  });

  const [newSkill, setNewSkill] = useState("");

  /* ================= VALIDATION ================= */
  const isFormValid =
    Boolean(data.name?.trim()) &&
    Boolean(data.title?.trim()) &&
    data.skills.length > 0;

  /* ================= HANDLERS ================= */
  const handlePreviewTemplates = () => {
    if (!isFormValid) return;

    setLoading(true);

    // ✅ Dispatch draft instead of full Resume
    dispatch(setCurrentDraft(data));

    router.push("/new-resume");
  };

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (data.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase()))
      return;

    onChange({
      ...data,
      skills: [...data.skills, { name: trimmed, level: 3 }],
    });
    setNewSkill("");
  };

  const removeSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  const addExperience = () => {
    if (!newExperience.role.trim()) return;

    onChange({
      ...data,
      experience: [...data.experience, newExperience],
    });

    setNewExperience({
      role: "",
      company: "",
      startMonth: "",
      startYear: "",
      endMonth: "",
      endYear: "",
      description: "",
    });
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updated = [...data.experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange({ ...data, experience: updated });
  };

  const removeExperience = (index: number) => {
    onChange({
      ...data,
      experience: data.experience.filter((_, i) => i !== index),
    });
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* BASIC INFO */}
      <input
        type="text"
        value={data.name || ""}
        onChange={(e) => onChange({ ...data, name: e.target.value })}
        placeholder="Full Name"
        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="text"
        value={data.title || ""}
        onChange={(e) => onChange({ ...data, title: e.target.value })}
        placeholder="Job Title"
        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        value={data.summary || ""}
        onChange={(e) => onChange({ ...data, summary: e.target.value })}
        placeholder="Professional Summary"
        rows={4}
        className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
      />

      {/* SKILLS */}
      <div>
        <h4 className="font-semibold mb-2">Skills</h4>
        <ul className="flex flex-wrap gap-2 mb-2">
          {data.skills.map((skill, idx) => (
            <li
              key={idx}
              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1"
            >
              {skill.name}
              <button
                type="button"
                onClick={() => removeSkill(idx)}
                className="text-red-500 font-bold"
              >
                &times;
              </button>
            </li>
          ))}
        </ul>

        <input
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill and press Enter"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addSkill(newSkill);
            }
          }}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {/* EXPERIENCE */}
      <div>
        <h4 className="font-semibold mb-2">Experience</h4>

        {data.experience.map((exp, idx) => (
          <div
            key={idx}
            className="border p-3 rounded mb-3 space-y-2 bg-gray-50 relative"
          >
            <button
              type="button"
              onClick={() => removeExperience(idx)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              &times;
            </button>

            <input
              placeholder="Role"
              value={exp.role}
              onChange={(e) => updateExperience(idx, "role", e.target.value)}
              className="border p-2 rounded w-full"
            />

            <input
              placeholder="Company"
              value={exp.company}
              onChange={(e) => updateExperience(idx, "company", e.target.value)}
              className="border p-2 rounded w-full"
            />

            <textarea
              placeholder="Description"
              value={exp.description}
              onChange={(e) =>
                updateExperience(idx, "description", e.target.value)
              }
              className="border p-2 rounded w-full"
            />
          </div>
        ))}

        <div className="border p-3 rounded space-y-2 bg-gray-50">
          <input
            placeholder="Role"
            value={newExperience.role}
            onChange={(e) =>
              setNewExperience({ ...newExperience, role: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <input
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="border p-2 rounded w-full"
          />

          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="border p-2 rounded w-full"
          />

          <button
            type="button"
            onClick={addExperience}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Experience
          </button>
        </div>
      </div>

      {/* PREVIEW BUTTON */}
      <div className="flex justify-end pt-8 border-t mt-10">
        <Button
          type="button"
          onClick={handlePreviewTemplates}
          disabled={!isFormValid || loading}
          className="
            flex items-center gap-2
            px-6 py-3
            rounded-xl
            bg-black text-white
            hover:bg-gray-900
            active:scale-95
            transition-all
            shadow-lg hover:shadow-xl
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          <Eye className="w-4 h-4" />
          <span className="font-semibold">
            {loading ? "Opening Templates..." : "Preview Templates"}
          </span>
          {!loading && <ArrowRight className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
