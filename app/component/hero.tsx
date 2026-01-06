"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Hero() {
  return (
    <header className="relative overflow-hidden bg-linear-to-b from-blue-50 to-white py-24 px-6">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-200 opacity-20 blur-3xl rounded-full"></div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-6xl font-extrabold leading-tight text-blue-900 drop-shadow-sm"
        >
          Build a Job-Winning Resume
          <span className="text-blue-600"> in Minutes</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-5 text-lg md:text-xl text-gray-700 max-w-2xl mx-auto"
        >
          AI-powered resume builder that instantly creates ATS-friendly,
          professionally designed resumes tailored for your dream job.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
        >
          <Link
            href="/dashboard"
            aria-label="Create your resume"
            className="inline-block mt-8 px-10 py-4 text-lg font-semibold bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
          >
            Create My Resume
          </Link>
        </motion.div>

        {/* Small Feature Highlights */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-600"
        >
          <div className="bg-white shadow-sm p-3 px-5 rounded-full border">
            🚀 AI-Powered Writer
          </div>
          <div className="bg-white shadow-sm p-3 px-5 rounded-full border">
            📄 ATS-Friendly Templates
          </div>
          <div className="bg-white shadow-sm p-3 px-5 rounded-full border">
            ⚡ One-Click Export
          </div>
        </motion.div>
      </div>
    </header>
  );
}
