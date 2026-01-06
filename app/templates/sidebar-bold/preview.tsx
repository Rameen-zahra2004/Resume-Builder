"use client";

export default function SidebarBoldPreview() {
  return (
    <div className="w-[220px] h-[310px] rounded-xl shadow-md flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-[#1e293b] p-3 space-y-2">
        <div className="h-4 w-16 bg-gray-400 rounded" />
        <div className="h-3 w-12 bg-gray-300 rounded" />
        <div className="h-2.5 w-16 bg-gray-500 rounded mt-2" />
      </div>

      {/* Content */}
      <div className="w-2/3 bg-white p-3 space-y-2">
        <div className="h-2.5 w-20 bg-gray-300 rounded mb-2" />
        <div className="h-2 w-16 bg-gray-200 rounded" />
        <div className="h-2 w-20 bg-gray-200 rounded" />
      </div>

      <p className="absolute bottom-2 w-full text-center text-sm font-semibold text-gray-700">
        Sidebar Bold
      </p>
    </div>
  );
}
