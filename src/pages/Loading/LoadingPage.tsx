import Lottie from "lottie-react";
import { useSearchParams } from "react-router-dom";
import styles from "./LoadingPage.module.scss";
import ongilLoading from "../../assets/animations/ongilLoading.json";
import TopBar from "../../components/TopBar";
import HomeIndicator from "../../components/HomeIndicator";

export default function LoadingPage() {
  const [searchParams] = useSearchParams();
  const from = searchParams.get("from");

  const getLoadingText = () => {
    if (from === "collaboration") {
      return {
        title: "분석 중이에요...",
        description: (
          <>
            작성하신 조건을 바탕으로 온길의 인공지능이
            <br />
            제휴할 가게를 찾아보고 있어요.
            <br />
            조금만 기다려 주세요!
          </>
        ),
      };
    } else if (from === "select-conditions") {
      return {
        title: "분석 중이에요...",
        description: (
          <>
            선택하신 매물과 창업 조건 간의 적합도를
            <br />
            계산하는 중이에요.
            <br />
            정확한 분석을 위해 조금만 기다려 주세요!
          </>
        ),
      };
    } else {
      return {
        title: "분석 중이에요...",
        description: (
          <>
            선택하신 매물과 창업 조건 간의 적합도를
            <br />
            계산하는 중이에요.
            <br />
            정확한 분석을 위해 조금만 기다려 주세요!
          </>
        ),
      };
    }
  };

  const loadingText = getLoadingText();

  return (
    <div className={styles.LoadingPage}>
      <TopBar showNavRow={false} />
      <div className={styles.content}>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>{loadingText.title}</h1>
          <p className={styles.description}>{loadingText.description}</p>
        </div>
      </div>
      <div className={styles.animationContainer}>
        <Lottie animationData={ongilLoading} loop={true} autoplay={true} />
      </div>
      <HomeIndicator />
    </div>
  );
}
