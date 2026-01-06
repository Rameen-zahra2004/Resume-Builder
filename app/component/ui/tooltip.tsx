"use client";

interface TooltipProps {
  id: string;
  text: string;
}

export default function Tooltip({ id, text }: TooltipProps) {
  return (
    <div
      id={id}
      role="tooltip"
      className="absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-gray-800 text-white text-sm px-3 py-1 rounded-lg shadow-lg pointer-events-none z-50"
    >
      {text}
    </div>
  );
}
