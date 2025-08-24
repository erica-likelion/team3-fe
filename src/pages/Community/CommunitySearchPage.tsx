import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./CommunitySearchPage.module.scss";

import SearchBtn2 from "../../assets/ui/SearchButton 2.svg"; // 입력 전 (OR)
import SearchGray from "../../assets/ui/search.svg"; // 결과 상단 드롭다운(회색)
import DeleteButton from "../../assets/ui/DeleteButton.svg"; // 입력 중 X(OR)
import XIcon from "../../assets/ui/x.svg"; // 검색기록 X
import ChevronDown from "../../assets/ui/chevron-down 2.svg";

import arrowBetween from "../../assets/ui/arrow-right 3.svg";
import cornerOR from "../../assets/ui/corner-down-right.svg";
import cornerBL from "../../assets/ui/corner-down-right 2.svg";

import RadioSheet from "../../components/BottomSheet/RadioSheet";

import { getAllPosts, type Post } from "./communityData";

type Field = "all" | "title" | "nick" | "content";

/** ✅ 결과 범위 버튼 라벨 매핑 */
const FIELD_LABEL: Record<Field, string> = {
  all: "전체 검색 결과",
  title: "제목으로 검색",
  nick: "작성자로 검색",
  content: "본문으로 검색",
};

const now = Date.now();
const fmtAgo = (ts: number) => {
  const m = Math.max(1, Math.floor((now - ts) / 60000));
  return m < 60 ? `${m}분 전` : `${Math.floor(m / 60)}시간 전`;
};
const shorten = (t: string, n: number) =>
  t.length > n ? t.slice(0, n) + "…" : t;

function highlightHit(text: string, q: string) {
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return <>{text}</>;
  return (
    <>
      <span className={s.hlBk}>{text.slice(0, i)}</span>
      <span className={s.hlOr}>{text.slice(i, i + q.length)}</span>
      <span className={s.hlBk}>{text.slice(i + q.length)}</span>
    </>
  );
}

export default function CommunitySearchPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);

  // URL ?q= 파라미터(결과 모드 기준)
  const qParam = useMemo(() => {
    const p = new URLSearchParams(loc.search).get("q") ?? "";
    return p.trim();
  }, [loc.search]);
  const isResult = qParam.length > 0;

  // 입력창 상태(타이핑 모드)
  const [q, setQ] = useState("");
  const [field, setField] = useState<Field>("all");
  const [sheetOpen, setSheetOpen] = useState(false);

  // ✅ 현재 선택된 범위 라벨
  const scopeLabel = useMemo(() => FIELD_LABEL[field], [field]);

  // 검색 기록 (로컬에 저장)
  const [history, setHistory] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem("community:searchHistory") || "[]"
      );
    } catch {
      return [];
    }
  });

  // 화면 진입/URL 변경 시 입력값 동기화 + 포커스
  useEffect(() => {
    if (isResult) {
      setQ(qParam);
    } else {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [isResult, qParam]);

  // 검색 실행 → /community/search?q=...
  const goSearch = (keyword: string) => {
    const key = keyword.trim();
    if (!key) return;
    const next = [key, ...history.filter((v) => v !== key)].slice(0, 10);
    localStorage.setItem("community:searchHistory", JSON.stringify(next));
    setHistory(next);
    nav(`/community/search?q=${encodeURIComponent(key)}`);
  };

  // 입력 중 자동완성
  const suggestions = useMemo(() => {
    const key = q.trim();
    if (!key) return [];
    const allPosts = getAllPosts();
    const pool = allPosts.flatMap((p) => [p.title, p.content, p.nick, p.board]);
    const uniq: string[] = [];
    for (const t of pool) {
      const sText = String(t);
      if (sText.toLowerCase().includes(key.toLowerCase())) {
        if (!uniq.includes(sText)) uniq.push(sText);
      }
      if (uniq.length >= 8) break;
    }
    return uniq.map((t) => {
      const display = shorten(t, 60);
      return (
        <li key={`s-${t}`}>
          <button
            type="button"
            className={s.suggestItem}
            onClick={() => goSearch(key)}
          >
            {highlightHit(display, key)}
          </button>
        </li>
      );
    });
  }, [q]); // eslint-disable-line react-hooks/exhaustive-deps

  // 결과 리스트
  const results: Post[] = useMemo(() => {
    if (!isResult) return [];
    const key = qParam;
    const allPosts = getAllPosts();
    const matchers = {
      all: (p: Post) =>
        [p.title, p.content, p.nick].some((t) => t.includes(key)),
      title: (p: Post) => p.title.includes(key),
      nick: (p: Post) => p.nick.includes(key),
      content: (p: Post) => p.content.includes(key),
    };
    return allPosts.filter(matchers[field]);
  }, [isResult, qParam, field]);

  const clearQ = () => setQ("");

  const removeHistory = (word: string) => {
    const next = history.filter((w) => w !== word);
    localStorage.setItem("community:searchHistory", JSON.stringify(next));
    setHistory(next);
  };

  return (
    <div className={s.wrap}>
      {/* ===== 검색 입력 화면 ===== */}
      {!isResult && (
        <>
          <div className={s.searchRow}>
            <div
              className={s.searchBar}
              role="search"
              onKeyDown={(e) => {
                if (e.key === "Enter") goSearch(q);
              }}
            >
              {!q && <img src={SearchBtn2} className={s.searchIcon} alt="" />}
              <input
                ref={inputRef}
                className={s.searchInput}
                placeholder="제목, 작성자, 본문으로 검색"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
              {!!q && (
                <button
                  type="button"
                  className={s.clearBtn}
                  onClick={clearQ}
                  aria-label="지우기"
                >
                  <img src={DeleteButton} alt="" width={18} height={18} />
                </button>
              )}
            </div>
          </div>

          {/* 자동완성 */}
          {!!q && <ul className={s.suggestList}>{suggestions}</ul>}

          {/* 검색 기록 */}
          {!q && history.length > 0 && (
            <ul className={s.historyList} aria-label="검색 기록">
              {history.map((word) => (
                <li key={word} className={s.historyRow}>
                  <button
                    type="button"
                    className={s.historyWord}
                    onClick={() => goSearch(word)}
                  >
                    {word}
                  </button>
                  <button
                    type="button"
                    className={s.historyDel}
                    onClick={() => removeHistory(word)}
                    aria-label={`${word} 삭제`}
                  >
                    <img src={XIcon} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {/* ===== 검색 결과 화면 ===== */}
      {isResult && (
        <>
          <div className={s.resultHead}>
            <div className={s.resultDropdown}>
              <img src={SearchGray} className={s.resultSearchIcon} alt="" />
              <span className={s.resultPhrase}>{qParam}에 대한 검색 결과</span>
            </div>

            <button
              type="button"
              className={s.resultScopeBtn}
              onClick={() => setSheetOpen(true)}
            >
              <span>{scopeLabel}</span> {/* ✅ 선택한 필드명으로 표시 */}
              <img src={ChevronDown} alt="" className={s.scopeChev} />
            </button>
          </div>

          <ul className={s.resultList}>
            {results.map((p) => {
              const partner = p.board === "제휴게시판";
              return (
                <li
                  key={p.id}
                  className={s.item}
                  onClick={() => nav(`/community/post/${p.id}`)}
                >
                  <div className={s.rowHead}>
                    <span
                      className={`${s.badge} ${
                        partner ? s.badgeOR : s.badgeBL
                      }`}
                    >
                      {p.board}
                    </span>
                    {partner && p.pairIcons && (
                      <span className={s.pairChip}>
                        <img src={p.pairIcons[0]} alt="" />
                        <img
                          className={s.pairArrow}
                          src={arrowBetween}
                          alt=""
                        />
                        <img src={p.pairIcons[1]} alt="" />
                      </span>
                    )}
                  </div>

                  <div className={s.itemBody}>
                    <div className={s.texts}>
                      <div className={s.title}>{p.title}</div>
                      <div className={s.preview}>{shorten(p.content, 60)}</div>
                      <div className={s.meta}>
                        <span className={s.nick}>{p.nick}</span>
                        <span className={partner ? s.timeOR : s.timeBL}>
                          {fmtAgo(p.ts)}
                        </span>
                      </div>
                    </div>

                    {p.thumb ? (
                      <div
                        className={s.thumb}
                        style={{ backgroundImage: `url(${p.thumb})` }}
                      />
                    ) : (
                      <div className={s.thumbPlaceholder} />
                    )}
                  </div>

                  <div
                    className={`${s.reply} ${partner ? s.replyOR : s.replyBL}`}
                  >
                    <span
                      className={`${s.replyIcon} ${
                        partner ? s.replyIconOR : s.replyIconBL
                      }`}
                    >
                      <img src={partner ? cornerOR : cornerBL} alt="" />
                    </span>
                    <span className={s.replyNum}>{p.count}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <RadioSheet
            open={sheetOpen}
            title="검색 조건"
            items={[
              { key: "all", label: "전체 검색 결과 보기" },
              { key: "title", label: "제목으로 검색" },
              { key: "nick", label: "작성자로 검색" },
              { key: "content", label: "본문으로 검색" },
            ]}
            initial={field}
            variant="radio"
            onClose={() => setSheetOpen(false)}
            onApply={(v) => {
              if (v) setField(v as Field);
              setSheetOpen(false);
            }}
          />
        </>
      )}
    </div>
  );
}
