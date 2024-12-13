import React, { useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { IoClose } from "react-icons/io5";
import "./MapModal.css";
import { Button, Group, Input } from "@chakra-ui/react";
import { Field } from "../ui/field.jsx";
import { toaster } from "../ui/toaster.jsx";

export const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [map, setMap] = useState(null);
  const [listItem, setListItem] = useState([]);
  const [currCategory, setCurrCategory] = useState("");

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

      // 검색된 장소 위치를 기주느로 지도 범위 재설정
      map.setBounds(bounds);
    }
  }

  return (
    <div className="background">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <IoClose style={{ zIndex: 3 }} />
        </button>

        <Map
          className="map"
          center={{ lat: 33.450701, lng: 126.570667 }}
          level={3}
          style={{ width: "100%", height: "600px" }}
          onClick={handleMapClick}
          onCreate={setMap}
        >
          {markerPosition && <MapMarker position={markerPosition} />}
          <ZoomControl position={"LEFT"} />
        </Map>

        <Field mt={5} label={"선택한 곳의 장소명을 입력해주세요"}>
          <Group w={"100%"}>
            <Input
              value={locationName}
              onChange={(e) => {
                setLocationName(e.target.value);
              }}
              placeholder="예) 이대역 1번 출구, 롯데타워 앞"
            />
            <Button onClick={handleSearch}> 검색하기</Button>
          </Group>
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
  );
};
