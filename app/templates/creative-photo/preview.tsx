"use client";

export default function CreativePhotoPreview() {
  return (
    <div className="w-[220px] h-[310px] bg-white rounded-xl shadow-md border overflow-hidden">
      {/* Photo Header */}
      <div className="flex justify-center mt-3 mb-3">
        <div className="h-16 w-16 bg-gray-300 rounded-full" />
      </div>

      <div className="p-3">
        <div className="h-3 w-24 bg-gray-300 rounded mb-2" />
        <div className="h-2 w-20 bg-gray-200 rounded mb-3" />

        {/* Sections */}
        <div className="h-2.5 w-28 bg-blue-300 rounded mb-2" />
        <div className="space-y-2 mb-3">
          <div className="h-2 w-32 bg-gray-200 rounded" />
          <div className="h-2 w-28 bg-gray-200 rounded" />
        </div>

        <div className="h-2.5 w-28 bg-blue-300 rounded mb-2" />
        <div className="space-y-2">
          <div className="h-2 w-32 bg-gray-200 rounded" />
          <div className="h-2 w-28 bg-gray-200 rounded" />
        </div>
      </div>

      <p className="text-center text-sm font-semibold text-blue-600 mt-2 mb-2">
        Creative Photo
      </p>
    </div>
  );
}
