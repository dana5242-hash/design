import { Sparkles, RefreshCw, Loader2 } from "lucide-react";
import type { AIBrief, AnalysisLevel } from "../../../types";
import { Button } from "../../ui/Button";
import { Card } from "../../ui/Card";
import { FieldWrap } from "../../ui/Field";
import { ChipSelect } from "../../ui/ChipSelect";

const LEVEL_OPTIONS: { value: AnalysisLevel; label: string; desc: string }[] = [
  { value: "simple", label: "간단", desc: "핵심만 빠르게 정리" },
  { value: "normal", label: "일반", desc: "실무에 적합한 균형있는 분석" },
  { value: "detailed", label: "상세", desc: "체크리스트와 키워드까지 폭넓게 생성" },
];

interface Props {
  analysisLevel: AnalysisLevel;
  onLevelChange: (level: AnalysisLevel) => void;
  aiBrief: AIBrief | null;
  generating: boolean;
  onGenerate: () => void;
}

export function StepAIBrief({ analysisLevel, onLevelChange, aiBrief, generating, onGenerate }: Props) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        입력하신 내용을 분석해 실무용 디자인 브리프 초안을 생성합니다. 분석 수준을 선택한 뒤 생성해 주세요.
      </p>

      <FieldWrap label="분석 수준">
        <ChipSelect
          options={LEVEL_OPTIONS.map((l) => l.label)}
          value={[LEVEL_OPTIONS.find((l) => l.value === analysisLevel)?.label ?? "일반"]}
          onChange={(next) => {
            const found = LEVEL_OPTIONS.find((l) => l.label === next[next.length - 1]);
            if (found) onLevelChange(found.value);
          }}
          multiple={false}
        />
        <p className="text-xs text-gray-400">
          {LEVEL_OPTIONS.find((l) => l.value === analysisLevel)?.desc}
        </p>
      </FieldWrap>

      <div className="flex gap-2">
        <Button icon={generating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />} onClick={onGenerate} disabled={generating}>
          {aiBrief ? "다시 생성" : "AI 분석 시작"}
        </Button>
        {aiBrief && (
          <Button variant="secondary" icon={<RefreshCw size={15} />} onClick={onGenerate} disabled={generating}>
            재생성
          </Button>
        )}
      </div>

      {generating && (
        <Card className="flex items-center gap-3 text-sm text-gray-500">
          <Loader2 size={18} className="animate-spin text-brand-600" />
          입력값을 분석해 디자인 브리프를 생성하고 있습니다...
        </Card>
      )}

      {!generating && aiBrief && (
        <Card className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-brand-700">
            <Sparkles size={16} />
            <span className="text-sm font-semibold">AI 브리프 초안 생성 완료</span>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">프로젝트 개요</p>
            <p className="text-sm text-gray-700">{aiBrief.projectSummary}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">핵심 메시지</p>
            <p className="text-sm text-gray-700">{aiBrief.keyMessage}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 mb-1">디자인 방향</p>
            <p className="text-sm text-gray-700">{aiBrief.designDirection}</p>
          </div>
          <p className="text-xs text-gray-400 pt-1 border-t border-gray-100">
            다음 단계에서 전체 브리프를 검토하고 직접 수정할 수 있어요.
          </p>
        </Card>
      )}

      {!generating && !aiBrief && (
        <Card className="text-sm text-gray-400 text-center py-8">
          아직 생성된 브리프가 없습니다. "AI 분석 시작" 버튼을 눌러주세요.
        </Card>
      )}
    </div>
  );
}
