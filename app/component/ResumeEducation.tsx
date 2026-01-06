"use client";

import React, { useState } from "react";
import type { ResumeFormData, Education } from "../types/resume";
import { Trash2, Plus } from "lucide-react";

interface Props {
  data: ResumeFormData;
  onChange?: (next: ResumeFormData) => void;
  onSave?: (data: ResumeFormData) => void;
  onDelete?: () => void;
  mode?: "edit" | "preview"; // New prop to switch modes
}

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 50 }, (_, i) => currentYear - i);

const emptyEducation: Education = {
  degree: "",
  institution: "",
  fieldOfStudy: "",
  startDate: "",
  endDate: "",
  gpa: "",
  honors: [],
  courses: [],
  certifications: [],
  type: "Full-time",
  level: "Bachelor",
  description: "",
};

const ResumeEducation: React.FC<Props> = ({
  data,
  onChange,
  onSave,
  onDelete,
  mode = "edit",
}) => {
  const educationList = data.education ?? [];
  const [honorInputs, setHonorInputs] = useState<Record<number, string>>({});
  const [courseInputs, setCourseInputs] = useState<Record<number, string>>({});

  const commitChange = (education: Education[]) => {
    onChange?.({ ...data, education });
  };

  const updateField = (index: number, key: keyof Education, value: string) => {
    const updated = [...educationList];
    updated[index] = { ...updated[index], [key]: value };
    commitChange(updated);
  };

  const addEducation = () =>
    commitChange([...educationList, { ...emptyEducation }]);
  const removeEducation = (index: number) =>
    commitChange(educationList.filter((_, i) => i !== index));

  const addTag = (index: number, key: "honors" | "courses", value: string) => {
    if (!value.trim()) return;
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      [key]: [...(updated[index][key] ?? []), value],
    };
    commitChange(updated);
  };

  const removeTag = (
    index: number,
    key: "honors" | "courses" | "certifications",
    tagIndex: number
  ) => {
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      [key]: (updated[index][key] ?? []).filter((_, i) => i !== tagIndex),
    };
    commitChange(updated);
  };

  const handleCertFile = (index: number, file: File) => {
    const updated = [...educationList];
    updated[index] = {
      ...updated[index],
      certifications: [...(updated[index].certifications ?? []), file],
    };
    commitChange(updated);
  };

  return (
    <div className="space-y-6">
      {educationList.map((edu, index) => (
        <div
          key={index}
          className="relative border border-gray-200 rounded-xl p-6 bg-white shadow-sm"
        >
          {mode === "edit" && (
            <>
              {/* Remove Education */}
              <button
                type="button"
                onClick={() => removeEducation(index)}
                aria-label="Remove this education entry"
                title="Remove this education entry"
                className="absolute top-4 right-4 text-red-600 hover:text-red-700"
              >
                <Trash2 size={16} />
              </button>

              {/* Degree / Institution / Field */}
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor={`degree-${index}`}
                    className="text-sm font-medium"
                  >
                    Degree
                  </label>
                  <input
                    id={`degree-${index}`}
                    type="text"
                    placeholder="Bachelor of Science"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      updateField(index, "degree", e.target.value)
                    }
                    className="border p-3 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={`institution-${index}`}
                    className="text-sm font-medium"
                  >
                    Institution
                  </label>
                  <input
                    id={`institution-${index}`}
                    type="text"
                    placeholder="University Name"
                    value={edu.institution || ""}
                    onChange={(e) =>
                      updateField(index, "institution", e.target.value)
                    }
                    className="border p-3 rounded"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={`field-${index}`}
                    className="text-sm font-medium"
                  >
                    Field of Study
                  </label>
                  <input
                    id={`field-${index}`}
                    type="text"
                    placeholder="Computer Science"
                    value={edu.fieldOfStudy || ""}
                    onChange={(e) =>
                      updateField(index, "fieldOfStudy", e.target.value)
                    }
                    className="border p-3 rounded"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col">
                  <label
                    htmlFor={`start-${index}`}
                    className="text-sm font-medium"
                  >
                    Start Year
                  </label>
                  <select
                    id={`start-${index}`}
                    value={edu.startDate || ""}
                    onChange={(e) =>
                      updateField(index, "startDate", e.target.value)
                    }
                    className="border p-3 rounded"
                    aria-label={`Start year for education entry ${index + 1}`}
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor={`end-${index}`}
                    className="text-sm font-medium"
                  >
                    End Year
                  </label>
                  <select
                    id={`end-${index}`}
                    value={edu.endDate || ""}
                    onChange={(e) =>
                      updateField(index, "endDate", e.target.value)
                    }
                    className="border p-3 rounded"
                    aria-label={`End year for education entry ${index + 1}`}
                  >
                    <option value="">Select year</option>
                    <option value="Present">Present</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Certifications */}
              <div className="mb-4">
                <label className="text-sm font-medium">
                  Certifications / Documents
                </label>
                <div className="space-y-2 mt-1">
                  {(edu.certifications ?? []).map((cert, i) => {
                    const name = cert instanceof File ? cert.name : cert;
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-2 bg-purple-100 px-2 py-1 rounded"
                      >
                        {name}
                        <button
                          type="button"
                          onClick={() => removeTag(index, "certifications", i)}
                          aria-label={`Remove certification ${name}`}
                          title={`Remove certification ${name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    );
                  })}

                  <input
                    type="file"
                    accept=".pdf,.png,.jpg"
                    onChange={(e) =>
                      e.target.files && handleCertFile(index, e.target.files[0])
                    }
                    aria-label={`Upload certification for education entry ${
                      index + 1
                    }`}
                    title={`Upload certification for education entry ${
                      index + 1
                    }`}
                    className="border p-2 rounded"
                  />
                </div>
              </div>

              {/* Honors & Courses */}
              {(["honors", "courses"] as const).map((key) => (
                <div key={key} className="mb-4">
                  <label
                    htmlFor={`tag-${key}-${index}`}
                    className="text-sm font-medium capitalize"
                  >
                    {key}
                  </label>
                  <div className="flex gap-2 flex-wrap mt-1">
                    {(edu[key] ?? []).map((item, i) => (
                      <span
                        key={i}
                        className="bg-gray-100 px-2 py-1 rounded flex gap-1"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeTag(index, key, i)}
                          aria-label={`Remove ${key.slice(0, -1)} ${item}`}
                          title={`Remove ${key.slice(0, -1)} ${item}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      id={`tag-${key}-${index}`}
                      type="text"
                      placeholder={`Add ${key}`}
                      aria-label={`Add ${key}`}
                      title={`Add ${key}`}
                      value={
                        key === "honors"
                          ? honorInputs[index] || ""
                          : courseInputs[index] || ""
                      }
                      onChange={(e) => {
                        if (key === "honors")
                          setHonorInputs({
                            ...honorInputs,
                            [index]: e.target.value,
                          });
                        else
                          setCourseInputs({
                            ...courseInputs,
                            [index]: e.target.value,
                          });
                      }}
                      className="border p-2 rounded flex-1"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const value =
                          key === "honors"
                            ? honorInputs[index]
                            : courseInputs[index];
                        addTag(index, key, value || "");
                        if (key === "honors")
                          setHonorInputs({ ...honorInputs, [index]: "" });
                        else setCourseInputs({ ...courseInputs, [index]: "" });
                      }}
                      aria-label={`Add ${key}`}
                      title={`Add ${key}`}
                      className="bg-blue-600 text-white px-3 rounded flex items-center"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}

          {mode === "preview" && (
            <div>
              <h4 className="font-semibold">
                {edu.degree} in {edu.fieldOfStudy}
              </h4>
              <p className="italic text-gray-600">{edu.institution}</p>
              <p>
                {edu.startDate} - {edu.endDate}
              </p>
              {(edu.honors ?? []).length > 0 && (
                <p>Honors: {(edu.honors ?? []).join(", ")}</p>
              )}
              {(edu.courses ?? []).length > 0 && (
                <p>Courses: {(edu.courses ?? []).join(", ")}</p>
              )}
              {(edu.certifications ?? []).length > 0 && (
                <p>
                  Certifications:{" "}
                  {(edu.certifications ?? [])
                    .map((c) => (c instanceof File ? c.name : c))
                    .join(", ")}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Add Education */}
      {mode === "edit" && (
        <button
          type="button"
          onClick={addEducation}
          aria-label="Add new education entry"
          title="Add new education entry"
          className="px-5 py-3 bg-blue-600 text-white rounded-xl flex gap-2"
        >
          <Plus size={16} /> Add Education
        </button>
      )}

      {/* Actions */}
      {mode === "edit" && (onSave || onDelete) && (
        <div className="flex justify-end gap-3 mt-6">
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-5 py-2 border rounded text-red-600"
              aria-label="Delete all education entries"
              title="Delete all education entries"
            >
              Delete All
            </button>
          )}
          {onSave && (
            <button
              type="button"
              onClick={() => onSave(data)}
              className="px-5 py-2 bg-blue-600 text-white rounded"
              aria-label="Save education changes"
              title="Save education changes"
            >
              Save Changes
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeEducation;
