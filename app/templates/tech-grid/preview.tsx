"use client";

export default function TechGridPreview() {
  return (
    <div className="w-[220px] h-[310px] bg-white rounded-xl shadow-md border overflow-hidden p-3">
      {/* Header */}
      <div className="h-4 w-28 bg-gray-300 rounded mb-2" />
      <div className="h-3 w-20 bg-gray-200 rounded mb-4" />

      {/* Left Column */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
        <div className="h-2 w-full bg-gray-200 rounded" />
      </div>

      {/* Right Column */}
      <div className="space-y-2">
        <div className="h-2.5 w-36 bg-gray-300 rounded" />
        <div className="h-2 w-32 bg-gray-200 rounded" />
        <div className="h-2 w-36 bg-gray-200 rounded" />
      </div>

      <p className="text-center text-sm font-semibold text-gray-700 mt-2">
        Tech Grid
      </p>
    </div>
  );
}
