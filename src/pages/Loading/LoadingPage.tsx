import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import s from "./LoadingPage.module.scss";
import Glasses from "../../assets/ui/안경.png";

export default function LoadingPage() {
  const lRef = useRef<HTMLDivElement>(null);
  const rRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 눈동자 움직임
    let t = 0;
    let raf = 0;
    const tick = () => {
      t += 0.035;
      const rx = 8;
      const ry = 9;
      const x = Math.cos(t) * rx;
      const y = Math.sin(t) * ry;
      if (lRef.current)
        lRef.current.style.transform = `translate(${x}px, ${y}px)`;
      if (rRef.current)
        rRef.current.style.transform = `translate(${x}px, ${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // 3초 뒤에 페이지 이동
    const timer = setTimeout(() => {
      navigate("/output"); // Output/MainPage 경로
    }, 5000);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [navigate]);

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
