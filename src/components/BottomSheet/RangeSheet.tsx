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
          <button
            className={s.close}
            aria-label="닫기"
            onClick={onClose}
            type="button"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </header>

        <div className={s.fields}>
          <Field
            label="최소금액"
            unit={unit}
            value={lo}
            active={activeField === "lo"}
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
            onChange={(v) => setHi(stripComma(v))}
            onFocus={() => setActiveField("hi")}
            inputRef={hiRef}
          />
        </div>

        <DualSlider
          min={min}
          max={max}
          step={step}
          low={loNum ?? min}
          high={hiNum ?? max}
          onChange={(l, h) => {
            setLo(String(l));
            setHi(String(h));
          }}
        />

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
  onChange: (v: string) => void;
  onFocus: () => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
};

function Field({
  label,
  unit,
  value,
  active,
  onChange,
  onFocus,
  inputRef,
}: FieldProps) {
  return (
    <label className={`${s.field} ${active ? s.fieldActive : ""}`}>
      <span className={s.fieldLabel}>{label}</span>
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
          // Selected.svg 경로를 CSS 변수로 내려서 경로 이슈 방지
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

      {/* 입력은 항상 최상단에서 클릭을 받도록 */}
      <input
        className={`${s.thumb} ${s.thumbLow}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={low}
        onChange={onLow}
      />
      <input
        className={`${s.thumb} ${s.thumbHigh}`}
        type="range"
        min={min}
        max={max}
        step={step}
        value={high}
        onChange={onHigh}
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
