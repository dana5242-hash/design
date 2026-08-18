import type { DesignRequest, ProjectType } from "../../../types";
import { PROJECT_TYPES } from "../../../types";
import { FieldWrap, Input, Textarea } from "../../ui/Field";
import type { FieldError } from "../../../lib/validation";

interface Props {
  projectName: string;
  deadline: string;
  dr: DesignRequest;
  errors: FieldError[];
  onProjectNameChange: (v: string) => void;
  onDeadlineChange: (v: string) => void;
  onChange: (patch: Partial<DesignRequest>) => void;
}

const SIZE_HINT_BY_TYPE: Partial<Record<ProjectType, string>> = {
  현수막: "예: 가로 5m x 세로 1.2m",
  배너: "예: 60cm x 160cm (X배너)",
  신문광고: "예: 5단 x 10cm",
  SNS: "예: 1080 x 1080px (정방형)",
  포스터: "예: A2 (420 x 594mm)",
  영상: "예: 15초, 1920 x 1080px",
  쇼핑백: "예: 소형 / 중형 / 대형",
  브로슈어: "예: A4 3단 접지",
};

function errorFor(errors: FieldError[], field: string) {
  return errors.find((e) => e.field === field)?.message;
}

export function StepBasicInfo({
  projectName,
  deadline,
  dr,
  errors,
  onProjectNameChange,
  onDeadlineChange,
  onChange,
}: Props) {
  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        프로젝트의 기본 조건을 입력해 주세요. 제작물 종류에 따라 이후 입력 항목이 자동으로 조정됩니다.
      </p>

      <FieldWrap label="제작물 종류" required error={errorFor(errors, "projectType")}>
        <div className="flex flex-wrap gap-2">
          {PROJECT_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => onChange({ projectType: type })}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                dr.projectType === type
                  ? "bg-brand-600 border-brand-600 text-white"
                  : "bg-white border-gray-300 text-gray-700 hover:border-brand-400 hover:text-brand-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </FieldWrap>

      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrap label="프로젝트명" required error={errorFor(errors, "projectName")}>
          <Input
            value={projectName}
            onChange={(e) => onProjectNameChange(e.target.value)}
            placeholder="예: 2026 여름 신제품 런칭 배너"
            error={!!errorFor(errors, "projectName")}
          />
        </FieldWrap>
        <FieldWrap label="마감일" required error={errorFor(errors, "deadline")}>
          <Input
            type="date"
            value={deadline}
            onChange={(e) => onDeadlineChange(e.target.value)}
            error={!!errorFor(errors, "deadline")}
          />
        </FieldWrap>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <FieldWrap label="사용처" required error={errorFor(errors, "usage")} hint="어디에, 어떤 상황에서 사용되나요?">
          <Input
            value={dr.usage}
            onChange={(e) => onChange({ usage: e.target.value })}
            placeholder="예: 매장 입구 현수막"
            error={!!errorFor(errors, "usage")}
          />
        </FieldWrap>
        <FieldWrap label="타깃" required error={errorFor(errors, "target")} hint="누구에게 보여줄 디자인인가요?">
          <Input
            value={dr.target}
            onChange={(e) => onChange({ target: e.target.value })}
            placeholder="예: 20~30대 여성 고객"
            error={!!errorFor(errors, "target")}
          />
        </FieldWrap>
      </div>

      <FieldWrap label="제작 목적" required error={errorFor(errors, "purpose")}>
        <Textarea
          value={dr.purpose}
          onChange={(e) => onChange({ purpose: e.target.value })}
          placeholder="예: 신제품 출시를 알리고 매장 방문을 유도하기 위함"
          error={!!errorFor(errors, "purpose")}
        />
      </FieldWrap>

      <FieldWrap
        label="사이즈 / 규격"
        required
        error={errorFor(errors, "size")}
        hint={dr.projectType ? SIZE_HINT_BY_TYPE[dr.projectType as ProjectType] : undefined}
      >
        <Input
          value={dr.size}
          onChange={(e) => onChange({ size: e.target.value })}
          placeholder={dr.projectType ? SIZE_HINT_BY_TYPE[dr.projectType as ProjectType] : "사이즈를 입력해 주세요"}
          error={!!errorFor(errors, "size")}
        />
      </FieldWrap>
    </div>
  );
}
