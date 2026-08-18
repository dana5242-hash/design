import { useRef, useState } from "react";
import { FileText, Image as ImageIcon, Link2, StickyNote, Trash2, Upload } from "lucide-react";
import type { DesignRequest, ReferenceItem } from "../../../types";
import { FieldWrap, Input, Textarea } from "../../ui/Field";
import { Button } from "../../ui/Button";
import { generateId } from "../../../lib/id";
import { useToast } from "../../ui/ToastProvider";

interface Props {
  dr: DesignRequest;
  references: ReferenceItem[];
  onChange: (patch: Partial<DesignRequest>) => void;
  onReferencesChange: (next: ReferenceItem[]) => void;
}

const MAX_IMAGE_BYTES = 1_500_000;

const ICON_BY_TYPE: Record<ReferenceItem["type"], React.ReactNode> = {
  image: <ImageIcon size={16} className="text-brand-600" />,
  file: <FileText size={16} className="text-gray-500" />,
  url: <Link2 size={16} className="text-emerald-600" />,
  note: <StickyNote size={16} className="text-amber-600" />,
};

export function StepReferences({ dr, references, onChange, onReferencesChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const [noteDraft, setNoteDraft] = useState("");
  const { showToast } = useToast();

  const addReference = (item: Omit<ReferenceItem, "id" | "addedAt">) => {
    onReferencesChange([
      ...references,
      { ...item, id: generateId("ref"), addedAt: new Date().toISOString() },
    ]);
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      const isImage = file.type.startsWith("image/");
      if (isImage) {
        if (file.size > MAX_IMAGE_BYTES) {
          showToast(`"${file.name}" 파일이 너무 큽니다. 1.5MB 이하 이미지를 업로드해 주세요.`, "error");
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          addReference({ type: "image", name: file.name, dataUrl: String(reader.result) });
        };
        reader.readAsDataURL(file);
      } else {
        addReference({ type: "file", name: file.name });
      }
    });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeReference = (id: string) => {
    onReferencesChange(references.filter((r) => r.id !== id));
  };

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-gray-500">
        참고할 이미지, 기존 디자인, URL을 등록하면 더 정확한 AI 브리프를 만들 수 있어요. (선택 입력)
      </p>

      <FieldWrap label="참고 이미지 / 기존 디자인 파일" hint="이미지 파일은 1.5MB 이하를 권장합니다.">
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFiles(e.dataTransfer.files);
          }}
          className="border-2 border-dashed border-gray-300 rounded-xl px-4 py-6 flex flex-col items-center justify-center gap-2 text-center hover:border-brand-400 transition-colors"
        >
          <Upload size={22} className="text-gray-400" />
          <p className="text-sm text-gray-500">파일을 드래그하거나 클릭해서 업로드하세요</p>
          <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
            파일 업로드
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.ai,.psd,.doc,.docx"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>
      </FieldWrap>

      <FieldWrap label="참고 URL" hint="레퍼런스 사이트, 클라우드 링크 등을 추가하세요.">
        <div className="flex gap-2">
          <Input
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            placeholder="https://"
            onKeyDown={(e) => {
              if (e.key === "Enter" && urlDraft.trim()) {
                e.preventDefault();
                addReference({ type: "url", name: urlDraft.trim(), url: urlDraft.trim() });
                setUrlDraft("");
              }
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!urlDraft.trim()) return;
              addReference({ type: "url", name: urlDraft.trim(), url: urlDraft.trim() });
              setUrlDraft("");
            }}
          >
            참고자료 추가
          </Button>
        </div>
      </FieldWrap>

      <FieldWrap label="자유 메모" hint="레퍼런스에 대한 설명을 남겨보세요.">
        <div className="flex gap-2">
          <Input
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            placeholder="예: 첨부한 포스터의 레이아웃 구조를 참고해 주세요"
            onKeyDown={(e) => {
              if (e.key === "Enter" && noteDraft.trim()) {
                e.preventDefault();
                addReference({ type: "note", name: noteDraft.trim(), note: noteDraft.trim() });
                setNoteDraft("");
              }
            }}
          />
          <Button
            variant="secondary"
            onClick={() => {
              if (!noteDraft.trim()) return;
              addReference({ type: "note", name: noteDraft.trim(), note: noteDraft.trim() });
              setNoteDraft("");
            }}
          >
            메모 추가
          </Button>
        </div>
      </FieldWrap>

      {references.length > 0 && (
        <ul className="flex flex-col gap-2">
          {references.map((ref) => (
            <li
              key={ref.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-gray-200 bg-white"
            >
              {ref.type === "image" && ref.dataUrl ? (
                <img src={ref.dataUrl} alt={ref.name} className="w-10 h-10 rounded object-cover shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded bg-gray-50 flex items-center justify-center shrink-0">
                  {ICON_BY_TYPE[ref.type]}
                </div>
              )}
              <span className="flex-1 text-sm text-gray-700 truncate">{ref.name}</span>
              <button
                type="button"
                onClick={() => removeReference(ref.id)}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 shrink-0"
                aria-label="삭제"
              >
                <Trash2 size={15} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <FieldWrap label="추가 요청사항" hint="그 외 전달하고 싶은 내용을 자유롭게 적어주세요.">
        <Textarea
          value={dr.additionalRequest}
          onChange={(e) => onChange({ additionalRequest: e.target.value })}
          placeholder="예: 경쟁사 A사 배너와는 다른 느낌으로 부탁드립니다"
        />
      </FieldWrap>
    </div>
  );
}
