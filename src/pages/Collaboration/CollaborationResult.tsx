import React, { useState, useRef } from "react";
import { useRestaurantContext } from "../../context/RestaurantContext";
import styles from "./CollaborationResult.module.scss";
import rightArrowIcon from "../../assets/ui/rightArrow.svg";
import { Link } from "react-router-dom";
import communityBanner from "../../assets/ui/communityBanner.png";
import arrowRight from "../../assets/ui/arrow-right.png";

const CollaborationResult: React.FC = () => {
  const { partnershipResult } = useRestaurantContext();
  const [currentPartnerIndex, setCurrentPartnerIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  if (!partnershipResult) {
    return (
      <div className={styles.selectPlace}>
        <div className={styles.header}>
          <h1 className={styles.title}>오류가 발생했습니다</h1>
          <p className={styles.description}>
            제휴 데이터를 불러올 수 없습니다.
          </p>
        </div>
      </div>
    );
  }

  const currentPartner = partnershipResult.partners[currentPartnerIndex];
  const totalPartners = partnershipResult.partners.length;

  const handleKakaoMapClick = () => {
    window.open(currentPartner.kakaomapUrl, "_blank");
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50; // 스와이프 감지 임계값

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentPartnerIndex < totalPartners - 1) {
        // 왼쪽으로 스와이프 (다음 파트너)
        setCurrentPartnerIndex(currentPartnerIndex + 1);
      } else if (diff < 0 && currentPartnerIndex > 0) {
        // 오른쪽으로 스와이프 (이전 파트너)
        setCurrentPartnerIndex(currentPartnerIndex - 1);
      }
    }

    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;

    const diff = startX - currentX;
    const threshold = 50;

    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentPartnerIndex < totalPartners - 1) {
        setCurrentPartnerIndex(currentPartnerIndex + 1);
      } else if (diff < 0 && currentPartnerIndex > 0) {
        setCurrentPartnerIndex(currentPartnerIndex - 1);
      }
    }

    setIsDragging(false);
  };

  return (
    <div className={styles.selectPlace}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {partnershipResult.targetStoreName}의 정보를 바탕으로{"\n"}제휴
          파트너를 추천해 드려요 📝
        </h1>
        <p className={styles.description}>
          현재 운영 중인 가게의 위치를 바탕으로{"\n"}인공지능이 제휴 가게와 제휴
          방식까지 똑똑하게 추천해 드려요!
        </p>
      </div>

      <div
        className={styles.partnerCard}
        ref={cardRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div className={styles.partnerInfo}>
          <div className={styles.partnerHeader}>
            <h2 className={styles.partnerName}>{currentPartner.name}</h2>
            <span className={styles.partnerCategory}>
              {currentPartner.category}
            </span>
          </div>
          <div className={styles.partnerLocation}>
            <span className={styles.partnerAddress}>
              {currentPartner.address}
            </span>
            <span className={styles.partnerDistance}>
              {currentPartner.distanceMeters}m
            </span>
          </div>
        </div>

        <p className={styles.partnerDescription}>
          {partnershipResult.events[currentPartnerIndex]?.reason ||
            `${currentPartner.name}는 매장과 ${currentPartner.distanceMeters}m로 가까운 곳에 위치해 있어요.`}
        </p>

        <button className={styles.kakaoMapButton} onClick={handleKakaoMapClick}>
          <span className={styles.kakaoMapText}>카카오맵 바로가기</span>
          <img
            src={rightArrowIcon}
            alt="바로가기"
            className={styles.rightArrow}
          />
        </button>
      </div>

      <div className={styles.paginationContainer}>
        <div className={styles.paginationBadge}>
          <span className={styles.paginationCurrent}>
            {currentPartnerIndex + 1}
          </span>
          <span className={styles.paginationTotal}>/{totalPartners}</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          사장님을 위한 제휴 전략을 추천해 드려요
        </h2>
        <p className={styles.sectionDesc}>
          운영 중이신 가게 업종과 상권 특성을 조합하여 작성했어요
        </p>
      </section>

      {partnershipResult.events.map((event, index) => (
        <div key={index} className={styles.strategyCard}>
          <span className={styles.strategyNumber}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className={styles.strategyTitle}>{event.eventTitle}</h3>
          <p className={styles.strategyDescription}>{event.description}</p>
        </div>
      ))}

      <Link to="/community" className={styles.communityBannerLink}>
        <div className={styles.communityBanner}>
          <img
            src={communityBanner}
            alt="온길 자영업자 커뮤니티"
            className={styles.communityBannerImage}
          />
          <div className={styles.communityBannerContent}>
            <div className={styles.communityBannerText1}>
              우리 지역의 진짜 목소리를 듣고 싶다면?
            </div>
            <div className={styles.communityBannerText2}>
              온길 자영업자 커뮤니티 바로가기
              <img
                src={arrowRight}
                alt="화살표"
                className={styles.communityBannerArrow}
              />
            </div>
            <div className={styles.communityBannerText3}>
              일상 공유부터 제휴 업체 매칭까지
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default CollaborationResult;
