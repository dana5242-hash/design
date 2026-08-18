import { ArrowDown, ArrowUp } from "lucide-react";
import type { DesignRequest } from "../../../types";
import { REQUIRED_ELEMENT_OPTIONS } from "../../../types";
import { FieldWrap } from "../../ui/Field";
import { TagListInput } from "../../ui/TagListInput";
import { ChipSelect } from "../../ui/ChipSelect";
import type { FieldError } from "../../../lib/validation";

interface Props {
  dr: DesignRequest;
  errors: FieldError[];
  onChange: (patch: Partial<DesignRequest>) => void;
}

export function StepRequiredContent({ dr, errors, onChange }: Props) {
  const orderedTexts = dr.priority.length
    ? [...dr.requiredTexts].sort((a, b) => dr.priority.indexOf(a) - dr.priority.indexOf(b))
    : dr.requiredTexts;

  const move = (label: string, dir: -1 | 1) => {
    const order = orderedTexts.length ? orderedTexts : dr.requiredTexts;
    const idx = order.indexOf(label);
    const nextIdx = idx + dir;
    if (nextIdx < 0 || nextIdx >= order.length) return;
    const next = [...order];
    [next[idx], next[nextIdx]] = [next[nextIdx], next[idx]];
    onChange({ priority: next });
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        디자인에 반드시 포함되어야 할 요소를 입력해 주세요. 누락되면 디자이너가 다시 확인해야 하는 항목입니다.
      </p>

      <FieldWrap
        label="필수 문구"
        required
        error={errors.find((e) => e.field === "requiredTexts")?.message}
        hint="반드시 들어가야 할 카피/문구를 하나씩 추가하세요. Enter로 추가됩니다."
      >
        <TagListInput
          items={dr.requiredTexts}
          onChange={(next) => onChange({ requiredTexts: next, priority: dr.priority.filter((p) => next.includes(p)) })}
          placeholder="예: 신규 오픈 이벤트 30% 할인"
        />
      </FieldWrap>

      {orderedTexts.length > 1 && (
        <FieldWrap label="강조 우선순위" hint="위에서 아래로 갈수록 우선순위가 낮아집니다. 화살표로 순서를 조정하세요.">
          <ul className="flex flex-col gap-1.5">
            {orderedTexts.map((label, idx) => (
              <li
                key={label}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-gray-50"
              >
                <span className="text-sm text-gray-700">
                  <span className="text-brand-600 font-semibold mr-2">{idx + 1}</span>
                  {label}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => move(label, -1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    aria-label="위로"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(label, 1)}
                    disabled={idx === orderedTexts.length - 1}
                    className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
                    aria-label="아래로"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </FieldWrap>
      )}

      <FieldWrap label="필수 포함 요소" hint="해당되는 항목을 모두 선택하세요.">
        <ChipSelect
          options={REQUIRED_ELEMENT_OPTIONS}
          value={dr.requiredElements}
          onChange={(next) => onChange({ requiredElements: next })}
        />
      </FieldWrap>

      <FieldWrap label="기타 요청 내용" hint="필수 요소 외 추가로 전달할 내용이 있다면 입력하세요.">
        <TagListInput
          items={dr.requiredElements.filter((e) => !REQUIRED_ELEMENT_OPTIONS.includes(e as (typeof REQUIRED_ELEMENT_OPTIONS)[number]))}
          onChange={(customItems) => {
            const preset = dr.requiredElements.filter((e) =>
              REQUIRED_ELEMENT_OPTIONS.includes(e as (typeof REQUIRED_ELEMENT_OPTIONS)[number])
            );
            onChange({ requiredElements: [...preset, ...customItems] });
          }}
          placeholder="예: 매장 위치 지도 이미지"
        />
      </FieldWrap>
    </div>
  );
}
