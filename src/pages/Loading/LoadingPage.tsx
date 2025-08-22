import Lottie from "lottie-react";
import styles from "./LoadingPage.module.scss";
import ongilLoading from "../../assets/animations/ongilLoading.json";
import TopBar from "../../components/TopBar";
import HomeIndicator from "../../components/HomeIndicator";

export default function LoadingPage() {
  return (
    <div className={styles.LoadingPage}>
      <TopBar showNavRow={false} />
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>분석 중이에요...</h1>
          <p className={styles.description}>
            선택하신 매물과 창업 조건 간의 적합도를
            <br />
            계산하는 중이에요.
            <br />
            정확한 분석을 위해 조금만 기다려 주세요!
          </p>
        </div>
      </div>
      <div className={styles.animationContainer}>
        <Lottie animationData={ongilLoading} loop={true} autoplay={true} />
      </div>
      <HomeIndicator />
    </div>
  );
}
