// src/components/TopBar.tsx
import { useEffect, useState } from "react";
import s from "./TopBar.module.scss";

import Wifi from "../assets/ui/Wifi.svg";
import Cellular from "../assets/ui/Cellular Connection.svg";
import Battery from "../assets/ui/Battery.svg";
import Prev from "../assets/ui/PreviousButton.svg";
import Close from "../assets/ui/CloseButton.svg";

function formatNow(): string {
  return new Date().toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function TopBar() {
  const [time, setTime] = useState<string>(formatNow());

  useEffect(() => {
    // 다음 분(00초)에 처음 갱신 → 이후 1분마다
    let intervalId: number | undefined;

    const now = new Date();
    const msToNextMinute =
      (60 - now.getSeconds()) * 1000 - now.getMilliseconds();

    const timeoutId = window.setTimeout(() => {
      setTime(formatNow());
      intervalId = window.setInterval(() => setTime(formatNow()), 60_000);
    }, msToNextMinute);

    // 정리
    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, []);

  return (
    <div className={s.root}>
      {/* status bar */}
      <div className={s.statusWrap}>
        <div className={s.statusRow}>
          <div className={s.time}>
            <span>{time}</span>
          </div>
          <div className={s.levels}>
            <img src={Cellular} className={s.levelIcon} alt="" />
            <img src={Wifi} className={s.levelIcon} alt="" />
            <img src={Battery} className={s.levelIcon} alt="" />
          </div>
        </div>
      </div>
      {/* top bar */}
      <div className={s.navRow}>
        <button className={s.iconBtn} aria-label="back">
          <img src={Prev} alt="" />
        </button>
        <button className={s.iconBtn} aria-label="close">
          <img src={Close} alt="" />
        </button>
      </div>
    </div>
  );
}
