"use client";

import React from "react";
import type { Resume, TemplateType } from "../types/resume";
import { getTemplateById } from "../templates";

interface Props {
  resume: Resume;
  templateId: TemplateType;
}

const TemplateRenderer: React.FC<Props> = ({ resume, templateId }) => {
  const template = getTemplateById(templateId);
  const Page = template.page;

  return <Page resume={resume} />;
};

export default TemplateRenderer;
