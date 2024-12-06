import React, { useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import "./ViewMap.css";
import { Box } from "@chakra-ui/react";

function ViewMap() {
  const [map, setMap] = useState(null);
  const [markerPosition, setMarkerPosition] = useState({});

  const handleMapClick = (_target, mouseEvent) => {
    // mouseEvent 객체에서 latLng 가져오기
    const clickedPosition = mouseEvent.latLng;
    setMarkerPosition({
      lat: clickedPosition.getLat(),
      lng: clickedPosition.getLng(),
    });
  };

  return (
    <Box>
      <Map
        className="map"
        center={{ lat: 33.450701, lng: 126.570667 }}
        level={3}
        style={{ width: "100%", height: "800px" }}
        onCreate={setMap}
        onClick={handleMapClick}
      >
        {markerPosition && <MapMarker position={markerPosition} />}
        <ZoomControl />
      </Map>
      <Box zIndex={1}>한글</Box>
    </Box>
  );
}

export default ViewMap;
