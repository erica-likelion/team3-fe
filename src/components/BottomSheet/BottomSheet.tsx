// src/components/BottomSheet/BottomSheet.tsx
import { ReactNode, useEffect } from "react";
import s from "./BottomSheet.module.scss";

type Props = {
  open: boolean;
  title: string;
  onClose: () => void;
  footer?: ReactNode; // 초기화/적용 버튼 묶음
  children: ReactNode; // 시트 본문(레인지/라디오/셀렉트 등)
};

export default function BottomSheet({
  open,
  title,
  onClose,
  footer,
  children,
}: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className={s.overlay} onClick={onClose} />
      <div
        className={s.sheet}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <div className={s.handle} />
        <div className={s.header}>
          <h3>{title}</h3>
          <button className={s.close} onClick={onClose} aria-label="close">
            ×
          </button>
        </div>
        <div className={s.content}>{children}</div>
        {footer && <div className={s.footer}>{footer}</div>}
      </div>
    </>
  );
}
