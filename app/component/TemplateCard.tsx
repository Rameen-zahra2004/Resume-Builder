"use client";

import Link from "next/link";
import { TemplateItem } from "../data/template";

interface Props {
  template: TemplateItem;
}

export default function TemplateCard({ template }: Props) {
  return (
    <article className="rounded-2xl border shadow-sm p-6 bg-white hover:shadow-md transition flex flex-col justify-between">
      {/* Optional Preview Placeholder */}
      <div
        className="h-64 flex items-center justify-center bg-gray-100 rounded-xl text-gray-400 font-semibold text-lg"
        aria-label={`${template.name} template preview`}
      >
        {template.name} Preview
      </div>

      {/* Template Name */}
      <h2 className="text-lg font-semibold mt-4">{template.name}</h2>

      {/* Action Button */}
      <div className="flex gap-2 mt-4 flex-wrap">
        <Link
          href={`/template/${template.id}`}
          className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm hover:bg-gray-900 transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
        >
          Preview
        </Link>
      </div>
    </article>
  );
}
