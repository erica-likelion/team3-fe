import React, { useEffect, useMemo, useState } from "react";
import s from "./RadioSheet.module.scss";

import CloseIcon from "../../assets/ui/CloseButton.svg";
import ChevronDown from "../../assets/ui/chevron-down.svg";

type Item = { key: string; label: string };
type Variant = "dropdown" | "radio";

type Props = {
  open: boolean;
  title: string;
  items: Item[];
  initial: string | null;
  variant?: Variant; // 기본은 "radio"
  onClose: () => void;
  onApply: (v: string | null) => void;
};

export default function RadioSheet({
  open,
  title,
  items,
  initial,
  variant = "radio",
  onClose,
  onApply,
}: Props) {
  const [value, setValue] = useState<string | null>(initial);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!open) return;
    setValue(initial);
    setExpanded(false);
  }, [open, initial]);

  // 헤드 라벨
  const selectedLabel = items.find((i) => i.key === value)?.label ?? null;
  const defaultLabel = title.includes("평수")
    ? "10평 이하"
    : title.includes("층수")
    ? "1층"
    : "선택";
  const headLabel = selectedLabel ?? defaultLabel;

  const canApply = useMemo(() => value !== null, [value]);

  const reset = () => {
    setValue(null);
    setExpanded(false);
  };

  const apply = () => {
    if (!canApply) return;
    onApply(value);
  };

  if (!open) return null;

  // 드롭다운에서는 현재 헤드 텍스트는 목록에서 제외
  const dropdownList = items.filter((it) => it.label !== headLabel);

  return (
    <>
      <div className={s.backdrop} onClick={onClose} />
      <aside className={s.sheet} role="dialog" aria-modal="true">
        <div className={s.grabber} />
        <header className={s.header}>
          <h2 className={s.title}>{title}</h2>
          <button
            className={s.close}
            type="button"
            aria-label="닫기"
            onClick={onClose}
          >
            <img src={CloseIcon} alt="" />
          </button>
        </header>

        {variant === "dropdown" ? (
          <>
            {/* 헤드 */}
            <button
              type="button"
              className={[
                s.dropdownHead,
                expanded ? s.dropdownHeadOpen : "",
                selectedLabel ? s.dropdownHeadActive : "", // ✅ 선택 시 외곽선/아이콘/텍스트 주황
              ].join(" ")}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <span
                className={[
                  s.dropdownText,
                  selectedLabel ? s.dropdownTextActive : "",
                ].join(" ")}
              >
                {headLabel}
              </span>
              <img
                src={ChevronDown}
                alt=""
                className={[s.chev, expanded ? s.chevOpen : ""].join(" ")}
              />
            </button>

            {/* 목록 */}
            {expanded && (
              <div className={s.dropdownBody} role="listbox">
                {dropdownList.map((it) => (
                  <button
                    key={it.key}
                    type="button"
                    role="option"
                    aria-selected={value === it.key}
                    className={s.option}
                    onClick={() => {
                      setValue(it.key); // 선택
                      setExpanded(false); // 접기
                    }}
                  >
                    <span className={s.optionLabel}>{it.label}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          // 라디오 버전
          <ul className={s.radioList} role="listbox" aria-label={title}>
            {items.map((it) => {
              const active = value === it.key;
              return (
                <li key={it.key}>
                  <button
                    type="button"
                    className={`${s.radioItem} ${
                      active ? s.radioItemActive : ""
                    }`}
                    onClick={() => setValue(it.key)}
                    role="option"
                    aria-selected={active}
                  >
                    <span className={s.radioCircle} aria-hidden />
                    <span className={s.radioLabel}>{it.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        <div className={s.actions}>
          <button className={s.ghost} type="button" onClick={reset}>
            초기화
          </button>
          <button
            className={`${s.primary} ${!canApply ? s.disabled : ""}`}
            type="button"
            disabled={!canApply}
            onClick={apply}
          >
            적용하기
          </button>
        </div>

        <div className={s.homeIndicator} aria-hidden />
      </aside>
    </>
  );
}
