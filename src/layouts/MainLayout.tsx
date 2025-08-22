import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import ExitConfirmModal from "../components/ExitConfirmModal";
import styles from "./MainLayout.module.scss";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const openExit = () => setShowExit(true);
    const goBack = () => {
      if (window.history.length > 1) navigate(-1);
      else navigate("/"); // 히스토리 없을 때 홈으로
    };

    window.addEventListener("topbar:close", openExit as EventListener);
    window.addEventListener("topbar:back", goBack as EventListener);

    return () => {
      window.removeEventListener("topbar:close", openExit as EventListener);
      window.removeEventListener("topbar:back", goBack as EventListener);
    };
  }, [navigate]);

  // 페이지별 TopBar 설정
  const getTopBarConfig = () => {
    switch (location.pathname) {
      case "/select-place":
        return {
          title: "위치 선택",
          onLeftClick: () => navigate("/select-conditions"),
          onRightClick: () => setShowExit(true),
        };
      case "/select-type":
        return {
          title: "업종 선택",
          onLeftClick: () => navigate("/select-place"),
          onRightClick: () => setShowExit(true),
        };
      case "/select/conditions":
        return {
          title: "조건 선택",
          onLeftClick: () => navigate("/onboarding"),
          onRightClick: () => setShowExit(true),
        };
      case "/output":
        return {
          title: "분석 결과",
          onLeftClick: () => navigate("/select-type"),
          onRightClick: () => setShowExit(true),
        };
      default:
        return {
          title: "",
          onLeftClick: () => navigate(-1),
          onRightClick: () => setShowExit(true),
        };
    }
  };

  const topBarConfig = getTopBarConfig();

  return (
    <>
      <div className={styles.iphoneFrame}>
        <TopBar
          title={topBarConfig.title}
          onLeftClick={topBarConfig.onLeftClick}
          onRightClick={topBarConfig.onRightClick}
        />
        <main className={styles.pageContent}>
          <Outlet />
        </main>
        <HomeIndicator />
      </div>

      {showExit && (
        <ExitConfirmModal
          onStay={() => setShowExit(false)}
          onLeave={() => navigate("/")}
        />
      )}
    </>
  );
}
