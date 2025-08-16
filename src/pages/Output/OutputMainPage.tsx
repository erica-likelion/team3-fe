import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import s from "./OutputMainPage.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";

import ChevronDown from "../../assets/ui/chevron-down.svg";
import ArrowRight from "../../assets/ui/arrow-right 2.png";

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
  const c = 2 * Math.PI * r;
  const filled = (pct / 100) * c;
  const dash = c;
  const offset = c - filled;

  return (
    <div className={s.donutWrap} style={{ width: size, height: size }}>
      <svg className={s.donutSvg} width={size} height={size}>
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

export default function OutputMainPage() {
  const navigate = useNavigate();
  const { analysisResult } = useRestaurantContext();
  const [showExit, setShowExit] = useState(false);
  const closeExit = () => setShowExit(false);
  const goHome = () => {
    setShowExit(false);
    navigate("/");
  };

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
    <main className={s.root}>
      <section className={s.hero}>
        <ScoreDonut score={analysisResult?.score || 60.4} />
        <div className={s.heroRight}>
          <div className={s.heroCaption}>매물 총점</div>
          <div className={s.heroScoreRow}>
            <span className={s.heroScore}>
              {analysisResult?.score?.toFixed(1) || "60.4"}
            </span>
            <span className={s.heroTotal}>/100점</span>
          </div>
          <div className={s.heroMeta}>
            <div>
              <span className={s.metaLabel}>사동</span> <b>월세 1200/100</b>
            </div>
            <div className={s.metaLine}>9/9평&nbsp;&nbsp;1/2층</div>
            <div className={s.metaLine}>
              관리비 없음&nbsp;&nbsp;한대앞역 3분
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
            scoreText={`${analysisResult?.location?.score || 0}점`}
            body={
              analysisResult?.location?.analysis ||
              "해당 매장은 대중교통과 도보 이동이 편리한 위치에 있어요. 학교와 가까워 학생 유입이 용이하고, 주변 유동인구가 안정적인 편이에요."
            }
          />
          <AccordionItem
            icon={IconTarget}
            title="시장 적합성"
            scoreText={`${analysisResult?.target?.score || 0}점`}
            body={
              analysisResult?.target?.analysis ||
              "학생들이 선호하는 분식집이라는 업종과 합리적인 단가가 학교 앞 상권 특성에 잘 어울리며, 현재 한대정문 사거리에 같은 업종의 매장이 5곳 미만이라 비교적 경쟁이 덜한 환경이에요."
            }
          />
          <AccordionItem
            icon={IconBudget}
            title="예산 적합성"
            scoreText={`${analysisResult?.budget?.score || 0}점`}
            body={
              analysisResult?.budget?.analysis ||
              "현재 매물의 월세가 설정하신 예산 범위 안에 있어요. 초기 고정비 부담을 줄일 수 있는 조건이에요."
            }
          />
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>더 나은 조건을 추천해 드려요!</h2>
        <p className={s.sectionDesc}>
          선택하신 창업 환경을 바탕으로 보다 나은 선택지를 알려드려요
        </p>
        <div className={s.recoList}>
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
        </div>
      </section>

      <div className={s.ctaWrap}>
        <button className={s.cta}>상세 보기</button>
      </div>

      {showExit && (
        <OutputExitConfirmModal onClose={closeExit} onConfirm={goHome} />
      )}
    </main>
  );
}
