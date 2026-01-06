"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { TemplateType } from "../types/resume";
import { templateList } from "../data/allTemplate";

interface TemplateDefinition {
  id: string;
  type: TemplateType;
  name: string;
  preview?: string; // image path only
  description?: string;
}

type Props = {
  selected: TemplateType;
  onSelect: (templateType: TemplateType) => void;
};

export default function TemplateSelector({ selected, onSelect }: Props) {
  const [activeIndex, setActiveIndex] = useState(
    templateList.findIndex((t) => t.type === selected)
  );
  const listRef = useRef<HTMLDivElement>(null);

  // Focus the active item whenever activeIndex changes
  useEffect(() => {
    const listEl = listRef.current;
    if (listEl && activeIndex >= 0) {
      const activeEl = listEl.querySelector<HTMLDivElement>(
        `#template-${templateList[activeIndex].id}`
      );
      activeEl?.focus();
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
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
    <div className="flex justify-center gap-6 mt-8 flex-wrap max-w-5xl mx-auto">
      <div
        ref={listRef}
        role="listbox"
        aria-label="Choose resume template"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="flex flex-wrap gap-6 outline-none"
      >
        {templateList.map((t, index) => {
          const isSelected = selected === t.type;
          const isActive = index === activeIndex;

          return (
            <div
              key={t.id}
              id={`template-${t.id}`}
              role="option"
              aria-selected={isSelected ? true : false} // ✅ boolean is valid
              tabIndex={isActive ? 0 : -1}
              onClick={() => {
                setActiveIndex(index);
                onSelect(t.type);
              }}
              className={`cursor-pointer rounded-2xl border bg-white shadow-sm
                p-4 min-w-[150px] max-w-[200px] flex flex-col items-center
                transition-all duration-300
                ${
                  isSelected
                    ? "ring-2 ring-blue-500 shadow-xl border-blue-400"
                    : "hover:shadow-lg"
                }
                ${
                  isActive
                    ? "focus-visible:ring-2 focus-visible:ring-blue-400"
                    : ""
                }
              `}
            >
              <div className="w-full h-32 rounded-lg border bg-gray-50 flex items-center justify-center overflow-hidden relative">
                {t.preview ? (
                  <Image
                    src={t.preview}
                    alt={`${t.name} resume template preview`}
                    fill
                    style={{ objectFit: "cover" }}
                  />
                ) : (
                  <span className="text-gray-400 text-xs">Preview</span>
                )}
              </div>

              <p className="text-lg font-semibold text-gray-900 mt-3">
                {t.name}
              </p>

              {t.description && (
                <p className="text-sm text-gray-600 text-center mt-1 leading-snug">
                  {t.description}
                </p>
              )}

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
