"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "../component/ui/button";

export default function PreviewTemplatesButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    router.push("/new-resume");
  };

  return (
    <div className="flex justify-end pt-6">
      <Button
        onClick={handleClick}
        disabled={loading}
        aria-label="Preview resume templates"
        className={`
          flex items-center gap-2
          px-6 py-3
          rounded-xl
          bg-black text-white
          hover:bg-gray-900
          active:scale-95
          transition-all
          shadow-lg hover:shadow-xl
          disabled:opacity-70
        `}
      >
        <Eye className="w-4 h-4" />

        <span className="font-semibold">
          {loading ? "Opening Templates..." : "Preview Templates"}
        </span>

        {!loading && <ArrowRight className="w-4 h-4" />}
      </Button>
    </div>
  );
}
