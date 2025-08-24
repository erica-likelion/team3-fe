import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectConditions.module.scss";
import { useRestaurantContext } from "../../context/RestaurantContext";
import { submitRestaurantData } from "../../services/api";

import RangeSheet from "../../components/BottomSheet/RangeSheet";
import RadioSheet from "../../components/BottomSheet/RadioSheet";

type SheetKey =
  | null
  | "대표 메뉴"
  | "평균 단가"
  | "특수 상권 여부"
  | "매장 운영 방식"
  | "월세 기준 예산"
  | "보증금 기준 예산"
  | "선호 평수"
  | "선호 층수";

// 대표 메뉴 데이터 정의
const REPRESENTATIVE_MENUS = {
  "카페/디저트": [
    "아메리카노",
    "조각 케이크",
    "샌드위치/샐러드",
    "아이스크림/빙수",
    "구움과자",
  ],
  "피자/치킨": ["피자", "치킨"],
  "주점/술집": ["볶음/구이", "찜/탕", "튀김/스낵"],
  패스트푸드: ["햄버거"],
  한식: ["찜/탕/찌개", "구이/볶음류", "덮밥/비빔밥", "면/국수", "국밥"],
  아시안: ["팟타이", "나시고렝", "쌀국수", "똠얌꿍", "반미"],
  양식: ["파스타", "스테이크", "리조또", "샐러드/브런치"],
  중식: ["짜장면", "짬뽕", "탕수육", "마라탕/샹궈"],
  일식: ["초밥", "회", "돈카츠", "라멘/우동/소바", "덮밥/도시락"],
};

export default function SelectConditions() {
  const navigate = useNavigate();
  const { formData, setAnalysisResult } = useRestaurantContext();
  const [representativeMenu, setRepresentativeMenu] = useState<string | null>(
    null
  );
  const [unitPrice, setUnitPrice] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [rent, setRent] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [deposit, setDeposit] = useState<[number | null, number | null]>([
    null,
    null,
  ]);
  const [district, setDistrict] = useState<string | null>(null);
  const [opMode, setOpMode] = useState<string | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [floor, setFloor] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showLoading, setShowLoading] = useState<boolean>(false);

  // 뒤로 가기로 돌아왔는지 확인하고 데이터 복원
  useEffect(() => {
    // 뒤로 가기로 돌아왔는지 확인 (document.referrer 또는 sessionStorage 사용)
    const isBackNavigation =
      sessionStorage.getItem("isBackNavigation") === "true";

    if (isBackNavigation) {
      // localStorage에서 저장된 데이터 불러오기
      try {
        const stored = localStorage.getItem("selectConditionsData");
        if (stored) {
          const data = JSON.parse(stored);
          if (data.representativeMenu)
            setRepresentativeMenu(data.representativeMenu);
          if (data.unitPrice) setUnitPrice(data.unitPrice);
          if (data.rent) setRent(data.rent);
          if (data.deposit) setDeposit(data.deposit);
          if (data.district) setDistrict(data.district);
          if (data.opMode) setOpMode(data.opMode);
          if (data.size) setSize(data.size);
          if (data.floor) setFloor(data.floor);
        }
      } catch (error) {
        console.error("Failed to restore saved data:", error);
      }

      // 복원 후 플래그 제거
      sessionStorage.removeItem("isBackNavigation");
    }
  }, []);

  // 데이터가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    const dataToSave = {
      representativeMenu,
      unitPrice,
      rent,
      deposit,
      district,
      opMode,
      size,
      floor,
    };

    try {
      localStorage.setItem("selectConditionsData", JSON.stringify(dataToSave));
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  }, [
    representativeMenu,
    unitPrice,
    rent,
    deposit,
    district,
    opMode,
    size,
    floor,
  ]);

  // 어떤 시트를 열지
  const [active, setActive] = useState<SheetKey>(null);

  // 현재 카테고리에 따른 대표 메뉴 목록 가져오기
  const getMenuItems = () => {
    const category = formData.category;
    if (!category) return [];

    const menuList =
      REPRESENTATIVE_MENUS[category as keyof typeof REPRESENTATIVE_MENUS] || [];
    return menuList.map((menu) => ({ key: menu, label: menu }));
  };

  const canNext = useMemo(
    () =>
      representativeMenu !== null &&
      unitPrice[0] !== null &&
      unitPrice[1] !== null &&
      rent[0] !== null &&
      rent[1] !== null &&
      deposit[0] !== null &&
      deposit[1] !== null &&
      district !== null &&
      opMode !== null &&
      size !== null &&
      floor !== null,
    [
      representativeMenu,
      unitPrice,
      rent,
      deposit,
      district,
      opMode,
      size,
      floor,
    ]
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
    setShowLoading(true);
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
        deposit: {
          min: deposit![0]!,
          max: deposit![1]!,
        },
        managementMethod: managementMethod,
        representativeMenuName: representativeMenu!,
        representativeMenuPrice: unitPrice![0]!,
        size: {
          min: sizeRange.min,
          max: sizeRange.max,
        },
        height: height.toString(),
      };

      console.log("전송할 데이터:", restaurantData);

      // API 호출
      const response = await submitRestaurantData(restaurantData);
      console.log("API 응답:", response);

      // 응답 데이터를 Context에 저장
      setAnalysisResult(response);

      // 성공 시 결과 페이지로 이동
      navigate("/output");
    } catch (error) {
      console.error("API 호출 실패:", error);
      alert("데이터 전송에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setShowLoading(false);
    }
  };

  const rows = [
    {
      key: "대표 메뉴",
      title: "대표 메뉴",
      value: representativeMenu ?? "선택해 주세요",
      onClick: () => setActive("대표 메뉴"),
    },
    {
      key: "평균 단가",
      title: "평균 단가",
      value: unitPrice[0]
        ? `${unitPrice[0].toLocaleString()}원`
        : "선택해 주세요",
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
      key: "월세 기준 예산",
      title: "월세 기준 예산",
      value: fmtRange(rent, "원"),
      onClick: () => setActive("월세 기준 예산"),
    },
    {
      key: "보증금 기준 예산",
      title: "보증금 기준 예산",
      value: fmtRange(deposit, "원"),
      onClick: () => setActive("보증금 기준 예산"),
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

  // 로딩 페이지 표시
  if (showLoading) {
    navigate("/loading?from=select-conditions");
    return null;
  }

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
      <RadioSheet
        open={active === "대표 메뉴"}
        title="대표 메뉴"
        items={getMenuItems()}
        initial={representativeMenu}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setRepresentativeMenu(v);
          setActive(null);
        }}
      />

      <RangeSheet
        key={`unitPrice-${unitPrice[0]}-${unitPrice[1]}`}
        open={active === "평균 단가"}
        title="평균 단가"
        unit="원"
        min={0}
        max={50_000}
        step={100}
        initial={unitPrice}
        singleValue={true}
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
        key={`rent-${rent[0]}-${rent[1]}`}
        open={active === "월세 기준 예산"}
        title="월세 기준 예산"
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

      <RangeSheet
        key={`deposit-${deposit[0]}-${deposit[1]}`}
        open={active === "보증금 기준 예산"}
        title="보증금 기준 예산"
        unit="원"
        min={0}
        max={100_000_000}
        step={5_000_000}
        initial={deposit}
        onClose={() => setActive(null)}
        onApply={(v) => {
          setDeposit(v);
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
