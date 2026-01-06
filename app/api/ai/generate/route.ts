
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI only if API key exists
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

interface AIResumeRequest {
  input: string;
}

interface AIResumeOutput {
  summary: string;
  experience: string[];
  skills: string[];
}

export async function POST(req: Request) {
  try {
    const { input }: AIResumeRequest = await req.json();

    if (!input || !input.trim()) {
      return NextResponse.json(
        { error: "No input provided" },
        { status: 400 }
      );
    }

    let aiOutput: AIResumeOutput;

    if (openai) {
      // Production-ready AI prompt
      const prompt = `
      You are a professional resume writer. 
      Rewrite the following resume content professionally, optimize for ATS, 
      and return JSON with three fields: 
      summary (string), experience (array of bullet points), skills (array of skills). 
      Content: ${input}
      Return only valid JSON.
      `;

      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
      });

      const raw = completion.choices[0].message?.content || "";

      try {
        aiOutput = JSON.parse(raw);
      } catch (err) {
        console.warn("AI returned invalid JSON, fallback to default parsing", err);
        // Fallback if AI output is invalid
        aiOutput = {
          summary: raw.slice(0, 200) + "...",
          experience: input.split("\n").map((line) => `• ${line.trim()}`).filter(Boolean),
          skills: ["Skill 1", "Skill 2", "Skill 3"],
        };
      }
    } else {
      // Mock output if OpenAI key is missing
      aiOutput = {
        summary: `Professional summary for: ${input.slice(0, 50)}...`,
        experience: input.split("\n").map((line) => `• ${line.trim()} (optimized)`),
        skills: ["Skill 1", "Skill 2", "Skill 3"],
      };
    }

    return NextResponse.json({ output: aiOutput });
  } catch (err) {
    console.error("AI generation error:", err);
    return NextResponse.json(
      { error: "AI generation failed" },
      { status: 500 }
    );
  }
}
