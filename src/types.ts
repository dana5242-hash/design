export const PROJECT_TYPES = [
  "현수막",
  "배너",
  "신문광고",
  "SNS",
  "포스터",
  "영상",
  "쇼핑백",
  "브로슈어",
  "기타",
] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export type ProjectStatus = "draft" | "in_progress" | "completed" | "archived";

export type AnalysisLevel = "simple" | "normal" | "detailed";

export const MOOD_OPTIONS = [
  "모던하고 심플한",
  "고급스러운",
  "신뢰감 있는",
  "활기차고 젊은",
  "따뜻하고 친근한",
  "전문적이고 격식있는",
  "귀엽고 캐주얼한",
  "미니멀한",
] as const;

export const AVOID_OPTIONS = [
  "너무 화려한 컬러",
  "복잡한 레이아웃",
  "과도한 텍스트",
  "유치한 느낌",
  "촌스러운 느낌",
  "너무 딱딱한 느낌",
  "저작권 이슈 소지 이미지",
] as const;

export const BACKGROUND_OPTIONS = [
  "깨끗한 화이트 배경",
  "브랜드 컬러 배경",
  "사진/이미지 배경",
  "그라데이션 배경",
  "패턴/텍스처 배경",
] as const;

export const REQUIRED_ELEMENT_OPTIONS = [
  "로고",
  "메인 이미지",
  "행사/이벤트 날짜",
  "연락처",
  "홈페이지 URL",
  "QR코드",
  "지도/오시는길",
  "가격 정보",
] as const;

export interface ReferenceItem {
  id: string;
  type: "image" | "file" | "url" | "note";
  name: string;
  dataUrl?: string;
  url?: string;
  note?: string;
  addedAt: string;
}

export interface DesignRequest {
  projectType: ProjectType | "";
  size: string;
  usage: string;
  target: string;
  purpose: string;
  requiredTexts: string[];
  requiredElements: string[];
  priority: string[];
  mood: string[];
  avoidMood: string[];
  colorDirection: string;
  brandColors: string[];
  backgroundDirection: string;
  logoRequired: boolean;
  additionalRequest: string;
}

export interface ChecklistItem {
  id: string;
  label: string;
  done: boolean;
}

export interface AIBrief {
  projectSummary: string;
  designGoal: string;
  targetSummary: string;
  keyMessage: string;
  designDirection: string;
  layoutRecommendation: string;
  colorRecommendation: string;
  typographyRecommendation: string;
  imageDirection: string;
  avoidElements: string;
  searchKeywords: string[];
  checklist: ChecklistItem[];
  aiModel: string;
  analysisLevel: AnalysisLevel;
  generatedAt: string;
}

export interface Revision {
  id: string;
  version: number;
  changedContent: string;
  modifiedBy: string;
  modifiedAt: string;
}

export interface Project {
  id: string;
  projectName: string;
  creatorId: string;
  requestDate: string;
  deadline: string;
  status: ProjectStatus;
  favorite: boolean;
  currentStep: number;
  createdAt: string;
  updatedAt: string;
  designRequest: DesignRequest;
  references: ReferenceItem[];
  aiBrief: AIBrief | null;
  revisions: Revision[];
}

export interface UserProfile {
  userId: string;
  name: string;
  department: string;
  position: string;
  email: string;
  role: string;
}

export interface CompanySettings {
  companyName: string;
  brandColors: string[];
  logoDataUrl: string;
  designGuide: string;
}

export interface AISettings {
  defaultAnalysisLevel: AnalysisLevel;
  aiModelLabel: string;
}

export function emptyDesignRequest(): DesignRequest {
  return {
    projectType: "",
    size: "",
    usage: "",
    target: "",
    purpose: "",
    requiredTexts: [],
    requiredElements: [],
    priority: [],
    mood: [],
    avoidMood: [],
    colorDirection: "",
    brandColors: [],
    backgroundDirection: "",
    logoRequired: false,
    additionalRequest: "",
  };
}
