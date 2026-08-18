import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, FileText, CheckCircle2, PenLine, Star, History } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { ProjectListItem } from "../components/brief/ProjectListItem";
import { formatDateTime } from "../lib/status";

function StatCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <Card className="flex items-center gap-3.5" padded>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${tone}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const projects = useAppStore((s) => s.projects);
  const createProject = useAppStore((s) => s.createProject);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const counts = useMemo(
    () => ({
      draft: projects.filter((p) => p.status === "draft").length,
      completed: projects.filter((p) => p.status === "completed").length,
      favorite: projects.filter((p) => p.favorite).length,
      total: projects.length,
    }),
    [projects]
  );

  const recentProjects = useMemo(
    () =>
      [...projects]
        .filter((p) => p.projectName.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 6),
    [projects, query]
  );

  const recentActivity = useMemo(
    () =>
      [...projects]
        .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
        .slice(0, 5),
    [projects]
  );

  const handleCreate = () => {
    const project = createProject("");
    navigate(`/briefs/${project.id}/edit`);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            현재 진행 중인 요청과 기존 브리프를 확인하고 새 작업을 시작하세요.
          </p>
        </div>
        <Button icon={<PlusCircle size={17} />} onClick={handleCreate}>
          새 디자인 브리프
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<FileText size={19} className="text-brand-600" />} label="전체 프로젝트" value={counts.total} tone="bg-brand-50" />
        <StatCard icon={<PenLine size={19} className="text-amber-600" />} label="작성 중" value={counts.draft} tone="bg-amber-50" />
        <StatCard icon={<CheckCircle2 size={19} className="text-emerald-600" />} label="완료" value={counts.completed} tone="bg-emerald-50" />
        <StatCard icon={<Star size={19} className="text-yellow-500" />} label="즐겨찾기" value={counts.favorite} tone="bg-yellow-50" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-gray-800">최근 프로젝트</h2>
            <div className="relative w-48 sm:w-64">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="프로젝트 검색"
                className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
            </div>
          </div>

          {recentProjects.length === 0 ? (
            <Card>
              <EmptyState
                icon={<FileText size={36} />}
                title={query ? "검색 결과가 없습니다" : "아직 프로젝트가 없습니다"}
                description={query ? "다른 검색어로 시도해 보세요." : "새 디자인 브리프를 만들어 첫 프로젝트를 시작해 보세요."}
                action={
                  !query && (
                    <Button size="sm" icon={<PlusCircle size={15} />} onClick={handleCreate}>
                      새 디자인 브리프 만들기
                    </Button>
                  )
                }
              />
            </Card>
          ) : (
            <div className="flex flex-col gap-2.5">
              {recentProjects.map((p) => (
                <ProjectListItem key={p.id} project={p} />
              ))}
            </div>
          )}

          {projects.length > 6 && (
            <Button variant="ghost" size="sm" className="self-start" onClick={() => navigate("/briefs")}>
              전체 브리프 보기 →
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-gray-800">최근 수정내역</h2>
          <Card padded={false}>
            {recentActivity.length === 0 ? (
              <div className="p-6">
                <EmptyState icon={<History size={30} />} title="수정 내역이 없습니다" />
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {recentActivity.map((p) => (
                  <li key={p.id} className="px-4 py-3">
                    <button
                      onClick={() => navigate(p.aiBrief ? `/briefs/${p.id}` : `/briefs/${p.id}/edit`)}
                      className="text-left w-full"
                    >
                      <p className="text-sm font-medium text-gray-800 truncate">{p.projectName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{formatDateTime(p.updatedAt)} 수정</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
