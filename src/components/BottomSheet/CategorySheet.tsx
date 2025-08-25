import { useEffect, useState } from "react";
import styles from "./CategorySheet.module.scss";

import coffee from "../../assets/categories/coffee.png";
import pizzachicken from "../../assets/categories/pizzachicken.png";
import beer from "../../assets/categories/beer.png";
import hamboogi from "../../assets/categories/hamboogi.png";
import bibim from "../../assets/categories/bibim.png";
import asian from "../../assets/categories/asian.png";
import pasta from "../../assets/categories/pasta.png";
import zza from "../../assets/categories/zza.png";
import sushi from "../../assets/categories/sushi.png";
import CloseIcon from "../../assets/ui/sheetCloseButton.svg";

type Category = { key: string; name: string; icon: string };

const CATEGORIES: Category[] = [
  { key: "카페/디저트", name: "카페/디저트", icon: coffee },
  { key: "피자/치킨", name: "피자/치킨", icon: pizzachicken },
  { key: "주점/술집", name: "주점/술집", icon: beer },
  { key: "패스트푸드", name: "패스트푸드", icon: hamboogi },
  { key: "한식", name: "한식", icon: bibim },
  { key: "아시안", name: "아시안", icon: asian },
  { key: "양식", name: "양식", icon: pasta },
  { key: "중식", name: "중식", icon: zza },
  { key: "일식", name: "일식", icon: sushi },
];

type Props = {
  open: boolean;
  title: string;
  initial: string | null;
  onClose: () => void;
  onApply: (value: string | null) => void;
};

export default function CategorySheet({
  open,
  title,
  initial,
  onClose,
  onApply,
}: Props) {
  const [value, setValue] = useState<string | null>(initial);

  useEffect(() => {
    if (!open) return;
    setValue(initial ?? null);
  }, [open, initial]);
  useEffect(() => {
    const frame = document.querySelector(".iphone-frame");
    if (open) frame?.classList.add("modal-open");
    return () => frame?.classList.remove("modal-open");
  }, [open]);
  const canApply = !!value; // 값이 선택됐는지 여부
  const reset = () => setValue(null); // 초기화
  const apply = () => onApply(value);
  if (!open) return null;

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.sheet} role="dialog" aria-modal="true">
        <div className={styles.grabber} />
        <header className={styles.head}>
          <h2>{title}</h2>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="닫기"
            type="button"
          >
            <img src={CloseIcon} alt="" />
          </button>
        </header>

        <div className={styles.grid}>
          {CATEGORIES.map((c) => {
            const active = value === c.key;
            return (
              <button
                key={c.key}
                type="button"
                className={`${styles.card} ${active ? styles.cardActive : ""}`}
                onClick={() => setValue(c.key)}
              >
                <img src={c.icon} alt="" className={styles.icon} />
                <span className={styles.label}>{c.name}</span>
              </button>
            );
          })}
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.ghost}`}
            onClick={reset}
          >
            초기화
          </button>

          <button
            type="button"
            className={`${styles.btn} ${styles.primary} ${
              !canApply ? styles.disabled : ""
            }`}
            disabled={!canApply}
            onClick={apply}
          >
            적용하기
          </button>
        </div>

        <div className={styles.homeIndicator} aria-hidden />
      </aside>
    </>
  );
}
