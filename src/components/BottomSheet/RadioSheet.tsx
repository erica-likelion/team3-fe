import { useEffect, useMemo, useState } from "react";
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
  variant?: Variant;
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

  // 드롭다운 디폴트 라벨
  const defaultLabel = useMemo(() => {
    if (title.includes("평수")) return "10평 이하";
    if (title.includes("층수")) return "1층";
    return "선택";
  }, [title]);

  // 디폴트 라벨과 일치하는 항목(없으면 첫 항목)
  const defaultItem = useMemo<Item | null>(() => {
    return items.find((i) => i.label === defaultLabel) ?? items[0] ?? null;
  }, [items, defaultLabel]);

  // ✅ 드롭다운일 땐 선택이 없어도 디폴트를 '실제 선택값'으로 간주
  const effectiveValue = useMemo<string | null>(() => {
    return variant === "dropdown" ? value ?? defaultItem?.key ?? null : value;
  }, [variant, value, defaultItem]);

  // 헤더에 표시할 텍스트
  const selectedLabel =
    items.find((i) => i.key === effectiveValue)?.label ?? defaultLabel;
  const headLabel = selectedLabel;

  // ✅ 드롭다운은 기본값만 있어도 적용하기 활성화
  const canApply = useMemo(() => {
    return variant === "dropdown" ? !!effectiveValue : value !== null;
  }, [variant, effectiveValue, value]);

  const reset = () => {
    setValue(null);
    setExpanded(false);
  };

  const apply = () => {
    if (!canApply) return;

    onApply(effectiveValue);
  };

  if (!open) return null;

  const dropdownList =
    variant === "dropdown"
      ? items.filter((it) => it.label !== headLabel)
      : items;

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
                effectiveValue ? s.dropdownHeadActive : "",
              ].join(" ")}
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
            >
              <span
                className={[
                  s.dropdownText,
                  effectiveValue ? s.dropdownTextActive : "",
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
                    aria-selected={effectiveValue === it.key}
                    className={s.option}
                    onClick={() => {
                      setValue(it.key);
                      setExpanded(false);
                    }}
                  >
                    <span className={s.optionLabel}>{it.label}</span>
                  </button>
                ))}
              </div>
            )}
          </>
        ) : (
          // 라디오
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
