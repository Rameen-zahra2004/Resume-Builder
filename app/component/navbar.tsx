"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search } from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    if (!query.trim()) return;

    const q = query.toLowerCase();

    if (q.includes("modern")) {
      window.location.href = "/templates/modern";
    } else if (q.includes("classic")) {
      window.location.href = "/templates/classic";
    } else {
      alert("No template found. Try: modern, classic");
    }
  };

  return (
    <nav className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between">
        {/* Logo - Left */}
        <Link
          href="/"
          className="text-2xl md:text-3xl font-extrabold text-blue-700 tracking-tight"
        >
          ResumeBuilder
        </Link>

        {/* --- Search Bar (Centered on Desktop) --- */}
        <div className="hidden md:flex flex-1 justify-center px-8">
          <div className="relative w-72">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search templates..."
              aria-label="Search templates"
              className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleSearch}
              aria-label="Search"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        {/* Desktop Menu - Right */}
        <div className="hidden md:flex items-center space-x-10 text-gray-700">
          <Link href="/pricing" className="hover:text-blue-600 transition">
            Pricing
          </Link>

          <Link
            href="/login"
            className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition"
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-white shadow-inner"
          >
            <div className="px-6 py-4 space-y-4 text-gray-700">
              {/* Mobile Search */}
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search templates..."
                  aria-label="Search templates"
                  className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    handleSearch();
                    setOpen(false);
                  }}
                  aria-label="Search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 hover:text-blue-600"
                >
                  <Search size={18} />
                </button>
              </div>

              <Link
                href="/pricing"
                className="block hover:text-blue-600 transition"
                onClick={() => setOpen(false)}
              >
                Pricing
              </Link>

              <Link
                href="/login"
                className="block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-sm"
                onClick={() => setOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
