import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import HomeIndicator from "../components/HomeIndicator";
import "../styles/global.scss"; // 전역 스타일 한 번만

export default function AppLayout() {
  return (
    <div className="iphone-frame">
      <TopBar />
      <div className="page-content">
        <Outlet />
      </div>
      <HomeIndicator />
    </div>
  );
}
