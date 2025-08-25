import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import s from "./PostDetail.module.scss";
import { type Post } from "./communityData";
import ReplyArrow from "../../assets/ui/corner-down-right 3.svg";
import SendType3 from "../../assets/ui/Type3.svg";
import {
  getPostById as getServerPost,
  submitComment,
  type ServerPost,
} from "../../services/api";

type Comment = { id: number; nick: string; ts: number; text: string };

// ===== 시간 고정(화면 체류 중 n분 전 안늘어남) =====
const nowFixed = Date.now();
const fmtAgo = (ts: number) => {
  const m = Math.max(1, Math.floor((nowFixed - ts) / 60000));
  return m < 60 ? `${m}분 전` : `${Math.floor(m / 60)}시간 전`;
};

// 서버 데이터를 로컬 Post 형식으로 변환하는 함수
const convertServerPostToLocal = (serverPost: ServerPost): Post => {
  const createdAt = new Date(serverPost.createdAt).getTime();

  // imageUrl을 완전한 URL로 변환
  let fullImageUrl = undefined;
  if (serverPost.imageUrl) {
    // 상대 경로인 경우 API 베이스 URL과 결합
    if (serverPost.imageUrl.startsWith("/")) {
      fullImageUrl = `${import.meta.env.VITE_API_BASE_URL}${
        serverPost.imageUrl
      }`;
    } else {
      fullImageUrl = serverPost.imageUrl;
    }
  }

  return {
    id: serverPost.id,
    board: serverPost.category === "PARTNERSHIP" ? "제휴게시판" : "자유게시판",
    title: serverPost.title,
    content: serverPost.content,
    nick: "익명", // 서버에서 author 필드가 없으므로 기본값 사용
    ts: createdAt,
    count: 0, // 서버에서 commentCount 필드가 없으므로 기본값 사용
    thumb: fullImageUrl,
    pairIcons:
      serverPost.category === "PARTNERSHIP" &&
      serverPost.myStoreCategory &&
      serverPost.partnerStoreCategory
        ? [
            getCategoryIcon(serverPost.myStoreCategory),
            getCategoryIcon(serverPost.partnerStoreCategory),
          ]
        : undefined,
  };
};

// 서버 댓글을 로컬 Comment 형식으로 변환하는 함수
const convertServerCommentToLocal = (serverComment: {
  id: number;
  content: string;
  createdAt: string;
}): Comment => {
  return {
    id: serverComment.id,
    nick: "익명", // 서버에서 userName 필드가 없으므로 기본값 사용
    ts: new Date(serverComment.createdAt).getTime(),
    text: serverComment.content,
  };
};

// 카테고리별 아이콘 매핑 함수
const getCategoryIcon = (category: string): string => {
  const iconMap: { [key: string]: string } = {
    "카페/디저트": "/src/assets/categories/coffee.png",
    "피자/치킨": "/src/assets/categories/pizzachicken.png",
    "주점/술집": "/src/assets/categories/beer.png",
    패스트푸드: "/src/assets/categories/hamboogi.png",
    한식: "/src/assets/categories/bibim.png",
    아시안: "/src/assets/categories/asian.png",
    양식: "/src/assets/categories/pasta.png",
    중식: "/src/assets/categories/zza.png",
    일식: "/src/assets/categories/sushi.png",
  };
  return iconMap[category] || "/src/assets/categories/coffee.png";
};

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

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 서버에서 게시물 데이터와 댓글 목록 가져오기
  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const serverPost = await getServerPost(Number(id));
        if (serverPost) {
          const convertedPost = convertServerPostToLocal(serverPost);
          setPost(convertedPost);

          // 댓글 목록 변환
          if (serverPost.comments && Array.isArray(serverPost.comments)) {
            const convertedComments = serverPost.comments.map(
              convertServerCommentToLocal
            );
            setComments(convertedComments);
          } else {
            setComments([]);
          }

          setError(null);
        } else {
          setError("게시물을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("게시물 로드 실패:", err);
        setError("게시물을 불러오는데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  // 제휴 안내 라벨 (아이콘 -> 텍스트)
  const pairText = useMemo(() => {
    if (!post?.pairIcons || post.board !== "제휴게시판") return null;
    return {
      from: labelFromIcon(post.pairIcons[0]),
      to: labelFromIcon(post.pairIcons[1]),
    };
  }, [post]);

  const onSend = async () => {
    if (!post || !id) return;
    const txt = input.trim();
    if (!txt) return;

    try {
      setSubmitting(true);

      // 서버에 댓글 전송
      const serverComment = await submitComment(Number(id), { content: txt });

      // 서버 응답을 로컬 Comment 형식으로 변환
      const newComment: Comment = {
        id: serverComment.id,
        nick: "익명", // 서버에서 userName 필드가 없으므로 기본값 사용
        ts: new Date(serverComment.createdAt).getTime(),
        text: serverComment.content,
      };

      // 로컬 상태 업데이트
      const updated = [...comments, newComment];
      setComments(updated);
      setInput("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
      alert("댓글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  };

  // 로딩 중일 때 표시
  if (loading) {
    return (
      <div className={s.wrap}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          게시물을 불러오는 중...
        </div>
      </div>
    );
  }

  // 에러가 있을 때 표시
  if (error || !post) {
    return (
      <div className={s.wrap}>
        <div className={s.title}>{error || "게시글을 찾을 수 없습니다."}</div>
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
                <span className={s.cmtNick}>{c.nick}</span>
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
          onKeyDown={(e) => e.key === "Enter" && !submitting && onSend()}
          disabled={submitting}
        />
        <button
          className={s.sendBtn}
          onClick={onSend}
          aria-label="댓글 등록"
          disabled={submitting}
        >
          <img src={SendType3} alt="" />
        </button>
      </div>
    </div>
  );
}
