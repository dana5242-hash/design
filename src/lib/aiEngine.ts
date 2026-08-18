import { generateId } from "./id";
import type {
  AIBrief,
  AnalysisLevel,
  ChecklistItem,
  DesignRequest,
  ProjectType,
} from "../types";

const LAYOUT_BY_TYPE: Record<ProjectType, string> = {
  현수막:
    "가로형 와이드 레이아웃을 기본으로 하고, 핵심 메시지를 중앙 또는 좌측에 크게 배치해 원거리에서도 읽히도록 구성합니다. 로고와 부가 정보는 하단에 정렬합니다.",
  배너:
    "상단에 핵심 메시지, 중단에 비주얼 이미지, 하단에 CTA(행동유도) 문구와 로고를 배치하는 3단 구조를 권장합니다.",
  신문광고:
    "지면형 레이아웃으로 상단 헤드라인, 중단 바디카피 및 이미지, 하단 로고/문의처 구조를 사용합니다. 인쇄 해상도를 고려한 여백 확보가 필요합니다.",
  SNS: "정방형(1:1) 또는 세로형(4:5, 9:16) 비율을 기본으로 하고, 모바일 화면에서 3초 안에 핵심 메시지가 읽히도록 텍스트를 최소화합니다.",
  포스터:
    "세로형 레이아웃으로 상단 60%는 비주얼 중심, 하단 40%는 정보(일시·장소·연락처)를 배치하는 구조를 권장합니다.",
  영상: "인트로(3초 내 관심 유도) - 본문(핵심 메시지 전달) - 아웃트로(CTA 및 로고 노출) 3단 스토리보드 구성으로 설계합니다.",
  쇼핑백:
    "브랜드 로고를 중심에 두고 심플한 패턴 또는 브랜드 컬러 배경으로 구성하며, 과도한 정보 노출을 지양합니다.",
  브로슈어:
    "표지 - 내지(제품/서비스 소개, 다단 구성) - 뒤표지(연락처)로 이어지는 흐름을 설계하고, 내지는 그리드 기반 다단 레이아웃을 사용합니다.",
  기타: "제작물 목적에 맞는 범용 그리드 레이아웃을 사용하고, 핵심 메시지 우선순위에 따라 시각적 위계를 설정합니다.",
};

const TYPOGRAPHY_BY_MOOD: Record<string, string> = {
  "모던하고 심플한": "굵기 대비가 뚜렷한 산세리프 서체, 여백을 넉넉히 확보한 타이포 조합",
  고급스러운: "얇은 굵기의 세리프 또는 정제된 산세리프, 자간을 살짝 넓힌 고급스러운 타이포",
  "신뢰감 있는": "가독성이 높은 표준 산세리프 서체, 안정적인 정렬과 위계 구조",
  "활기차고 젊은": "볼드하고 개성 있는 디스플레이 서체, 크기 대비를 강조한 다이내믹한 타이포",
  "따뜻하고 친근한": "둥근 느낌의 서체, 부드러운 곡선의 손글씨 스타일 포인트 활용",
  "전문적이고 격식있는": "격식 있는 명조/세리프 계열 또는 클래식한 산세리프, 절제된 스타일",
  "귀엽고 캐주얼한": "둥글둥글한 서체와 아이코닉한 포인트 요소를 활용한 캐주얼한 타이포",
  미니멀한: "가는 굵기의 심플한 산세리프, 최소한의 크기 대비로 절제된 타이포",
};

const COLOR_BY_MOOD: Record<string, string> = {
  "모던하고 심플한": "화이트/그레이 베이스에 포인트 컬러 1색을 더한 미니멀 컬러 조합",
  고급스러운: "블랙, 딥네이비, 골드/실버 톤을 활용한 프리미엄 컬러 조합",
  "신뢰감 있는": "블루 계열을 메인으로 화이트와 그레이를 보조색으로 사용",
  "활기차고 젊은": "비비드한 오렌지, 옐로우, 핑크 등 채도 높은 컬러의 다이내믹한 조합",
  "따뜻하고 친근한": "오렌지, 코랄, 베이지 등 따뜻한 톤의 컬러 조합",
  "전문적이고 격식있는": "네이비, 딥그레이 등 차분한 톤 중심의 정제된 컬러 조합",
  "귀엽고 캐주얼한": "파스텔톤 컬러를 메인으로 한 부드럽고 발랄한 조합",
  미니멀한: "화이트, 라이트그레이, 블랙 위주의 무채색 중심 조합",
};

const IMAGE_DIRECTION_BY_MOOD: Record<string, string> = {
  "모던하고 심플한": "여백이 많은 클린한 사진 또는 플랫 일러스트 활용",
  고급스러운: "고해상도의 정제된 프로덕트/라이프스타일 사진, 과도한 보정 지양",
  "신뢰감 있는": "실제 인물/현장 사진 중심의 사실적인 이미지 활용",
  "활기차고 젊은": "역동적인 구도와 생동감 있는 컬러의 사진 또는 그래픽 활용",
  "따뜻하고 친근한": "자연광, 일상적인 순간을 담은 따뜻한 톤의 사진 활용",
  "전문적이고 격식있는": "정돈된 구도의 비즈니스/현장 사진, 장식 요소 최소화",
  "귀엽고 캐주얼한": "일러스트 또는 캐릭터 요소를 활용한 친근한 비주얼",
  미니멀한: "단색 배경 위 단일 오브젝트 중심의 절제된 이미지",
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

// 받침 유무에 따라 을/를 조사를 선택합니다.
function withEulReul(word: string): string {
  const trimmed = word.trim();
  if (!trimmed) return word;
  const lastChar = trimmed.charCodeAt(trimmed.length - 1);
  if (lastChar < 0xac00 || lastChar > 0xd7a3) return `${trimmed}을(를)`;
  const hasBatchim = (lastChar - 0xac00) % 28 !== 0;
  return `${trimmed}${hasBatchim ? "을" : "를"}`;
}

function buildProjectSummary(dr: DesignRequest, level: AnalysisLevel): string {
  const type = dr.projectType || "디자인물";
  const usage = dr.usage || "지정된 사용처";
  const target = dr.target || "지정된 타깃";
  const base = `${type} 제작 건으로, ${usage}에서 ${withEulReul(target)} 대상으로 활용될 예정입니다.`;
  if (level === "simple") return base;
  const purpose = dr.purpose ? ` 목적은 "${dr.purpose}"입니다.` : "";
  const size = dr.size ? ` 규격은 ${dr.size}입니다.` : "";
  if (level === "normal") return `${base}${purpose}${size}`;
  const brand = dr.brandColors.length
    ? ` 브랜드 컬러(${dr.brandColors.join(", ")})를 반영해야 합니다.`
    : "";
  const logo = dr.logoRequired ? " 로고가 반드시 포함되어야 합니다." : "";
  return `${base}${purpose}${size}${brand}${logo}`;
}

function buildDesignGoal(dr: DesignRequest): string {
  const purpose = dr.purpose || "브랜드/제품 메시지를 효과적으로 전달";
  const target = dr.target || "타깃 고객";
  return `${target}에게 "${purpose}"라는 목적이 명확하게 전달되도록, 첫 3초 안에 핵심 메시지를 인지시키는 것을 디자인 목표로 합니다.`;
}

function buildTargetSummary(dr: DesignRequest): string {
  if (!dr.target) return "타깃 정보가 입력되지 않았습니다. 정확한 톤앤매너 설정을 위해 타깃을 구체적으로 입력해 주세요.";
  return `주요 타깃은 "${dr.target}"이며, 해당 타깃의 눈높이와 관심사에 맞는 시각 언어와 메시지 톤을 사용해야 합니다.`;
}

function buildKeyMessage(dr: DesignRequest): string {
  const texts = dr.requiredTexts.filter(Boolean);
  if (texts.length === 0) {
    return "필수 문구가 입력되지 않았습니다. 핵심 메시지를 명확히 하기 위해 필수 문구를 추가해 주세요.";
  }
  const prioritized = dr.priority.length
    ? [...texts].sort((a, b) => dr.priority.indexOf(a) - dr.priority.indexOf(b))
    : texts;
  return prioritized
    .slice(0, 3)
    .map((t, i) => `${i + 1}순위: ${t}`)
    .join(" / ");
}

function buildDesignDirection(dr: DesignRequest, level: AnalysisLevel): string {
  const moods = dr.mood.length ? dr.mood.join(", ") : "모던하고 심플한";
  const base = `전체적으로 "${moods}" 분위기를 중심으로 디자인 방향을 설정합니다.`;
  if (level === "simple") return base;
  const avoid = dr.avoidMood.length
    ? ` 반대로 ${dr.avoidMood.join(", ")} 느낌은 지양합니다.`
    : "";
  const bg = dr.backgroundDirection ? ` 배경은 "${dr.backgroundDirection}" 방향으로 구성합니다.` : "";
  return `${base}${avoid}${bg}`;
}

function buildAvoidElements(dr: DesignRequest): string {
  const items = [...dr.avoidMood];
  if (items.length === 0) return "특별히 회피할 요소가 지정되지 않았습니다. 일반적인 가독성 저해 요소(과도한 텍스트, 저해상도 이미지)는 지양합니다.";
  return items.join(", ") + " 요소는 사용을 지양합니다.";
}

function buildSearchKeywords(dr: DesignRequest, level: AnalysisLevel): string[] {
  const type = dr.projectType || "디자인";
  const keywords = new Set<string>();
  keywords.add(`${type} 디자인 레퍼런스`);
  if (dr.mood[0]) keywords.add(`${dr.mood[0]} ${type} 디자인`);
  if (dr.target) keywords.add(`${dr.target} 타깃 ${type} 예시`);
  if (dr.purpose) keywords.add(`${dr.purpose} ${type}`);
  if (dr.backgroundDirection) keywords.add(`${dr.backgroundDirection} ${type}`);
  keywords.add(`${type} 레이아웃 아이디어`);
  if (level !== "simple") {
    keywords.add(`${type} 트렌드 2026`);
    if (dr.mood[1]) keywords.add(`${dr.mood[1]} 컬러 팔레트`);
  }
  if (level === "detailed") {
    keywords.add(`${type} Behance`);
    keywords.add(`${type} Pinterest 무드보드`);
  }
  return Array.from(keywords).filter(Boolean).slice(0, level === "simple" ? 4 : level === "normal" ? 6 : 9);
}

function buildChecklist(dr: DesignRequest, level: AnalysisLevel): ChecklistItem[] {
  const items: string[] = [];
  if (dr.requiredTexts.length) items.push("필수 문구가 모두 반영되었는지 확인");
  if (dr.logoRequired || dr.requiredElements.includes("로고")) items.push("로고 사용 가이드 및 위치 확인");
  items.push("마감일까지 최종 산출물 전달 가능 여부 확인");
  if (dr.requiredElements.includes("QR코드")) items.push("QR코드 스캔 테스트 완료");
  if (dr.requiredElements.includes("연락처")) items.push("연락처 정보 정확성 확인");
  if (dr.requiredElements.includes("홈페이지 URL")) items.push("URL 오타 여부 확인");
  if (dr.requiredElements.includes("행사/이벤트 날짜")) items.push("행사/이벤트 날짜 정확성 확인");
  if (dr.brandColors.length) items.push("브랜드 컬러 가이드 준수 여부 확인");
  items.push("타깃 눈높이에 맞는 톤앤매너 확인");
  items.push("저작권 프리 이미지/폰트 사용 확인");
  if (level !== "simple") {
    items.push("인쇄/게시 규격에 맞는 해상도 및 여백 확인");
    items.push("맞춤법 및 띄어쓰기 최종 검수");
  }
  if (level === "detailed") {
    items.push("모바일/PC 등 다양한 화면에서 가독성 확인");
    items.push("이해관계자 최종 컨펌 여부 확인");
  }
  return items
    .filter(Boolean)
    .slice(0, level === "simple" ? 5 : level === "normal" ? 8 : 12)
    .map((label) => ({ id: generateId("chk"), label, done: false }));
}

export function generateAIBrief(
  dr: DesignRequest,
  analysisLevel: AnalysisLevel,
  seed = Date.now()
): AIBrief {
  const moodKey = dr.mood[0] ?? "모던하고 심플한";
  const type: ProjectType = (dr.projectType || "기타") as ProjectType;

  const layoutBase = LAYOUT_BY_TYPE[type] ?? LAYOUT_BY_TYPE["기타"];
  const typography = TYPOGRAPHY_BY_MOOD[moodKey] ?? TYPOGRAPHY_BY_MOOD["모던하고 심플한"];
  let colorRec = COLOR_BY_MOOD[moodKey] ?? COLOR_BY_MOOD["모던하고 심플한"];
  if (dr.brandColors.length) {
    colorRec = `브랜드 컬러(${dr.brandColors.join(", ")})를 메인으로 사용하고, ${colorRec}를 보조 방향으로 참고합니다.`;
  }
  const imageDirection = IMAGE_DIRECTION_BY_MOOD[moodKey] ?? IMAGE_DIRECTION_BY_MOOD["모던하고 심플한"];

  const layoutVariants = [layoutBase, `${layoutBase} (대안: 정보 요소를 좌우로 분할하는 구성도 검토 가능)`];
  const layoutRecommendation = pick(layoutVariants, seed);

  return {
    projectSummary: buildProjectSummary(dr, analysisLevel),
    designGoal: buildDesignGoal(dr),
    targetSummary: buildTargetSummary(dr),
    keyMessage: buildKeyMessage(dr),
    designDirection: buildDesignDirection(dr, analysisLevel),
    layoutRecommendation,
    colorRecommendation: colorRec,
    typographyRecommendation: typography,
    imageDirection,
    avoidElements: buildAvoidElements(dr),
    searchKeywords: buildSearchKeywords(dr, analysisLevel),
    checklist: buildChecklist(dr, analysisLevel),
    aiModel: "Design Brief AI Engine v1",
    analysisLevel,
    generatedAt: new Date().toISOString(),
  };
}
