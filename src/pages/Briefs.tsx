import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, FileText } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";
import { ProjectListItem } from "../components/brief/ProjectListItem";
import type { ProjectStatus } from "../types";

type FilterKey = "all" | ProjectStatus | "favorite";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "all", label: "전체" },
  { key: "draft", label: "작성 중" },
  { key: "completed", label: "완료" },
  { key: "archived", label: "보관" },
  { key: "favorite", label: "즐겨찾기" },
];

export default function Briefs() {
  const projects = useAppStore((s) => s.projects);
  const createProject = useAppStore((s) => s.createProject);
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return projects
      .filter((p) => {
        if (filter === "all") return true;
        if (filter === "favorite") return p.favorite;
        return p.status === filter;
      })
      .filter((p) => p.projectName.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1));
  }, [projects, filter, query]);

  const handleCreate = () => {
    const project = createProject("");
    navigate(`/briefs/${project.id}/edit`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Briefs</h1>
          <p className="text-sm text-gray-500 mt-1">전체 디자인 브리프를 확인하고 관리하세요.</p>
        </div>
        <Button icon={<PlusCircle size={17} />} onClick={handleCreate}>
          새 디자인 브리프
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === f.key ? "bg-brand-600 text-white" : "bg-white border border-gray-300 text-gray-600 hover:border-brand-300"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative sm:ml-auto sm:w-64">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="프로젝트 검색"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 bg-white"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<FileText size={36} />}
            title="브리프가 없습니다"
            description="조건에 맞는 프로젝트가 없어요. 필터를 변경하거나 새 브리프를 만들어 보세요."
            action={
              <Button size="sm" icon={<PlusCircle size={15} />} onClick={handleCreate}>
                새 디자인 브리프 만들기
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="flex flex-col gap-2.5">
          {filtered.map((p) => (
            <ProjectListItem key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  );
}
