"use client";

import React, { memo } from "react";

interface SectionProps {
  /** Optional section heading */
  title?: string;

  /** Section content */
  children: React.ReactNode;

  /** Extra Tailwind classes or custom styles */
  className?: string;

  /** Optional HTML id for linking / anchors */
  id?: string;

  /** Optional divider line below the section */
  divider?: boolean;

  /** Optional role override (default: "region") */
  role?: React.AriaRole;
}

/**
 * Section component: reusable wrapper for resume sections.
 * Handles spacing, optional titles, dividers, and accessibility.
 */
const Section: React.FC<SectionProps> = ({
  title,
  children,
  className,
  id,
  divider = false,
  role = "region",
}) => {
  return (
    <section
      id={id}
      role={role}
      aria-labelledby={id ? `${id}-title` : undefined}
      className={`my-6 ${divider ? "border-b border-gray-200 pb-4" : ""} ${
        className ?? ""
      }`}
    >
      {title && (
        <h2
          id={id ? `${id}-title` : undefined}
          className="text-sm font-semibold uppercase text-gray-500 mb-2"
        >
          {title}
        </h2>
      )}

      <div className="space-y-2">{children}</div>
    </section>
  );
};

// Memoize to prevent unnecessary re-renders
export default memo(Section);
