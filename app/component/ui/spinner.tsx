"use client";

import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl" | number; // numeric size allowed
  color?: string; // Tailwind color class
  className?: string;
  ariaLabel?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "border-gray-300 text-black",
  className = "",
  ariaLabel = "Loading",
}) => {
  // Determine width/height
  let sizeClass = "";
  if (typeof size === "string") {
    sizeClass =
      size === "sm"
        ? "w-4 h-4"
        : size === "md"
        ? "w-6 h-6"
        : size === "lg"
        ? "w-8 h-8"
        : "w-12 h-12"; // xl
  } else {
    sizeClass = `w-[${size}px] h-[${size}px]`;
  }

  return (
    <div
      role="status"
      aria-label={ariaLabel}
      className={`inline-block animate-spin rounded-full border-4 border-t-transparent ${sizeClass} ${color} ${className}`}
    />
  );
};
