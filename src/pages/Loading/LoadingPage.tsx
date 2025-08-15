// src/pages/Loading/LoadingPage.tsx
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import s from "./LoadingPage.module.scss";
import Glasses from "../../assets/ui/안경.png";
import { submitRestaurantData } from "../../services/api";

// 필요한 경우 타입을 가져오거나 여기에 정의
type RestaurantData = {
  addr: string;
  category: string;
  marketingArea: string;
  budget: { min: number; max: number };
  managementMethod: string;
  averagePrice: { min: number; max: number };
  size: { min: number; max: number };
  height: number;
};

export default function LoadingPage() {
  const lRef = useRef<HTMLDivElement>(null);
  const rRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation() as { state?: { payload?: RestaurantData } };
  const payload = location.state?.payload;

  useEffect(() => {
    // 눈동자 애니메이션
    let t = 0;
    let raf = 0;
    const tick = () => {
      t += 0.035;
      const x = Math.cos(t) * 8;
      const y = Math.sin(t) * 9;
      if (lRef.current)
        lRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (rRef.current)
        rRef.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 실제 API 호출
    let cancelled = false;
    (async () => {
      try {
        if (!payload) throw new Error("분석 입력 데이터가 없습니다.");
        const analysis = await submitRestaurantData(payload);
        if (cancelled) return;
        // 결과 페이지로 응답 전달
        navigate("/output", { state: { analysis, payload } });
      } catch (e) {
        console.error("분석 실패:", e);
        if (!cancelled) {
          alert("분석에 실패했습니다. 잠시 후 다시 시도해 주세요.");
          navigate(-1); // 직전 페이지로
        }
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
    };
  }, [navigate, payload]);
  return (
    <main className={s.wrap} aria-label="분석 중 로딩 화면">
      <div className={s.body} aria-hidden />
      <section className={s.body}>
        <div className={`${s.eyeWhite} ${s.leftEye}`}>
          <div ref={lRef} className={`${s.pupil} ${s.pupilL}`} />
          <i className={s.eyelid} aria-hidden />
        </div>
        <div className={`${s.eyeWhite} ${s.rightEye}`}>
          <div ref={rRef} className={`${s.pupil} ${s.pupilR}`} />
          <i className={s.eyelid} aria-hidden />
        </div>
        <img className={s.glasses} src={Glasses} alt="" />
        <h1 className={s.title}>분석 중이에요...</h1>
        <p className={s.desc}>
          선택하신 매물과 창업 조건 간의 적합도를
          <br />
          계산하는 중이에요.
          <br />
          정확한 분석을 위해 조금만 기다려 주세요!
        </p>
      </section>
    </main>
  );
}
