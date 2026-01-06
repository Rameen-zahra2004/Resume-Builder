"use client";

import React, { useState } from "react";
import Image from "next/image";
import type { ResumeFormData } from "../types/resume";
import {
  MapPin as LocateIcon,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Camera,
} from "lucide-react";

export type HeaderTheme = "light" | "dark" | "professional";

type ThemeColors = {
  textPrimary: string;
  textSecondary: string;
  border: string;
  bg: string;
  bgMuted: string;
  ring: string;
  icon: string;
  link: string;
};

interface ResumeHeaderEditableProps {
  data: ResumeFormData;
  theme?: HeaderTheme;
  mode?: "edit" | "preview";
  onChange?: (data: ResumeFormData) => void;
}

export default function ResumeHeaderEditable({
  data,
  theme = "professional",
  mode = "edit",
  onChange,
}: ResumeHeaderEditableProps) {
  const [preview, setPreview] = useState<string | null>(data.photo || null);
  const [showContacts, setShowContacts] = useState(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.({ ...data, photo: url });
  };

  const themeColors: Record<HeaderTheme, ThemeColors> = {
    light: {
      textPrimary: "text-gray-900",
      textSecondary: "text-gray-600",
      border: "border-gray-300",
      bg: "bg-white",
      bgMuted: "bg-gray-50",
      ring: "focus:ring-blue-500",
      icon: "text-gray-400",
      link: "text-blue-600 hover:text-blue-700",
    },
    dark: {
      textPrimary: "text-gray-100",
      textSecondary: "text-gray-300",
      border: "border-gray-600",
      bg: "bg-gray-900",
      bgMuted: "bg-gray-800",
      ring: "focus:ring-blue-400",
      icon: "text-gray-400",
      link: "text-blue-400 hover:text-blue-300",
    },
    professional: {
      textPrimary: "text-slate-900",
      textSecondary: "text-slate-600",
      border: "border-slate-300",
      bg: "bg-white",
      bgMuted: "bg-slate-50",
      ring: "focus:ring-blue-600",
      icon: "text-slate-400",
      link: "text-blue-600 hover:text-blue-700",
    },
  };

  const c = themeColors[theme];

  return (
    <header
      className={`max-w-4xl mx-auto rounded-xl border ${c.border} ${c.bg} p-6 md:p-8 shadow-md`}
    >
      {/* PHOTO */}
      {mode === "edit" ? (
        <div className="flex justify-center">
          <div className="relative group">
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border shadow">
              {preview ? (
                <Image
                  src={preview}
                  alt={data.name || "Profile photo"}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full bg-gray-100 text-gray-400 text-sm">
                  No Photo
                </div>
              )}
            </div>

            <label
              htmlFor="photo"
              className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition rounded-full cursor-pointer"
              aria-label="Upload profile photo"
            >
              <Camera size={18} />
            </label>

            <input
              id="photo"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
            />
          </div>
        </div>
      ) : (
        preview && (
          <div className="flex justify-center mb-4">
            <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border shadow">
              <Image
                src={preview}
                alt={data.name || "Profile photo"}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        )
      )}

      {/* NAME & TITLE */}
      <div className="mt-6 text-center space-y-2">
        {mode === "edit" ? (
          <>
            <label htmlFor="name" className="sr-only">
              Full name
            </label>
            <input
              id="name"
              type="text"
              value={data.name || ""}
              onChange={(e) => onChange?.({ ...data, name: e.target.value })}
              placeholder="Your Name"
              className={`w-full text-center text-3xl md:text-4xl font-bold ${c.textPrimary} bg-transparent outline-none border-b ${c.border} pb-1 ${c.ring}`}
            />

            <label htmlFor="title" className="sr-only">
              Job title
            </label>
            <input
              id="title"
              type="text"
              value={data.title || ""}
              onChange={(e) => onChange?.({ ...data, title: e.target.value })}
              placeholder="Job Title"
              className={`w-full text-center text-lg md:text-xl ${c.textSecondary} bg-transparent outline-none border-b ${c.border} pb-1 ${c.ring}`}
            />
          </>
        ) : (
          <>
            <h1 className={`text-3xl md:text-4xl font-bold ${c.textPrimary}`}>
              {data.name}
            </h1>
            <h2 className={`text-lg md:text-xl ${c.textSecondary}`}>
              {data.title}
            </h2>
          </>
        )}
      </div>

      {/* SUMMARY */}
      {mode === "edit" ? (
        <div className="mt-6">
          <label htmlFor="summary" className="sr-only">
            Professional summary
          </label>
          <textarea
            id="summary"
            value={data.summary || ""}
            onChange={(e) => onChange?.({ ...data, summary: e.target.value })}
            placeholder="Professional summary"
            rows={3}
            className={`w-full rounded-lg border ${c.border} ${c.bgMuted} p-4 text-center text-sm md:text-base outline-none resize-none ${c.ring}`}
          />
        </div>
      ) : (
        data.summary && (
          <p
            className={`mt-6 text-center text-sm md:text-base ${c.textSecondary}`}
          >
            {data.summary}
          </p>
        )
      )}

      {/* CONTACT TOGGLE (MOBILE) */}
      {mode === "edit" && (
        <div className="mt-4 flex justify-end md:hidden">
          <button
            type="button"
            onClick={() => setShowContacts(!showContacts)}
            className={`flex items-center gap-1 text-sm font-medium ${c.link}`}
          >
            {showContacts ? "Hide contacts" : "Show contacts"}
            {showContacts ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      )}

      {/* CONTACTS */}
      {showContacts && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <ContactInput
            id="email"
            label="Email address"
            icon={<Mail size={16} className={c.icon} />}
            placeholder="Email"
            value={data.email || ""}
            onChange={(v) => onChange?.({ ...data, email: v })}
            colors={c}
            editable={mode === "edit"}
          />
          <ContactInput
            id="phone"
            label="Phone number"
            icon={<Phone size={16} className={c.icon} />}
            placeholder="Phone"
            value={data.phone || ""}
            onChange={(v) => onChange?.({ ...data, phone: v })}
            colors={c}
            editable={mode === "edit"}
          />
          <ContactInput
            id="location"
            label="Location"
            icon={<LocateIcon size={16} className={c.icon} />}
            placeholder="Location"
            value={data.location || ""}
            onChange={(v) => onChange?.({ ...data, location: v })}
            colors={c}
            editable={mode === "edit"}
          />
        </div>
      )}
    </header>
  );
}

/* ---------------- CONTACT INPUT ---------------- */
interface ContactInputProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  value: string;
  placeholder: string;
  onChange: (val: string) => void;
  colors: ThemeColors;
  editable?: boolean;
}

function ContactInput({
  id,
  label,
  icon,
  value,
  placeholder,
  onChange,
  colors,
  editable = true,
}: ContactInputProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-md border ${colors.border} ${colors.bgMuted} px-3 py-2 focus-within:ring-2 ${colors.ring}`}
    >
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      {icon}
      {editable ? (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
        />
      ) : (
        <span className="w-full text-sm text-gray-800">{value}</span>
      )}
    </div>
  );
}
