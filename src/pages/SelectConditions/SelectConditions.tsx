import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectConditions.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";
import { submitRestaurantData } from "../../services/api";

import RangeSheet from "../../components/BottomSheet/RangeSheet";
import RadioSheet from "../../components/BottomSheet/RadioSheet";

type SheetKey =
  | null
  | "평균 단가"
  | "특수 상권 여부"
  | "매장 운영 방식"
  | "월세 기준 예상"
  | "선호 평수"
  | "선호 층수";

export default function SelectConditions() {
  const navigate = useNavigate();
  const { formData } = useRestaurantContext();
  const [unitPrice, setUnitPrice] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [rent, setRent] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [district, setDistrict] = useState<string | null>(null);
  const [opMode, setOpMode] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [floor, setFloor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // 어떤 시트를 열지
  const [active, setActive] = useState<SheetKey>(null);

  const canNext = useMemo(
    () =>
      unitPrice[0] !== null &&
      unitPrice[1] !== null &&
      rent[0] !== null &&
      rent[1] !== null &&
      district !== null &&
      opMode !== null &&
      size !== null &&
      floor !== null,
    [unitPrice, rent, district, opMode, size, floor]
  );

  // 평수 범위를 숫자로 변환하는 함수
  const getSizeRange = (sizeStr: string): { min: number; max: number } => {
    const sizeMap: { [key: string]: { min: number; max: number } } = {
      "10평 이하": { min: 0, max: 10 },
      "11~20평": { min: 11, max: 20 },
      "21~30평": { min: 21, max: 30 },
      "31~40평": { min: 31, max: 40 },
      "41~50평": { min: 41, max: 50 },
      "51평 이상": { min: 51, max: 100 },
    };
    return sizeMap[sizeStr] || { min: 0, max: 0 };
  };

  // 층수를 숫자로 변환하는 함수
  const getHeightFromFloor = (floorStr: string): number => {
    const floorMap: { [key: string]: number } = {
      지하층: 0,
      "1층": 1,
      "2층": 2,
      "3층": 3,
      "4층 이상": 4,
      "루프탑/옥상": 5,
    };
    return floorMap[floorStr] || 1;
  };

  // 운영 방식을 백엔드 형식으로 변환하는 함수
  const getManagementMethod = (opModeStr: string): string => {
    const opModeMap: { [key: string]: string } = {
      "홀 운영 위주": "홀 영업 위주",
      "배달 운영 위주": "배달 영업 위주",
      "모두 겸함": "홀/배달 겸업",
    };
    return opModeMap[opModeStr] || opModeStr;
  };

  const handleSubmit = async () => {
    if (!canNext) return;

    setIsSubmitting(true);
    try {
      // 모든 데이터를 수집
      const sizeRange = getSizeRange(size!);
      const height = getHeightFromFloor(floor!);
      const managementMethod = getManagementMethod(opMode!);

      const restaurantData = {
        addr: formData.addr || "",
        category: formData.category || "",
        marketingArea: district!,
        budget: {
          min: rent![0]!,
          max: rent![1]!,
        },
        managementMethod: managementMethod,
        averagePrice: {
          min: unitPrice![0]!,
          max: unitPrice![1]!,
        },
        size: {
          min: sizeRange.min,
          max: sizeRange.max,
        },
        height: height,
      };

      console.log("전송할 데이터:", restaurantData);

      // API 호출
      const response = await submitRestaurantData(restaurantData);
      console.log("API 응답:", response);

      // 성공 시 결과 페이지로 이동
      navigate("/output");
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("데이터 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const rows = [
    {
      key: "평균 단가",
      title: "평균 단가",
      value: fmtRange(unitPrice, "원"),
      onClick: () => setActive("평균 단가"),
    },
    {
      key: "특수 상권 여부",
      title: "특수 상권 여부",
      value: district ?? "선택해 주세요",
      onClick: () => setActive("특수 상권 여부"),
    },
    {
      key: "매장 운영 방식",
      title: "매장 운영 방식",
      value: opMode ?? "선택해 주세요",
      onClick: () => setActive("매장 운영 방식"),
    },
    {
      key: "월세 기준 예상",
      title: "월세 기준 예상",
      value: fmtRange(rent, "원"),
      onClick: () => setActive("월세 기준 예상"),
    },
    {
      key: "선호 평수",
      title: "선호 평수",
      value: size ?? "선택해 주세요",
      onClick: () => setActive("선호 평수"),
    },
    {
      key: "선호 층수",
      title: "선호 층수",
      value: floor ?? "선택해 주세요",
      onClick: () => setActive("선호 층수"),
    },
  ];

  return (
    <>
      {/* 루트 래퍼: TopBar ↔ HeadInfo 24px 패딩 보장 */}
      <div className={styles.root}>
        {/* HeadInfo */}
        <div className={styles.head}>
          <h1>
            당신이 운영할
            <br />
            가게에 대해 알려 주세요 <span className={styles.nowrap}>📝</span>
          </h1>
          <p className={styles.desc}>
            <span className={styles.line}>
              온길은 개개인의 창업 조건에 맞추어 분석 결과를 제공합니다.
            </span>
            <br />
            <span className={styles.line}>
              질문에 자세히 답변해 주시면 정확도가 올라가요!
            </span>
          </p>
        </div>

        {/* 리스트 */}
        <ul className={styles.list} role="list">
          {rows.map((r) => {
            const selected = r.value !== "선택해 주세요";
            return (
              <li
                key={r.key}
                className={styles.item}
                onClick={r.onClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    r.onClick();
                  }
                }}
              >
                <div className={styles.itemLeft}>
                  <div className={styles.itemTitle}>{r.title}</div>
                  <div
                    className={`${styles.itemValue} ${
                      selected ? styles.selected : ""
                    }`}
                  >
                    {r.value}
                  </div>
                </div>
                <div className={styles.chev} aria-hidden>
                  ›
                </div>
              </li>
            );
          })}
        </ul>

        {/* 하단 고정 버튼 */}
        <button
          className={`${styles.next} ${!canNext ? styles.disabled : ""}`}
          disabled={!canNext || isSubmitting}
          type="button"
          onClick={handleSubmit}
        >
          {isSubmitting ? "전송 중..." : "다음으로"}
        </button>
      </div>

      {/* ===== BottomSheets ===== */}
      <RangeSheet
        open={active === "평균 단가"}
        title="평균 단가"
        unit="원"
        min={0}
        max={50_000}
        step={100}
        initial={unitPrice}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setUnitPrice(v);
          setActive(null);
        }}
      />

      <RadioSheet
        open={active === "특수 상권 여부"}
        title="특수 상권 여부"
        items={[
          { key: "대학가/학교 주변", label: "대학가/학교 주변" },
          { key: "공단/회사 단지/산업단지", label: "공단/회사 단지/산업단지" },
          { key: "관광지/피서지", label: "관광지/피서지" },
          {
            key: "아파트 단지/주택 밀집 지역",
            label: "아파트 단지/주택 밀집 지역",
          },
          { key: "해당 사항 없음", label: "해당 사항 없음" },
        ]}
        initial={district}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setDistrict(v);
          setActive(null);
        }}
      />

      <RadioSheet
        open={active === "매장 운영 방식"}
        title="매장 운영 방식"
        items={[
          { key: "홀 운영 위주", label: "홀 운영 위주" },
          { key: "배달 운영 위주", label: "배달 운영 위주" },
          { key: "모두 겸함", label: "모두 겸함" },
        ]}
        initial={opMode}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setOpMode(v);
          setActive(null);
        }}
      />

      <RangeSheet
        open={active === "월세 기준 예상"}
        title="월세 기준 예상"
        unit="원"
        min={0}
        max={1_500_000}
        step={10_000}
        initial={rent}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setRent(v);
          setActive(null);
        }}
      />

      <RadioSheet
        open={active === "선호 층수"}
        title="선호 층수"
        variant="dropdown" // ← 드롭다운
        items={[
          { key: "지하층", label: "지하층" },
          { key: "1층", label: "1층" },
          { key: "2층", label: "2층" },
          { key: "3층", label: "3층" },
          { key: "4층 이상", label: "4층 이상" },
          { key: "루프탑/옥상", label: "루프탑/옥상" },
        ]}
        initial={floor}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setFloor(v);
          setActive(null);
        }}
      />

      <RadioSheet
        open={active === "선호 평수"}
        title="선호 평수"
        variant="dropdown" // ← 드롭다운
        items={[
          { key: "10평 이하", label: "10평 이하" },
          { key: "11~20평", label: "11~20평" },
          { key: "21~30평", label: "21~30평" },
          { key: "31~40평", label: "31~40평" },
          { key: "41~50평", label: "41~50평" },
          { key: "51평 이상", label: "51평 이상" },
        ]}
        initial={size}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setSize(v);
          setActive(null);
        }}
      />
    </>
  );
}

function fmtRange(v: [number | null, number | null], unit: string) {
  const [a, b] = v;
  if (a === null || b === null) return "선택해 주세요";
  return `${num(a)}~${num(b)}${unit}`;
}
function num(n: number) {
  return n.toLocaleString("ko-KR");
}
