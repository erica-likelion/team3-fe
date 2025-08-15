// src/pages/Output/OutputMainPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import s from "./OutputMainPage.module.scss";

import ChevronDown from "../../assets/ui/chevron-down.svg";
import ArrowRight from "../../assets/ui/arrow-right 2.png";

import IconBudget from "../../assets/ui/Budget.png";
import IconLocation from "../../assets/ui/Location.png";
import IconTarget from "../../assets/ui/Target.png";

import OutputExitConfirmModal from "../../components/ExitConfirmModal/OutputExitConfirmModal";
import type { AnalysisResponse, AnalysisRequest } from "../../api/analysis";

/* ---------------------------------- */
/* 작은 컴포넌트: 원형 점수 그래프      */
/* 12시 시작, 시계 방향으로 차오르게   */
/* ---------------------------------- */
function ScoreDonut({
  score = 60.4,
  size = 150,
}: {
  score?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, score));
  const stroke = 18; // 두께
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const filled = (pct / 100) * c;
  const dash = c;
  const offset = c - filled; // 12시부터 시계방향 진행

  return (
    <div className={s.donutWrap} style={{ width: size, height: size }}>
      <svg className={s.donutSvg} width={size} height={size}>
        {/* 트랙 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--OR300)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* 프로그레스 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--PRIMARYOR)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={dash}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={s.donutCenter}>
        <span className={s.donutScore}>{score.toFixed(1)}점</span>
      </div>
    </div>
  );
}

/* ------------------------------ */
/* 아코디언 아이템                */
/* ------------------------------ */
type AccordionProps = {
  icon: string;
  title: string;
  scoreText: string;
  body: string;
  defaultOpen?: boolean;
};
function AccordionItem({
  icon,
  title,
  scoreText,
  body,
  defaultOpen = false,
}: AccordionProps) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className={`${s.acc} ${open ? s.accOpen : ""}`}>
      <button className={s.accHead} onClick={() => setOpen((v) => !v)}>
        <div className={s.accLeft}>
          <img src={icon} alt="" className={s.accIcon} />
          <span className={s.accTitle}>{title}</span>
        </div>
        <div className={s.accRight}>
          <span className={s.accPoint}>{scoreText}</span>
          <img
            src={ChevronDown}
            alt=""
            className={`${s.chev} ${open ? s.chevOpen : ""}`}
          />
        </div>
      </button>
      {open && (
        <div className={s.accBody}>
          <i className={s.accDivider} aria-hidden />
          <p className={s.accText}>{body}</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ */
/* 추천 카드                       */
/* ------------------------------ */
function RecoItem({
  title,
  subtitle,
  score,
}: {
  title: string;
  subtitle: string;
  score: string;
}) {
  return (
    <button className={s.reco}>
      <div className={s.recoTexts}>
        <div className={s.recoTitle}>{title}</div>
        <div className={s.recoSub}>{subtitle}</div>
      </div>
      <div className={s.recoRight}>
        <span className={s.recoScore}>{score}</span>
        <img src={ArrowRight} alt="" className={s.recoArrow} />
      </div>
    </button>
  );
}

/* ------------------------------ */
/* 페이지                          */
/* ------------------------------ */
export default function OutputMainPage() {
  const navigate = useNavigate();

  // 라우트 state로 넘겨받은 응답/요청
  const { state } = useLocation() as {
    state?: { analysis?: AnalysisResponse; payload?: AnalysisRequest };
  };
  const analysis = state?.analysis;
  const payload = state?.payload;

  // 총점(평균) 계산
  const totalScore = useMemo(() => {
    if (!analysis?.scores?.length) return 60.4;
    const sum = analysis.scores.reduce(
      (acc, cur) => acc + (typeof cur.score === "number" ? cur.score : 0),
      0
    );
    return Math.round((sum / analysis.scores.length) * 10) / 10;
  }, [analysis]);

  // 항목 점수/사유
  const scAccess = analysis?.scores?.find(
    (s) => s.name.includes("접근") || s.name.includes("위치")
  );
  const scBudget = analysis?.scores?.find((s) => s.name.includes("예산"));
  const scMarket = analysis?.scores?.find(
    (s) => s.name.includes("메뉴") || s.name.includes("시장")
  );

  const fmtScore = (n?: number) =>
    typeof n === "number" ? `${Math.round(n)}점` : "00점";
  const safeReason = (r?: string) =>
    r && r.trim().length ? r : "자세한 근거가 준비되는 대로 표시됩니다.";

  // 상단 메타 표시용(요청 바디에서)
  const metaArea = payload?.marketingArea ?? "선택 지역";
  const metaBudget =
    payload?.budget?.min != null && payload?.budget?.max != null
      ? `월세 ${payload.budget.min}~${payload.budget.max}만원`
      : payload?.budget?.min != null
      ? `월세 ${payload.budget.min}만원~`
      : payload?.budget?.max != null
      ? `월세 ~${payload.budget.max}만원`
      : "월세 미지정";

  const metaSize =
    payload?.size?.min != null && payload?.size?.max != null
      ? `${payload.size.min}~${payload.size.max}평`
      : "평수 미지정";
  const metaFloor =
    payload?.height != null ? `${payload.height}층` : "층수 미지정";

  // X(닫기) 모달
  const [showExit, setShowExit] = useState(false);
  const closeExit = () => setShowExit(false);
  const goHome = () => {
    setShowExit(false);
    navigate("/");
  };

  // 탑바 X 가로채기
  useEffect(() => {
    const selector =
      '.topbar-x, [data-role="topbar-close"], [aria-label="닫기"], [aria-label="Close"]';
    const onCaptureClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(selector)) {
        e.preventDefault();
        e.stopPropagation();
        setShowExit(true);
      }
    };
    document.addEventListener("click", onCaptureClick, true);
    return () => {
      document.removeEventListener("click", onCaptureClick, true);
    };
  }, []);

  return (
    <main className={s.root} aria-label="분석 결과">
      {/* 탑바 중앙 타이틀 */}
      <h1 className={s.pageTitle}>분석 결과</h1>

      {/* 히어로: 그래프 + 요약 */}
      <section className={s.hero}>
        <ScoreDonut score={totalScore} />
        <div className={s.heroRight}>
          <div className={s.heroCaption}>매물 총점</div>
          <div className={s.heroScoreRow}>
            <span className={s.heroScore}>{totalScore.toFixed(1)}</span>
            <span className={s.heroTotal}>/100점</span>
          </div>
          <div className={s.heroMeta}>
            <div>
              <span className={s.metaLabel}>{metaArea}</span>{" "}
              <b>{metaBudget}</b>
            </div>
            <div className={s.metaLine}>
              {metaSize}&nbsp;&nbsp;{metaFloor}
            </div>
            <div className={s.metaLine}>
              {/* 필요 시 다른 메타로 교체 */}
              대표메뉴 {payload?.representativeMenuName ?? "미지정"} · 단가{" "}
              {payload?.representativeMenuPrice
                ? `${payload.representativeMenuPrice.toLocaleString()}원`
                : "미지정"}
            </div>
          </div>
        </div>
      </section>

      {/* 섹션: 항목별 세부 점수 */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>항목별 세부 점수</h2>
        <p className={s.sectionDesc}>
          각 항목을 클릭하면, 세부적인 근거를 확인할 수 있어요!
        </p>
        <div className={s.accList}>
          <AccordionItem
            icon={IconLocation}
            title="위치 및 접근성"
            scoreText={fmtScore(scAccess?.score)}
            body={safeReason(scAccess?.reason)}
          />
          <AccordionItem
            icon={IconTarget}
            title="시장/메뉴 적합성"
            scoreText={fmtScore(scMarket?.score)}
            body={safeReason(scMarket?.reason)}
          />
          <AccordionItem
            icon={IconBudget}
            title="예산 적합성"
            scoreText={fmtScore(scBudget?.score)}
            body={
              scBudget?.reason ??
              (scBudget?.expectedPrice
                ? `예상 월세 ${scBudget.expectedPrice.monthly}만원, 보증금 ${scBudget.expectedPrice.securityDeposit}만원`
                : "예산 관련 상세 근거는 준비 중입니다.")
            }
          />
        </div>
      </section>

      {/* 섹션: 추천(간단 매핑) */}
      <section className={s.section}>
        <h2 className={s.sectionTitle}>더 나은 조건을 추천해 드려요!</h2>
        <p className={s.sectionDesc}>
          선택하신 창업 환경을 바탕으로 보다 나은 선택지를 알려드려요
        </p>

        <div className={s.recoList}>
          {/* tips가 있으면 일부를 추천 카드처럼 보여주기 */}
          {analysis?.tips?.length ? (
            <>
              {analysis.tips.slice(0, 2).map((t, i) => (
                <RecoItem
                  key={i}
                  title={
                    t.type === "success"
                      ? "성공 가능성이 높아요"
                      : t.type === "warning"
                      ? "주의가 필요해요"
                      : "참고하세요"
                  }
                  subtitle={t.message}
                  score={
                    t.type === "success"
                      ? "95점"
                      : t.type === "warning"
                      ? "80점"
                      : "85점"
                  }
                />
              ))}
            </>
          ) : (
            <>
              <RecoItem
                title="위치 및 접근성이 더 뛰어나요"
                subtitle="한대 정문 사거리 위치"
                score="96.7점"
              />
              <RecoItem
                title="예산 부합성이 더 뛰어나요"
                subtitle="한양대 에리카 도보 15분"
                score="90.3점"
              />
            </>
          )}
        </div>
      </section>

      {/* 하단 CTA */}
      <div className={s.ctaWrap}>
        <button className={s.cta}>상세 보기</button>
      </div>

      {showExit && (
        <OutputExitConfirmModal onClose={closeExit} onConfirm={goHome} />
      )}
    </main>
  );
}
