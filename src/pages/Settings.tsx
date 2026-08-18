import { useRef, useState } from "react";
import { Save, Upload, X, User, Building2, Palette, BookOpen, Sparkles } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { Card, CardHeader } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { FieldWrap, Input, Textarea } from "../components/ui/Field";
import { ChipSelect } from "../components/ui/ChipSelect";
import { useToast } from "../components/ui/ToastProvider";
import type { AnalysisLevel } from "../types";

const LEVEL_LABEL: Record<AnalysisLevel, string> = { simple: "간단", normal: "일반", detailed: "상세" };

export default function Settings() {
  const user = useAppStore((s) => s.user);
  const company = useAppStore((s) => s.company);
  const aiSettings = useAppStore((s) => s.aiSettings);
  const updateUser = useAppStore((s) => s.updateUser);
  const updateCompany = useAppStore((s) => s.updateCompany);
  const updateAISettings = useAppStore((s) => s.updateAISettings);
  const { showToast } = useToast();

  const [userDraft, setUserDraft] = useState(user);
  const [companyDraft, setCompanyDraft] = useState(company);
  const [colorDraft, setColorDraft] = useState("#4f46e5");
  const logoInputRef = useRef<HTMLInputElement>(null);

  const saveUser = () => {
    updateUser(userDraft);
    showToast("사용자 정보가 저장되었습니다.", "success");
  };

  const saveCompany = () => {
    updateCompany(companyDraft);
    showToast("회사 정보가 저장되었습니다.", "success");
  };

  const handleLogoUpload = (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_000_000) {
      showToast("로고 파일이 너무 큽니다. 1MB 이하 이미지를 사용해 주세요.", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const next = { ...companyDraft, logoDataUrl: String(reader.result) };
      setCompanyDraft(next);
      updateCompany(next);
      showToast("로고가 업로드되었습니다.", "success");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-5 max-w-3xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">사용자, 회사 정보와 AI 설정을 관리하세요.</p>
      </div>

      <Card>
        <CardHeader
          title="사용자 정보"
          subtitle="브리프 작성자로 표시되는 정보입니다."
          action={<User size={18} className="text-gray-400" />}
        />
        <div className="grid sm:grid-cols-2 gap-4">
          <FieldWrap label="이름">
            <Input value={userDraft.name} onChange={(e) => setUserDraft({ ...userDraft, name: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="부서">
            <Input
              value={userDraft.department}
              onChange={(e) => setUserDraft({ ...userDraft, department: e.target.value })}
            />
          </FieldWrap>
          <FieldWrap label="직책">
            <Input
              value={userDraft.position}
              onChange={(e) => setUserDraft({ ...userDraft, position: e.target.value })}
            />
          </FieldWrap>
          <FieldWrap label="역할">
            <Input value={userDraft.role} onChange={(e) => setUserDraft({ ...userDraft, role: e.target.value })} />
          </FieldWrap>
          <FieldWrap label="이메일" hint="선택 입력">
            <Input
              type="email"
              value={userDraft.email}
              onChange={(e) => setUserDraft({ ...userDraft, email: e.target.value })}
              placeholder="you@company.com"
            />
          </FieldWrap>
        </div>
        <div className="flex justify-end mt-4">
          <Button size="sm" icon={<Save size={14} />} onClick={saveUser}>
            저장
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="회사 정보"
          subtitle="브리프 문서에 표시될 회사 정보입니다."
          action={<Building2 size={18} className="text-gray-400" />}
        />
        <FieldWrap label="회사명">
          <Input
            value={companyDraft.companyName}
            onChange={(e) => setCompanyDraft({ ...companyDraft, companyName: e.target.value })}
            placeholder="예: (주)디자인컴퍼니"
          />
        </FieldWrap>
        <div className="flex justify-end mt-4">
          <Button size="sm" icon={<Save size={14} />} onClick={saveCompany}>
            저장
          </Button>
        </div>
      </Card>

      <Card>
        <CardHeader
          title="로고"
          subtitle="브리프 문서 및 자료에 사용할 기본 로고입니다."
          action={<Upload size={18} className="text-gray-400" />}
        />
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg border border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 shrink-0">
            {company.logoDataUrl ? (
              <img src={company.logoDataUrl} alt="로고" className="w-full h-full object-contain" />
            ) : (
              <span className="text-xs text-gray-300">No Logo</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => logoInputRef.current?.click()}>
              로고 업로드
            </Button>
            {company.logoDataUrl && (
              <Button
                variant="ghost"
                size="sm"
                icon={<X size={14} />}
                onClick={() => {
                  updateCompany({ logoDataUrl: "" });
                  setCompanyDraft({ ...companyDraft, logoDataUrl: "" });
                }}
              >
                제거
              </Button>
            )}
          </div>
          <input
            ref={logoInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleLogoUpload(e.target.files?.[0])}
          />
        </div>
      </Card>

      <Card>
        <CardHeader title="브랜드 컬러" subtitle="자주 사용하는 브랜드 컬러를 등록해 두면 브리프 작성이 빨라져요." action={<Palette size={18} className="text-gray-400" />} />
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
              if (company.brandColors.includes(colorDraft)) return;
              updateCompany({ brandColors: [...company.brandColors, colorDraft] });
            }}
          >
            컬러 추가
          </Button>
        </div>
        {company.brandColors.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {company.brandColors.map((c) => (
              <span
                key={c}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-1 py-1 rounded-full border border-gray-200 text-xs text-gray-600"
              >
                <span className="w-4 h-4 rounded-full border border-gray-200" style={{ background: c }} />
                {c}
                <button
                  onClick={() => updateCompany({ brandColors: company.brandColors.filter((x) => x !== c) })}
                  className="p-0.5 rounded-full hover:bg-gray-100"
                  aria-label="삭제"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      <Card>
        <CardHeader title="디자인 가이드" subtitle="디자이너들이 참고할 공통 가이드라인을 적어두세요." action={<BookOpen size={18} className="text-gray-400" />} />
        <Textarea
          value={companyDraft.designGuide}
          onChange={(e) => {
            const next = { ...companyDraft, designGuide: e.target.value };
            setCompanyDraft(next);
          }}
          onBlur={() => updateCompany({ designGuide: companyDraft.designGuide })}
          placeholder="예: 로고는 항상 여백 20px 이상 확보, 메인 폰트는 Pretendard 사용"
          rows={4}
        />
      </Card>

      <Card>
        <CardHeader title="AI 설정" subtitle="AI 브리프 생성 시 기본으로 사용할 분석 수준입니다." action={<Sparkles size={18} className="text-gray-400" />} />
        <FieldWrap label="기본 분석 수준">
          <ChipSelect
            options={["simple", "normal", "detailed"].map((v) => LEVEL_LABEL[v as AnalysisLevel])}
            value={[LEVEL_LABEL[aiSettings.defaultAnalysisLevel]]}
            multiple={false}
            onChange={(next) => {
              const found = (Object.keys(LEVEL_LABEL) as AnalysisLevel[]).find(
                (k) => LEVEL_LABEL[k] === next[next.length - 1]
              );
              if (found) updateAISettings({ defaultAnalysisLevel: found });
            }}
          />
        </FieldWrap>
        <p className="text-xs text-gray-400 mt-3">
          현재 AI 엔진: <span className="font-medium text-gray-500">{aiSettings.aiModelLabel}</span> — 입력된 요청
          정보를 규칙 기반으로 분석하여 실무용 디자인 브리프를 자동 생성합니다.
        </p>
      </Card>
    </div>
  );
}
