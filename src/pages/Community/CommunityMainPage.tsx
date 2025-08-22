// src/pages/Community/CommunityMainPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./CommunityMainPage.module.scss";
import { getCommentCount /* ... */ } from "./communityData";
import bannerImg from "../../assets/ui/Banner.png";
import arrowRightBlue from "../../assets/ui/arrow-right.png";
import arrowBetween from "../../assets/ui/arrow-right 3.svg";
import cornerOR from "../../assets/ui/corner-down-right.svg";
import cornerBL from "../../assets/ui/corner-down-right 2.svg";

import {
  freePosts,
  partnerPosts,
  type Post,
  type TabKey,
  getAllPosts,
} from "./communityData";

const now = Date.now();
const fmtAgo = (ts: number) => {
  const m = Math.max(1, Math.floor((now - ts) / 60000));
  if (m < 60) return `${m}분 전`;
  return `${Math.floor(m / 60)}시간 전`;
};
const shorten = (t: string, n: number) =>
  t.length > n ? t.slice(0, n) + "…" : t;

function pickHot(list: Post[]) {
  return list.reduce((best, p) => {
    if (!best) return p;
    const a = getCommentCount(p.id, p.count);
    const b = getCommentCount(best.id, best.count);
    if (a > b) return p;
    if (a === b && p.ts > best.ts) return p;
    return best;
  }, list[0]);
}

export default function CommunityMainPage() {
  const nav = useNavigate();
  const [tab, setTab] = useState<TabKey>("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    const h = () => setSearchOpen((v) => !v);
    window.addEventListener("community:toggleSearch", h as EventListener);
    return () =>
      window.removeEventListener("community:toggleSearch", h as EventListener);
  }, []);

  const baseList = useMemo(() => {
    if (tab === "all") return getAllPosts();
    if (tab === "free") return freePosts.slice().sort((a, b) => b.ts - a.ts);
    return partnerPosts.slice().sort((a, b) => b.ts - a.ts);
  }, [tab]);

  const list = useMemo(() => {
    if (!q.trim()) return baseList;
    const qq = q.trim();
    return baseList.filter((p) =>
      [p.title, p.content, p.nick].some((t) => t.includes(qq))
    );
  }, [baseList, q]);

  const hot = useMemo(() => {
    if (tab === "all") return pickHot(getAllPosts());
    if (tab === "free") return pickHot(freePosts);
    return pickHot(partnerPosts);
  }, [tab]);

  // ✅ 여기만 추가: SelectPlace로 이동
  const goSelectPlace = () => nav("/select-place");

  return (
    <div className={s.wrap}>
      <nav className={s.tabs}>
        <button
          className={`${s.tab} ${tab === "all" ? s.active : ""}`}
          onClick={() => setTab("all")}
        >
          전체 글
        </button>
        <div className={s.tabCenter}>
          <button
            className={`${s.tab} ${tab === "free" ? s.active : ""}`}
            onClick={() => setTab("free")}
          >
            자유게시판
          </button>
        </div>
        <button
          className={`${s.tab} ${tab === "partner" ? s.active : ""}`}
          onClick={() => setTab("partner")}
        >
          제휴게시판
        </button>
      </nav>

      {searchOpen && (
        <div className={s.searchBar}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="커뮤니티 글 검색"
            className={s.searchInput}
          />
        </div>
      )}

      <section className={s.hotSection}>
        <div className={s.hotTitle}>
          <span className={s.fire}>🔥</span>
          <span>지금 HOT한 게시글</span>
        </div>

        <div
          className={s.hotCard}
          onClick={() => nav(`/community/post/${hot.id}`)}
        >
          <div className={s.hotCardTitle}>{hot.title}</div>
          <div className={s.hotCardPreview}>{shorten(hot.content, 60)}</div>
          <div className={s.hotMeta}>
            <span className={s.hotNick}>익명</span>
            <span className={s.hotAgoOR}>{fmtAgo(hot.ts)}</span>
            <div className={s.flex1} />
            <span className={`${s.reply} ${s.replyOR}`}>
              <span className={`${s.replyIcon} ${s.replyIconHot}`}>
                <img src={cornerOR} alt="" />
              </span>
              <span className={s.replyNum}>
                {getCommentCount(hot.id, hot.count)}
              </span>
            </span>
          </div>
        </div>
        {/* HOT 섹션 아래 배너 */}
        <div
          className={s.banner}
          role="button"
          tabIndex={0}
          onClick={() => nav("/select-place")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              nav("/select-place");
            }
          }}
        >
          <img src={bannerImg} className={s.bannerImg} alt="banner" />
          <div className={s.bannerTop}>
            우리 지역의 진짜 핫플을 알고 싶다면?
          </div>

          <div className={s.bannerMid}>
            <span className={s.bannerMidInner}>
              <span className={s.bannerHeadGrad}>
                내 창업조건에 맞춘 1:1 매물 적합도 분석
              </span>
              <img src={arrowRightBlue} alt="" className={s.bannerArrowBlue} />
            </span>
          </div>

          <div className={s.bannerBottom}>
            손익분기점 예측부터 동종업계 후기 분석 기반 전략 제안까지
          </div>
        </div>
      </section>

      <section className={s.newSection}>
        <div className={s.newTitle}>
          <span className={s.eyes}>👀</span>
          <span>따끈한 NEW 게시글</span>
        </div>

        <ul className={s.postList}>
          {list.map((p) => {
            const isPartner = p.board === "제휴게시판";
            return (
              <li
                key={p.id}
                className={s.postItem}
                onClick={() => nav(`/community/post/${p.id}`)}
              >
                <div className={s.postText}>
                  <div className={s.badgeRow}>
                    <span className={isPartner ? s.badgeOR : s.badgeBL}>
                      {p.board}
                    </span>
                    {isPartner && p.pairIcons && (
                      <span className={s.pairChip}>
                        <img src={p.pairIcons[0]} alt="" />
                        <img
                          src={arrowBetween}
                          alt=""
                          className={s.pairArrow}
                        />
                        <img src={p.pairIcons[1]} alt="" />
                      </span>
                    )}
                  </div>
                  <div className={s.postTitle}>{p.title}</div>
                  <div className={s.postPreview}>{shorten(p.content, 60)}</div>
                  <div className={s.postMeta}>
                    <span className={s.postNick}>익명</span>
                    <span className={isPartner ? s.agoOR : s.agoBL}>
                      {fmtAgo(p.ts)}
                    </span>
                  </div>
                </div>

                <div className={s.postRight}>
                  {p.thumb ? (
                    <div
                      className={s.thumb}
                      style={{ backgroundImage: `url(${p.thumb})` }}
                    />
                  ) : (
                    <div className={s.thumbPlaceholder} />
                  )}
                  <div
                    className={`${s.reply} ${
                      isPartner ? s.replyOR : s.replyBL
                    }`}
                  >
                    <span
                      className={`${s.replyIcon} ${
                        isPartner ? s.replyIconOR : s.replyIconBL
                      }`}
                    >
                      <img src={isPartner ? cornerOR : cornerBL} alt="" />
                    </span>
                    <span className={s.replyNum}>
                      {getCommentCount(p.id, p.count)}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <button className={s.fab} onClick={() => nav("/community/post/new")}>
        새 글쓰기
      </button>
    </div>
  );
}
