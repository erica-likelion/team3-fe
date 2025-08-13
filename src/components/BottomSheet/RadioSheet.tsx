// src/components/BottomSheet/RadioSheet.tsx
import { useState } from "react";
import BottomSheet from "./BottomSheet";
import s from "./BottomSheet.module.scss";

type Item = { key: string; label: string };
type Props = {
  open: boolean;
  title: string;
  items: Item[];
  initial?: string | null;
  onClose: () => void;
  onApply: (value: string | null) => void;
};

export default function RadioSheet({
  open,
  title,
  items,
  initial = null,
  onClose,
  onApply,
}: Props) {
  const [value, setValue] = useState<string | null>(initial);
  const canApply = value !== null;

  return (
    <BottomSheet
      open={open}
      title={title}
      onClose={onClose}
      footer={
        <>
          <button
            className={`${s.btn} ${s.outline}`}
            onClick={() => setValue(null)}
          >
            초기화
          </button>
          <button
            className={`${s.btn} ${s.primary} ${!canApply ? s.disabled : ""}`}
            onClick={() => canApply && onApply(value)}
          >
            적용하기
          </button>
        </>
      }
    >
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "grid",
          gap: 12,
        }}
      >
        {items.map((it) => (
          <li key={it.key}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <input
                type="radio"
                name="sheet-radio"
                checked={value === it.key}
                onChange={() => setValue(it.key)}
              />
              <span>{it.label}</span>
            </label>
          </li>
        ))}
      </ul>
    </BottomSheet>
  );
}
