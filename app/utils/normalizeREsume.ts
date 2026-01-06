import type { ResumeFormData } from "../types/resume";

export function normalizeResume(
  data?: ResumeFormData
): Required<ResumeFormData> {
  return {
    name: data?.name ?? "",
    title: data?.title ?? "",
    summary: data?.summary ?? "",

    skills: data?.skills ?? [],
    experience: data?.experience ?? [],
    education: data?.education ?? [],
    projects: data?.projects ?? [],

    photo: data?.photo ?? "",
    email: data?.email ?? "",
    phone: data?.phone ?? "",
    location: data?.location ?? "",
  };
}
