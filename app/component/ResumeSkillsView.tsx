"use client";

import React, { memo, useState, useRef, useMemo } from "react";
import type { ResumeFormData, Skill } from "../types/resume";

interface ResumeSkillsViewProps {
  data: ResumeFormData;
  onChange: (data: ResumeFormData) => void;
  maxSkills?: number;
  mode?: "edit" | "preview";
}

const DEFAULT_SKILLS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Express",
  "MongoDB",
  "SQL",
  "Python",
  "Java",
  "C#",
  "C++",
  "Git",
  "Tailwind CSS",
  "Redux",
  "GraphQL",
  "Docker",
  "AWS",
  "Figma",
  "UI/UX",
];

const ResumeSkillsView: React.FC<ResumeSkillsViewProps> = ({
  data,
  onChange,
  maxSkills = 20,
  mode = "edit",
}) => {
  const [inputValue, setInputValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const skills = useMemo(
    () => (data.skills || []).map((s) => s.name),
    [data.skills]
  );

  const filteredOptions = useMemo(() => {
    const value = inputValue.toLowerCase();
    return DEFAULT_SKILLS.filter(
      (skill) => skill.toLowerCase().includes(value) && !skills.includes(skill)
    );
  }, [inputValue, skills]);

  const addSkill = (skillName?: string) => {
    const value = (skillName ?? inputValue).trim();
    if (
      !value ||
      skills.includes(value) ||
      skills.length >= maxSkills ||
      mode === "preview"
    )
      return;

    const updatedSkills: Skill[] = [
      ...(data.skills || []),
      { name: value, level: 3 },
    ];
    onChange({ ...data, skills: updatedSkills });
    setInputValue("");
    setFocusedIndex(null);
  };

  const removeSkill = (index: number) => {
    if (mode === "preview") return;
    const updatedSkills = (data.skills || []).filter((_, i) => i !== index);
    onChange({ ...data, skills: updatedSkills });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!filteredOptions.length) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null || prev === filteredOptions.length - 1 ? 0 : prev + 1
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setFocusedIndex((prev) =>
          prev === null || prev === 0 ? filteredOptions.length - 1 : prev - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (focusedIndex !== null) addSkill(filteredOptions[focusedIndex]);
        else addSkill();
        break;
      case "Escape":
        setFocusedIndex(null);
        break;
    }
  };

  return (
    <section className="relative w-full max-w-md">
      {/* Selected skills */}
      <ul
        role="list"
        aria-label="Selected skills"
        className="flex flex-wrap gap-2 mb-3"
      >
        {(data.skills || []).map((skill, index) => (
          <SkillTag
            key={skill.name}
            skill={skill.name}
            onRemove={() => removeSkill(index)}
          />
        ))}
      </ul>

      {/* Input for adding skills */}
      {mode === "edit" && (
        <div className="flex gap-2">
          <input
            id="skill-input"
            ref={inputRef}
            type="text"
            value={inputValue}
            disabled={skills.length >= maxSkills}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              skills.length >= maxSkills ? "Skill limit reached" : "Add a skill"
            }
            role="combobox"
            aria-controls="skill-listbox"
            aria-expanded={filteredOptions.length > 0 ? "true" : "false"} // ✅ must be string
            aria-autocomplete="list"
            aria-activedescendant={
              focusedIndex !== null ? `skill-option-${focusedIndex}` : undefined
            }
            className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 transition"
          />
          <button
            type="button"
            onClick={() => addSkill()}
            disabled={skills.length >= maxSkills}
            className="bg-blue-600 text-white px-4 rounded disabled:bg-gray-400 hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
      )}

      {/* Skill suggestions */}
      {mode === "edit" && inputValue && filteredOptions.length > 0 && (
        <ul
          id="skill-listbox"
          role="listbox"
          aria-label="Skill suggestions"
          className="absolute z-10 mt-1 w-full bg-white border rounded shadow max-h-40 overflow-y-auto"
        >
          {filteredOptions.map((option, index) => (
            <li
              key={option}
              id={`skill-option-${index}`}
              role="option"
              tabIndex={-1}
              aria-selected={focusedIndex === index ? "true" : "false"} // ✅ string
              className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${
                focusedIndex === index ? "bg-blue-200 font-semibold" : ""
              }`}
              onClick={() => addSkill(option)}
              onMouseEnter={() => setFocusedIndex(index)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

interface SkillTagProps {
  skill: string;
  onRemove: () => void;
}

const SkillTag: React.FC<SkillTagProps> = ({ skill, onRemove }) => (
  <li className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
    <span>{skill}</span>
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Remove ${skill}`}
      className="bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition"
    >
      ✕
    </button>
  </li>
);

export default memo(ResumeSkillsView);
