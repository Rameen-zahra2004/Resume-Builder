import React from "react";

export interface FormInputProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
}

export default function FormInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
  required = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium mb-1">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          className="p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      )}
    </div>
  );
}
