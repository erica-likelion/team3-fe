import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import s from "./PostDetail.module.scss";
import { getPostById, type Post } from "./communityData";
import ReplyArrow from "../../assets/ui/corner-down-right 3.svg";
import SendType3 from "../../assets/ui/Type3.svg";
import { COMMENTS_OVERRIDE, type ManualCommentSeed } from "./commentsOverrides";

type Comment = { id: number; nick: "익명"; ts: number; text: string };

const COMMENTS_KEY = (id: number) => `community:comments:${id}`;

// ===== 시간 고정(화면 체류 중 n분 전 안늘어남) =====
const nowFixed = Date.now();
const fmtAgo = (ts: number) => {
  const m = Math.max(1, Math.floor((nowFixed - ts) / 60000));
  return m < 60 ? `${m}분 전` : `${Math.floor(m / 60)}시간 전`;
};

// ===== 저장 =====
function loadComments(id: number): Comment[] {
  try {
    const raw = localStorage.getItem(COMMENTS_KEY(id));
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as Comment[]) : [];
  } catch {
    return [];
  }
}
function saveComments(id: number, list: Comment[]) {
  try {
    localStorage.setItem(COMMENTS_KEY(id), JSON.stringify(list));
  } catch {}
}

/** 아이콘 경로 → 업종 라벨 */
function labelFromIcon(src: string) {
  const s = src.toLowerCase();
  if (
    s.includes("pizzachicken") ||
    s.includes("pizza") ||
    s.includes("chicken")
  ) {
    return "피자/치킨";
  }
  if (s.includes("coffee")) return "카페/디저트";
  if (s.includes("asian")) return "아시안";
  if (s.includes("sushi")) return "일식";
  if (s.includes("pasta")) return "양식";
  if (s.includes("zza")) return "중식";
  if (s.includes("beer")) return "주점/술집";
  if (/(?:^|\/)zza(?:[._-]|$)/.test(s)) {
    return "중식";
  }

  return "업종";
}

/** 연락처/메일 풀(모두 다르게 보이도록 섞어서 사용) */
const PHONE_POOL = [
  "010-1732-0921",
  "010-8455-6612",
  "010-2207-9843",
  "010-9321-4407",
  "010-5578-3015",
  "010-4920-7719",
  "010-6631-2588",
  "010-7419-6004",
  "010-3166-8450",
  "010-9042-1108",
];
const MAIL_POOL = [
  "collab@brand.com",
  "partnership@sample.io",
  "biz@company.kr",
  "contact@cafehub.co",
  "hello@diningworks.io",
  "offer@marketup.kr",
  "team@launchers.co",
  "ops@plateunion.com",
  "owner@shopmail.kr",
  "support@foodlane.io",
];

/** 글 성격에 맞춘 시드 문구(쪽지/DM 금지, 전화·메일만) */
function seedTexts(p: Post): string[] {
  if (p.board === "제휴게시판") {
    // 포스트마다 다른 조합이 되도록 id를 섞어 인덱싱
    const baseIdx = Math.abs(p.id) % 10;
    return Array.from({ length: 8 }).map((_, i) =>
      i % 2 === 0
        ? `${PHONE_POOL[(baseIdx + i) % PHONE_POOL.length]}로 연락주세요`
        : `${MAIL_POOL[(baseIdx + i) % MAIL_POOL.length]}으로 메일주세요`
    );
  }

  // 자유게시판 – 다양하게
  const common = [
    "화이팅입니다!",
    "도움 됩니다 감사합니다.",
    "저도 비슷한 고민이었어요.",
    "리뷰 이벤트 한 번 열어보세요!",
    "손님 동선 바꿔보는 것도 추천해요.",
    "SNS 리그램 이벤트가 효과 있었어요.",
    "월세도 못 내겠어요 ^^;~~",
    "쿠폰은 소진 속도 보고 탄력 운영해보세요.",
  ];
  const t = (p.title + " " + p.content).toLowerCase();
  if (t.includes("배달") || t.includes("주문"))
    common.push(
      "비 오는 날은 최소금액 낮추는 게 체감 있어요.",
      "날씨별 탄력 운영 추천!"
    );
  if (t.includes("수박") || t.includes("원가"))
    common.push(
      "원가 오를 땐 한시적 품절도 방법입니다.",
      "대체 메뉴로 돌려보는 건 어떨까요?"
    );
  if (t.includes("조명") || t.includes("인테리어"))
    common.push(
      "전구 3000K/4000K 혼합이 무난했어요.",
      "조도 스위치 달아두면 편합니다."
    );
  return common;
}

/** “댓글은 절대 글보다 과거가 나오지 않게” 만드는 보정 */
function clampToPostWindow(postTs: number, ts: number) {
  const minTs = postTs + 60_000; // 글 이후 최소 +1분
  const maxTs = Math.max(minTs, nowFixed - 30_000); // 현재보다 살짝 이전
  return Math.min(Math.max(ts, minTs), maxTs);
}

/** 글 시간 이후로 자연스러운 댓글 시드(너무 최근 글이면 개수 줄임) */
function makeTimedComments(p: Post, want: number, pool: string[]): Comment[] {
  const elapsedMin = Math.max(0, Math.floor((nowFixed - p.ts) / 60000));
  const count = Math.min(want, Math.max(1, Math.min(8, elapsedMin)));
  const out: Comment[] = [];
  for (let i = 0; i < count; i++) {
    // 글~현재 사이에서 균등분포
    const ratio = (i + 1) / (count + 1);
    const est = p.ts + Math.floor((nowFixed - p.ts) * ratio);
    out.push({
      id: Date.now() + i,
      nick: "익명" as const,
      ts: clampToPostWindow(p.ts, est),
      text: pool[(i * 3) % pool.length], // 다양도 ↑
    });
  }
  return out;
}

/** 기존 댓글: 쪽지/DM 문구 제거 + 시간 보정 + 너무 많으면 최근만 남김 */
function sanitizeExisting(p: Post, list: Comment[]): Comment[] {
  const repls = [
    /쪽지[ ]?(주세요|드렸습니다|부탁)/gi,
    /dm|디엠/gi,
    /비밀 ?댓글/gi,
  ];
  const elapsedMin = Math.max(0, Math.floor((nowFixed - p.ts) / 60000));
  const keep = Math.min(list.length, Math.max(1, Math.min(8, elapsedMin))); // 최근만
  const kept = list.slice(-keep).map((c, i) => {
    let text = c.text;
    if (repls.some((r) => r.test(text))) {
      const idx = (p.id + i) % 10;
      text =
        i % 2 === 0
          ? `${PHONE_POOL[idx]}로 연락주세요`
          : `${MAIL_POOL[idx]}으로 메일주세요`;
    }
    // 시간도 글 이후로 보정
    const ratio = (i + 1) / (keep + 1);
    const est = p.ts + Math.floor((nowFixed - p.ts) * ratio);
    return { ...c, text, ts: clampToPostWindow(p.ts, est) };
  });
  return kept;
}

/** ▼ 오버라이드 시드 → 실제 댓글로 변환(시간 보정 포함) */
function fromManualSeeds(p: Post, seeds: ManualCommentSeed[]): Comment[] {
  return seeds.map((seed, i) => {
    let ts: number;
    if (typeof seed.minutesAfterPost === "number") {
      ts = p.ts + seed.minutesAfterPost * 60_000;
    } else if (typeof seed.minutesAgo === "number") {
      ts = nowFixed - seed.minutesAgo * 60_000;
    } else {
      // 지정이 없으면 글 이후 1분 간격
      ts = p.ts + (i + 1) * 60_000;
    }
    ts = clampToPostWindow(p.ts, ts); // 글보다 과거 금지
    return { id: Date.now() + i, nick: "익명" as const, ts, text: seed.text };
  });
}

export default function PostDetail() {
  const { id } = useParams();
  const post = getPostById(Number(id));

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");

  // 제휴 안내 라벨 (아이콘 -> 텍스트)
  const pairText = useMemo(() => {
    if (!post?.pairIcons || post.board !== "제휴게시판") return null;
    return {
      from: labelFromIcon(post.pairIcons[0]),
      to: labelFromIcon(post.pairIcons[1]),
    };
  }, [post]);

  // 초기 로드
  useEffect(() => {
    if (!post) return;

    // 1) 저장된 댓글이 있으면 그걸 사용 (보정만)
    const existing = loadComments(post.id);
    if (existing.length > 0) {
      const fixed = sanitizeExisting(post, existing);
      setComments(fixed);
      saveComments(post.id, fixed);
      return;
    }

    // 2) 게시물별 오버라이드가 있으면 "무조건" 그걸 사용
    const manual = COMMENTS_OVERRIDE[post.id];
    if (Array.isArray(manual)) {
      const list = fromManualSeeds(post, manual);
      setComments(list);
      saveComments(post.id, list);
      return;
    }

    // 3) 없으면 기존 count 기반 자동 시드
    if (post.count > 0) {
      const seeded = makeTimedComments(post, post.count, seedTexts(post));
      setComments(seeded);
      saveComments(post.id, seeded);
    }
  }, [post]);

  const onSend = () => {
    if (!post) return;
    const txt = input.trim();
    if (!txt) return;
    // 입력 댓글도 글 이후로 확실히
    const seq = comments.length + 1;
    const ratio = seq / (seq + 1);
    const est = post.ts + Math.floor((nowFixed - post.ts) * ratio);
    const newOne: Comment = {
      id: Date.now(),
      nick: "익명" as const,
      ts: clampToPostWindow(post.ts, est),
      text: txt,
    };
    const updated = [...comments, newOne];
    setComments(updated);
    saveComments(post.id, updated);
    setInput("");
  };

  if (!post) {
    return (
      <div className={s.wrap}>
        <div className={s.title}>게시글을 찾을 수 없습니다.</div>
      </div>
    );
  }

  return (
    <div className={s.wrap}>
      {/* 제휴 안내 라인: 제목 위, 간격 6, 좌우 20과 동일 폭(= 335) */}
      {pairText && (
        <div className={s.pairLine}>
          <span className={`${s.pill} ${s.pillOutline}`}>{pairText.from}</span>
          <span className={s.pairWord}>에서</span>
          <span className={`${s.pill} ${s.pillFill}`}>{pairText.to}</span>
          <span className={s.pairWord}>구하는 글이에요</span>
        </div>
      )}

      {/* 제목(TopBar와 24 간격), 본문 → 이미지 순서, 모두 폭 335 정렬 */}
      <div className={s.title}>{post.title}</div>
      <div className={s.content}>{post.content}</div>
      {post.thumb && (
        <div
          className={s.hero}
          style={{ backgroundImage: `url(${post.thumb})` }}
        />
      )}

      {/* 본문↔댓글 인포 사이 16px */}
      <div className={s.divider} aria-hidden />

      {/* 댓글 인포(폭 335 정렬) */}
      <div className={s.cmtHead}>댓글</div>

      {/* 댓글 리스트(좌 들여쓰기 20) / 비어있음 */}
      {comments.length === 0 ? (
        <div className={s.emptyWrap}>
          <div className={s.emptyIcon}>
            <img src={ReplyArrow} alt="" />
          </div>
          <div className={s.emptyText}>첫 댓글을 남겨 보세요</div>
        </div>
      ) : (
        <ul className={s.cmtList}>
          {comments.map((c) => (
            <li key={c.id} className={s.cmtItem}>
              <div className={s.cmtMeta}>
                <span className={s.cmtNick}>익명</span>
                <span className={s.cmtAgo}>{fmtAgo(c.ts)}</span>
              </div>
              <div className={s.cmtText}>{c.text}</div>
            </li>
          ))}
        </ul>
      )}

      {/* 아래 여백 28px 고정 + HomeIndicator와 붙도록(스크롤이 짧을 때도) */}
      <div className={s.inputWrap}>
        <input
          className={s.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="댓글을 입력하세요."
          onKeyDown={(e) => e.key === "Enter" && onSend()}
        />
        <button className={s.sendBtn} onClick={onSend} aria-label="댓글 등록">
          <img src={SendType3} alt="" />
        </button>
      </div>
    </div>
  );
}
