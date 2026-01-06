"use client";

import { useState } from "react";
import { saveAs } from "file-saver";

type ResumeTemplate = "modern" | "classic";

interface AIResumeOutput {
  summary: string;
  experience: string[];
  skills: string[];
}

export default function AItoolsPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<AIResumeOutput | null>(null);
  const [loading, setLoading] = useState(false);
  const [template, setTemplate] = useState<ResumeTemplate>("modern");
  const [title, setTitle] = useState("");

  const generateAIResume = async () => {
    if (!input) return;
    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
      });

      if (!res.ok) throw new Error("AI generation failed");

      const data = await res.json();
      setOutput(data.output);
    } catch (err) {
      console.error(err);
      alert("Failed to generate AI resume");
    } finally {
      setLoading(false);
    }
  };

  const saveResume = async () => {
    if (!output || !title) {
      alert("Enter a title and generate resume first");
      return;
    }

    try {
      const res = await fetch("http://localhost:3001/resumes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1,
          title,
          template,
          content: output,
          createdAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        alert("Resume saved successfully!");
        setTitle("");
        setInput("");
        setOutput(null);
      } else {
        alert("Failed to save resume");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving resume");
    }
  };

  const downloadResume = () => {
    if (!output || !title) return;

    const content = `
Title: ${title}
Template: ${template}

Summary:
${output.summary}

Experience:
${output.experience.join("\n")}

Skills:
${output.skills.join(", ")}
`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    saveAs(blob, `${title}.txt`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6 text-center">
          AI Resume Writer
        </h1>

        {/* Resume Input */}
        <div className="mb-4">
          <label htmlFor="resumeInput" className="block font-medium mb-2">
            Resume / Experience
          </label>
          <textarea
            id="resumeInput"
            className="w-full border rounded-lg p-3 h-40 mb-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Paste your resume or experience here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={generateAIResume}
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "Generate AI Resume"}
          </button>
        </div>

        {output && (
          <>
            {/* Resume Title */}
            <div className="mb-4">
              <label htmlFor="resumeTitle" className="block font-medium mb-2">
                Resume Title
              </label>
              <input
                id="resumeTitle"
                type="text"
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
                placeholder="Enter a title for your resume"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Template Selector */}
            <div className="mb-4">
              <label
                htmlFor="resumeTemplate"
                className="block font-medium mb-2"
              >
                Select Template
              </label>
              <select
                id="resumeTemplate"
                value={template}
                onChange={(e) => setTemplate(e.target.value as ResumeTemplate)}
                className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="modern">Modern</option>
                <option value="classic">Classic</option>
              </select>
            </div>

            {/* Preview */}
            <div className="mb-6 bg-white border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Summary</h2>
              <p>{output.summary}</p>

              <h2 className="text-xl font-semibold mt-4 mb-2">Experience</h2>
              <ul className="list-disc list-inside">
                {output.experience.map((exp, idx) => (
                  <li key={idx}>{exp}</li>
                ))}
              </ul>

              <h2 className="text-xl font-semibold mt-4 mb-2">Skills</h2>
              <p>{output.skills.join(", ")}</p>
            </div>

            {/* Save & Download */}
            <button
              onClick={saveResume}
              className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition mb-2"
            >
              Save Resume
            </button>

            <button
              onClick={downloadResume}
              className="bg-gray-600 text-white px-4 py-2 rounded w-full hover:bg-gray-700 transition"
            >
              Download Resume
            </button>
          </>
        )}
      </div>
    </div>
  );
}
