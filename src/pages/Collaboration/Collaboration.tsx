import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Collaboration.module.scss";
import mapSpotIcon from "../../assets/ui/mapSpot.svg";
import { useRestaurantContext } from "../../context/RestaurantContext";

declare global {
  interface Window {
    kakao: any;
  }
}

const Collaboration: React.FC = () => {
  const navigate = useNavigate();
  const { updateFormData } = useRestaurantContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCoordinates, setSelectedCoordinates] = useState<string>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [selectedDetailAddress, setSelectedDetailAddress] =
    useState<string>("");
  const [isLocationAdded, setIsLocationAdded] = useState<boolean>(false);
  const [addedLocationName, setAddedLocationName] = useState<string>("");
  const [whiteCardHeight, setWhiteCardHeight] = useState<number>(0);
  const [isSearchMode, setIsSearchMode] = useState<boolean>(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const currentMarkerRef = useRef<any>(null);
  const whiteCardRef = useRef<HTMLDivElement>(null);

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

      // 지도 클릭 이벤트 - 확대 모드로 전환
      const clickListener = function (mouseEvent: any) {
        if (!isMapExpanded) {
          // 확대 모드로 전환
          setIsMapExpanded(true);
          return;
        }

        // 확대 모드에서 위치 선택
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

        // 좌표 저장
        const coordinates = `${latlng.getLat()}, ${latlng.getLng()}`;
        setSelectedCoordinates(coordinates);

        // 백그라운드에서 주소 변환 (딜레이 있지만 마커는 이미 표시됨)
        const geocoder = new kakao.maps.services.Geocoder();
        geocoder.coord2Address(
          latlng.getLng(),
          latlng.getLat(),
          function (result: any, status: any) {
            if (status === kakao.maps.services.Status.OK) {
              const address = result[0].address.address_name;
              const detailAddress = result[0].address.address_name;
              console.log("주소 설정:", address);
              setSelectedLocation(address);
              setSelectedAddress(address.split(" ").slice(0, 2).join(" ")); // 시/구만 추출
              setSelectedDetailAddress(detailAddress);
            }
          }
        );
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

  // 하얀 창의 높이를 측정하여 빨간 창 위치 업데이트
  useEffect(() => {
    if (whiteCardRef.current && isMapExpanded && selectedLocation) {
      const height = whiteCardRef.current.offsetHeight;
      setWhiteCardHeight(height);
    }
  }, [isMapExpanded, selectedLocation, selectedAddress, selectedDetailAddress]);

  const handleSearchClick = () => {
    setIsSearchMode(true);
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleSearchClose = () => {
    setIsSearchMode(false);
    setSearchKeyword("");
    setSearchResults([]);
  };

  const handleSearch = () => {
    if (!searchKeyword.trim()) return;

    setIsSearching(true);
    const kakao = window.kakao;
    const places = new kakao.maps.services.Places();

    places.keywordSearch(searchKeyword, function (data: any, status: any) {
      setIsSearching(false);
      if (status === kakao.maps.services.Status.OK) {
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    });
  };

  const handleSearchResultClick = (place: any) => {
    setSelectedLocation(place.address_name);
    setSelectedAddress(place.address_name.split(" ").slice(0, 2).join(" "));
    setSelectedDetailAddress(place.address_name);
    setIsSearchMode(false);
    setSearchKeyword("");
    setSearchResults([]);

    // 지도 확장 및 마커 표시
    setIsMapExpanded(true);

    if (map) {
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
        position: new kakao.maps.LatLng(place.y, place.x),
        image: markerImage,
      });
      marker.setMap(map);
      currentMarkerRef.current = marker;
    }
  };

  const handleNext = () => {
    if (selectedLocation && selectedCoordinates) {
      console.log("선택된 위치:", selectedLocation);
      console.log("선택된 좌표:", selectedCoordinates);

      // 좌표를 전역 상태에 저장
      updateFormData({ addr: selectedCoordinates });

      navigate("/select-type");
    }
  };

  const handleAddLocation = () => {
    setIsLocationAdded(true);
    // 전체 주소에서 시, 구, 동까지만 추출 (예: "경기도 안산시 상록구")
    const addressParts = selectedLocation.split(" ");
    if (addressParts.length >= 3) {
      setAddedLocationName(
        `${addressParts[0]} ${addressParts[1]} ${addressParts[2]}`
      );
    } else {
      setAddedLocationName(selectedLocation);
    }
  };

  // 빨간 창의 위치를 동적으로 계산
  const getRedBoxStyle = () => {
    if (!isMapExpanded || !isLocationAdded) return {};

    // 하얀 창의 높이를 고려하여 빨간 창 위치 계산
    // 하얀 창은 bottom: 120px, 간격 8px 추가
    const redBoxBottom = 120 + whiteCardHeight + 8;
    return {
      bottom: `${redBoxBottom}px`,
    };
  };

  return (
    <div className={styles.selectPlace}>
      {!isMapExpanded && (
        <div className={styles.header}>
          <h1 className={styles.title}>
            당신이 운영할{"\n"}가게의 위치를 선택해 주세요 🏪
          </h1>
          <p className={styles.description}>
            현재 창업을 고려 중인 지역을 선택해 주세요. 분석 정확도를 위해 한
            개의 지역만 선택 가능합니다.
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

      {/* 검색 모드일 때 */}
      {isSearchMode && (
        <div className={styles.searchModeOverlay}>
          <div className={styles.searchModeHeader}>
            <button className={styles.backButton} onClick={handleSearchClose}>
              &lt;
            </button>
            <h2 className={styles.searchModeTitle}>위치 검색</h2>
            <button className={styles.closeButton} onClick={handleSearchClose}>
              ✕
            </button>
          </div>

          <div className={styles.searchModeInput}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="지번, 도로명, 건물명으로 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              autoFocus
            />
            {searchKeyword && (
              <button
                className={styles.clearButton}
                onClick={() => setSearchKeyword("")}
              >
                ✕
              </button>
            )}
          </div>

          {isSearching && (
            <div className={styles.searchingIndicator}>검색 중...</div>
          )}

          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              {searchResults.map((place, index) => (
                <div
                  key={index}
                  className={styles.searchResultItem}
                  onClick={() => handleSearchResultClick(place)}
                >
                  {place.address_name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 일반 검색창 - 고정 위치 */}
      {!isSearchMode && (
        <div
          className={`${styles.searchContainer} ${
            isMapExpanded ? styles.searchExpanded : ""
          }`}
        >
          <div className={styles.searchInput} onClick={handleSearchClick}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="지번, 도로명, 건물명으로 검색"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              readOnly
            />
          </div>
        </div>
      )}

      {/* 확대 모드에서 추가된 위치 표시 (빨간 박스) - 동적 위치 */}
      {isMapExpanded && isLocationAdded && (
        <div
          className={styles.expandedAddedLocationCard}
          style={getRedBoxStyle()}
        >
          <span>{addedLocationName}</span>
          <button
            className={styles.removeButton}
            onClick={() => {
              setIsLocationAdded(false);
              setAddedLocationName("");
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* 확대 모드에서 위치 정보 카드 (하얀 창) - 고정 위치 */}
      {isMapExpanded && selectedLocation && (
        <div ref={whiteCardRef} className={styles.locationCard}>
          <div className={styles.locationInfo}>
            <div className={styles.locationTitle}>{selectedAddress}</div>
            <div className={styles.locationDetail}>{selectedDetailAddress}</div>
          </div>
          <div className={styles.locationActions}>
            <button
              className={styles.closeButton}
              onClick={() => setIsMapExpanded(false)}
            >
              ✕
            </button>
            <button className={styles.addButton} onClick={handleAddLocation}>
              추가하기
            </button>
          </div>
        </div>
      )}

      {/* 다음으로 버튼 - 고정 위치 */}
      <button
        className={`${styles.nextButton} ${
          isLocationAdded ? styles.active : ""
        }`}
        onClick={handleNext}
        disabled={!isLocationAdded}
      >
        다음으로
      </button>
    </div>
  );
};

export default Collaboration;
