import { useState } from "react";
import { X, Wand2 } from "lucide-react";
import type { DesignRequest } from "../../../types";
import { AVOID_OPTIONS, BACKGROUND_OPTIONS, MOOD_OPTIONS } from "../../../types";
import { FieldWrap, Textarea } from "../../ui/Field";
import { ChipSelect } from "../../ui/ChipSelect";
import { Toggle } from "../../ui/Toggle";
import { Button } from "../../ui/Button";
import type { FieldError } from "../../../lib/validation";

interface Props {
  dr: DesignRequest;
  errors: FieldError[];
  onChange: (patch: Partial<DesignRequest>) => void;
}

const TYPE_MOOD_SUGGESTION: Record<string, string[]> = {
  현수막: ["신뢰감 있는", "전문적이고 격식있는"],
  배너: ["활기차고 젊은", "모던하고 심플한"],
  신문광고: ["신뢰감 있는", "전문적이고 격식있는"],
  SNS: ["활기차고 젊은", "귀엽고 캐주얼한"],
  포스터: ["모던하고 심플한", "고급스러운"],
  영상: ["활기차고 젊은", "모던하고 심플한"],
  쇼핑백: ["고급스러운", "미니멀한"],
  브로슈어: ["전문적이고 격식있는", "신뢰감 있는"],
  기타: ["모던하고 심플한"],
};

export function StepDesignDirection({ dr, errors, onChange }: Props) {
  const [colorDraft, setColorDraft] = useState("#4f46e5");

  const applyAISuggestion = () => {
    const suggestion = TYPE_MOOD_SUGGESTION[dr.projectType || "기타"] ?? TYPE_MOOD_SUGGESTION["기타"];
    onChange({
      mood: Array.from(new Set([...dr.mood, ...suggestion])),
      backgroundDirection: dr.backgroundDirection || BACKGROUND_OPTIONS[0],
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-gray-500">
          추상적인 요구를 구체적인 디자인 방향으로 바꿔보세요. 확신이 없다면 AI 스타일 추천을 활용하세요.
        </p>
        <Button variant="outline" size="sm" icon={<Wand2 size={14} />} onClick={applyAISuggestion} className="shrink-0">
          AI 스타일 추천
        </Button>
      </div>

      <FieldWrap label="원하는 분위기" required error={errors.find((e) => e.field === "mood")?.message}>
        <ChipSelect options={MOOD_OPTIONS} value={dr.mood} onChange={(next) => onChange({ mood: next })} />
      </FieldWrap>

      <FieldWrap label="피하고 싶은 요소" hint="이 프로젝트에서 지양했으면 하는 느낌을 선택하세요.">
        <ChipSelect options={AVOID_OPTIONS} value={dr.avoidMood} onChange={(next) => onChange({ avoidMood: next })} />
      </FieldWrap>

      <FieldWrap label="배경 방향">
        <ChipSelect
          options={BACKGROUND_OPTIONS}
          value={dr.backgroundDirection ? [dr.backgroundDirection] : []}
          onChange={(next) => {
            const value = next[next.length - 1];
            if (value) onChange({ backgroundDirection: value });
          }}
          multiple={false}
        />
      </FieldWrap>

      <FieldWrap label="브랜드 컬러" hint="사용해야 할 브랜드 컬러가 있다면 추가하세요. (선택)">
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={colorDraft}
            onChange={(e) => setColorDraft(e.target.value)}
            className="w-10 h-10 rounded-lg border border-gray-300 cursor-pointer p-0.5"
            aria-label="컬러 선택"
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              if (dr.brandColors.includes(colorDraft)) return;
              onChange({ brandColors: [...dr.brandColors, colorDraft] });
            }}
          >
            컬러 추가
          </Button>
        </div>
        {dr.brandColors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {dr.brandColors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full border border-gray-200 text-xs text-gray-600"
              >
                <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: c }} />
                {c}
                <button
                  type="button"
                  onClick={() => onChange({ brandColors: dr.brandColors.filter((x) => x !== c) })}
                  className="p-0.5 rounded-full hover:bg-gray-100"
                  aria-label="컬러 삭제"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </FieldWrap>

      <FieldWrap label="컬러/톤 관련 추가 설명" hint="자유롭게 원하는 컬러 방향을 설명해도 좋습니다.">
        <Textarea
          value={dr.colorDirection}
          onChange={(e) => onChange({ colorDirection: e.target.value })}
          placeholder="예: 채도가 너무 높지 않은 파스텔 톤을 선호합니다"
        />
      </FieldWrap>

      <FieldWrap label="로고 사용">
        <Toggle
          checked={dr.logoRequired}
          onChange={(checked) => onChange({ logoRequired: checked })}
          label="이 제작물에 로고를 반드시 포함합니다"
        />
      </FieldWrap>
    </div>
  );
}
