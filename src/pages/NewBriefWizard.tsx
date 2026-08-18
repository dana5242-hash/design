import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, FileQuestion, Save, Sparkles, X } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { ProgressSteps } from "../components/ui/ProgressSteps";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { useToast } from "../components/ui/ToastProvider";
import { StepBasicInfo } from "../components/brief/steps/StepBasicInfo";
import { StepRequiredContent } from "../components/brief/steps/StepRequiredContent";
import { StepDesignDirection } from "../components/brief/steps/StepDesignDirection";
import { StepReferences } from "../components/brief/steps/StepReferences";
import { StepAIBrief } from "../components/brief/steps/StepAIBrief";
import { validateStep1, validateStep2, validateStep3, type FieldError } from "../lib/validation";
import { generateAIBrief } from "../lib/aiEngine";
import type { AnalysisLevel, DesignRequest, ReferenceItem } from "../types";
import { EmptyState } from "../components/ui/EmptyState";

const STEP_LABELS = ["기본정보", "콘텐츠", "스타일", "참고자료", "AI 브리프"];

export default function NewBriefWizard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const project = useAppStore((s) => s.projects.find((p) => p.id === id));
  const updateProject = useAppStore((s) => s.updateProject);
  const deleteProject = useAppStore((s) => s.deleteProject);
  const addRevision = useAppStore((s) => s.addRevision);
  const defaultLevel = useAppStore((s) => s.aiSettings.defaultAnalysisLevel);

  const [step, setStep] = useState(() => Math.min(Math.max(project?.currentStep ?? 1, 1), 5));
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [generating, setGenerating] = useState(false);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [analysisLevel, setAnalysisLevel] = useState<AnalysisLevel>(
    project?.aiBrief?.analysisLevel ?? defaultLevel
  );

  const steps = useMemo(() => STEP_LABELS.map((label) => ({ label })), []);

  if (!project) {
    return (
      <Card>
        <EmptyState
          icon={<FileQuestion size={36} />}
          title="프로젝트를 찾을 수 없습니다"
          description="삭제되었거나 잘못된 경로입니다."
          action={
            <Button size="sm" onClick={() => navigate("/briefs")}>
              브리프 목록으로 이동
            </Button>
          }
        />
      </Card>
    );
  }

  const dr = project.designRequest;

  const patchDR = (patch: Partial<DesignRequest>) => {
    updateProject(project.id, { designRequest: { ...dr, ...patch } });
  };

  const patchReferences = (next: ReferenceItem[]) => {
    updateProject(project.id, { references: next });
  };

  const goToStep = (next: number) => {
    setErrors([]);
    setStep(next);
    updateProject(project.id, { currentStep: next });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNext = () => {
    const validation =
      step === 1
        ? validateStep1(project.projectName, dr, project.deadline)
        : step === 2
          ? validateStep2(dr)
          : step === 3
            ? validateStep3(dr)
            : { valid: true, errors: [] };
    if (!validation.valid) {
      setErrors(validation.errors);
      showToast(`입력을 확인해 주세요: ${validation.errors[0].message}`, "error");
      return;
    }
    setErrors([]);
    goToStep(Math.min(step + 1, 5));
  };

  const handleTempSave = () => {
    showToast("임시저장되었습니다.", "success");
  };

  const handleCancel = () => {
    deleteProject(project.id);
    showToast("브리프 작성을 취소했습니다.", "info");
    navigate("/briefs");
  };

  const runGenerate = () => {
    setGenerating(true);
    updateProject(project.id, { status: "in_progress" });
    window.setTimeout(() => {
      const brief = generateAIBrief(dr, analysisLevel);
      updateProject(project.id, { aiBrief: brief, currentStep: 5 });
      addRevision(project.id, "AI 브리프 생성");
      setGenerating(false);
      showToast("AI 브리프 초안이 생성되었습니다.", "success");
    }, 700);
  };

  const handleGoToReferencesGenerate = () => {
    goToStep(5);
    runGenerate();
  };

  const handleConfirmBrief = () => {
    if (!project.aiBrief) {
      showToast("먼저 AI 브리프를 생성해 주세요.", "error");
      return;
    }
    navigate(`/briefs/${project.id}`);
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
          {project.projectName || "새 디자인 브리프"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">단계별로 입력하면 AI가 실무용 디자인 브리프로 정리해 드립니다.</p>
      </div>

      <ProgressSteps steps={steps} current={step} />

      <Card>
        {step === 1 && (
          <StepBasicInfo
            projectName={project.projectName}
            deadline={project.deadline}
            dr={dr}
            errors={errors}
            onProjectNameChange={(v) => updateProject(project.id, { projectName: v })}
            onDeadlineChange={(v) => updateProject(project.id, { deadline: v })}
            onChange={patchDR}
          />
        )}
        {step === 2 && <StepRequiredContent dr={dr} errors={errors} onChange={patchDR} />}
        {step === 3 && <StepDesignDirection dr={dr} errors={errors} onChange={patchDR} />}
        {step === 4 && (
          <StepReferences
            dr={dr}
            references={project.references}
            onChange={patchDR}
            onReferencesChange={patchReferences}
          />
        )}
        {step === 5 && (
          <StepAIBrief
            analysisLevel={analysisLevel}
            onLevelChange={setAnalysisLevel}
            aiBrief={project.aiBrief}
            generating={generating}
            onGenerate={runGenerate}
          />
        )}
      </Card>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          {step === 1 ? (
            <Button variant="ghost" icon={<X size={16} />} onClick={() => setCancelOpen(true)}>
              취소
            </Button>
          ) : (
            <Button variant="secondary" icon={<ArrowLeft size={16} />} onClick={() => goToStep(step - 1)}>
              이전
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" icon={<Save size={16} />} onClick={handleTempSave}>
            임시저장
          </Button>
          {step < 4 && (
            <Button icon={<ArrowRight size={16} />} onClick={handleNext} className="flex-row-reverse">
              다음
            </Button>
          )}
          {step === 4 && (
            <Button icon={<Sparkles size={16} />} onClick={handleGoToReferencesGenerate}>
              AI 브리프 생성
            </Button>
          )}
          {step === 5 && (
            <Button icon={<ArrowRight size={16} />} onClick={handleConfirmBrief} className="flex-row-reverse" disabled={!project.aiBrief}>
              확정하고 검토하기
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        title="브리프 작성을 취소할까요?"
        description="지금까지 입력한 내용이 모두 삭제됩니다."
        confirmLabel="취소하기"
        cancelLabel="계속 작성"
        onConfirm={handleCancel}
        onCancel={() => setCancelOpen(false)}
      />
    </div>
  );
}
