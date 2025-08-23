import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./OutputDetailPage.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";
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
    <div className={styles.donutWrap} style={{ width: size, height: size }}>
      <svg className={styles.donutSvg} width={size} height={size}>
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
      <div className={styles.donutCenter}>
        <span className={styles.donutScore}>{score.toFixed(1)}점</span>
      </div>
    </div>
  );
}

export default function OutputDetailPage() {
  const navigate = useNavigate();
  const { analysisResult, formData } = useRestaurantContext();
  const [showExit, setShowExit] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const closeExit = () => setShowExit(false);
  const goHome = () => {
    setShowExit(false);
    navigate("/onboarding?final=1");
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

  return (
    <main className={styles.root}>
      <section className={styles.hero}>
        <ScoreDonut score={totalScore} />
        <div className={styles.heroRight}>
          <div className={styles.heroCaption}>입지 총점</div>
          <div className={styles.heroScoreRow}>
            <span className={styles.heroScore}>{totalScore.toFixed(1)}</span>
            <span className={styles.heroTotal}>/100점</span>
          </div>
          <div className={styles.heroMeta}>
            <div>
              <span className={styles.metaLabel}>사동</span>{" "}
              <b>{formData.category || "카페/디저트"}</b>
            </div>
            <div className={styles.metaLine}>
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
            <div className={styles.metaLine}>
              {formData.marketingArea || "대학가/학교 주변"}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          대학가/학교 주변이라는 특수 상권을 고려 중이시군요!
        </h2>
        <p className={styles.sectionDesc}>
          소비층과 소비 성향을 중심으로 입지 특성을 정리했어요
        </p>
      </section>

      <section className={styles.graphSection}>
        <img
          src="/src/assets/ui/outputDetailGraph.svg"
          alt="상세 분석 그래프"
          className={styles.outputDetailGraph}
        />

        {/* ✅ 태그(칩) 추가: 중앙 정렬 / 간격 10 / 좌우 패딩 52.5 */}
        <div className={styles.tagRow}>
          {["젊은 연령대", "합리성 추구", "트렌드 중심"].map((t) => (
            <span key={t} className={styles.tagChip}>
              {t}
            </span>
          ))}
        </div>

        <p className={styles.graphSectionDesc}>
          대학가 소비 성향은 보통 20대 초중반의 대학생과 청년층을 중심으로
          형성되며, 이 연령대는 상대적으로 예산이 제한적이라 기본적으로 절약형
          소비를 합니다. 그렇다고 무작정 아끼는 건 아니고, 필요한 곳에는 확실히
          지출하는 특징이 있어요.{"\n"}
          단순히 싸다고 아무거나 고르는 게 아니라, 가격 대비 만족도를 중요하게
          생각해요. 그래서 가성비 좋은 식당이나 카페를 찾는 데 적극적이고,
          트렌디하면서도 합리적인 소비처를 선호합니다.
        </p>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          분석 결과를 바탕으로 운영 전략을 추천해 드려요
        </h2>
        <p className={styles.sectionDesc}>
          선택하신 창업 환경과 상권 특성을 조합하여 작성했어요
        </p>
      </section>

      {/* 탭 네비게이션 */}
      <div className={styles.tabContainer}>
        <div className={styles.tabList}>
          {analysisResult?.detailAnalysis?.sections?.map((section, index) => {
            // 탭 이름 매핑
            const tabNames = ["위치 및 접근성", "시장 적합성", "예산 적합성"];
            const displayName = tabNames[index] || section.name;

            return (
              <button
                key={index}
                className={`${styles.tab} ${
                  activeTab === index ? styles.activeTab : ""
                }`}
                onClick={() => setActiveTab(index)}
              >
                {displayName}
              </button>
            );
          })}
        </div>

        {/* 탭 콘텐츠 */}
        <div className={styles.tabContent}>
          {analysisResult?.detailAnalysis?.sections?.[activeTab] && (
            <div className={styles.tabPanel}>
              <p className={styles.tabText}>
                {analysisResult.detailAnalysis.sections[activeTab].content}
              </p>
            </div>
          )}
        </div>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          유사 업종 리뷰 분석을 통해 운영 전략을 추천해 드려요
        </h2>
        <p className={styles.sectionDesc}>
          카카오맵 리뷰 데이터를 기반으로 작성되었어요
        </p>

        {/* 별점 섹션 */}
        <div className={styles.ratingSection}>
          <h3 className={styles.ratingTitle}>
            유사 업종 가게의 리뷰 평균 평점
          </h3>
          <div className={styles.ratingDisplay}>
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((star) => {
                const averageRating =
                  analysisResult?.reviewAnalysis?.averageRating || 0;
                const filledPercentage = Math.max(
                  0,
                  Math.min(100, (averageRating - star + 1) * 100)
                );

                return (
                  <div key={star} className={styles.starContainer}>
                    <svg className={styles.star} viewBox="0 0 24 24">
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill="#e0e0e0"
                      />
                      <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        fill="var(--PRIMARYOR)"
                        style={{
                          clipPath: `inset(0 ${100 - filledPercentage}% 0 0)`,
                        }}
                      />
                    </svg>
                  </div>
                );
              })}
            </div>
            <span className={styles.ratingScore}>
              {analysisResult?.reviewAnalysis?.averageRating?.toFixed(1) ||
                "0.0"}
            </span>
          </div>
        </div>

        {/* 리뷰 섹션 */}
        <div className={styles.reviewSection}>
          <h3 className={styles.reviewTitle}>유사 업종 가게의 대표 리뷰</h3>
          <div className={styles.reviewList}>
            {analysisResult?.reviewAnalysis?.reviewSamples?.map(
              (review, index) => (
                <div key={index} className={styles.reviewBubble}>
                  {review.highlights[0]}
                </div>
              )
            )}
          </div>
        </div>

        {/* 피드백 섹션 */}
        <div className={styles.feedbackSection}>
          <h3 className={styles.reviewTitle}>
            유사 업종 가게의 리뷰를 종합한 피드백
          </h3>
          <p className={styles.feedbackText}>
            {analysisResult?.reviewAnalysis?.feedback ||
              "피드백 데이터가 없습니다."}
          </p>
        </div>
      </section>

      <div className={styles.ctaWrap}>
        <button className={styles.cta}>상세 보기</button>
      </div>

      {showExit && (
        <OutputExitConfirmModal onClose={closeExit} onConfirm={goHome} />
      )}
    </main>
  );
}
