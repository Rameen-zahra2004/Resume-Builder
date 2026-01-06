"use client";

import React, { useState, ChangeEvent } from "react";
import { ChevronDown } from "lucide-react";

interface CanvasToolbarProps {
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onSearch?: (query: string) => void;
}

export default function CanvasToolbar({
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onSearch,
}: CanvasToolbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch?.(value);
  };

  const toggleMenu = (menu: string) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  return (
    <div className="w-full bg-white shadow-md py-3 px-6 flex flex-col md:flex-row md:items-center justify-between">
      <nav className="flex items-center gap-6 text-gray-700 font-medium relative">
        <button type="button" className="hover:text-blue-600 transition">
          Home
        </button>

        {/* Templates Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu("templates")}
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            Templates <ChevronDown size={18} />
          </button>

          {openMenu === "templates" && (
            <div className="absolute top-8 left-0 bg-white shadow rounded-md py-2 w-40 z-50">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Modern
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Classic
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Elegant
              </button>
            </div>
          )}
        </div>

        {/* Services Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu("services")}
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            Services <ChevronDown size={18} />
          </button>

          {openMenu === "services" && (
            <div className="absolute top-8 left-0 bg-white shadow rounded-md py-2 w-44 z-50">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Resume Writing
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Cover Letter
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                LinkedIn Optimization
              </button>
            </div>
          )}
        </div>

        {/* Resume Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => toggleMenu("resume")}
            className="hover:text-blue-600 transition flex items-center gap-1"
          >
            Resume <ChevronDown size={18} />
          </button>

          {openMenu === "resume" && (
            <div className="absolute top-8 left-0 bg-white shadow rounded-md py-2 w-44 z-50">
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Create Resume
              </button>
              <button
                type="button"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Load Resume
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Right: Controls + Search */}
      <div className="flex items-center gap-2 mt-4 md:mt-0">
        <button
          type="button"
          onClick={onUndo}
          className="px-4 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Undo
        </button>
        <button
          type="button"
          onClick={onRedo}
          className="px-4 py-1 bg-gray-100 rounded hover:bg-gray-200 transition"
        >
          Redo
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onLoad}
          className="px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Load
        </button>

        {onSearch && (
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search..."
            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ml-2"
          />
        )}
      </div>
    </div>
  );
}
