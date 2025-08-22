// src/pages/Community/commentsOverrides.ts
export type ManualCommentSeed = {
  text: string;
  /** 글 작성 시점으로부터 +N분 뒤 (글보다 과거가 되지 않게 모두 조정됨) */
  minutesAfterPost?: number;
  /** 현재 시점에서 N분 전 (이번 설정에선 사용 안 함) */
  minutesAgo?: number;
};

/** 게시글별 초기 댓글(개수 줄여서 현실적으로 조정) */
export const COMMENTS_OVERRIDE: Record<
  number,
  ManualCommentSeed[] | undefined
> = {
  /* ===================== 자유게시판 ===================== */

  // id: 1000 (약 47분 전) — 8개만
  1000: [
    { text: "원가 폭등 기간엔 한시 품절 추천입니다.", minutesAfterPost: 2 },
    { text: "대체 과일로 시즌 한정 메뉴 가보세요.", minutesAfterPost: 6 },
    { text: "수박주스는 스몰 사이즈만 유지해 보세요.", minutesAfterPost: 10 },
    { text: "시세 연동 안내문 붙이면 컴플레인 줄어요.", minutesAfterPost: 16 },
    { text: "시럽/베이스로 단가 잡아보는 것도 방법.", minutesAfterPost: 22 },
    { text: "PB 주스랑 블렌딩 테스트 추천!", minutesAfterPost: 28 },
    { text: "대체메뉴(멜론, 파인) 반응 괜찮았어요.", minutesAfterPost: 34 },
    { text: "원가 정상화 때 깔끔하게 복귀 공지!", minutesAfterPost: 40 },
  ],

  // id: 101 (약 1분 전) — 너무 최근 → 1개만
  101: [{ text: "샘플 시식대가 체감 확실했어요.", minutesAfterPost: 1 }],

  // id: 102 (약 9분 전) — 3개
  102: [
    { text: "치즈볼이 회전 빠르고 마진도 좋더라구용ㅎㅎ", minutesAfterPost: 3 },
    { text: "감바스는 손은 가지만 객단가 올려줘요.", minutesAfterPost: 6 },
    { text: "꼬치는 포장+테이크아웃도 좋아요.", minutesAfterPost: 9 },
  ],

  // id: 103 (약 28분 전) — 4개
  103: [
    { text: "면은 80~90%만 삶고 소스에서 마무리!", minutesAfterPost: 4 },
    { text: "유니 비율은 7:3이 무난했어요.", minutesAfterPost: 10 },
    { text: "소스 점도는 약간 걸쭉 쪽이 무난.", minutesAfterPost: 18 },
    { text: "완성 직전 15초 강불 추천!", minutesAfterPost: 26 },
  ],

  // id: 104 (약 36분 전) — 5개
  104: [
    { text: "초밥 소량이라면 셋트 2~3종만 추천.", minutesAfterPost: 6 },
    {
      text: "밥은 미리 잡고 주문 즉시 토핑 하는건 어때요!?",
      minutesAfterPost: 12,
    },
    { text: "라스트오더에만 초밥 돌려도 좋아요.", minutesAfterPost: 18 },
    { text: "핸들링 교육 1일이면 충분했습니다.", minutesAfterPost: 24 },
    { text: "쇼케이스 노출이 회전율보다 중요했어요.", minutesAfterPost: 30 },
  ],

  // id: 105 (약 60분 전) — 5개
  105: [
    { text: "18,000원에서 이탈률 가장 낮았어요.", minutesAfterPost: 10 },
    {
      text: "비 오는 날만 15,000원으로 탄력 운영하는것도 좋더라구요",
      minutesAfterPost: 20,
    },
    { text: "사이드 번들로 객단가를 보정하는거 추천.", minutesAfterPost: 30 },
    { text: "요일별 A/B 테스트 2주 해보세요.", minutesAfterPost: 40 },
    { text: "수요 피크는 22~24시, 쿠폰은 21시로 고고", minutesAfterPost: 50 },
  ],

  // id: 106 (약 120분 전) — 4개
  106: [
    { text: "3000K/4000K 혼합 + 디머스위치 추천.", minutesAfterPost: 20 },
    { text: "테이블 위만 스폿으로 보완해요.", minutesAfterPost: 40 },
    { text: "입구/포스 주변은 4000K로 선명하게 합니다.", minutesAfterPost: 70 },
    { text: "조도 스위치 달아두면 편합니다.", minutesAfterPost: 100 },
  ],

  // id: 107 (약 180분 전) — 4개
  107: [
    {
      text: "참깨/브리오슈 2종만 운영하는게 깔끔해요..!!",
      minutesAfterPost: 30,
    },
    { text: "토스트 시간을 표준화 하는건 어때요??", minutesAfterPost: 60 },
    { text: "샘플 받고 수분율 꼭 체크하세요!", minutesAfterPost: 90 },
    { text: "분기 계약이 단가 유리했습니다.", minutesAfterPost: 150 },
  ],

  // id: 108 (약 240분 전) — 2개
  108: [
    {
      text: "비 오는 날은 최소금액↓ + 배달팁↑ 조합 좋아용!",
      minutesAfterPost: 60,
    },
    { text: "우천 시 무료추가 사이드가 반응 좋았어요.", minutesAfterPost: 120 },
  ],

  // id: 109 (약 300분 전) — 0개
  109: [],

  /* ===================== 제휴게시판 ===================== */

  // id: 1 (약 2분 전) — 너무 최근 → 1개
  1: [{ text: "010-1234-5678로 연락주세요", minutesAfterPost: 1 }],

  // id: 2 (약 14분 전) — 4개
  2: [
    { text: "010-1111-1111로 연락주세요", minutesAfterPost: 3 },
    { text: "offer@marketup.kr으로 메일주세요", minutesAfterPost: 7 },
    { text: "031-2222-2222로 연락주세요", minutesAfterPost: 10 },
    { text: "team@launchers.co으로 메일주세요", minutesAfterPost: 13 },
  ],

  // id: 3 (약 30분 전) — 2개
  3: [
    { text: "010-3333-3333로 연락주세요", minutesAfterPost: 5 },
    { text: "ops@plateunion.com으로 메일주세요", minutesAfterPost: 12 },
  ],

  // id: 4 (약 120분 전) — 6개
  4: [
    { text: "010-4444-4444로 연락주세요", minutesAfterPost: 10 },
    { text: "owner@shopmail.kr으로 메일주세요", minutesAfterPost: 25 },
    { text: "031-5555-5555로 연락주세요", minutesAfterPost: 45 },
    { text: "support@foodlane.io으로 메일주세요", minutesAfterPost: 70 },
    { text: "010-6666-6666로 연락주세요", minutesAfterPost: 95 },
    { text: "collab@brand.com으로 메일주세요", minutesAfterPost: 110 },
  ],

  // id: 5 (약 180분 전) — 5개
  5: [
    { text: "031-7777-7777로 연락주세요", minutesAfterPost: 15 },
    { text: "biz@company.kr으로 메일주세요", minutesAfterPost: 40 },
    { text: "010-8888-8888로 연락주세요", minutesAfterPost: 70 },
    { text: "contact@cafehub.co으로 메일주세요", minutesAfterPost: 110 },
    { text: "010-9999-9999로 연락주세요", minutesAfterPost: 160 },
  ],

  // id: 6 (약 240분 전) — 3개
  6: [
    { text: "hello@diningworks.io으로 메일주세요", minutesAfterPost: 25 },
    { text: "010-1212-1212로 연락주세요", minutesAfterPost: 60 },
    { text: "offer@marketup.kr으로 메일주세요", minutesAfterPost: 130 },
  ],

  // id: 7 (약 300분 전) — 6개
  7: [
    { text: "010-2323-2323로 연락주세요", minutesAfterPost: 30 },
    { text: "team@launchers.co으로 메일주세요", minutesAfterPost: 70 },
    { text: "010-3434-3434로 연락주세요", minutesAfterPost: 110 },
    { text: "ops@plateunion.com으로 메일주세요", minutesAfterPost: 150 },
    { text: "031-111-1111로 연락주세요", minutesAfterPost: 200 },
    { text: "owner@shopmail.kr으로 메일주세요", minutesAfterPost: 260 },
  ],

  // id: 8 (약 360분 전) — 1개
  8: [{ text: "support@foodlane.io으로 메일주세요", minutesAfterPost: 40 }],
};
