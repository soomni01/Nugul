import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { IoClose } from "react-icons/io5";
import "./MapModal.css";
import { Button, Input } from "@chakra-ui/react";
import { Field } from "../ui/field.jsx";
import { toaster } from "../ui/toaster.jsx";

export const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationName, setLocationName] = useState(null);

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
    if (markerPosition && locationName) {
      onSelectLocation({
        ...markerPosition,
        locationName: locationName, // 장소명 포함
      });
      onClose(); // 모달 닫기
    } else {
      toaster.create({
        title: `위치와 장소를 입력해주세요`,
        type: "warning",
      });
    }
  };

  return (
    <div className="background">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <IoClose />
        </button>
        <div className="content">
          <Map
            className="map"
            center={{ lat: 33.450701, lng: 126.570667 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
            onClick={handleMapClick}
          >
            {markerPosition && <MapMarker position={markerPosition} />}
          </Map>
          <Field mt={5} label={"선택한 곳의 장소명을 입력해주세요"}>
            <Input
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
              }}
              placeholder="예) 이대역 1번 출구, 롯데타워 앞"
            />
          </Field>
          <div className="button-container">
            <Button
              className="confirm-button"
              onClick={handleOkButton}
              isDisabled={!markerPosition || !locationName}
            >
              {/*// 위치와 장소명 모두 있어야 활성화> 위치 설정*/}
              위치 설정
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
