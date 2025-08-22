// src/layouts/AppLayout.tsx
import { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import ExitConfirmModal from "../components/ExitConfirmModal";
import SearchButton from "../assets/ui/SearchButton.svg";
import CheckButton from "../assets/ui/CheckButton.svg";
import "../styles/global.scss";
import { getPostById } from "../pages/Community/communityData"; // 그대로 유지

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExit, setShowExit] = useState(false);

  useEffect(() => {
    const openExit = () => setShowExit(true);
    const goBack = () => {
      if (window.history.length > 1) navigate(-1);
      else navigate("/");
    };
    window.addEventListener("topbar:close", openExit as EventListener);
    window.addEventListener("topbar:back", goBack as EventListener);
    return () => {
      window.removeEventListener("topbar:close", openExit as EventListener);
      window.removeEventListener("topbar:back", goBack as EventListener);
    };
  }, [navigate]);

  const getTopBarConfig = () => {
    const path = location.pathname;

    if (path === "/community") {
      return {
        title: "커뮤니티",
        onLeftClick: () => navigate(-1),
        rightChild: <img src={SearchButton} alt="" />,
        onRightClick: () => navigate("/community/search"),
        showRight: true,
      };
    }

    if (path.startsWith("/community/search")) {
      const params = new URLSearchParams(location.search);
      const hasQuery = !!params.get("q") && params.get("q")!.trim().length > 0;
      return {
        title: hasQuery ? "검색 결과" : "커뮤니티 검색",
        onLeftClick: () => navigate("/community"),
        showRight: false,
      };
    }

    if (path === "/community/post/new") {
      return {
        title: "새 글 작성",
        onLeftClick: () => navigate(-1),
        rightChild: <img src={CheckButton} alt="등록" />,
        onRightClick: () =>
          window.dispatchEvent(new CustomEvent("community:submitPost")),
        showRight: true,
      };
    }

    // 글 디테일
    const m = path.match(/^\/community\/post\/(\d+)$/);
    if (m) {
      const id = Number(m[1]);
      const board = getPostById(id)?.board ?? "";
      return {
        title: board,
        onLeftClick: () => navigate(-1),
        showRight: true, // X 버튼 표시
      };
    }

    switch (path) {
      case "/select-place":
        return {
          title: "위치 선택",
          onLeftClick: () => navigate("/select-conditions"),
          onRightClick: () => setShowExit(true),
          showRight: true,
        };
      case "/select-type":
        return {
          title: "업종 선택",
          onLeftClick: () => navigate("/select-place"),
          onRightClick: () => setShowExit(true),
          showRight: true,
        };
      case "/select/conditions":
        return {
          title: "조건 선택",
          onLeftClick: () => navigate("/onboarding"),
          onRightClick: () => setShowExit(true),
          showRight: true,
        };
      case "/output":
        return {
          title: "분석 결과",
          onLeftClick: () => navigate("/select-type"),
          onRightClick: () => setShowExit(true),
          showRight: true,
        };
      default:
        return {
          title: "",
          onLeftClick: () => navigate(-1),
          onRightClick: () => setShowExit(true),
          showRight: true,
        };
    }
  };

  const topBarConfig = getTopBarConfig();

  // 디테일 페이지에서만 모달 문구 변경
  const path = location.pathname;
  const isCommunityDetail = /^\/community\/post\/\d+$/.test(path);
  const exitLines = isCommunityDetail
    ? ["커뮤니티 이용을 중단하고", "홈 화면으로 이동하시겠어요?"]
    : undefined;

  return (
    <>
      <div className="iphone-frame">
        <TopBar
          title={topBarConfig.title}
          onLeftClick={topBarConfig.onLeftClick}
          onRightClick={topBarConfig.onRightClick}
          rightChild={(topBarConfig as any).rightChild}
          showRight={(topBarConfig as any).showRight}
        />
        <div className="page-content">
          <Outlet />
        </div>
        <HomeIndicator />
      </div>

      {showExit && (
        <ExitConfirmModal
          onStay={() => setShowExit(false)}
          onLeave={() => navigate("/")}
          messageLines={exitLines} // ← 여기서 페이지별 문구 오버라이드
        />
      )}
    </>
  );
}
