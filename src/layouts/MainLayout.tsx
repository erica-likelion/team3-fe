// src/layouts/MainLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import ExitConfirmModal from "../components/ExitConfirmModal";
import { getPostById } from "../pages/Community/communityData";
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
      case "/community":
        return {
          title: "커뮤니티",
          onLeftClick: () => navigate(-1),
          onRightClick: () => setShowExit(true),
        };
      case "/community/post/new":
        return {
          title: "새 글 작성",
          onLeftClick: () => navigate(-1),
          onRightClick: () => setShowExit(true),
        };
      case "/community/search":
        return {
          title: "커뮤니티 검색",
          onLeftClick: () => navigate("/community"),
          onRightClick: () => setShowExit(true),
        };
      case "/community/search/results":
        return {
          title: "검색 결과",
          onLeftClick: () => navigate("/community"),
          onRightClick: () => setShowExit(true),
        };
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
      case "/select-conditions":
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
      case "/output-detail":
        return {
          title: "상세 분석 결과",
          onLeftClick: () => navigate("/output"),
          onRightClick: () => setShowExit(true),
        };
      default: {
        // 커뮤니티 게시글 상세 페이지 처리
        const postMatch = location.pathname.match(/^\/community\/post\/(\d+)$/);
        if (postMatch) {
          const id = Number(postMatch[1]);
          const post = getPostById(id);
          const board = post?.board ?? "";
          return {
            title: board,
            onLeftClick: () => navigate(-1),
            onRightClick: () => setShowExit(true),
          };
        }
        return {
          title: "",
          onLeftClick: () => navigate(-1),
          onRightClick: () => setShowExit(true),
        };
      }
    }
  };

  const topBarConfig = getTopBarConfig();

  // ✅ 경로에 따른 모달 문구 분기
  const exitMessage =
    /^\/output(\/|$)/.test(location.pathname) ||
    /^\/output-detail(\/|$)/.test(location.pathname)
      ? "분석 결과 열람을 중단하고\n홈 화면으로 이동하시겠어요?"
      : /^\/community(\/|$)/.test(location.pathname)
      ? "커뮤니티 이용을 중단하고\n홈 화면으로 이동하시겠어요?"
      : undefined; // 나머지는 ExitConfirmModal의 기본 문구 사용

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
          onLeave={() => navigate("/onboarding?final=1")}
          message={exitMessage}
        />
      )}
    </>
  );
}
