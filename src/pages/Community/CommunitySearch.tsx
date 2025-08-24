import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import cs from "./CommunitySearch.module.scss";

import SearchIcon from "../../assets/ui/SearchButton.svg";
import CloseSmall from "../../assets/ui/CloseButton.svg";
import arrowBetween from "../../assets/ui/arrow-right 3.svg";
import cornerOR from "../../assets/ui/corner-down-right.svg";
import cornerBL from "../../assets/ui/corner-down-right 2.svg";

import RadioSheet from "../../components/BottomSheet/RadioSheet";

import { getAllPosts, type Post } from "./communityData";

type Scope = "all" | "title" | "nick" | "content";

const STORAGE_KEY = "communitySearchHistory_v1";

// 시간 포맷(‘n분 전 / n시간 전’)
const now = Date.now();
const fmtAgo = (ts: number) => {
  const m = Math.max(1, Math.floor((now - ts) / 60000));
  if (m < 60) return `${m}분 전`;
  return `${Math.floor(m / 60)}시간 전`;
};

// 최대 60자 … 처리
const shorten = (t: string, n: number) =>
  t.length > n ? t.slice(0, n) + "…" : t;

// scope 라벨
const scopeLabel = (s: Scope) =>
  s === "all"
    ? "전체 검색 결과"
    : s === "title"
    ? "제목으로 검색"
    : s === "nick"
    ? "작성자로 검색"
    : "본문으로 검색";

// 히스토리 읽기/쓰기
const readHistory = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? (list as string[]) : [];
  } catch {
    return [];
  }
};
const writeHistory = (list: string[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 10)));
  } catch {}
};

export default function CommunitySearch() {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [history, setHistory] = useState<string[]>(() => readHistory());

  useEffect(() => {
    // 페이지 들어오면 자동 포커스
    inputRef.current?.focus();
  }, []);

  // 검색 실행
  const doSearch = (term: string) => {
    const qq = term.trim();
    setQ(qq);
    if (!qq) return;
    // 히스토리 갱신(중복 제거 + 최신 우선)
    const next = [qq, ...history.filter((h) => h !== qq)];
    setHistory(next);
    writeHistory(next);
  };

  // 결과 계산
  const results = useMemo(() => {
    const qq = q.trim();
    if (!qq) return [] as Post[];
    const keys: Array<"title" | "nick" | "content"> =
      scope === "all" ? ["title", "nick", "content"] : [scope];

    const allPosts = getAllPosts();
    return allPosts
      .filter((p) => keys.some((k) => (p as any)[k].includes(qq)))
      .sort((a, b) => b.ts - a.ts);
  }, [q, scope]);

  // 히스토리 제안
  const suggestions = useMemo(() => {
    const t = q.trim();
    if (!t) return history;
    return history.filter((h) => h.includes(t));
  }, [q, history]);

  const clearInput = () => setQ("");

  return (
    <div className={cs.wrap}>
      {/* 검색 입력 영역 */}
      <div className={cs.searchRow}>
        <div className={cs.searchBox}>
          <img src={SearchIcon} alt="" className={cs.searchIcon} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") doSearch(q);
            }}
            placeholder="제목, 작성자, 본문으로 검색"
          />
          {q && (
            <button
              className={cs.clearBtn}
              onClick={clearInput}
              aria-label="지우기"
            >
              <img src={CloseSmall} alt="" />
            </button>
          )}
        </div>

        <button className={cs.scopeBtn} onClick={() => setSheetOpen(true)}>
          {scopeLabel(scope)}
        </button>
      </div>

      {/* 입력 중 히스토리/제안 */}
      {!q && history.length > 0 && (
        <ul className={cs.historyList}>
          {history.map((h) => (
            <li key={h}>
              <button
                type="button"
                className={cs.historyItem}
                onClick={() => doSearch(h)}
              >
                {h}
              </button>
            </li>
          ))}
        </ul>
      )}
      {q && suggestions.length > 0 && (
        <ul className={cs.suggestList}>
          {suggestions.map((sug) => (
            <li key={sug}>
              <button
                type="button"
                className={cs.suggestItem}
                onClick={() => doSearch(sug)}
              >
                {sug}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 결과 리스트 */}
      {q && (
        <ul className={cs.postList}>
          {results.map((p) => {
            const isPartner = p.board === "제휴게시판";
            return (
              <li
                key={p.id}
                className={cs.postItem}
                onClick={() => nav(`/community/post/${p.id}`)}
              >
                <div className={cs.postText}>
                  <div className={cs.badgeRow}>
                    <span className={isPartner ? cs.badgeOR : cs.badgeBL}>
                      {p.board}
                    </span>
                    {isPartner && p.pairIcons && (
                      <span className={cs.pairChip}>
                        <img src={p.pairIcons[0]} alt="" />
                        <img
                          src={arrowBetween}
                          alt=""
                          className={cs.pairArrow}
                        />
                        <img src={p.pairIcons[1]} alt="" />
                      </span>
                    )}
                  </div>
                  <div className={cs.postTitle}>{p.title}</div>
                  <div className={cs.postPreview}>{shorten(p.content, 60)}</div>
                  <div className={cs.postMeta}>
                    <span className={cs.postNick}>{p.nick}</span>
                    <span className={isPartner ? cs.agoOR : cs.agoBL}>
                      {fmtAgo(p.ts)}
                    </span>
                  </div>
                </div>

                <div className={cs.postRight}>
                  {p.thumb ? (
                    <div
                      className={cs.thumb}
                      style={{ backgroundImage: `url(${p.thumb})` }}
                    />
                  ) : (
                    <div className={cs.thumbPlaceholder} />
                  )}
                  <div
                    className={`${cs.reply} ${
                      isPartner ? cs.replyOR : cs.replyBL
                    }`}
                  >
                    <span
                      className={`${cs.replyIcon} ${
                        isPartner ? cs.replyIconOR : cs.replyIconBL
                      }`}
                    >
                      <img src={isPartner ? cornerOR : cornerBL} alt="" />
                    </span>
                    <span className={cs.replyNum}>{p.count}</span>
                  </div>
                </div>
              </li>
            );
          })}
          {q && results.length === 0 && (
            <li className={cs.empty}>검색 결과가 없습니다.</li>
          )}
        </ul>
      )}

      {/* 라디오 시트 */}
      <RadioSheet
        open={sheetOpen}
        title="검색 조건"
        items={[
          { key: "all", label: "전체 검색 결과 보기" },
          { key: "title", label: "제목으로 검색" },
          { key: "nick", label: "작성자로 검색" },
          { key: "content", label: "본문으로 검색" },
        ]}
        initial={scope}
        variant="radio"
        onClose={() => setSheetOpen(false)}
        onApply={(v) => {
          setSheetOpen(false);
          setScope((v as Scope) ?? "all");
          // 조건 바꾸면 다시 검색 유지
          if (q) doSearch(q);
        }}
      />
    </div>
  );
}
