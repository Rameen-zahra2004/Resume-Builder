"use client";

export default function ClassicPreview() {
  return (
    <div className="w-[220px] h-[310px] bg-[#fdfaf4] rounded-xl shadow-md border overflow-hidden">
      {/* Header */}
      <div className="bg-gray-700 h-12 w-full" />

      {/* Content */}
      <div className="p-3">
        {/* Name */}
        <div className="h-4 w-28 bg-gray-300 rounded mb-2" />
        <div className="h-3 w-20 bg-gray-200 rounded mb-4" />

        {/* Section 1 */}
        <div className="h-3 w-24 bg-gray-500 rounded mb-2" />
        <div className="space-y-2 mb-3">
          <div className="h-2.5 w-36 bg-gray-200 rounded" />
          <div className="h-2.5 w-32 bg-gray-200 rounded" />
          <div className="h-2.5 w-40 bg-gray-200 rounded" />
        </div>

        {/* Section 2 */}
        <div className="h-3 w-24 bg-gray-500 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-2.5 w-36 bg-gray-200 rounded" />
          <div className="h-2.5 w-30 bg-gray-200 rounded" />
          <div className="h-2.5 w-40 bg-gray-200 rounded" />
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-gray-700 mt-2 mb-2">
        Classic Template
      </p>
    </div>
  );
}
