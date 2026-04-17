"use client";

import { useState, useRef, useEffect } from "react";
import type { TemplateType, Resume } from "../types/resume";
import { templateList } from "../data/allTemplate";

/* =========================
   DUMMY RESUME (FIXED)
========================= */
const dummyResume: Resume = {
  id: 0,
  template: "modern",
  theme: "blue",
  title: "Preview Resume",
  updatedAt: new Date().toISOString(),
  data: {
    name: "John Doe",
    title: "Frontend Developer",
    summary: "Preview summary",
    skills: [{ name: "React" }, { name: "TypeScript" }],
    experience: [],
    projects: [],
    education: [],
  },
};

type Props = {
  selected: TemplateType;
  onSelect: (templateType: TemplateType) => void;
};

export default function TemplateSelector({ selected, onSelect }: Props) {
  const [activeIndex, setActiveIndex] = useState<number>(() => {
    const index = templateList.findIndex((t) => t.type === selected);
    return index >= 0 ? index : 0;
  });

  const listRef = useRef<HTMLDivElement>(null);

  /* =========================
     FOCUS ACTIVE ITEM
  ========================= */
  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) return;

    const activeTemplate = templateList[activeIndex];
    if (!activeTemplate) return;

    const activeEl = listEl.querySelector<HTMLDivElement>(
      `#template-${activeTemplate.id}`,
    );

    activeEl?.focus();
  }, [activeIndex]);

  /* =========================
     KEYBOARD NAVIGATION
  ========================= */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!templateList.length) return;

    let nextIndex = activeIndex;

    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (activeIndex + 1) % templateList.length;
        break;

      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault();
        nextIndex =
          (activeIndex - 1 + templateList.length) % templateList.length;
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        onSelect(templateList[activeIndex].type);
        return;

      default:
        return;
    }

    setActiveIndex(nextIndex);
  };

  return (
    <div className="flex justify-center mt-8">
      <div
        ref={listRef}
        role="listbox"
        aria-label="Choose resume template"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-6 outline-none max-w-6xl justify-center"
      >
        {templateList.map((t, index) => {
          const isSelected = selected === t.type;
          const isActive = index === activeIndex;

          const PreviewComponent = t.preview;

          return (
            <div
              key={t.id}
              id={`template-${t.id}`}
              role="option"
              aria-selected={Boolean(isSelected)}
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                setActiveIndex(index);
                onSelect(t.type);
              }}
              className={`cursor-pointer rounded-2xl border bg-white shadow-sm
                p-4 w-[220px] flex flex-col items-center
                transition-all duration-300
                ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-xl border-blue-400"
                    : "hover:shadow-lg"
                }
              `}
            >
              {/* =========================
                  PREVIEW (COMPONENT FIXED)
              ========================= */}
              <div className="w-full h-32 rounded-lg border bg-gray-50 overflow-hidden flex items-center justify-center">
                {PreviewComponent ? (
                  <div className="scale-[0.35] origin-top">
                    <PreviewComponent resume={dummyResume} />
                  </div>
                ) : (
                  <span className="text-gray-400 text-xs">No Preview</span>
                )}
              </div>

              {/* NAME */}
              <p className="text-lg font-semibold text-gray-900 mt-3 text-center">
                {t.name}
              </p>

              {/* DESCRIPTION */}
              {t.description && (
                <p className="text-sm text-gray-600 text-center mt-1 leading-snug">
                  {t.description}
                </p>
              )}

              {/* SELECTED BADGE */}
              {isSelected && (
                <div
                  aria-hidden="true"
                  className="mt-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium shadow"
                >
                  Selected
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
