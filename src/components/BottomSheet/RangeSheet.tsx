import React, { useEffect, useMemo, useRef, useState } from "react";
import s from "./RangeSheet.module.scss";

import CloseIcon from "../../assets/ui/sheetCloseButton.svg";
import SelectedIcon from "../../assets/ui/Selected.svg"; // 선택 구간 도트(오버레이용)

type Props = {
  open: boolean;
  title: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  initial: [number | null, number | null];
  singleValue?: boolean;
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
  singleValue = false,
  onClose,
  onApply,
}: Props) {
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
  }, [open, initial]);

  // 숫자 파싱/스냅 (범위 제한은 props의 min/max 그대로 사용)
  const loNum = useMemo(
    () => toNumber(lo, min, max, step),
    [lo, min, max, step]
  );
  const hiNum = useMemo(
    () => toNumber(hi, min, max, step),
    [hi, min, max, step]
  );

  const bothValid =
    loNum !== null &&
    hiNum !== null &&
    loNum >= min &&
    hiNum <= max &&
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
        {/* 그랩바 */}
        <div className={s.grabber} />

        {/* 헤더 */}
        <header className={s.header}>
          <h2 id="rangeTitle" className={s.title}>
            {title}
          </h2>
          {/* 회색 배경의 X 버튼 */}
          <button
            className={s.close}
            aria-label="닫기"
            onClick={onClose}
            type="button"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </header>

        {/* 인풋 필드 */}
        <div className={s.fields}>
          {singleValue ? (
            <Field
              label="금액"
              unit={unit}
              value={lo}
              active={activeField === "lo"}
              hasValue={hasLo}
              onChange={(v) => {
                setLo(stripComma(v));
                setHi(stripComma(v));
              }}
              onFocus={() => setActiveField("lo")}
              inputRef={loRef}
            />
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* 듀얼 슬라이더 */}
        <DualSlider
          min={min}
          max={max}
          step={step}
          low={loNum ?? min}
          high={hiNum ?? max}
          singleValue={singleValue}
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

        {/* 홈 인디케이터 */}
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
  singleValue?: boolean;
  onChange: (low: number, high: number) => void;
};

/**
 * 충돌/끊김 방지 버전:
 * - 보이는 native range는 pointer-events:none
 * - 드래그는 오버레이에서 처리 + rAF로 프레임당 1회만 업데이트
 */
function DualSlider({
  min,
  max,
  step,
  low,
  high,
  singleValue = false,
  onChange,
}: DualSliderProps) {
  const wrapRef = React.useRef<HTMLDivElement | null>(null);
  const activeRef = React.useRef<"low" | "high" | null>(null);
  const rafId = React.useRef<number | null>(null);
  const pending = React.useRef<{ low: number; high: number } | null>(null);

  const pct = (n: number) => ((n - min) / (max - min)) * 100;

  const posToValue = (clientX: number) => {
    const el = wrapRef.current!;
    const r = el.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - r.left, 0), r.width);
    const raw = min + (x / r.width) * (max - min);
    return snap(raw, step, min, max);
  };

  const flushRaf = () => {
    if (!pending.current) return;
    onChange(pending.current.low, pending.current.high);
    pending.current = null;
    rafId.current = null;
  };

  const schedule = (nextLow: number, nextHigh: number) => {
    if (nextLow === low && nextHigh === high) return;
    pending.current = { low: nextLow, high: nextHigh };
    if (rafId.current == null) rafId.current = requestAnimationFrame(flushRaf);
  };

  const start = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (singleValue) {
      activeRef.current = "low";
    } else {
      const v = posToValue(e.clientX);
      const pick = Math.abs(v - low) <= Math.abs(v - high) ? "low" : "high";
      activeRef.current = pick;
    }
    move(e);
  };

  const move = (e: React.PointerEvent) => {
    const pick = activeRef.current;
    if (!pick) return;
    const v = posToValue(e.clientX);
    if (singleValue) {
      schedule(v, v);
    } else {
      if (pick === "low") {
        schedule(Math.min(v, high), high);
      } else {
        schedule(low, Math.max(v, low));
      }
    }
  };

  const end = (e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    activeRef.current = null;
    if (pending.current && rafId.current == null) flushRaf();
  };

  return (
    <div
      className={s.sliderWrap}
      ref={wrapRef}
      style={
        {
          ["--selected-url" as any]: `url(${SelectedIcon})`,
        } as React.CSSProperties
      }
    >
      <div className={s.track} aria-hidden />
      <div
        className={s.range}
        aria-hidden
        style={{ left: `${pct(low)}%`, width: `${pct(high) - pct(low)}%` }}
      />

      {/* 보이는 thumb (접근성용으로만 존재, 클릭/드래그는 오버레이가 처리) */}
      {singleValue ? (
        <input
          className={`${s.thumb} ${s.thumbLow}`}
          type="range"
          min={min}
          max={max}
          step={step}
          value={low}
          readOnly
          tabIndex={-1}
          aria-hidden
        />
      ) : (
        <>
          <input
            className={`${s.thumb} ${s.thumbLow}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={low}
            readOnly
            tabIndex={-1}
            aria-hidden
          />
          <input
            className={`${s.thumb} ${s.thumbHigh}`}
            type="range"
            min={min}
            max={max}
            step={step}
            value={high}
            readOnly
            tabIndex={-1}
            aria-hidden
          />
        </>
      )}

      {/* 포인터 이벤트 전담 */}
      <div
        className={s.dragOverlay}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
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
