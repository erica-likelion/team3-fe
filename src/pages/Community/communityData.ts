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

// =================== 로컬 글 저장/병합 유틸 ===================
const USER_KEY = "community:userPosts:v1";

function loadUserPosts(): Post[] {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    // 타입 안전장치(최소 필드만 보정)
    return arr.map((p: unknown) => ({
      id: Number((p as any).id),
      board: (p as any).board === "제휴게시판" ? "제휴게시판" : "자유게시판",
      title: String((p as any).title ?? ""),
      content: String((p as any).content ?? ""),
      nick: String((p as any).nick ?? "익명"),
      ts: Number((p as any).ts ?? Date.now()),
      count: Number((p as any).count ?? 0),
      thumb: (p as any).thumb || undefined,
      pairIcons: (p as any).pairIcons || undefined,
    })) as Post[];
  } catch {
    return [];
  }
}

function saveUserPosts(list: Post[]) {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(list));
  } catch {
    // 로컬 스토리지 저장 실패 시 무시
  }
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

/** 모든 글(로컬) 머지 */
export function getAllPosts(): Post[] {
  return loadUserPosts().sort((a, b) => b.ts - a.ts);
}

/** id로 글 찾기(로컬 포함) */
export const getPostById = (id: number) =>
  loadUserPosts().find((p) => p.id === id);

export function getCommentCount(id: number, fallback = 0): number {
  // fallback이 0이 아닌 경우 (서버에서 받은 commentCount) 우선 사용
  if (fallback > 0) {
    return fallback;
  }

  // 로컬 스토리지에서 댓글 수 확인 (기존 로직)
  try {
    const raw = localStorage.getItem(`community:comments:${id}`);
    if (!raw) return fallback;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.length : fallback;
  } catch {
    return fallback;
  }
}
