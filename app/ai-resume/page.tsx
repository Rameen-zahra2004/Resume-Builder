"use client";

import { useState, useEffect } from "react";
import { saveAs } from "file-saver";
import { AnimatePresence, motion } from "framer-motion";
import ResumePreview from "../component/ResumePreview";
import type { ResumeFormData, Skill } from "../types/resume";

const SKILLS: Skill[] = [
  { name: "JavaScript" },
  { name: "TypeScript" },
  { name: "Python" },
  { name: "Java" },
  { name: "C++" },
  { name: "React" },
  { name: "Next.js" },
  { name: "Node.js" },
  { name: "Express" },
  { name: "Django" },
  { name: "HTML" },
  { name: "CSS" },
  { name: "TailwindCSS" },
  { name: "SQL" },
  { name: "MongoDB" },
];

type ResumeTemplate = "modern" | "classic";

interface Resume {
  id: number;
  title: string;
  data: ResumeFormData;
  template: ResumeTemplate;
  skills: Skill[];
  createdAt: string;
}

export default function AIResumePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<ResumeFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [title, setTitle] = useState("");
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const escapeRegex = (text: string) =>
    text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  // Load saved resumes
  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await fetch("http://localhost:3001/resumes?userId=1");
        if (!res.ok) return;
        const data = await res.json();
        setResumes(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchResumes();
  }, []);

  // Auto-detect skills
  useEffect(() => {
    if (!input) return;
    const detected = SKILLS.filter((skill) =>
      new RegExp(`\\b${escapeRegex(skill.name)}\\b`, "i").test(input)
    );
    setSelectedSkills(detected);
  }, [input]);

  // Auto-save draft
  useEffect(() => {
    const draft = localStorage.getItem("resumeDraft");
    if (draft) setInput(draft);
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeDraft", input);
  }, [input]);

  const generateAIResume = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          skills: selectedSkills.map((s) => s.name),
        }),
      });
      const data = await res.json();
      if (res.ok && data.output) {
        setOutput(data.output as ResumeFormData);
      } else {
        showToast(data.error || "AI generation failed");
      }
    } catch (err) {
      console.error(err);
      showToast("Error generating resume");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!title.trim() || !output) {
      showToast("Please generate the resume and enter a title");
      return;
    }
    try {
      const res = await fetch("http://localhost:3001/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          title,
          data: output,
          template,
          skills: selectedSkills,
          createdAt: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        const saved: Resume = await res.json();
        setResumes((prev) => [saved, ...prev]);
        showToast("Resume saved successfully!");
        setInput("");
        setOutput(null);
        setTitle("");
        setSelectedSkills([]);
        localStorage.removeItem("resumeDraft");
      } else {
        showToast("Failed to save resume");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving resume");
    }
  };

  const downloadResume = () => {
    if (!output) return;
    const blob = new Blob([JSON.stringify(output, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    saveAs(blob, `${title || "resume"}.json`);
    showToast("Resume downloaded!");
  };

  const toggleSkill = (skill: Skill) => {
    setSelectedSkills((prev) =>
      prev.some((s) => s.name === skill.name)
        ? prev.filter((s) => s.name !== skill.name)
        : [...prev, skill]
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <main className="min-h-screen bg-linear-to-r from-blue-50 to-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-5xl font-bold text-blue-700">
            AI Resume Builder
          </h1>
          <p className="text-gray-600 mt-2">
            Generate, preview, and save professional resumes easily
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel */}
          <section className="space-y-6">
            {/* Input */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <textarea
                className="w-full border rounded-lg p-3 h-40 focus:ring-2 focus:ring-blue-500 mt-4 outline-none"
                placeholder="Paste your resume or experience here..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <p className="text-sm text-gray-500 mt-1">
                {input.length} characters,{" "}
                {input.split(/\s+/).filter(Boolean).length} words
              </p>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
              <h2 className="text-xl font-semibold mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {SKILLS.map((skill) => (
                  <button
                    key={skill.name}
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1 rounded-full border flex items-center gap-1 transition-all duration-200 ${
                      selectedSkills.some((s) => s.name === skill.name)
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateAIResume}
              disabled={loading}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
            >
              {loading ? "Generating..." : "Generate AI Resume"}
            </button>
          </section>

          {/* Right Panel */}
          <section className="space-y-6">
            {output && (
              <>
                {/* Title & Template */}
                <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow space-y-4">
                  <input
                    className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                    placeholder="Enter resume title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <div className="flex gap-4">
                    {(["modern", "classic"] as ResumeTemplate[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTemplate(t)}
                        className={`w-24 text-center px-3 py-2 rounded-lg border transition focus:outline-none focus:ring-2 ${
                          template === t
                            ? "bg-blue-100 border-blue-600 text-blue-700"
                            : "bg-white border-gray-300 text-gray-700"
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <ResumePreview
                  data={output}
                  template={template}
                  onSave={saveResume}
                />

                <div className="mt-4 flex gap-4">
                  <button
                    onClick={downloadResume}
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                  >
                    Download JSON
                  </button>
                  <button
                    onClick={saveResume}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Save
                  </button>
                </div>
              </>
            )}

            {/* Saved Resumes */}
            {resumes.length > 0 && (
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow">
                <h2 className="text-xl font-semibold mb-4">Saved Resumes</h2>
                <ul className="space-y-3">
                  {resumes.map((r) => (
                    <li
                      key={r.id}
                      className="p-4 border rounded-lg flex justify-between items-center hover:shadow-sm transition"
                    >
                      <div>
                        <p className="font-medium">{r.title}</p>
                        {r.skills.length > 0 && (
                          <p className="text-sm text-gray-500">
                            Skills: {r.skills.map((s) => s.name).join(", ")}
                          </p>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        </div>

        {/* Toast */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg"
            >
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
