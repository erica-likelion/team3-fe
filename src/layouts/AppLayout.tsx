import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import ExitConfirmModal from "../components/ExitConfirmModal";
import "../styles/global.scss";

export default function AppLayout() {
  const navigate = useNavigate();
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

  return (
    <>
      <div className="iphone-frame">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
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
