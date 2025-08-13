import React, { useEffect, useMemo, useRef, useState } from "react";
import s from "./RangeSheet.module.scss";

import CloseIcon from "../../assets/ui/CloseButton.svg";
import SelectedIcon from "../../assets/ui/Selected.svg";

type Props = {
  open: boolean;
  title: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initial: [number | null, number | null];
  onClose: () => void;
  onApply: (range: [number | null, number | null]) => void;
};

export default function RangeSheet({
  open,
  title,
  unit,
  min,
  max,
  step,
  initial,
  onClose,
  onApply,
}: Props) {
  // 요구#1: 이 화면에서는 최대 50,000(원)으로 캡
  const effMin = Math.max(0, min);
  const effMax = Math.min(50000, max);

  const [lo, setLo] = useState<string>(fmt(initial[0]));
  const [hi, setHi] = useState<string>(fmt(initial[1]));
  const [activeField, setActiveField] = useState<"lo" | "hi" | null>(null);

  const loRef = useRef<HTMLInputElement | null>(null);
  const hiRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setLo(fmt(initial[0]));
    setHi(fmt(initial[1]));
    setActiveField(null);
  }, [open, initial[0], initial[1]]);

  const loNum = useMemo(
    () => toNumber(lo, effMin, effMax, step),
    [lo, effMin, effMax, step]
  );
  const hiNum = useMemo(
    () => toNumber(hi, effMin, effMax, step),
    [hi, effMin, effMax, step]
  );

  const bothValid =
    loNum !== null &&
    hiNum !== null &&
    loNum >= effMin &&
    hiNum <= effMax &&
    loNum <= hiNum;

  const onReset = () => {
    setLo("");
    setHi("");
    setActiveField(null);
  };

  const apply = () => {
    if (!bothValid) return;
    onApply([loNum, hiNum]);
  };

  if (!open) return null;

  const hasLo = lo.trim().length > 0;
  const hasHi = hi.trim().length > 0;

  return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <aside
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rangeTitle"
      >
        <div className={s.grabber} />

        <header className={s.header}>
          <h2 id="rangeTitle" className={s.title}>
            {title}
          </h2>
          {/* 요구#3: 회색 배경이 있는 X 버튼 */}
          <button
            className={s.close}
            aria-label="닫기"
            onClick={onClose}
            type="button"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </header>

        {/* 입력 필드 */}
        <div className={s.fields}>
          <Field
            label="최소금액"
            unit={unit}
            value={lo}
            active={activeField === "lo"}
            hasValue={hasLo}
            onChange={(v) => setLo(stripComma(v))}
            onFocus={() => setActiveField("lo")}
            inputRef={loRef}
          />
          <span className={s.hyphen}>-</span>
          <Field
            label="최대금액"
            unit={unit}
            value={hi}
            active={activeField === "hi"}
            hasValue={hasHi}
            onChange={(v) => setHi(stripComma(v))}
            onFocus={() => setActiveField("hi")}
            inputRef={hiRef}
          />
        </div>

        {/* 듀얼 슬라이더 */}
        <DualSlider
          min={effMin}
          max={effMax}
          step={step}
          low={loNum ?? effMin}
          high={hiNum ?? effMax}
          onChange={(l, h) => {
            setLo(String(l));
            setHi(String(h));
          }}
        />

        {/* 액션 */}
        <div className={s.actions}>
          <button className={s.ghost} type="button" onClick={onReset}>
            초기화
          </button>
          <button
            className={`${s.primary} ${!bothValid ? s.disabled : ""}`}
            type="button"
            disabled={!bothValid}
            onClick={apply}
          >
            적용하기
          </button>
        </div>

        {/* 홈 인디케이터 간격 확보 + 표시(요구#6) */}
        <div className={s.homeIndicator} aria-hidden />
      </aside>
    </>
  );
}

/* -------------------- Sub Components -------------------- */

type FieldProps = {
  label: string;
  unit: string;
  value: string;
  active: boolean;
  hasValue: boolean;
  onChange: (v: string) => void;
  onFocus: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

function Field({
  label,
  unit,
  value,
  active,
  hasValue,
  onChange,
  onFocus,
  inputRef,
}: FieldProps) {
  return (
    <label
      className={`${s.field} ${active ? s.fieldActive : ""} ${
        hasValue ? s.fieldFilled : s.fieldEmpty
      }`}
    >
      {/* 요구#5: 디폴트 상태엔 중앙에 '최소금액 원' / 값이 생기면 좌측 정렬 + 주황색 */}
      <input
        ref={inputRef}
        inputMode="numeric"
        aria-label={label}
        placeholder={label}
        value={formatWithComma(value)}
        onChange={(e) => onChange(stripComma(e.target.value))}
        onFocus={onFocus}
      />
      <span className={s.unit}>{unit}</span>
    </label>
  );
}

type DualSliderProps = {
  min: number;
  max: number;
  step: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
};

function DualSlider({ min, max, step, low, high, onChange }: DualSliderProps) {
  // 요구#2: 어느 쪽이든 정상 드래그되도록 "현재 활성 thumb"을 올려줌
  const [active, setActive] = useState<"low" | "high" | null>(null);

  const onLow = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = snap(Number(e.target.value), step, min, max);
    onChange(Math.min(v, high), high);
  };
  const onHigh = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = snap(Number(e.target.value), step, min, max);
    onChange(low, Math.max(v, low));
  };

  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  return (
    <div
      className={s.sliderWrap}
      style={
        {
          ["--selected-url" as any]: `url(${SelectedIcon})`,
        } as React.CSSProperties
      }
    >
      <div className={s.track} aria-hidden />
      {/* 요구#4: 주황색 선택 구간 확실히 보이도록 색상 채움 + SVG 도트 덮어씀 */}
      <div
        className={s.range}
        aria-hidden
        style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
      />

      <input
        className={`${s.thumb} ${s.thumbLow} ${
          active === "low" ? s.thumbTop : ""
        }`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={onLow}
        onMouseDown={() => setActive("low")}
        onTouchStart={() => setActive("low")}
      />
      <input
        className={`${s.thumb} ${s.thumbHigh} ${
          active === "high" ? s.thumbTop : ""
        }`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={onHigh}
        onMouseDown={() => setActive("high")}
        onTouchStart={() => setActive("high")}
      />
    </div>
  );
}

/* -------------------- Utils -------------------- */

function fmt(n: number | null) {
  return n == null ? "" : String(n);
}
function stripComma(v: string) {
  return v.replace(/[^\d]/g, "");
}
function formatWithComma(v: string) {
  if (!v) return "";
  const n = Number(v);
  if (Number.isNaN(n)) return v;
  return n.toLocaleString("ko-KR");
}
function toNumber(
  v: string,
  min: number,
  max: number,
  step: number
): number | null {
  if (!v) return null;
  const n = Number(v);
  if (Number.isNaN(n)) return null;
  return snap(clamp(n, min, max), step, min, max);
}
function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
function snap(n: number, step: number, min: number, max: number) {
  const snapped = Math.round((n - min) / step) * step + min;
  return clamp(snapped, min, max);
}
