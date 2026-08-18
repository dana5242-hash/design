import { useNavigate } from "react-router-dom";
import { Star, Calendar, Clock } from "lucide-react";
import type { Project } from "../../types";
import { Badge } from "../ui/Badge";
import { STATUS_LABEL, STATUS_TONE, formatDate } from "../../lib/status";
import { useAppStore } from "../../store/useAppStore";

export function ProjectListItem({ project }: { project: Project }) {
  const navigate = useNavigate();
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  const target = project.status === "completed" || project.aiBrief ? `/briefs/${project.id}` : `/briefs/${project.id}/edit`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(target)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") navigate(target);
      }}
      className="w-full text-left flex items-center gap-3 px-4 py-3.5 rounded-lg border border-gray-200 bg-white hover:border-brand-300 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-gray-900 truncate">{project.projectName}</span>
          <Badge tone={STATUS_TONE[project.status]}>{STATUS_LABEL[project.status]}</Badge>
          {project.designRequest.projectType && (
            <Badge tone="gray">{project.designRequest.projectType}</Badge>
          )}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 mt-1.5">
          <span className="inline-flex items-center gap-1">
            <Clock size={12} /> 수정 {formatDate(project.updatedAt)}
          </span>
          {project.deadline && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> 마감 {formatDate(project.deadline)}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(project.id);
        }}
        aria-label="즐겨찾기"
        className="p-1.5 rounded-full hover:bg-amber-50 shrink-0"
      >
        <Star
          size={18}
          className={project.favorite ? "fill-amber-400 text-amber-400" : "text-gray-300"}
        />
      </button>
    </div>
  );
}
