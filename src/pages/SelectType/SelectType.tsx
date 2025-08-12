// src/pages/SelectType/SelectType.tsx
import { useState } from "react";
import styles from "./SelectType.module.scss";

import coffee from "../../assets/categories/coffee.png";
import chicken from "../../assets/categories/chicken.png";
import pizza from "../../assets/categories/pizza.png";
import hamboogi from "../../assets/categories/hamboogi.png";
import bibim from "../../assets/categories/bibim.png";
import asian from "../../assets/categories/asian.png";
import pasta from "../../assets/categories/pasta.png";
import zza from "../../assets/categories/zza.png";
import sushi from "../../assets/categories/sushi.png";

type Category = { key: string; name: string; icon: string };

const CATEGORIES: Category[] = [
  { key: "coffee", name: "카페/디저트", icon: coffee },
  { key: "chicken", name: "치킨", icon: chicken },
  { key: "pizza", name: "피자", icon: pizza },
  { key: "hamboogi", name: "패스트푸드", icon: hamboogi },
  { key: "bibim", name: "한식", icon: bibim },
  { key: "asian", name: "아시안", icon: asian },
  { key: "pasta", name: "양식", icon: pasta },
  { key: "zza", name: "중식", icon: zza },
  { key: "sushi", name: "일식", icon: sushi },
];

export default function SelectType() {
  const [selected, setSelected] = useState<string | null>(null);

  const onNext = () => {
    if (!selected) return;
    // TODO: 다음 페이지 경로 연결 (useNavigate로 이동)
  };

  return (
    <>
      <div className={styles.head}>
        <h1>당신이 운영할{"\n"}가게의 업종을 선택해 주세요 📝</h1>
        <p>
          현재 창업을 고려 중인 업종을 선택해 주세요. 정확한 계산을 위해 한 번에
          하나의 업종만 선택할 수 있어요!
        </p>
      </div>

      <div className={styles.grid}>
        {CATEGORIES.map((c) => {
          const active = selected === c.key;
          return (
            <button
              key={c.key}
              className={`${styles.card} ${active ? styles.cardActive : ""}`}
              onClick={() => setSelected(c.key)}
              aria-pressed={active}
              type="button"
            >
              <img src={c.icon} alt="" className={styles.icon} />
              <span
                className={`${styles.label} ${
                  active ? styles.labelActive : ""
                }`}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>

      <button
        className={`${styles.next} ${!selected ? styles.disabled : ""}`}
        disabled={!selected}
        onClick={onNext}
        type="button"
      >
        다음으로
      </button>
    </>
  );
}
