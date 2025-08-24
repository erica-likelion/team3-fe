import React, { useEffect, useRef, useState } from "react";
import styles from "./Collaboration.module.scss";
import smallOngilMarkIcon from "../../assets/ui/smallOngilMark.svg";
import alertCircleIcon from "../../assets/ui/alertCircle.svg";
import { getRestaurants, type Restaurant } from "../../services/api";

declare global {
  interface Window {
    kakao: any;
  }
}

const Collaboration: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [mapInstance, setMapInstance] = useState<unknown>(null); // kakao.maps.Map 타입
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);

  // API에서 레스토랑 데이터 가져오기
  const fetchRestaurants = async () => {
    try {
      const data = await getRestaurants();
      setRestaurants(data);
      console.log("레스토랑 데이터 로드 완료:", data);
    } catch (error) {
      console.error("레스토랑 데이터 로드 실패:", error);
    }
  };

  // 레스토랑 마커들을 지도에 표시
  const displayRestaurantMarkers = (
    map: unknown,
    restaurants: Restaurant[]
  ) => {
    if (!map || restaurants.length === 0) return;

    const kakaoMap = map as typeof window.kakao.maps.Map;

    // smallOngilMark 이미지로 마커 생성
    const markerImage = new window.kakao.maps.MarkerImage(
      smallOngilMarkIcon,
      new window.kakao.maps.Size(34, 34),
      {
        anchor: new window.kakao.maps.Point(17, 17), // 마커 이미지의 중앙을 앵커로 설정
      }
    );

    restaurants.forEach((restaurant) => {
      if (restaurant.lat && restaurant.lon) {
        const position = new window.kakao.maps.LatLng(
          restaurant.lat,
          restaurant.lon
        );

        // 마커 생성
        const marker = new window.kakao.maps.Marker({
          position: position,
          image: markerImage,
          title: restaurant.name, // 마커에 마우스를 올리면 표시될 텍스트
        });

        // 마커를 지도에 표시
        marker.setMap(kakaoMap);
      }
    });
  };

  useEffect(() => {
    const kakao = window.kakao;
    const container = mapRef.current; // 지도를 담을 영역의 DOM 참조

    if (!container) {
      setError("지도 컨테이너를 찾을 수 없습니다.");
      setIsLoading(false);
      return;
    }

    try {
      // 지도를 생성할 때 필요한 기본 옵션
      const options = {
        center: new kakao.maps.LatLng(37.2983, 126.8391), // 한양대학교 에리카 캠퍼스
        level: 5, // 지도의 레벨(확대, 축소 정도) - 약 500m 범위
        draggable: false, // 지도 드래그 비활성화
        maxLevel: 5, // 최소 줌 레벨 (5보다 작은 레벨로는 줌 불가)
      };

      const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
      setMapInstance(kakaoMap);

      // 지도 생성 후 줌 기능 활성화
      kakaoMap.setZoomable(true);

      // 줌 레벨 변경 이벤트 리스너 추가
      kakao.maps.event.addListener(kakaoMap, "zoom_changed", function () {
        const currentLevel = kakaoMap.getLevel();
        if (currentLevel === 5) {
          // level 5로 돌아오면 처음 좌표로 이동
          const initialCenter = new kakao.maps.LatLng(37.2983, 126.8391);
          kakaoMap.setCenter(initialCenter);
        }
      });

      setIsLoading(false);
      console.log("카카오 지도 초기화 완료");

      // 지도 클릭 이벤트 - 확대 모드로 전환
      const clickListener = function () {
        if (!isMapExpanded) {
          // 확대 모드로 전환
          setIsMapExpanded(true);
          return;
        }
      };

      kakao.maps.event.addListener(kakaoMap, "click", clickListener);

      // 클린업 함수
      return () => {
        kakao.maps.event.removeListener(kakaoMap, "click", clickListener);
      };
    } catch (err) {
      console.error("지도 초기화 오류:", err);
      setError("지도를 초기화하는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, [isMapExpanded]);

  // 레스토랑 데이터 로드 및 마커 표시
  useEffect(() => {
    fetchRestaurants();
  }, []);

  // 지도 인스턴스가 준비되면 레스토랑 마커 표시
  useEffect(() => {
    if (mapInstance && restaurants.length > 0) {
      displayRestaurantMarkers(mapInstance, restaurants);
    }
  }, [mapInstance, restaurants]);

  return (
    <div className={styles.selectPlace}>
      {!isMapExpanded && (
        <div className={styles.header}>
          <h1 className={styles.title}>
            당신이 운영할{"\n"}가게의 위치를 선택해 주세요 🏪
          </h1>
          <p className={styles.description}>
            현재 창업을 고려 중인 지역을 선택해 주세요.{"\n"}분석 정확도를 위해
            한 개의 지역만 선택 가능합니다.
          </p>
        </div>
      )}

      <div
        className={`${styles.mapContainer} ${
          isMapExpanded ? styles.mapExpanded : ""
        }`}
      >
        {isLoading && (
          <div className={styles.loading}>
            <p>지도를 불러오는 중...</p>
          </div>
        )}
        {error && (
          <div className={styles.error}>
            <p>{error}</p>
            <p>API 키와 도메인 설정을 확인해주세요.</p>
          </div>
        )}

        <div ref={mapRef} className={styles.map}></div>
      </div>

      {/* 알림 섹션 - 최초 로딩 시에만 표시 */}
      {!isMapExpanded && (
        <div className={styles.alertSection}>
          <img src={alertCircleIcon} alt="알림" className={styles.alertIcon} />
          <p className={styles.alertText}>
            2025 중앙해커톤 내 서비스 범위는 한양대 ERICA 인근 상권에 한정됩니다
          </p>
        </div>
      )}
    </div>
  );
};

export default Collaboration;
