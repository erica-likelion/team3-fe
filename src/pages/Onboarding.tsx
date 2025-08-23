import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import wearyOngil from "../assets/wearyOngil.svg";
import thinkOngil from "../assets/thinkOngil.svg";
import smileOngil from "../assets/smileOngil.svg";
import styles from "./Onboarding.module.scss";

interface OnboardingStep {
  image: string;
  title: string;
  description: string;
  isFinal?: boolean;
}

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps: OnboardingStep[] = [
    {
      image: wearyOngil,
      title: "창업 위치, 어디가 좋을까요?",
      description:
        "소중한 내 가게를 쉽게 열 수 없다는 마음.\n온길은 그 지점에서 시작되었습니다.\n감이 아닌 데이터로, 꼭 맞는 자리를 추천해 드릴게요.",
    },
    {
      image: thinkOngil,
      title: "적합도 분석, 어렵지 않아요!",
      description:
        "입지 조건과 창업 조건을 항목별로 나누어\n100점 만점의 '적합도 점수'를 계산해 드려요.\n복잡한 조건들을 한눈에 비교해 보세요!",
    },
    {
      image: smileOngil,
      title: "단순한 분석, 그 이상을 위하여",
      description:
        "입지 분석 이후, 매출과 손익분기점은 물론\n입지 조건 기반 운영 전략까지 제공해 드려요.\n당신의 가게에 따뜻한 '온길' 드릴게요.",
    },
    {
      image: smileOngil,
      title: "당신에게 가장 맞는 길, 온길",
      description:
        "'새 분석 시작'으로 나만의 로드맵을 만들거나\n커뮤니티에서 다른 창업자들과 이야기를 나눠보세요.",
      isFinal: true,
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  const handleSkip = () => setCurrentStep(steps.length - 2);

  const handleCommunity = () => {
    navigate("/community");
  };

  const handleNewAnalysis = () => {
    navigate("/select-place");
  };

  const isLastStep = currentStep === steps.length - 1;
  const isThirdStep = currentStep === 2;
  const currentStepData = steps[currentStep];

  const getIndicatorStep = () => {
    if (currentStep <= 1) return currentStep;
    return 2;
  };

  return (
    <div className={styles.onboarding}>
      <div className={styles.backgroundImages}>
        <img
          src={wearyOngil}
          alt="Weary Ongil"
          className={`${styles.backgroundImage} ${
            currentStep === 0 ? styles.visible : ""
          }`}
        />
        <img
          src={thinkOngil}
          alt="Think Ongil"
          className={`${styles.backgroundImage} ${
            currentStep === 1 ? styles.visible : ""
          }`}
        />
        <img
          src={smileOngil}
          alt="Smile Ongil"
          className={`${styles.backgroundImage} ${
            currentStep >= 2 ? styles.visible : ""
          }`}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{currentStepData.title}</h1>
        <p className={styles.description}>{currentStepData.description}</p>
      </div>

      <div className={styles.navigation}>
        {!isLastStep && !isThirdStep && (
          <button className={styles.skipButton} onClick={handleSkip}>
            그만보기
          </button>
        )}
        {!isLastStep && !isThirdStep ? (
          <button className={styles.nextButton} onClick={handleNext}>
            다음으로
          </button>
        ) : isThirdStep ? (
          <button className={styles.startButton} onClick={handleNext}>
            시작하기
          </button>
        ) : (
          <>
            <button
              className={styles.communityButton}
              onClick={handleCommunity}
            >
              커뮤니티로
            </button>
            <button
              className={styles.analysisButton}
              onClick={handleNewAnalysis}
            >
              새분석 시작
            </button>
          </>
        )}
      </div>

      <div className={styles.indicators}>
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={`${styles.indicator} ${
              index === getIndicatorStep() ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
