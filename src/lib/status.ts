import type { ProjectStatus } from "../types";

export const STATUS_LABEL: Record<ProjectStatus, string> = {
  draft: "작성 중",
  in_progress: "검토 중",
  completed: "완료",
  archived: "보관",
};

export const STATUS_TONE: Record<ProjectStatus, "gray" | "brand" | "green" | "amber"> = {
  draft: "amber",
  in_progress: "brand",
  completed: "green",
  archived: "gray",
};

export function formatDate(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateTime(iso: string): string {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${formatDate(iso)} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
