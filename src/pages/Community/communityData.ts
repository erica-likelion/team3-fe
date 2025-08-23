export type TabKey = "all" | "free" | "partner";

export type Post = {
  id: number;
  board: "자유게시판" | "제휴게시판";
  title: string;
  content: string;
  nick: string;
  ts: number;
  count: number;
  thumb?: string;
  pairIcons?: [string, string];
};

const now = Date.now();
const min = (m: number) => m * 60 * 1000;
const hr = (h: number) => h * 60 * 60 * 1000;

// =================== 기존 더미 데이터 ===================
import soju from "../../assets/ui/soju.jpg";
import cafe from "../../assets/ui/cafe.jpg";
import gimbab from "../../assets/ui/gimbab.jpg";
import cheeseball from "../../assets/ui/cheeseball.jpg";
import sashimi from "../../assets/ui/sashimi.jpg";
import cafeInside2 from "../../assets/ui/cafe inside 2.jpg";
import emptyInside from "../../assets/ui/empty inside.jpg";
import friedChicken from "../../assets/ui/fried chicken.jpg";
import zzazhang from "../../assets/ui/zzazhangmeon.jpg";
import latte from "../../assets/ui/latte.jpg";
import cafeInside from "../../assets/ui/cafe inside.jpg";
import hamburger from "../../assets/ui/hamburger.jpg";
import pizza2 from "../../assets/ui/pizza 2.jpg";
import pasta2 from "../../assets/ui/pasta 2.jpg";

import iconCoffee from "../../assets/categories/coffee.png";
import iconAsian from "../../assets/categories/asian.png";
import iconSushi from "../../assets/categories/sushi.png";
import iconPasta from "../../assets/categories/pasta.png";
import iconZza from "../../assets/categories/zza.png";
import iconBeer from "../../assets/ui/beer.png";
import iconPizzaChicken from "../../assets/ui/pizzachicken.png";

export const freeMustPost: Post = {
  id: 1000,
  board: "자유게시판",
  title: "수박 가격 폭등...",
  content:
    "수박주스 메뉴에서 빼야할까요? 사장님들 생각이 궁금합니다. 원가가 너무 올라서 고민이 되네요. 비슷한 상황 겪어보신 분들 의견 부탁드려요!",
  nick: "바리바리스타",
  ts: now - min(47),
  count: 32,
  thumb: latte,
};

export const freePosts: Post[] = [
  freeMustPost,
  {
    id: 101,
    board: "자유게시판",
    title: "요즘 장사 잘 되시나요?",
    content:
      "손님이 별로 없어서 너무 슬프네요..... 이럴 때 꿀팁이 있을까요?쿠폰이라도 뿌려봐야 하나 고민이네요. 효과가 좋았던 방법 공유해주시면 정말 감사하겠습니다!",
    nick: "부자되고싶다",
    ts: now - min(1),
    count: 3,
    thumb: cafeInside2,
  },
  {
    id: 102,
    board: "자유게시판",
    title: "소주 안주 추천 부탁! 저녁 손님 늘리고 싶어요",
    content:
      "술집 신메뉴 고민 중입니다. 안주 뭐가 잘 팔리나요? 감바스/치즈볼/꼬치 중에서 고민인데 추천 부탁드립니다. 지역은 대학가 인근이에요.",
    nick: "야간영업러",
    ts: now - min(9),
    count: 4,
    thumb: soju,
  },
  {
    id: 103,
    board: "자유게시판",
    title: "중식 면 삶는 타이밍과 소스 점도 조언 구해요",
    content:
      "짜장면/유니 짜장 비율이 어렵네요. 소스 농도는 걸쭉한 편이 나은지, 살짝 묽은 편이 나은지 의견 부탁드립니다.",
    nick: "면치기장인",
    ts: now - min(28),
    count: 2,
    thumb: zzazhang,
  },
  {
    id: 104,
    board: "자유게시판",
    title: "회 메뉴 추가하면 회전율에 영향 있을까요?",
    content:
      "숙성회 위주 매장입니다. 초밥 메뉴를 소량 추가하려는데 손질/밥 손이 많이 갈 것 같아 고민이에요.",
    nick: "스시토로",
    ts: now - min(36),
    count: 7,
    thumb: sashimi,
  },
  {
    id: 105,
    board: "자유게시판",
    title: "치킨 야식 배달 최저 주문금액 얼마가 무난할까요",
    content:
      "평균 객단가 비교해보고 있어요. 15,000원 vs 18,000원? 실제 데이터 있으신 분들 경험 공유 부탁드려요.",
    nick: "밤닭집",
    ts: now - hr(1),
    count: 6,
    thumb: friedChicken,
  },
  {
    id: 106,
    board: "자유게시판",
    title: "매장 인테리어 밝기 조절 어떻게 하세요",
    content:
      "저녁엔 분위기 좋게, 낮엔 밝게 운영하고 싶은데 조도 조절/전구 색온도 팁 있으신가요?",
    nick: "조도고민중",
    ts: now - hr(2),
    count: 2,
    thumb: emptyInside,
  },
  {
    id: 107,
    board: "자유게시판",
    title: "패스트푸드 버거 번(빵) 수급처 추천 있나요?",
    content:
      "직접 굽는 대신 납품 고려 중입니다. 품질/단가 괜찮은 곳 있으면 공유 부탁드립니다.",
    nick: "번연구가",
    ts: now - hr(3),
    count: 5,
    thumb: hamburger,
  },
  {
    id: 108,
    board: "자유게시판",
    title: "장마철 배달 최소주문금액 낮출까요?",
    content:
      "비 오는 날 주문량이 들쭉날쭉합니다. 최소주문금액을 잠시 낮춰보려는데 효과 보신 분 있을까요?",
    nick: "비요일사장",
    ts: now - hr(4),
    count: 1,
  },
  {
    id: 109,
    board: "자유게시판",
    title: "직원 스케줄 자동표 추천 부탁드려요",
    content:
      "주말 알바 포함 7명 운영 중인데 스케줄링 툴 추천 부탁드려요. 무료/유료 상관없습니다.",
    nick: "스케줄장인",
    ts: now - hr(5),
    count: 0,
  },
];

export const partnerPosts: Post[] = [
  {
    id: 1,
    board: "제휴게시판",
    title: "에리카 앞 인더비엣에서 카페 제휴 구합니다!",
    content:
      "각자 고객에 대해 상호 10% 쿠폰 발행 이벤트 생각 중입니다! 혹시라도 생각 있으신 분들은 비밀 댓글 달아주세요.",
    nick: "분짜사랑해",
    ts: now - min(2),
    count: 10,
    thumb: cafeInside,
    pairIcons: [iconAsian, iconCoffee],
  },
  {
    id: 2,
    board: "제휴게시판",
    title: "치킨&피자 세트 + 맥주 제휴 가능 매장 찾습니다",
    content:
      "주말 야구 중계 타임에 맞춰 세트 프로모션 진행하려고 합니다. 치킨&피자 묶음 판매 + 맥주 할인 제휴 원해요. 작성 매장: 페퍼로니버튼",
    nick: "위켄드세일",
    ts: now - min(14),
    count: 4,
    thumb: pizza2,
    pairIcons: [iconPizzaChicken, iconBeer],
  },
  {
    id: 3,
    board: "제휴게시판",
    title: "학생 타깃 쌀국수 + 아이스아메리카노 세트 콜라보",
    content:
      "점심 시간대 학생 고객 대상 콜라보 제안합니다. 남월 쌀국수 + 아아 세트, 스탬프 적립 연동/포스터 제작 가능해요. 남월과 함께할 카페 찾습니다.",
    nick: "런치연합",
    ts: now - min(30),
    count: 2,
    pairIcons: [iconAsian, iconCoffee],
  },
  {
    id: 4,
    board: "제휴게시판",
    title: "파스타 디너세트 제휴(점심→저녁 20% 교차할인)",
    content:
      "파앤피 점심 세트 드신 고객께 저녁 타임에 한식/중식/일식 파트너 매장에서 20% 할인 제휴를 제안드립니다. 관심 매장 연락 주세요.",
    nick: "디너콜라보",
    ts: now - hr(2),
    count: 8,
    thumb: pasta2,
    pairIcons: [iconPasta, iconZza],
  },
  {
    id: 5,
    board: "제휴게시판",
    title: "초밥+디저트 상호 쿠폰 교환 원해요",
    content:
      "회전초밥집에서 평일 저녁대 디저트 카페와 상호 쿠폰 교환 희망합니다. 포스터/리그램 지원해요.",
    nick: "세트촬영",
    ts: now - hr(3),
    count: 5,
    thumb: sashimi,
    pairIcons: [iconSushi, iconCoffee],
  },
  {
    id: 6,
    board: "제휴게시판",
    title: "점심 김밥 세트 + 테이크아웃 커피 할인 제휴",
    content:
      "점심 포장 손님 많은 김밥 매장입니다. 인근 카페와 테이크아웃 할인 제휴 원해요.",
    nick: "김밥엔커피",
    ts: now - hr(4),
    count: 3,
    pairIcons: [iconAsian, iconCoffee],
  },
  {
    id: 7,
    board: "제휴게시판",
    title: "치킨&피자 야식 세트, 카페 라스트오더 연계",
    content:
      "야식 타임 주문에 카페 라스트오더 음료와 묶음 판매 제안합니다. 치킨&피자 매장과 카페 사장님 연락주세요.",
    nick: "야식연합",
    ts: now - hr(5),
    count: 6,
    pairIcons: [iconPizzaChicken, iconCoffee],
  },
  {
    id: 8,
    board: "제휴게시판",
    title: "참새방앗간 점심 도시락 × 카페 테이크아웃 상호 쿠폰",
    content:
      "한양대 에리카 인근 참새방앗간에서 점심 도시락 고객과 인근 카페 테이크아웃을 상호 쿠폰으로 연계하는 제휴 파트너를 찾습니다.",
    nick: "참새방앗간",
    ts: now - hr(6),
    count: 1,
    pairIcons: [iconAsian, iconCoffee],
  },
];

// =================== 로컬 글 저장/병합 유틸 ===================
const USER_KEY = "community:userPosts:v1";

function loadUserPosts(): Post[] {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // 타입 안전장치(최소 필드만 보정)
    return arr.map((p: any) => ({
      id: Number(p.id),
      board: p.board === "제휴게시판" ? "제휴게시판" : "자유게시판",
      title: String(p.title ?? ""),
      content: String(p.content ?? ""),
      nick: String(p.nick ?? "익명"),
      ts: Number(p.ts ?? Date.now()),
      count: Number(p.count ?? 0),
      thumb: p.thumb || undefined,
      pairIcons: p.pairIcons || undefined,
    })) as Post[];
  } catch {
    return [];
  }
}

function saveUserPosts(list: Post[]) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(list));
  } catch {}
}

/** 새 글 저장 → 새 id 반환 */
export function saveUserPost(input: {
  board: "자유게시판" | "제휴게시판";
  title: string;
  content: string;
  thumb?: string;
  pairIcons?: [string, string];
  nick?: string;
}): number {
  const id = Date.now(); // 간단 고유 ID
  const post: Post = {
    id,
    board: input.board,
    title: input.title,
    content: input.content,
    nick: input.nick ?? "익명",
    ts: Date.now(),
    count: 0,
    thumb: input.thumb,
    pairIcons: input.pairIcons,
  };
  const cur = loadUserPosts();
  saveUserPosts([post, ...cur]);
  return id;
}

/** 모든 글(로컬+더미) 머지 */
export function getAllPosts(): Post[] {
  return [...loadUserPosts(), ...freePosts, ...partnerPosts].sort(
    (a, b) => b.ts - a.ts
  );
}

/** id로 글 찾기(로컬 포함) */
export const getPostById = (id: number) =>
  [...loadUserPosts(), ...freePosts, ...partnerPosts].find((p) => p.id === id);

// (참고) 기존 allPosts 상수는 더 이상 사용 안 함
export const allPosts = [...freePosts, ...partnerPosts].sort(
  (a, b) => b.ts - a.ts
);
export function getCommentCount(id: number, fallback = 0): number {
  try {
    const raw = localStorage.getItem(`community:comments:${id}`);
    if (!raw) return fallback;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : fallback;
  } catch {
    return fallback;
  }
}
