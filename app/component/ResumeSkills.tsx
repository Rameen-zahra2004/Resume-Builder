"use client";

import { useState } from "react";
import type { ResumeFormData, Skill } from "../types/resume";

interface ResumeSkillsProps {
  data: ResumeFormData;
  onChange: (data: ResumeFormData) => void;
}

export default function ResumeSkills({ data, onChange }: ResumeSkillsProps) {
  const [newSkill, setNewSkill] = useState("");

  /* ---------------- Add Skill ---------------- */

  const handleAddSkill = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const alreadyExists = data.skills.some(
      (skill) => skill.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) return;

    const updatedSkills: Skill[] = [
      ...data.skills,
      { name: trimmed, level: 3 }, // sensible default
    ];

    onChange({ ...data, skills: updatedSkills });
    setNewSkill("");
  };

  /* ---------------- Remove Skill ---------------- */

  const handleRemoveSkill = (index: number) => {
    onChange({
      ...data,
      skills: data.skills.filter((_, i) => i !== index),
    });
  };

  /* ---------------- Update Skill Level ---------------- */

  const handleLevelChange = (index: number, level: number) => {
    const updatedSkills = data.skills.map((skill, i) =>
      i === index ? { ...skill, level } : skill
    );

    onChange({ ...data, skills: updatedSkills });
  };

  return (
    <section className="mb-6">
      <h3 className="font-semibold mb-3">Skills</h3>

      {/* ================= Skill List ================= */}
      <ul className="space-y-3 mb-4">
        {data.skills.map((skill, index) => {
          const sliderId = `skill-level-${index}`;

          return (
            <li
              key={index}
              className="p-3 bg-gray-100 rounded flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-medium">{skill.name}</span>

                <button
                  type="button"
                  onClick={() => handleRemoveSkill(index)}
                  aria-label={`Remove skill ${skill.name}`}
                  className="text-red-500 font-bold focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
                >
                  &times;
                </button>
              </div>

              {/* ✅ Properly associated label */}
              <label htmlFor={sliderId} className="text-sm text-gray-600">
                {skill.name} level: {skill.level ?? 3}
              </label>

              {/* ✅ Native range input — NO aria-valuemin/max/now */}
              <input
                id={sliderId}
                type="range"
                min={1}
                max={5}
                step={1}
                value={skill.level ?? 3}
                onChange={(e) =>
                  handleLevelChange(index, Number(e.target.value))
                }
                className="w-full accent-blue-500"
                title={`${skill.name} skill level`}
              />
            </li>
          );
        })}
      </ul>

      {/* ================= Add Skill ================= */}
      <div className="flex gap-2 items-center">
        <label htmlFor="new-skill" className="sr-only">
          Add a skill
        </label>

        <input
          id="new-skill"
          type="text"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          placeholder="Add a skill"
          className="border p-2 rounded flex-1 focus:ring-2 focus:ring-blue-400"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill(newSkill);
            }
          }}
        />

        <button
          type="button"
          onClick={() => handleAddSkill(newSkill)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Add
        </button>
      </div>
    </section>
  );
}
