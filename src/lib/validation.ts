import type { DesignRequest } from "../types";

export interface FieldError {
  field: string;
  message: string;
}

export interface StepValidation {
  valid: boolean;
  errors: FieldError[];
}

export function validateStep1(projectName: string, dr: DesignRequest, deadline: string): StepValidation {
  const errors: FieldError[] = [];
  if (!projectName.trim()) errors.push({ field: "projectName", message: "프로젝트명을 입력해 주세요." });
  if (!dr.projectType) errors.push({ field: "projectType", message: "제작물 종류를 선택해 주세요." });
  if (!dr.usage.trim()) errors.push({ field: "usage", message: "사용처를 입력해 주세요." });
  if (!dr.target.trim()) errors.push({ field: "target", message: "타깃을 입력해 주세요." });
  if (!dr.purpose.trim()) errors.push({ field: "purpose", message: "제작 목적을 입력해 주세요." });
  if (!dr.size.trim()) errors.push({ field: "size", message: "사이즈(규격)를 입력해 주세요." });
  if (!deadline.trim()) errors.push({ field: "deadline", message: "마감일을 선택해 주세요." });
  return { valid: errors.length === 0, errors };
}

export function validateStep2(dr: DesignRequest): StepValidation {
  const errors: FieldError[] = [];
  if (dr.requiredTexts.length === 0) {
    errors.push({ field: "requiredTexts", message: "필수로 포함할 문구를 1개 이상 입력해 주세요." });
  }
  return { valid: errors.length === 0, errors };
}

export function validateStep3(dr: DesignRequest): StepValidation {
  const errors: FieldError[] = [];
  if (dr.mood.length === 0) {
    errors.push({ field: "mood", message: "원하는 분위기를 1개 이상 선택해 주세요." });
  }
  return { valid: errors.length === 0, errors };
}

export function validateStep4(): StepValidation {
  return { valid: true, errors: [] };
}
