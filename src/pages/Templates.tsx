import { useNavigate } from "react-router-dom";
import {
  Flag,
  Image as ImageIcon,
  Newspaper,
  Hash,
  BookOpen,
  Video,
  ShoppingBag,
  BookText,
  MoreHorizontal,
} from "lucide-react";
import { PROJECT_TYPES } from "../types";
import { useAppStore } from "../store/useAppStore";
import { Card } from "../components/ui/Card";

const ICON_BY_TYPE: Record<string, React.ReactNode> = {
  현수막: <Flag size={22} />,
  배너: <ImageIcon size={22} />,
  신문광고: <Newspaper size={22} />,
  SNS: <Hash size={22} />,
  포스터: <BookOpen size={22} />,
  영상: <Video size={22} />,
  쇼핑백: <ShoppingBag size={22} />,
  브로슈어: <BookText size={22} />,
  기타: <MoreHorizontal size={22} />,
};

const DESC_BY_TYPE: Record<string, string> = {
  현수막: "행사·매장용 대형 현수막 디자인 요청",
  배너: "X배너, 롤업 배너 등 홍보용 배너",
  신문광고: "지면 광고 및 인쇄 매체 광고",
  SNS: "인스타그램, 카드뉴스 등 SNS 콘텐츠",
  포스터: "행사·전시·모집 포스터",
  영상: "홍보 영상, 숏폼 콘텐츠 스토리보드",
  쇼핑백: "브랜드 쇼핑백 패키지 디자인",
  브로슈어: "제품/서비스 소개 브로슈어",
  기타: "그 외 디자인 제작물 요청",
};

export default function Templates() {
  const navigate = useNavigate();
  const createProject = useAppStore((s) => s.createProject);
  const updateProject = useAppStore((s) => s.updateProject);

  const handleSelect = (type: (typeof PROJECT_TYPES)[number]) => {
    const project = createProject("");
    updateProject(project.id, { designRequest: { ...project.designRequest, projectType: type } });
    navigate(`/briefs/${project.id}/edit`);
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Templates</h1>
        <p className="text-sm text-gray-500 mt-1">
          제작물 종류를 선택하면 해당 유형으로 새 브리프 작성을 바로 시작합니다.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
        {PROJECT_TYPES.map((type) => (
          <button key={type} onClick={() => handleSelect(type)} className="text-left">
            <Card className="h-full flex flex-col gap-3 hover:border-brand-400 hover:shadow-md transition-all cursor-pointer">
              <div className="w-11 h-11 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
                {ICON_BY_TYPE[type]}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{type}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{DESC_BY_TYPE[type]}</p>
              </div>
            </Card>
          </button>
        ))}
      </div>
    </div>
  );
}
