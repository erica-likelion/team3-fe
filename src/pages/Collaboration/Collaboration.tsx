import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Collaboration.module.scss";
import smallOngilMarkIcon from "../../assets/ui/smallOngilMark.svg";
import bigOngilMarkIcon from "../../assets/ui/bigOngilMark.svg";
import alertCircleIcon from "../../assets/ui/alertCircle.svg";
import modalCloseButton from "../../assets/ui/modalCloseButton.svg";
import { useRestaurantContext } from "../../context/RestaurantContext";
import {
  getRestaurants,
  type Restaurant,
  submitPartnershipData,
} from "../../services/api";
import CollaborationConfirmModal from "../../components/ExitConfirmModal/CollaborationConfirmModal";

declare global {
  interface Window {
    kakao: any;
  }
}

const Collaboration: React.FC = () => {
  const navigate = useNavigate();
  const { updateFormData, setPartnershipResult } = useRestaurantContext();
  const mapRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [mapInstance, setMapInstance] = useState<unknown>(null); // kakao.maps.Map 타입
  const [isMapExpanded, setIsMapExpanded] = useState<boolean>(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);
  const [isLocationSelected, setIsLocationSelected] = useState<boolean>(false);
  const [clickedRestaurantId, setClickedRestaurantId] = useState<string | null>(
    null
  );
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<
    string | null
  >(null);
  const [showExitModal, setShowExitModal] = useState<boolean>(false);
  const [showCollaborationModal, setShowCollaborationModal] =
    useState<boolean>(false);
  const [clickedRestaurantName, setClickedRestaurantName] =
    useState<string>("");
  const markersRef = useRef<Map<string, unknown>>(new Map());

  // 특정 name 목록
  const specialRestaurantNames = [
    "유가네닭갈비 안산한양대점",
    "스타벅스 안산한양대점",
    "행컵 한양대점",
    "아마스빈 안산한양대점",
    "김밥천국 한양대점",
    "북촌손만두 안산한양대점",
    "라화쿵부마라탕 안산한양대점",
    "메가MGC커피 한양대에리카점",
    "이디야커피 안산한대점",
    "대학통닭",
    "교촌치킨 사동1호점",
    "BHC치킨 한양대창의인재관기숙사점",
    "텐버거 안산한양대점",
    "뉴욕버거 사동점",
    "뉴욕핫도그앤커피 안산한양대점",
    "한솥도시락 안산한양대점",
    "역전할머니맥주 안산한양대점",
    "파리바게뜨 안산한양대점",
    "큰맘할매순대국 안산한양대점",
    "피자스쿨 안산한양대점",
    "오가다 안산상록구직영점",
    "쥬씨 안산한양대점",
    "요거프레소 안산한양대점",
    "벤앤제리스아이스크림 안산상록DV점",
    "그라찌에 한양대점",
    "봉구스밥버거 안산한양대점",
    "백소정 안산한양대점",
    "육회바른연어 안산한양대점",
    "투썸플레이스 안산꿈의교회점",
    "로드락비어 안산한양대점",
  ];

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

  // 마커 이미지 업데이트 함수
  const updateMarkerImage = (restaurantId: string, isBig: boolean) => {
    const marker = markersRef.current.get(restaurantId);
    if (marker) {
      const image = isBig ? bigOngilMarkIcon : smallOngilMarkIcon;
      const markerImage = new window.kakao.maps.MarkerImage(
        image,
        new window.kakao.maps.Size(34, 34),
        {
          anchor: new window.kakao.maps.Point(17, 17),
        }
      );
      (marker as typeof window.kakao.maps.Marker).setImage(markerImage);
      console.log(
        `마커 ${restaurantId}를 ${
          isBig ? "bigOngilMark" : "smallOngilMark"
        }로 변경`
      );
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
    const smallMarkerImage = new window.kakao.maps.MarkerImage(
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
          image: smallMarkerImage,
          title: restaurant.name, // 마커에 마우스를 올리면 표시될 텍스트
          clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정
        });

        // 마커를 지도에 표시
        marker.setMap(kakaoMap);

        // 마커 참조 저장
        const restaurantId = `${restaurant.lat}-${restaurant.lon}`;
        markersRef.current.set(restaurantId, marker);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, "click", function () {
          console.log(
            `마커 클릭: ${restaurant.name}, 현재 선택된 마커: ${selectedRestaurantId}`
          );

          // 특정 name인지 확인
          if (specialRestaurantNames.includes(restaurant.name)) {
            console.log(`특정 레스토랑 클릭: ${restaurant.name}`);
            setClickedRestaurantName(restaurant.name);
            setShowCollaborationModal(true);
            return;
          }

          // 이미 선택된 마커가 있다면 변경하지 않음
          if (selectedRestaurantId) {
            console.log("이미 선택된 마커가 있어서 변경하지 않음");
            return;
          }

          // 이전에 클릭된 마커를 smallOngilMark로 되돌리기
          if (clickedRestaurantId && clickedRestaurantId !== restaurantId) {
            console.log(
              `이전 마커 ${clickedRestaurantId}를 smallOngilMark로 되돌림`
            );
            updateMarkerImage(clickedRestaurantId, false);
          }

          // 클릭된 마커를 bigOngilMark로 변경
          console.log(`현재 마커 ${restaurantId}를 bigOngilMark로 변경`);
          updateMarkerImage(restaurantId, true);

          // 클릭된 레스토랑 ID 설정
          setClickedRestaurantId(restaurantId);

          // 선택된 레스토랑 정보 설정
          setSelectedRestaurant(restaurant);
        });
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

  const handleSelectLocation = () => {
    if (selectedRestaurant && clickedRestaurantId) {
      setIsLocationSelected(true);
      setSelectedRestaurantId(clickedRestaurantId);
      // 좌표를 전역 상태에 저장
      updateFormData({
        addr: `${selectedRestaurant.lat}, ${selectedRestaurant.lon}`,
      });
    }
  };

  const handleNext = () => {
    if (isLocationSelected) {
      setShowExitModal(true);
    }
  };

  const handleStay = async () => {
    if (selectedRestaurant) {
      try {
        setShowExitModal(false);
        // Loading 페이지로 이동 (Collaboration에서 왔음을 표시)
        navigate("/loading?from=collaboration");

        const response = await submitPartnershipData({
          storeName: selectedRestaurant.name,
        });
        console.log("Partnership API 응답:", response);

        // 응답 데이터를 Context에 저장
        setPartnershipResult(response);

        // API 응답 완료 후 CollaborationResult로 이동
        navigate("/collaboration-result");
      } catch (error) {
        console.error("Partnership API 오류:", error);
        // 에러 발생 시에도 CollaborationResult로 이동 (에러 처리 로직은 CollaborationResult에서)
        navigate("/collaboration-result");
      }
    } else {
      setShowExitModal(false);
      navigate("/collaboration-result");
    }
  };

  const handleCloseModal = () => {
    setShowExitModal(false);
  };

  const handleCloseRestaurantModal = () => {
    console.log(
      "모달 닫기, 선택된 마커 ID:",
      selectedRestaurantId,
      "클릭된 마커 ID:",
      clickedRestaurantId
    );

    setSelectedRestaurant(null);
    setIsLocationSelected(false);

    // 선택이 취소되면 클릭된 마커를 smallOngilMark로 되돌리기
    if (clickedRestaurantId && !selectedRestaurantId) {
      console.log(
        `모달 닫기로 인해 마커 ${clickedRestaurantId}를 smallOngilMark로 되돌림`
      );
      updateMarkerImage(clickedRestaurantId, false);
      setClickedRestaurantId(null);
    }
  };

  return (
    <div className={styles.selectPlace}>
      {!isMapExpanded && (
        <div className={styles.header}>
          <h1 className={styles.title}>
            당신이 운영하는 가게의{"\n"}제휴 파트너를 추천해 드려요 📝
          </h1>
          <p className={styles.description}>
            현재 운영 중인 가게의 위치를 바탕으로{"\n"}인공지능이 제휴 가게와
            제휴 방식까지 똑똑하게 추천해 드려요!
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

      {/* 선택된 레스토랑 정보 모달 */}
      {selectedRestaurant && (
        <div className={styles.restaurantModal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <span className={styles.restaurantName}>
                {selectedRestaurant.name}
              </span>
              <button
                className={styles.closeButton}
                onClick={handleCloseRestaurantModal}
              >
                <img src={modalCloseButton} alt="닫기" />
              </button>
            </div>
            <div className={styles.restaurantAddress}>
              {selectedRestaurant.address}
            </div>
            <button
              className={styles.selectButton}
              onClick={handleSelectLocation}
            >
              선택하기
            </button>
          </div>
        </div>
      )}

      {/* 다음으로 버튼 */}
      <button
        className={`${styles.nextButton} ${
          isLocationSelected ? styles.active : ""
        }`}
        onClick={handleNext}
        disabled={!isLocationSelected}
      >
        다음으로
      </button>

      {/* CollaborationConfirmModal */}
      {showExitModal && (
        <CollaborationConfirmModal
          onStay={handleStay}
          onLeave={handleCloseModal}
          messageLines={[
            `선택하신 ${selectedRestaurant?.name || "가게"}로`,
            "추천 분석을 진행할까요?",
          ]}
        />
      )}

      {/* 특정 레스토랑 클릭 시 CollaborationConfirmModal */}
      {showCollaborationModal && (
        <CollaborationConfirmModal
          onStay={() => {
            setShowCollaborationModal(false);
            // 여기에 특정 레스토랑 선택 시의 로직 추가
            console.log(`특정 레스토랑 선택: ${clickedRestaurantName}`);
          }}
          onLeave={() => setShowCollaborationModal(false)}
          messageLines={[
            "대형 프랜차이즈는 제휴에",
            "제약이 있어 분석이 지원되지 않습니다",
          ]}
          isFranchise={true}
        />
      )}
    </div>
  );
};

export default Collaboration;
