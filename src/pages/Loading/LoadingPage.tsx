import React from "react";
import Lottie from "lottie-react";
import s from "./LoadingPage.module.scss";
import ongilLoading from "../../assets/animations/ongilLoading.json";
import TopBar from "../../components/TopBar";
import HomeIndicator from "../../components/HomeIndicator";

export default function LoadingPage() {
  return (
    <div className={s.iphoneFrame}>
      <TopBar showNavRow={false} />
      <div className={s.pageContent}>
        <div className={s.root}>
          <div className={s.content}>
            <div className={s.textContainer}>
              <h1 className={s.title}>분석 중이에요...</h1>
              <p className={s.description}>
                선택하신 매물과 창업 조건 간의 적합도를
                <br />
                계산하는 중이에요.
              </p>
              <p className={s.subDescription}>
                정확한 분석을 위해 조금만 기다려 주세요!
              </p>
            </div>
            <div className={s.animationContainer}>
              <Lottie
                animationData={ongilLoading}
                loop={true}
                autoplay={true}
                className={s.animation}
              />
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
}
