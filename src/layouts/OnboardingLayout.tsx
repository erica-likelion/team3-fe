import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import styles from "./OnboardingLayout.module.scss";

export default function OnboardingLayout() {
  return (
    <div className={styles.iphoneFrame}>
      <TopBar showNavRow={false} />
      <div className={styles.pageContent}>
        <Outlet />
      </div>
      <HomeIndicator />
    </div>
  );
}
