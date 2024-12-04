import React, { useRef, useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { IoClose } from "react-icons/io5";
import "./MapModal.css";
import { Button, Group, Input } from "@chakra-ui/react";
import { Field } from "../ui/field.jsx";
import { toaster } from "../ui/toaster.jsx";

export const MapModal = ({ isOpen, onClose, onSelectLocation }) => {
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationName, setLocationName] = useState(null);
  const [isKakaoMapLoaded, setIsKakaoMapLoaded] = useState(true);
  const mapRef = useRef(null); // useRef를 사용하여 지도 인스턴스 참조
  const placesServiceRef = useRef(null);

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
    console.log(mapRef.current);
    if (!isKakaoMapLoaded) {
      alert("지도 서비스가 아직 로드되지 않았습니다.");
      return;
    }

    if (!mapRef.current) {
      alert("지도가 로드되지 않았습니다.");
      return;
    }
    if (!locationName.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    // Places 서비스 생성
    if (!placesServiceRef.current) {
      placesServiceRef.current = new window.kakao.maps.services.Places();
    }

    placesServiceRef.current.keywordSearch(locationName, placeSearchCB);
  };

  function placeSearchCB(data, status) {
    if (status === kakao.maps.services.Status.OK) {
      // 정상 검색 완료
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
      return;
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
      return;
    }
  }

  function displayPlaces(places) {
    var bounds = new kakao.maps.LatLngBounds();

    var placePositon = new kakao.maps.LatLng(places[0].y, places[0].x);

    // 객체에 좌표 추가
    bounds.extend(placePositon);

    if (mapInstance) {
      mapRef.current.setBounds(bounds);
    }
    setMarkerPosition({
      lat: parseFloat(places[0].y),
      lng: parseFloat(places[0].x),
    });
  }

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
            ref={mapRef}
          >
            {markerPosition && <MapMarker position={markerPosition} />}
            <ZoomControl />
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
    </div>
  );
};
