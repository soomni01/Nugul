import React, { useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { IoClose } from "react-icons/io5";
import "./MapModal.css";
import { SiOpenstreetmap } from "react-icons/si";

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

  return (
    <div className="background">
      <div className="mini-modal">
        <button className="close" onClick={onClose}>
          <IoClose />
        </button>
        <div className="content">
          <Map
            className="map"
            center={{ lat: product.latitude, lng: product.longitude }}
            level={3}
            style={{ width: "100%", height: "400px" }}
            onCreate={handleMapCreate}
          >
            {markerPosition && (
              <MapMarker position={markerPosition}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    whiteSpace: "nowrap",
                    padding: "5px",
                    borderRadius: "5px",
                  }}
                >
                  <span>{markerMessage}</span>
                  <a
                    href={getKakaoLink()}
                    style={{
                      textDecoration: "none", // 링크 밑줄 제거
                      marginLeft: "5px", // 텍스트와 링크 사이의 간격 추가
                    }}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <SiOpenstreetmap />
                  </a>
                </div>
              </MapMarker>
            )}
            <ZoomControl />
          </Map>
        </div>
      </div>
    </div>
  );
};
