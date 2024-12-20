import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  ZoomControl,
} from "react-kakao-maps-sdk";
import { IoClose } from "react-icons/io5";
import "./MapModal.css";
import { Box, Button, Group, HStack, Input } from "@chakra-ui/react";
import { toaster } from "../ui/toaster.jsx";
import { LuSearch } from "react-icons/lu";
import { Field } from "../ui/field.jsx";

export const MapModal = ({
  isOpen,
  onClose,
  onSelectLocation,
  prevLocationName,
}) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [customLocationName, setCustomLocationName] = useState(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setCustomLocationName(prevLocationName); // locationName으로 초기화
    }
  }, [isOpen, locationName]);

  if (!isOpen) return null; // 모달이 닫혀 있으면 렌더링하지 않음

  const handleMapClick = (_target, mouseEvent) => {
    // mouseEvent 객체에서 latLng 가져오기
    const clickedPosition = mouseEvent.latLng;
    setMarkerPosition({
      lat: clickedPosition.getLat(),
      lng: clickedPosition.getLng(),
    });
    console.log(markerPosition);
  };

  const handleOkButton = () => {
    if (markerPosition && customLocationName) {
      onSelectLocation({
        ...markerPosition,
        locationName: customLocationName,
      });
      onClose(); // 모달 닫기
    } else {
      toaster.create({
        title: `위치와 장소를 입력해주세요`,
        type: "warning",
      });
    }
  };

  const handleSearch = () => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(locationName, placeSearchCB);
  };

  function placeSearchCB(data, status, pagiation) {
    // 정상 검색 완료시
    if (status === kakao.maps.services.Status.OK) {
      //검색된 장소 위치를 기준으로 지도 범위 재설정 하려고
      var bounds = new kakao.maps.LatLngBounds();
      for (var i = 0; i < data.length; i++) {
        // displayMarker(data[i]);
        bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
      }

      // 검색된 장소 위치를 기준으로 지도 범위 재설정
      map.setBounds(bounds);
    }
  }

  return (
    <div className="background">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <IoClose style={{ zIndex: 3 }} />
        </button>

        <Box className={"search-container"}>
          <Field mt={2} label={"거래 장소를 설정해주세요"}>
            <Group w="100%">
              <Input
                size="lg"
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                }}
                placeholder="장소 검색"
                // 엔터 키로 검색
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
              />
              <Button onClick={handleSearch}>
                <LuSearch />
              </Button>
            </Group>
          </Field>
        </Box>

        <Map
          className="map"
          center={{ lat: 37.556797076, lng: 126.946268566 }}
          level={3}
          style={{ width: "100%", height: "600px" }}
          onClick={handleMapClick}
          onCreate={setMap}
        >
          {markerPosition && (
            <>
              <MapMarker
                position={markerPosition}
                image={{
                  src: "/image/MapMarker2.png",
                  size: {
                    width: 33,
                    height: 36,
                  },
                }}
              />
              <CustomOverlayMap position={markerPosition} yAnchor={2}>
                <HStack
                  bg="white"
                  minWidth="200px"
                  borderRadius="md"
                  boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  transform="translate(0%, -10%)" // 마커의 중심에 맞추기 위한 변환
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Input
                    placeholder={prevLocationName || "장소명을 입력하세요"}
                    size="sm"
                    minLength={3} // 최소 길이 설정
                    value={customLocationName || ""}
                    onMouseDown={(e) => e.stopPropagation()}
                    onChange={(e) => setCustomLocationName(e.target.value)}
                  />
                </HStack>
              </CustomOverlayMap>
            </>
          )}
          <ZoomControl position={"LEFT"} />
        </Map>

        <div className="button-container">
          <Button
            className="confirm-button"
            onClick={handleOkButton}
            isDisabled={!markerPosition || !customLocationName}
          >
            장소 설정
          </Button>
        </div>
      </div>
    </div>
  );
};
