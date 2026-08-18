import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  Copy,
  Download,
  FileQuestion,
  Pencil,
  PencilOff,
  Plus,
  RefreshCw,
  Save,
  Share2,
  Sparkles,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { EmptyState } from "../components/ui/EmptyState";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { BriefSection } from "../components/brief/BriefSection";
import { useToast } from "../components/ui/ToastProvider";
import { STATUS_LABEL, formatDate, formatDateTime } from "../lib/status";
import { buildBriefText } from "../lib/briefText";
import { exportElementToPdf } from "../lib/pdf";
import { generateAIBrief } from "../lib/aiEngine";
import type { AIBrief, ProjectStatus } from "../types";

const STATUS_OPTIONS: ProjectStatus[] = ["draft", "in_progress", "completed", "archived"];

export default function BriefDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const project = useAppStore((s) => s.projects.find((p) => p.id === id));
  const updateProject = useAppStore((s) => s.updateProject);
  const addRevision = useAppStore((s) => s.addRevision);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const setStatus = useAppStore((s) => s.setStatus);

  const [editing, setEditing] = useState(false);
  const [regenerateOpen, setRegenerateOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [keywordDraft, setKeywordDraft] = useState("");
  const [checklistDraft, setChecklistDraft] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  if (!project) {
    return (
      <Card>
        <EmptyState
          icon={<FileQuestion size={36} />}
          title="프로젝트를 찾을 수 없습니다"
          action={
            <Button size="sm" onClick={() => navigate("/briefs")}>
              브리프 목록으로 이동
            </Button>
          }
        />
      </Card>
    );
  }

  if (!project.aiBrief) {
    return (
      <Card>
        <EmptyState
          icon={<Sparkles size={36} />}
          title="아직 생성된 브리프가 없습니다"
          description="입력한 내용을 바탕으로 AI 브리프를 먼저 생성해 주세요."
          action={
            <Button size="sm" onClick={() => navigate(`/briefs/${project.id}/edit`)}>
              브리프 만들러 가기
            </Button>
          }
        />
      </Card>
    );
  }

  const brief = project.aiBrief;

  const patchBrief = (patch: Partial<AIBrief>) => {
    updateProject(project.id, { aiBrief: { ...brief, ...patch } });
  };

  const handleSave = () => {
    addRevision(project.id, "브리프 직접 수정 저장");
    showToast("브리프가 저장되었습니다.", "success");
    setEditing(false);
  };

  const handleRegenerate = () => {
    const next = generateAIBrief(project.designRequest, brief.analysisLevel, Date.now());
    updateProject(project.id, { aiBrief: next });
    addRevision(project.id, "AI 브리프 재생성");
    setRegenerateOpen(false);
    showToast("브리프를 새로 생성했습니다.", "success");
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildBriefText(project));
      showToast("브리프 내용을 클립보드에 복사했습니다.", "success");
    } catch {
      showToast("복사에 실패했습니다. 브라우저 권한을 확인해 주세요.", "error");
    }
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      showToast("공유 링크를 클립보드에 복사했습니다.", "success");
    } catch {
      showToast("링크 복사에 실패했습니다.", "error");
    }
  };

  const handleExportPdf = async () => {
    if (!printRef.current) return;
    const wasEditing = editing;
    if (wasEditing) setEditing(false);
    setExporting(true);
    try {
      await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 60)));
      await exportElementToPdf(printRef.current, `${project.projectName || "design-brief"}.pdf`);
      showToast("PDF 파일을 다운로드했습니다.", "success");
    } catch (err) {
      console.error("PDF export failed:", err);
      showToast("PDF 생성 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.", "error");
    } finally {
      setExporting(false);
      if (wasEditing) setEditing(true);
    }
  };

  const toggleChecklistItem = (itemId: string) => {
    patchBrief({
      checklist: brief.checklist.map((c) => (c.id === itemId ? { ...c, done: !c.done } : c)),
    });
  };

  const removeChecklistItem = (itemId: string) => {
    patchBrief({ checklist: brief.checklist.filter((c) => c.id !== itemId) });
  };

  const addChecklistItem = () => {
    const label = checklistDraft.trim();
    if (!label) return;
    patchBrief({
      checklist: [...brief.checklist, { id: `chk_${Date.now()}`, label, done: false }],
    });
    setChecklistDraft("");
  };

  const addKeyword = () => {
    const kw = keywordDraft.trim();
    if (!kw || brief.searchKeywords.includes(kw)) {
      setKeywordDraft("");
      return;
    }
    patchBrief({ searchKeywords: [...brief.searchKeywords, kw] });
    setKeywordDraft("");
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/briefs")}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 no-print self-start"
      >
        <ArrowLeft size={15} /> 브리프 목록
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 no-print">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">{project.projectName}</h1>
            <button onClick={() => toggleFavorite(project.id)} aria-label="즐겨찾기" className="shrink-0">
              <Star size={20} className={project.favorite ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap mt-2">
            <select
              value={project.status}
              onChange={(e) => setStatus(project.id, e.target.value as ProjectStatus)}
              className="text-xs font-medium rounded-full border-0 px-2.5 py-1 bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABEL[s]}
                </option>
              ))}
            </select>
            {project.designRequest.projectType && <Badge tone="gray">{project.designRequest.projectType}</Badge>}
            <span className="text-xs text-gray-400">마감 {formatDate(project.deadline)}</span>
            <span className="text-xs text-gray-400">· 수정 {formatDateTime(project.updatedAt)}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {editing ? (
            <Button variant="secondary" size="sm" icon={<PencilOff size={14} />} onClick={() => setEditing(false)}>
              편집 종료
            </Button>
          ) : (
            <Button variant="secondary" size="sm" icon={<Pencil size={14} />} onClick={() => setEditing(true)}>
              편집
            </Button>
          )}
          {editing && (
            <Button size="sm" icon={<Save size={14} />} onClick={handleSave}>
              저장
            </Button>
          )}
          <Button variant="secondary" size="sm" icon={<RefreshCw size={14} />} onClick={() => setRegenerateOpen(true)}>
            재생성
          </Button>
          <Button variant="secondary" size="sm" icon={<Copy size={14} />} onClick={handleCopy}>
            복사
          </Button>
          <Button variant="secondary" size="sm" icon={<Share2 size={14} />} onClick={handleShare}>
            공유
          </Button>
          <Button size="sm" icon={<Download size={14} />} onClick={handleExportPdf} disabled={exporting}>
            {exporting ? "생성 중..." : "PDF"}
          </Button>
        </div>
      </div>

      <div ref={printRef} className="bg-white">
        <Card padded={false} className="overflow-hidden">
          <div className="px-5 sm:px-8 py-6 bg-brand-600 text-white">
            <p className="text-xs uppercase tracking-widest text-brand-100">Design Brief Report</p>
            <h2 className="text-lg sm:text-xl font-semibold mt-1">{project.projectName}</h2>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-brand-100 mt-3">
              <span>제작물: {project.designRequest.projectType || "-"}</span>
              <span>사이즈: {project.designRequest.size || "-"}</span>
              <span>마감일: {formatDate(project.deadline)}</span>
              <span>생성: {formatDateTime(brief.generatedAt)}</span>
            </div>
          </div>

          <div className="px-5 sm:px-8 py-2">
            <BriefSection label="프로젝트 개요" value={brief.projectSummary} editing={editing} onChange={(v) => patchBrief({ projectSummary: v })} />
            <BriefSection label="디자인 목표" value={brief.designGoal} editing={editing} onChange={(v) => patchBrief({ designGoal: v })} />
            <BriefSection label="타깃 요약" value={brief.targetSummary} editing={editing} onChange={(v) => patchBrief({ targetSummary: v })} />
            <BriefSection label="핵심 메시지" value={brief.keyMessage} editing={editing} onChange={(v) => patchBrief({ keyMessage: v })} />
            <BriefSection label="디자인 방향" value={brief.designDirection} editing={editing} onChange={(v) => patchBrief({ designDirection: v })} />
            <BriefSection label="레이아웃 제안" value={brief.layoutRecommendation} editing={editing} onChange={(v) => patchBrief({ layoutRecommendation: v })} />
            <BriefSection label="컬러 제안" value={brief.colorRecommendation} editing={editing} onChange={(v) => patchBrief({ colorRecommendation: v })} />
            <BriefSection label="타이포그래피 제안" value={brief.typographyRecommendation} editing={editing} onChange={(v) => patchBrief({ typographyRecommendation: v })} />
            <BriefSection label="이미지 방향" value={brief.imageDirection} editing={editing} onChange={(v) => patchBrief({ imageDirection: v })} />
            <BriefSection label="회피 요소" value={brief.avoidElements} editing={editing} onChange={(v) => patchBrief({ avoidElements: v })} />

            <div className="py-3.5 border-b border-gray-100">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">검색 키워드</p>
              <div className="flex flex-wrap gap-2">
                {brief.searchKeywords.map((kw) => (
                  <span key={kw} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full bg-brand-50 text-brand-700 text-xs">
                    {kw}
                    {editing && (
                      <button
                        onClick={() => patchBrief({ searchKeywords: brief.searchKeywords.filter((k) => k !== kw) })}
                        className="p-0.5 rounded-full hover:bg-brand-100 no-print"
                        aria-label="키워드 삭제"
                      >
                        <X size={11} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2 mt-2 no-print">
                  <input
                    value={keywordDraft}
                    onChange={(e) => setKeywordDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addKeyword();
                      }
                    }}
                    placeholder="키워드 추가"
                    className="flex-1 text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                  />
                  <Button variant="secondary" size="sm" icon={<Plus size={13} />} onClick={addKeyword}>
                    추가
                  </Button>
                </div>
              )}
            </div>

            <div className="py-3.5">
              <p className="text-xs font-semibold text-brand-600 uppercase tracking-wide mb-2">체크리스트</p>
              <ul className="flex flex-col gap-1.5">
                {brief.checklist.map((item) => (
                  <li key={item.id} className="flex items-center gap-2.5 group">
                    <button
                      onClick={() => toggleChecklistItem(item.id)}
                      className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                        item.done ? "bg-brand-600 border-brand-600 text-white" : "border-gray-300 text-transparent"
                      }`}
                      aria-label="완료 표시"
                    >
                      <Check size={13} />
                    </button>
                    <span className={`text-sm flex-1 ${item.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
                      {item.label}
                    </span>
                    {editing && (
                      <button
                        onClick={() => removeChecklistItem(item.id)}
                        className="p-1 rounded hover:bg-red-50 text-gray-300 hover:text-red-500 no-print opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="삭제"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {editing && (
                <div className="flex gap-2 mt-2.5 no-print">
                  <input
                    value={checklistDraft}
                    onChange={(e) => setChecklistDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addChecklistItem();
                      }
                    }}
                    placeholder="체크리스트 항목 추가"
                    className="flex-1 text-sm rounded-lg border border-gray-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                  />
                  <Button variant="secondary" size="sm" icon={<Plus size={13} />} onClick={addChecklistItem}>
                    추가
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 sm:px-8 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
            <span>{brief.aiModel} · 분석수준: {brief.analysisLevel === "simple" ? "간단" : brief.analysisLevel === "detailed" ? "상세" : "일반"}</span>
            <span>Design Brief Maker</span>
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={regenerateOpen}
        title="브리프를 다시 생성할까요?"
        description="현재 브리프 내용이 새로 생성된 내용으로 대체됩니다. 직접 수정한 내용은 사라질 수 있습니다."
        confirmLabel="다시 생성"
        tone="primary"
        onConfirm={handleRegenerate}
        onCancel={() => setRegenerateOpen(false)}
      />
    </div>
  );
}
