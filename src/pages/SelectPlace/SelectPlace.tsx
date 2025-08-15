import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./SelectPlace.module.scss";
import mapSpotIcon from "../../assets/ui/mapSpot.svg";

declare global {
  interface Window {
    kakao: any;
  }
}

const SelectPlace: React.FC = () => {
  const navigate = useNavigate();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const currentMarkerRef = useRef<any>(null);

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
        level: 3, // 지도의 레벨(확대, 축소 정도)
      };

      const kakaoMap = new kakao.maps.Map(container, options); // 지도 생성 및 객체 리턴
      setMap(kakaoMap);
      setIsLoading(false);
      console.log("카카오 지도 초기화 완료");

      // 지도 클릭 이벤트
      kakao.maps.event.addListener(
        kakaoMap,
        "click",
        function (mouseEvent: any) {
          const latlng = mouseEvent.latLng;

          // 기존 마커가 있다면 제거
          if (currentMarkerRef.current) {
            currentMarkerRef.current.setMap(null);
          }

          // 즉시 마커 생성 (딜레이 없음)
          const markerImage = new kakao.maps.MarkerImage(
            mapSpotIcon,
            new kakao.maps.Size(33, 33)
          );

          const marker = new kakao.maps.Marker({
            position: latlng,
            image: markerImage,
          });
          marker.setMap(kakaoMap);
          currentMarkerRef.current = marker;

          // 백그라운드에서 주소 변환 (딜레이 있지만 마커는 이미 표시됨)
          const geocoder = new kakao.maps.services.Geocoder();
          geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            function (result: any, status: any) {
              if (status === kakao.maps.services.Status.OK) {
                const address = result[0].address.address_name;
                setSelectedLocation(address);
              }
            }
          );
        }
      );
    } catch (err) {
      console.error("지도 초기화 오류:", err);
      setError("지도를 초기화하는 중 오류가 발생했습니다.");
      setIsLoading(false);
    }
  }, []);

  const handleSearch = () => {
    if (!searchKeyword.trim() || !map) return;

    const kakao = window.kakao;
    const places = new kakao.maps.services.Places();
    places.keywordSearch(searchKeyword, function (data: any, status: any) {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();

        data.forEach((place: any) => {
          bounds.extend(new kakao.maps.LatLng(place.y, place.x));
        });

        map.setBounds(bounds);

        if (data.length > 0) {
          const firstPlace = data[0];
          setSelectedLocation(firstPlace.address_name);

          // 기존 마커가 있다면 제거
          if (currentMarkerRef.current) {
            currentMarkerRef.current.setMap(null);
          }

          // 커스텀 마커 생성
          const markerImage = new kakao.maps.MarkerImage(
            mapSpotIcon,
            new kakao.maps.Size(40, 40)
          );

          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(firstPlace.y, firstPlace.x),
            image: markerImage,
          });
          marker.setMap(map);
          currentMarkerRef.current = marker;
        }
      }
    });
  };

  const handleNext = () => {
    if (selectedLocation) {
      console.log("선택된 위치:", selectedLocation);
      navigate("/select-type");
    }
  };

  return (
    <div className={styles.selectPlace}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          당신이 운영할{"\n"}가게의 위치를 선택해 주세요 🏪
        </h1>
        <p className={styles.description}>
          현재 창업을 고려 중인 지역을 선택해 주세요. 분석 정확도를 위해 한 개의
          지역만 선택 가능합니다.
        </p>
      </div>

      <div className={styles.mapContainer}>
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

      <div className={styles.searchContainer}>
        <div className={styles.searchInput}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="지번, 도로명, 건물명으로 검색"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSearch()}
          />
        </div>
      </div>

      <div className={styles.selectedLocation}>
        {selectedLocation && <p>선택된 위치: {selectedLocation}</p>}
      </div>

      <button
        className={`${styles.nextButton} ${
          selectedLocation ? styles.active : ""
        }`}
        onClick={handleNext}
        disabled={!selectedLocation}
      >
        다음으로
      </button>
    </div>
  );
};

export default SelectPlace;
