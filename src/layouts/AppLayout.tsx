import { useEffect, useRef, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import ExitConfirmModal from "../components/ExitConfirmModal";
import SearchButton from "../assets/ui/SearchButton.svg";
import CheckButton from "../assets/ui/CheckButton.svg";
import "../styles/global.scss";
import { getPostById } from "../pages/Community/communityData";

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showExit, setShowExit] = useState(false);
  const [exitLines, setExitLines] = useState<string[] | undefined>(undefined);

  // 현재 경로를 항상 최신으로 보관(리스너 클로저 stale 방지)
  const pathRef = useRef(location.pathname);
  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    const openExit = () => {
      const path = pathRef.current;
      const isCommunity = /^\/community(\/|$)/.test(path);
      setExitLines(
        isCommunity
          ? ["커뮤니티 이용을 중단하고", "홈 화면으로 이동하시겠어요?"]
          : undefined
      );
      setShowExit(true);
    };
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

    // ✅ 커뮤니티 메인: /community 또는 /community/
    if (/^\/community\/?$/.test(path)) {
      return {
        title: "커뮤니티",
        onLeftClick: () => navigate(-1),
        rightChild: <img src={SearchButton} alt="" />,
        onRightClick: () => navigate("/community/search"),
        showRight: true,
      };
    }

    // ✅ 커뮤니티 검색
    if (/^\/community\/search/.test(path)) {
      const params = new URLSearchParams(location.search);
      const hasQuery = !!params.get("q") && params.get("q")!.trim().length > 0;
      return {
        title: hasQuery ? "검색 결과" : "커뮤니티 검색",
        onLeftClick: () => navigate("/community"),
        showRight: false,
      };
    }

    // ✅ 새 글 작성
    if (/^\/community\/post\/new$/.test(path)) {
      return {
        title: "새 글 작성",
        onLeftClick: () => navigate(-1),
        rightChild: <img src={CheckButton} alt="등록" />,
        onRightClick: () =>
          window.dispatchEvent(new CustomEvent("community:submitPost")),
        showRight: true,
      };
    }

    // ✅ 글 디테일
    const m = path.match(/^\/community\/post\/(\d+)$/);
    if (m) {
      const id = Number(m[1]);
      const board = getPostById(id)?.board ?? "";
      return {
        title: board,
        onLeftClick: () => navigate(-1),
        showRight: true, // X
      };
    }

    // 그 외
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
          onLeave={() => navigate("/onboarding?final=1")}
          // ✅ 경로에 따라 문구 오버라이드
          message={
            /^\/community(\/|$)/.test(location.pathname)
              ? "커뮤니티 이용을 중단하고\n홈 화면으로 이동하시겠어요?"
              : /^\/output(\/|$)/.test(location.pathname) ||
                /^\/output-detail(\/|$)/.test(location.pathname)
              ? "분석 결과 열람을 중단하고\n홈 화면으로 이동하시겠어요?"
              : undefined
          }
        />
      )}
    </>
  );
}
