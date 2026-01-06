"use client";

import React, { memo } from "react";
import type { ResumeFormData, Project } from "../types/resume";
import { Trash2, ExternalLink, Plus } from "lucide-react";

interface Props {
  data: ResumeFormData;
  onChange?: (next: ResumeFormData) => void;
  mode?: "edit" | "preview";
}

const ResumeProjects: React.FC<Props> = ({ data, onChange, mode = "edit" }) => {
  const projectList = data.projects ?? [];

  const update = (
    projectIndex: number,
    key: keyof Project,
    value: string | string[]
  ) => {
    const updated = [...projectList];
    updated[projectIndex] = { ...updated[projectIndex], [key]: value };
    onChange?.({ ...data, projects: updated });
  };

  const addProject = () => {
    const newItem: Project = {
      name: "",
      role: "",
      techStack: [""],
      links: [""],
      description: "",
      attachments: [], // Redux-safe: only strings (URLs)
    };
    onChange?.({ ...data, projects: [...projectList, newItem] });
  };

  const removeProject = (index: number) => {
    const updated = projectList.filter((_, i) => i !== index);
    onChange?.({ ...data, projects: updated });
  };

  const addLink = (projectIndex: number) => {
    const updated = [...projectList];
    updated[projectIndex].links = [...(updated[projectIndex].links || []), ""];
    onChange?.({ ...data, projects: updated });
  };

  const updateLink = (
    projectIndex: number,
    linkIndex: number,
    value: string
  ) => {
    const updated = [...projectList];
    const links = updated[projectIndex].links || [];
    links[linkIndex] = value;
    updated[projectIndex].links = links;
    onChange?.({ ...data, projects: updated });
  };

  const removeLink = (projectIndex: number, linkIndex: number) => {
    const updated = [...projectList];
    const links = updated[projectIndex].links || [];
    links.splice(linkIndex, 1);
    updated[projectIndex].links = links;
    onChange?.({ ...data, projects: updated });
  };

  const addTech = (projectIndex: number) => {
    const updated = [...projectList];
    updated[projectIndex].techStack = [
      ...(updated[projectIndex].techStack || []),
      "",
    ];
    onChange?.({ ...data, projects: updated });
  };

  const updateTech = (
    projectIndex: number,
    techIndex: number,
    value: string
  ) => {
    const updated = [...projectList];
    const tech = updated[projectIndex].techStack || [];
    tech[techIndex] = value;
    updated[projectIndex].techStack = tech;
    onChange?.({ ...data, projects: updated });
  };

  const removeTech = (projectIndex: number, techIndex: number) => {
    const updated = [...projectList];
    const tech = updated[projectIndex].techStack || [];
    tech.splice(techIndex, 1);
    updated[projectIndex].techStack = tech;
    onChange?.({ ...data, projects: updated });
  };

  // ================== RENDER ==================
  return (
    <div className="space-y-8">
      {projectList.map((proj, index) => (
        <div
          key={index}
          className="relative border border-gray-200 rounded-2xl shadow-md p-6 bg-white hover:shadow-lg transition-all duration-300"
        >
          {mode === "edit" && (
            <>
              {/* Remove Project */}
              <button
                type="button"
                onClick={() => removeProject(index)}
                aria-label={`Remove project ${proj.name || index + 1}`}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-red-500 text-white rounded-full shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition-transform hover:scale-110"
              >
                <Trash2 size={20} />
              </button>

              {/* Project Name */}
              <input
                className="w-full border border-gray-300 p-3 rounded mb-2 font-semibold text-lg focus:ring-2 focus:ring-blue-300 transition"
                placeholder="Project Name"
                value={proj.name || ""}
                onChange={(e) => update(index, "name", e.target.value)}
              />

              {/* Role */}
              <input
                className="w-full border border-gray-300 p-2 rounded mb-3 italic text-gray-600 focus:ring-2 focus:ring-blue-300 transition"
                placeholder="Role / Position"
                value={proj.role || ""}
                onChange={(e) => update(index, "role", e.target.value)}
              />

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-3">
                {proj.techStack?.map((tech, techIndex) => (
                  <div key={techIndex} className="flex items-center gap-1">
                    <input
                      className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:ring-2 focus:ring-blue-300 transition"
                      placeholder="Tech (e.g., React)"
                      value={tech || ""}
                      onChange={(e) =>
                        updateTech(index, techIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeTech(index, techIndex)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove technology ${tech}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTech(index)}
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1"
                  aria-label="Add technology"
                >
                  <Plus size={14} /> Add Tech
                </button>
              </div>

              {/* Description */}
              <textarea
                className="w-full border p-3 rounded min-h-[100px] resize-none focus:ring-2 focus:ring-blue-300 transition mb-3"
                placeholder="Describe the project..."
                value={proj.description || ""}
                onChange={(e) => update(index, "description", e.target.value)}
                rows={4}
              />

              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-2">
                {proj.links?.map((link, linkIndex) => (
                  <div key={linkIndex} className="flex items-center gap-1">
                    <input
                      className="border border-gray-300 rounded-full px-3 py-1 text-sm focus:ring-2 focus:ring-blue-300 transition"
                      placeholder="GitHub / Demo link"
                      value={link || ""}
                      onChange={(e) =>
                        updateLink(index, linkIndex, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeLink(index, linkIndex)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Remove link ${linkIndex + 1}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addLink(index)}
                  className="flex items-center gap-1 text-blue-600 hover:underline text-sm mt-1"
                  aria-label="Add link"
                >
                  <Plus size={14} /> Add Link
                </button>
              </div>
            </>
          )}

          {mode === "preview" && (
            <>
              <h3 className="text-lg font-semibold mb-1">{proj.name}</h3>
              {proj.role && (
                <p className="italic text-gray-600 mb-2">{proj.role}</p>
              )}

              <div className="flex flex-wrap gap-2 mb-2">
                {proj.techStack?.map((tech, techIndex) => (
                  <span
                    key={techIndex}
                    className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {proj.description && (
                <p className="text-gray-700 mb-2">{proj.description}</p>
              )}

              <div className="flex flex-wrap gap-2 mt-2">
                {proj.links?.map(
                  (link, linkIndex) =>
                    link && (
                      <a
                        key={linkIndex}
                        href={
                          link.startsWith("http") ? link : `https://${link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs flex items-center gap-1 hover:bg-blue-200 transition"
                      >
                        <ExternalLink size={12} />{" "}
                        {linkIndex === 0 ? "Demo" : `Link ${linkIndex + 1}`}
                      </a>
                    )
                )}
              </div>
            </>
          )}
        </div>
      ))}

      {mode === "edit" && (
        <button
          type="button"
          onClick={addProject}
          className="w-full md:w-auto px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg transition hover:scale-105"
          aria-label="Add project"
        >
          + Add Project
        </button>
      )}
    </div>
  );
};

export default memo(ResumeProjects);
