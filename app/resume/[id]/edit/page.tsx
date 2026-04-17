"use client";

import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch } from "@/app/store/store";
import { updateResume } from "@/app/store/redux/resumeSlice";
import ResumeEditor from "@/app/component/ResumeEditor";

export default function EditResumePage() {
  const { id } = useParams();
  const resumeId = Number(id);

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const resume = useSelector((state: RootState) =>
    state.resumes.items.find((r) => r.id === resumeId),
  );

  if (!resume) return <p className="p-6">Resume not found</p>;

  // ✅ FIX: Convert ResumeFormData → Resume
  const handleSave = async (updatedData: typeof resume.data) => {
    const updatedResume = {
      ...resume,
      data: updatedData,
      updatedAt: new Date().toISOString(),
    };

    await dispatch(updateResume(updatedResume)).unwrap();
    router.push("/dashboard");
  };

  return <ResumeEditor key={resume.id} resume={resume} onSave={handleSave} />;
}
