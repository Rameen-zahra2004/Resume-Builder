"use client";

import { Button } from "./ui/button";

interface ResumeSaveEditButtonsProps {
  isEditing: boolean;
  isSaving: boolean;
  onSave: () => void;
  onEdit: () => void;
  onExport: () => void;
  onReset: () => void;
}

export default function ResumeSaveEditButtons({
  isEditing,
  isSaving,
  onSave,
  onEdit,
  onExport,
  onReset,
}: ResumeSaveEditButtonsProps) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="lg" onClick={onSave} disabled={isSaving}>
        {isSaving ? "Saving..." : "Save"}
      </Button>

      <Button size="lg" variant="secondary" onClick={onEdit}>
        {isEditing ? "Editing..." : "Edit"}
      </Button>

      <Button size="lg" onClick={onExport}>
        Export PDF
      </Button>

      <Button size="lg" variant="destructive" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
