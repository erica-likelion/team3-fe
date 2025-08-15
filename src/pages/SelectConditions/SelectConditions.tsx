// src/pages/SelectConditions/SelectConditions.tsx
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectConditions.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";

import RangeSheet from "../../components/BottomSheet/RangeSheet";
import RadioSheet from "../../components/BottomSheet/RadioSheet";

/** 어떤 시트를 열지 */
type SheetKey =
  | null
  | "평균 단가"
  | "특수 상권 여부"
  | "매장 운영 방식"
  | "월세 기준 예상"
  | "선호 평수"
  | "선호 층수";

/** 로딩 페이지로 넘길 페이로드 타입(백엔드 스펙) */
type AnalysisPayload = {
  addr: string; // "위도,경도"
  category: string; // 한글 카테고리
  marketingArea: string;
  budget: { min: number; max: number }; // 만원
  managementMethod: string;
  averagePrice: { min: number; max: number }; // 원
  size: { min: number; max: number }; // 평
  height: string; // 층(문자열로 전달)
};

// 원 → 만원(반올림). null이면 null 반환
const toManwon = (v: number | null) =>
  v == null ? null : Math.round(v / 10000);

// 숫자 → 로케일 문자열
const num = (n: number) => n.toLocaleString("ko-KR");

// 범위표시(뷰용)
const fmtRange = (v: [number | null, number | null], unit: string) => {
  const [a, b] = v;
  if (a === null || b === null) return "선택해 주세요";
  return `${num(a)}~${num(b)}${unit}`;
};

export default function SelectConditions() {
  const navigate = useNavigate();
  const { formData } = useRestaurantContext();

  // 입력값 상태
  const [unitPrice, setUnitPrice] = useState<[number | null, number | null]>([
    null,
    null,
  ]); // 평균 단가(원)
  const [rent, setRent] = useState<[number | null, number | null]>([
    null,
    null,
  ]); // 월세(원)
  const [district, setDistrict] = useState<string | null>(null); // 특수 상권 여부
  const [opMode, setOpMode] = useState<string | null>(null); // 운영 방식
  const [size, setSize] = useState<string | null>(null); // 선호 평수(라벨)
  const [floor, setFloor] = useState<string | null>(null); // 선호 층수(라벨)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [active, setActive] = useState<SheetKey>(null);

  /** 다음 버튼 활성화 조건 */
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

  /** 평수 라벨 → 범위 */
  const getSizeRange = (sizeStr: string): { min: number; max: number } => {
    const sizeMap: Record<string, { min: number; max: number }> = {
      "10평 이하": { min: 0, max: 10 },
      "11~20평": { min: 11, max: 20 },
      "21~30평": { min: 21, max: 30 },
      "31~40평": { min: 31, max: 40 },
      "41~50평": { min: 41, max: 50 },
      "51평 이상": { min: 51, max: 100 },
    };
    return sizeMap[sizeStr] || { min: 0, max: 0 };
  };

  /** 층수 라벨 → 숫자 */
  const getHeightFromFloor = (floorStr: string): number => {
    const floorMap: Record<string, number> = {
      지하층: 0,
      "1층": 1,
      "2층": 2,
      "3층": 3,
      "4층 이상": 4,
      "루프탑/옥상": 5,
    };
    return floorMap[floorStr] ?? 1;
  };

  /** 운영 방식 라벨 → 백엔드 문자열 */
  const getManagementMethod = (opModeStr: string): string => {
    const map: Record<string, string> = {
      "홀 운영 위주": "홀 영업 위주",
      "배달 운영 위주": "배달 영업 위주",
      "모두 겸함": "홀/배달 겸업",
    };
    return map[opModeStr] || opModeStr;
  };

  /** 제출 → 로딩 페이지로 페이로드 전달 (API는 로딩에서 호출) */
  const handleSubmit = async () => {
    if (!canNext || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // 튜플을 숫자 튜플로 좁히기(타입 경고 방지)
      const [unitMin, unitMax] = unitPrice as [number, number];
      const [rentMin, rentMax] = rent as [number, number];

      const sizeRange = getSizeRange(size!);
      const heightNum = getHeightFromFloor(floor!);
      const managementMethod = getManagementMethod(opMode!);

      // addr 없으면 임시값, 공백 제거
      const addrSafe = (formData.addr || "37.5665,126.9780").replace(
        /\s+/g,
        ""
      );

      //  budget 만원 단위로 변환(기본값 포함)
      const budgetMin = toManwon(rentMin) ?? 100;
      const budgetMax = toManwon(rentMax) ?? 150;

      // 평균 단가(원)
      const avgMin = unitMin ?? 6500;
      const avgMax = unitMax ?? avgMin;

      const payload: AnalysisPayload = {
        addr: addrSafe,
        category: formData.category || "",
        marketingArea: district!, // canNext로 보장됨
        budget: { min: budgetMin, max: budgetMax },
        managementMethod,
        averagePrice: { min: avgMin, max: avgMax },
        size: { min: sizeRange.min, max: sizeRange.max },
        height: String(heightNum),
      };

      console.log("전송할 데이터:", payload);

      // 로딩 페이지에서 실제 API 호출
      navigate("/loading", { state: { payload } });
    } catch (e) {
      console.error("제출 준비 실패:", e);
      alert("데이터 준비 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /** 리스트 행들 */
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
      <div className={styles.root}>
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

        <button
          className={`${styles.next} ${
            !canNext || isSubmitting ? styles.disabled : ""
          }`}
          disabled={!canNext || isSubmitting}
          type="button"
          onClick={handleSubmit}
        >
          {isSubmitting ? "전송 중..." : "다음으로"}
        </button>
      </div>

      {/* ====== BottomSheets ====== */}
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

      {/* 드롭다운(디폴트도 적용 가능) */}
      <RadioSheet
        open={active === "선호 층수"}
        title="선호 층수"
        variant="dropdown"
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
        variant="dropdown"
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
