import React, { useState } from "react";
import wearyOngil from "../assets/wearyOngil.svg";
import thinkOngil from "../assets/thinkOngil.svg";
import smileOngil from "../assets/smileOngil.svg";
import styles from "./Onboarding.module.scss";

interface OnboardingStep {
  image: string;
  title: string;
  description: string;
}

const Onboarding: React.FC = () => {
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
        "위치와 업종 조건을 분석해서 100점 만점의 적합도 점수를 알려드려요.",
    },
    {
      image: smileOngil,
      title: "단순한 분석, 그 이상을 위하여",
      description:
        "위치 분석뿐만 아니라 매출과 손익분기점, 운영 전략까지 제공해드려요.",
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    // 마지막 단계로 바로 이동
    setCurrentStep(steps.length - 1);
  };

  const isLastStep = currentStep === steps.length - 1;

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
            currentStep === 2 ? styles.visible : ""
          }`}
        />
      </div>

      <div className={styles.content}>
        <h1 className={styles.title}>{steps[currentStep].title}</h1>
        <p className={styles.description}>{steps[currentStep].description}</p>
      </div>

      <div className={styles.navigation}>
        {!isLastStep && (
          <button className={styles.skipButton} onClick={handleSkip}>
            그만보기
          </button>
        )}
        <button
          className={isLastStep ? styles.startButton : styles.nextButton}
          onClick={isLastStep ? () => console.log("시작하기") : handleNext}
        >
          {isLastStep ? "시작하기" : "다음으로"}
        </button>
      </div>

      <div className={styles.indicators}>
        {steps.map((_, index) => (
          <div
            key={index}
            className={`${styles.indicator} ${
              index === currentStep ? styles.active : ""
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
