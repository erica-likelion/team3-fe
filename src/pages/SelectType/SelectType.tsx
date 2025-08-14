import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectType.module.scss";

import RangeSheet from "../../components/BottomSheet/RangeSheet";
import RadioSheet from "../../components/BottomSheet/RadioSheet";

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

type SheetKey = null | "월세" | "단가" | "상권" | "운영";

export default function SelectType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);

  // ▼ 바텀시트 상태
  const [activeSheet, setActiveSheet] = useState<SheetKey>(null);
  const [rent, setRent] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [price, setPrice] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [trade, setTrade] = useState<string | null>(null);
  const [opMode, setOpMode] = useState<string | null>(null);

  const onNext = () => {
    if (!selected) return;
    navigate(`/select/conditions?cat=${encodeURIComponent(selected)}`);
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

      {/* ▼ 바텀시트들: 필요할 때 setActiveSheet("월세") 같은 식으로 열기 */}
      <RangeSheet
        open={activeSheet === "월세"}
        title="월세 기준 예상"
        unit="원"
        min={0}
        max={1_500_000}
        step={10_000}
        initial={rent}
        onClose={() => setActiveSheet(null)}
        onApply={(v) => {
          setRent(v);
          setActiveSheet(null);
        }}
      />

      <RangeSheet
        open={activeSheet === "단가"}
        title="평균 단가"
        unit="원"
        min={0}
        max={50_000}
        step={100}
        initial={price}
        onClose={() => setActiveSheet(null)}
        onApply={(v) => {
          setPrice(v);
          setActiveSheet(null);
        }}
      />

      <RadioSheet
        open={activeSheet === "상권"}
        title="특수 상권 여부"
        items={[
          { key: "대학", label: "대학가/학교 주변" },
          { key: "공단", label: "공단/회사 단지/산업단지" },
          { key: "관광", label: "관광지/피서지" },
          { key: "주택", label: "아파트 단지/주택 밀집 지역" },
          { key: "없음", label: "해당 사항 없음" },
        ]}
        initial={trade}
        onClose={() => setActiveSheet(null)}
        onApply={(v) => {
          setTrade(v);
          setActiveSheet(null);
        }}
      />

      <RadioSheet
        open={activeSheet === "운영"}
        title="매장 운영 방식"
        items={[
          { key: "홀", label: "홀 운영 위주" },
          { key: "배달", label: "배달 운영 위주" },
          { key: "혼합", label: "모두 겸함" },
        ]}
        initial={opMode}
        onClose={() => setActiveSheet(null)}
        onApply={(v) => {
          setOpMode(v);
          setActiveSheet(null);
        }}
      />
    </>
  );
}
