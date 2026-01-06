"use client";

import React, { useMemo } from "react";
import { Experience } from "../types/resume";
import { Trash2, Plus } from "lucide-react";

interface ResumeExperienceViewProps {
  experience: Experience[];
  onChange?: (experience: Experience[]) => void;
  editable?: boolean;
  mode?: "edit" | "preview";
}

export default function ResumeExperienceView({
  experience,
  onChange,
  editable = true,
}: ResumeExperienceViewProps) {
  const months = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  const currentYear = new Date().getFullYear();
  const years = useMemo(
    () => Array.from({ length: 50 }, (_, i) => currentYear - i),
    [currentYear]
  );

  const handleChange = (
    index: number,
    field: keyof Experience,
    value: string | string[] | File[]
  ) => {
    if (!onChange) return;
    const updated = [...experience];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleAdd = () => {
    if (!onChange) return;
    onChange([
      ...experience,
      {
        role: "",
        company: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        description: "",
        achievements: [],
        skills: [],
        attachments: [],
      },
    ]);
  };

  const handleRemove = (index: number) => {
    if (!onChange) return;
    onChange(experience.filter((_, i) => i !== index));
  };

  if (!experience) return null;

  return (
    <div className="space-y-6">
      {experience.map((exp, idx) => (
        <div
          key={exp.id || idx}
          className="border rounded-xl p-4 bg-gray-50 relative shadow-sm hover:shadow-md transition"
        >
          {editable && (
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              aria-label={`Remove experience ${exp.role || ""} at ${
                exp.company || ""
              }`}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition"
            >
              <Trash2 size={20} />
            </button>
          )}

          {/* Role & Company */}
          <div className="flex flex-col sm:flex-row sm:gap-4 space-y-2 sm:space-y-0">
            <TextInput
              label="Role"
              placeholder="Role"
              value={exp.role}
              onChange={
                editable ? (val) => handleChange(idx, "role", val) : undefined
              }
            />
            <TextInput
              label="Company"
              placeholder="Company"
              value={exp.company}
              onChange={
                editable
                  ? (val) => handleChange(idx, "company", val)
                  : undefined
              }
            />
          </div>

          {/* Location */}
          <TextInput
            label="Location"
            placeholder="Location"
            value={exp.location || ""}
            onChange={
              editable ? (val) => handleChange(idx, "location", val) : undefined
            }
          />

          {/* Start & End Dates */}
          <div className="flex flex-col sm:flex-row sm:gap-4 mt-2">
            <SelectInput
              label="Start Month"
              value={exp.startMonth || ""}
              options={months}
              placeholder="Start Month"
              onChange={
                editable
                  ? (val) => handleChange(idx, "startMonth", val)
                  : undefined
              }
            />
            <SelectInput
              label="Start Year"
              value={exp.startYear || ""}
              options={years.map(String)}
              placeholder="Start Year"
              onChange={
                editable
                  ? (val) => handleChange(idx, "startYear", val)
                  : undefined
              }
            />
            <SelectInput
              label="End Month"
              value={exp.endMonth || ""}
              options={months}
              placeholder="End Month"
              onChange={
                editable
                  ? (val) => handleChange(idx, "endMonth", val)
                  : undefined
              }
            />
            <SelectInput
              label="End Year"
              value={exp.endYear || ""}
              options={["Present", ...years.map(String)]}
              placeholder="End Year"
              onChange={
                editable
                  ? (val) => handleChange(idx, "endYear", val)
                  : undefined
              }
            />
          </div>

          {/* Description */}
          <TextAreaInput
            label="Job Description"
            value={exp.description || ""}
            placeholder="Description"
            onChange={
              editable
                ? (val) => handleChange(idx, "description", val)
                : undefined
            }
          />

          {/* Achievements */}
          <TextArrayInput
            label="Achievements"
            values={exp.achievements || []}
            onChange={
              editable
                ? (vals) => handleChange(idx, "achievements", vals)
                : undefined
            }
          />

          {/* Skills */}
          <TextArrayInput
            label="Skills"
            values={exp.skills || []}
            onChange={
              editable ? (vals) => handleChange(idx, "skills", vals) : undefined
            }
          />

          {/* Attachments */}
          <FileInput
            label="Attachments"
            files={exp.attachments || []}
            onChange={
              editable
                ? (files) => handleChange(idx, "attachments", files)
                : undefined
            }
          />
        </div>
      ))}

      {editable && (
        <button
          type="button"
          onClick={handleAdd}
          className="w-full md:w-auto px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Experience
        </button>
      )}
    </div>
  );
}

/* =================== REUSABLE INPUTS =================== */

interface TextInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChange?: (val: string) => void;
}

function TextInput({ label, placeholder, value, onChange }: TextInputProps) {
  return (
    <div className="flex flex-col flex-1">
      <label className="sr-only">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base"
        readOnly={!onChange}
      />
    </div>
  );
}

interface TextAreaInputProps {
  label: string;
  value: string;
  placeholder?: string;
  onChange?: (val: string) => void;
}

function TextAreaInput({
  label,
  value,
  placeholder,
  onChange,
}: TextAreaInputProps) {
  return (
    <div className="mt-2">
      <label className="sr-only">{label}</label>
      <textarea
        value={value}
        placeholder={placeholder}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base resize-none"
        rows={3}
        readOnly={!onChange}
      />
    </div>
  );
}

interface TextArrayInputProps {
  label: string;
  values: string[];
  onChange?: (vals: string[]) => void;
}

function TextArrayInput({ label, values, onChange }: TextArrayInputProps) {
  const handleAdd = () => onChange?.([...values, ""]);
  const handleChange = (index: number, val: string) => {
    if (!onChange) return;
    const updated = [...values];
    updated[index] = val;
    onChange(updated);
  };
  const handleRemove = (index: number) => {
    if (!onChange) return;
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-2 space-y-2">
      <label className="sr-only">{label}</label>
      {values.map((val, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            type="text"
            value={val}
            placeholder={label}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="border rounded-lg p-2 flex-1 focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base"
          />
          <button
            type="button"
            onClick={() => handleRemove(idx)}
            className="text-red-500 hover:text-red-700 transition"
            aria-label={`Remove ${label} ${idx + 1}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-blue-500 hover:text-blue-700 transition flex items-center gap-1"
      >
        <Plus size={14} /> Add {label}
      </button>
    </div>
  );
}

interface SelectInputProps {
  label: string;
  placeholder?: string;
  value: string;
  options: string[];
  onChange?: (val: string) => void;
}

function SelectInput({
  label,
  value,
  options,
  placeholder,
  onChange,
}: SelectInputProps) {
  return (
    <div className="flex-1 flex flex-col mt-2">
      <label className="sr-only">{label}</label>
      <select
        value={value || ""}
        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base"
        aria-label={label}
        disabled={!onChange}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt, idx) => (
          <option key={idx} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

interface FileInputProps {
  label: string;
  files: File[];
  onChange?: (files: File[]) => void;
}

function FileInput({ label, files, onChange }: FileInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onChange?.(Array.from(e.target.files));
  };
  return (
    <div className="mt-2">
      <label className="sr-only">{label}</label>
      <input
        type="file"
        multiple
        onChange={handleChange}
        className="border rounded-lg p-2 w-full focus:ring-2 focus:ring-blue-400 transition text-sm md:text-base"
        aria-label={label}
      />
      {files.length > 0 && (
        <ul className="mt-1 text-sm text-gray-700">
          {files.map((f, idx) => (
            <li key={idx}>{f.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
