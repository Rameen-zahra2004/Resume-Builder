"use client";

export default function ElegantPreview() {
  return (
    <div className="w-[220px] h-[310px] bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="p-3 space-y-2">
        <div className="h-5 w-32 bg-gray-400 rounded mb-1" />
        <div className="h-3 w-24 bg-gray-300 rounded mb-3" />

        <div className="h-2.5 w-28 bg-gray-500 rounded mb-1" />
        <div className="space-y-1 mb-3">
          <div className="h-2 w-32 bg-gray-300 rounded" />
          <div className="h-2 w-28 bg-gray-300 rounded" />
          <div className="h-2 w-36 bg-gray-300 rounded" />
        </div>

        <div className="h-2.5 w-28 bg-gray-500 rounded mb-1" />
        <div className="space-y-1">
          <div className="h-2 w-32 bg-gray-300 rounded" />
          <div className="h-2 w-28 bg-gray-300 rounded" />
          <div className="h-2 w-36 bg-gray-300 rounded" />
        </div>
      </div>
      <p className="text-center text-sm font-semibold text-gray-700 mt-3 mb-2">
        Elegant Template
      </p>
    </div>
  );
}
