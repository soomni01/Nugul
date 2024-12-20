import React, { useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  ZoomControl,
} from "react-kakao-maps-sdk";
import { HStack, Image, Text } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import "./MiniMapModal.css";
import { createPortal } from "react-dom";

export const MiniMapModal = ({ isOpen, onClose, product }) => {
  const [markerPosition, setMarkerPosition] = useState({
    lat: product.latitude,
    lng: product.longitude,
  });
  const [map, setMap] = useState(null);
  const [markerMessage, setMarkerMessage] = useState(
    product.locationName || "",
  );

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음

  const handleMapCreate = (mapInstance) => {
    setMap(mapInstance); // 지도 객체가 설정되도록 함
  };

  // 카카오 맵 길찾기 링크 생성 함수
  const getKakaoLink = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(
      product.locationName,
    )},${product.latitude},${product.longitude}`;
  };

  return createPortal(
    <div className="mini-background">
      <div className="mini-modal">
        <button className="mini-close" onClick={onClose}>
          <IoClose />
        </button>
        <div className="mini-content">
          <Map
            className="mini-map"
            center={{ lat: product.latitude, lng: product.longitude }}
            level={3}
            onCreate={handleMapCreate}
          >
            {markerPosition && (
              <>
                <MapMarker
                  position={markerPosition}
                  clickable={false}
                  image={{
                    src: "/image/MapMarker2.png",
                    size: {
                      width: 33,
                      height: 36,
                    },
                  }}
                />
                <CustomOverlayMap position={markerPosition} yAnchor={2.1}>
                  <HStack
                    className="custom-overlay"
                    // px={3}
                    // pr={7}
                    // w={"100%"} // 100% 너비로 지정
                    // style={{
                    //   background: "white",
                    //   borderRadius: "4px",
                    //   border: "1px solid #ccc",
                    //   alignItems: "center",
                    //   whiteSpace: "nowrap",
                    //   boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                    //   height: "36px",
                    // }}
                  >
                    <Text>{product.locationName}</Text>
                    <Image
                      onClick={() => window.open(getKakaoLink(), "_blank")}
                      src="/image/KakaoMap.png"
                      boxSize={"20px"} // 이미지를 20px 크기로 설정
                      style={{
                        cursor: "pointer",
                        objectFit: "contain", // 이미지 비율 유지
                      }}
                    />
                  </HStack>
                </CustomOverlayMap>
              </>
            )}
            <ZoomControl />
          </Map>
        </div>
      </div>
    </div>,
    document.body,
  );
};
