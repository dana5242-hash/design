import type { Project } from "../types";
import { formatDate } from "./status";

export function buildBriefText(project: Project): string {
  const b = project.aiBrief;
  if (!b) return "";
  const dr = project.designRequest;
  const lines = [
    `[Design Brief] ${project.projectName}`,
    `제작물 종류: ${dr.projectType || "-"} / 마감일: ${formatDate(project.deadline)}`,
    "",
    "■ 프로젝트 개요",
    b.projectSummary,
    "",
    "■ 디자인 목표",
    b.designGoal,
    "",
    "■ 타깃 요약",
    b.targetSummary,
    "",
    "■ 핵심 메시지",
    b.keyMessage,
    "",
    "■ 디자인 방향",
    b.designDirection,
    "",
    "■ 레이아웃 제안",
    b.layoutRecommendation,
    "",
    "■ 컬러 제안",
    b.colorRecommendation,
    "",
    "■ 타이포그래피 제안",
    b.typographyRecommendation,
    "",
    "■ 이미지 방향",
    b.imageDirection,
    "",
    "■ 회피 요소",
    b.avoidElements,
    "",
    "■ 검색 키워드",
    b.searchKeywords.join(", "),
    "",
    "■ 체크리스트",
    ...b.checklist.map((c) => `- [${c.done ? "x" : " "}] ${c.label}`),
  ];
  return lines.join("\n");
}
