"use client";

import Link from "next/link";
import { Cpu, FileText } from "lucide-react";
import { motion } from "framer-motion";
import type { TemplateType } from "../types/resume";

// Template list
const TEMPLATE_LIST: { id: TemplateType; name: string }[] = [
  { id: "modern", name: "Modern Template" },
  { id: "classic", name: "Classic Template" },

  { id: "minimal", name: "Minimal Template" },
  { id: "elegant", name: "Elegant Template" },
  { id: "premium-elegant", name: "Premium Elegant Template" },
  { id: "creative-photo", name: "Creative Photo Template" },

  { id: "sidebar-bold", name: "Sidebar Bold Template" },
  { id: "tech-grid", name: "TechGrid Template" },
  { id: "professional", name: "Professional Template" },
  { id: "corporate", name: "Corporate Template" },
];

export default function Features() {
  // Build the features array
  const features = [
    {
      title: "AI Resume Writer",
      description:
        "Rewrite your resume using intelligent job-optimized rewriting.",
      icon: <Cpu className="w-12 h-12 text-blue-600 mb-4" />,
      link: "/ai-resume",
    },

    ...TEMPLATE_LIST.map((t) => ({
      title: t.name,
      description: "ATS-friendly template — click to preview instantly.",
      icon: <FileText className="w-12 h-12 text-green-600 mb-4" />,
      link: `/templates/${t.id}`,
    })),
  ];

  return (
    <section className="py-24 bg-linear-to-b from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Title */}
        <h3 className="text-4xl md:text-5xl font-extrabold tracking-tight text-center mb-20 text-gray-900">
          Explore Tools & Templates
        </h3>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.07 }}
            >
              <Link
                href={feature.link}
                className="
                  group block p-8 rounded-3xl bg-white relative overflow-hidden
                  shadow-sm hover:shadow-2xl transition-all duration-300
                  border border-gray-100 hover:border-blue-200 hover:bg-linear-to-br
                  hover:from-white hover:to-blue-50
                "
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 bg-blue-200 blur-2xl transition-all" />

                {/* Icon */}
                <div className="flex justify-center mb-5">{feature.icon}</div>

                {/* Title */}
                <h4 className="text-lg md:text-xl font-semibold mb-3 text-gray-900 group-hover:text-blue-700 transition-colors">
                  {feature.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {feature.description}
                </p>

                {/* CTA */}
                <span className="text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More →
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
