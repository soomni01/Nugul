import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Box } from "@chakra-ui/react";

export const MapModal = () => {
  return (
    <Box>
      거래 희망 장소
      <Map
        center={{ lat: 33.450701, lng: 126.570667 }} // 지도 중심 좌표
        level={3} // 확대 수준
        style={{ width: "100%", height: "500px" }}
      >
        <MapMarker position={{ lat: 33.450701, lng: 126.570667 }} />
      </Map>
    </Box>
  );
};
