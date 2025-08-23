import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./OutputMainPage.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";

import ChevronDown from "../../assets/ui/chevron-down.svg";

import IconBudget from "../../assets/ui/Budget.png";
import IconLocation from "../../assets/ui/Location.png";
import IconTarget from "../../assets/ui/Target.png";

import OutputExitConfirmModal from "../../components/ExitConfirmModal/OutputExitConfirmModal";

function ScoreDonut({
  score = 60.4,
  size = 150,
}: {
  score?: number;
  size?: number;
}) {
  const pct = Math.max(0, Math.min(100, score));
  const stroke = 18;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const filledLength = (pct / 100) * circumference;

  return (
    <div className={s.donutWrap} style={{ width: size, height: size }}>
      <svg className={s.donutSvg} width={size} height={size}>
        {/* 배경 원 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--PRIMARYOR)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* 점수 원 - 12시부터 반시계 방향 */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--OR300)"
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="butt"
          strokeDasharray={`${circumference - filledLength} ${circumference}`}
          strokeDashoffset={0}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={s.donutCenter}>
        <span className={s.donutScore}>{score.toFixed(1)}점</span>
      </div>
    </div>
  );
}

type PenaltyItem = {
  label: string;
  points: number;
};

type BonusItem = {
  label: string;
  points: number;
};

type AccordionProps = {
  icon: string;
  title: string;
  scoreText: string;
  body: string;
  penalties?: PenaltyItem[];
  bonuses?: BonusItem[];
  defaultOpen?: boolean;
  index: number;
  onToggle: (index: number, isOpen: boolean) => void;
};
function AccordionItem({
  icon,
  title,
  scoreText,
  body,
  penalties = [],
  bonuses = [],
  defaultOpen = false,
  index,
  onToggle,
}: AccordionProps) {
  const [open, setOpen] = useState(!!defaultOpen);

  const handleToggle = () => {
    const newOpen = !open;
    setOpen(newOpen);
    onToggle(index, newOpen);
  };

  return (
    <div className={`${s.acc} ${open ? s.accOpen : ""}`}>
      <button className={s.accHead} onClick={handleToggle}>
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
          <i className={s.accDivider} aria-hidden />

          {(penalties.length > 0 || bonuses.length > 0) && (
            <div className={s.scoreFactors}>
              {penalties.length > 0 && (
                <div className={s.penaltySection}>
                  <div className={s.penaltyTag}>감점</div>
                  <div className={s.penaltyList}>
                    {penalties.map((penalty, index) => (
                      <div key={index} className={s.penaltyItem}>
                        <span>{penalty.label}</span>
                        <span className={s.penaltyPoints}>
                          {penalty.points}점
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {bonuses.length > 0 && (
                <div className={s.bonusSection}>
                  <div className={s.bonusTag}>가점</div>
                  <div className={s.bonusList}>
                    {bonuses.map((bonus, index) => (
                      <div key={index} className={s.bonusItem}>
                        <span>{bonus.label}</span>
                        <span className={s.bonusPoints}>+{bonus.points}점</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function OutputMainPage() {
  const navigate = useNavigate();
  const { analysisResult, formData } = useRestaurantContext();
  const [showExit, setShowExit] = useState(false);
  const [ctaOffset, setCtaOffset] = useState(0);
  const [openAccordions, setOpenAccordions] = useState<Set<number>>(new Set());
  const closeExit = () => setShowExit(false);
  const goHome = () => {
    setShowExit(false);
    navigate("/");
  };

  const handleAccordionToggle = (index: number, isOpen: boolean) => {
    setOpenAccordions((prev) => {
      const newSet = new Set(prev);
      if (isOpen) {
        newSet.add(index);
      } else {
        newSet.delete(index);
      }
      return newSet;
    });
  };

  // 점수 계산 로직
  const calculateTotalScore = () => {
    if (!analysisResult?.scores || analysisResult.scores.length === 0) {
      return 60.4; // 기본값
    }

    const scores = analysisResult.scores.map(
      (item: { score: number }) => item.score
    );
    const average =
      scores.reduce((sum: number, score: number) => sum + score, 0) /
      scores.length;
    return Math.round(average * 10) / 10; // 소수점 첫째 자리까지 반올림
  };

  const totalScore = calculateTotalScore();

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

  // TopBar 뒤로 가기 버튼 클릭 감지
  useEffect(() => {
    const selector =
      '.topbar-back, [data-role="topbar-back"], [aria-label="뒤로"], [aria-label="Back"]';
    const onBackClick = (e: Event) => {
      const t = e.target as HTMLElement | null;
      if (t && t.closest(selector)) {
        // 뒤로 가기로 돌아가는 경우 플래그 설정
        sessionStorage.setItem("isBackNavigation", "true");
      }
    };
    document.addEventListener("click", onBackClick, true);
    return () => {
      document.removeEventListener("click", onBackClick, true);
    };
  }, []);

  // 스크롤 감지하여 CTA 버튼 위치 조정
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // 스크롤이 페이지 하단에 가까워지면 CTA 버튼을 숨김
      if (scrollTop + windowHeight >= documentHeight - 100) {
        setCtaOffset(100); // 버튼을 아래로 밀어서 숨김
      } else {
        setCtaOffset(0); // 기본 위치
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 열린 아코디언 개수에 따라 패딩 계산
  const openCount = openAccordions.size;
  const dynamicPadding = openCount > 0 ? 100 * openCount : 100; // 열린 아코디언당 200px 추가, 기본값 100px로 줄임

  return (
    <main className={s.root} style={{ paddingBottom: `${dynamicPadding}px` }}>
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
              <span className={s.metaLabel}>사동</span>{" "}
              <b>{formData.category || "카페/디저트"}</b>
            </div>
            <div className={s.metaLine}>
              {formData.size?.min && formData.size?.max
                ? `${formData.size.min}~${formData.size.max}평`
                : "15~20평"}
              &nbsp;&nbsp;
              {formData.height === 0
                ? "지하층"
                : formData.height === 1
                ? "1층"
                : formData.height === 2
                ? "2층"
                : formData.height === 3
                ? "3층"
                : formData.height === 4
                ? "4층 이상"
                : formData.height === 5
                ? "루프탑/옥상"
                : "1층"}
            </div>
            <div className={s.metaLine}>
              {formData.marketingArea || "대학가/학교 주변"}
            </div>
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>항목별 세부 점수</h2>
        <p className={s.sectionDesc}>
          각 항목을 클릭하면, 세부적인 근거를 확인할 수 있어요!
        </p>
        <div className={s.accList}>
          <AccordionItem
            icon={IconLocation}
            title="위치 및 접근성"
            scoreText={`${analysisResult?.scores?.[0]?.score || 0}점`}
            body={
              analysisResult?.scores?.[0]?.reason ||
              "해당 매장은 대중교통과 도보 이동이 편리한 위치에 있어요. 학교와 가까워 학생 유입이 용이하고, 주변 유동인구가 안정적인 편이에요."
            }
            penalties={analysisResult?.scores?.[0]?.penalties || []}
            bonuses={analysisResult?.scores?.[0]?.bonuses || []}
            index={0}
            onToggle={handleAccordionToggle}
          />
          <AccordionItem
            icon={IconBudget}
            title="예산 적합성"
            scoreText={`${analysisResult?.scores?.[1]?.score || 0}점`}
            body={
              analysisResult?.scores?.[1]?.reason ||
              "현재 매물의 월세가 설정하신 예산 범위 안에 있어요. 초기 고정비 부담을 줄일 수 있는 조건이에요."
            }
            penalties={analysisResult?.scores?.[1]?.penalties || []}
            bonuses={analysisResult?.scores?.[1]?.bonuses || []}
            index={1}
            onToggle={handleAccordionToggle}
          />
          <AccordionItem
            icon={IconTarget}
            title="메뉴 적합성"
            scoreText={`${analysisResult?.scores?.[2]?.score || 0}점`}
            body={
              analysisResult?.scores?.[2]?.reason ||
              "학생들이 선호하는 분식집이라는 업종과 합리적인 단가가 학교 앞 상권 특성에 잘 어울리며, 현재 한대정문 사거리에 같은 업종의 매장이 5곳 미만이라 비교적 경쟁이 덜한 환경이에요."
            }
            penalties={analysisResult?.scores?.[2]?.penalties || []}
            bonuses={analysisResult?.scores?.[2]?.bonuses || []}
            index={2}
            onToggle={handleAccordionToggle}
          />
        </div>
      </section>

      <div
        className={s.ctaWrap}
        style={{ transform: `translateY(${ctaOffset}px)` }}
      >
        <button className={s.cta} onClick={() => navigate("/output-detail")}>
          상세 보기
        </button>
      </div>

      {showExit && (
        <OutputExitConfirmModal onClose={closeExit} onConfirm={goHome} />
      )}
    </main>
  );
}
