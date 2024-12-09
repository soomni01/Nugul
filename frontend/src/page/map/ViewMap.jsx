import React, { useState } from "react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import "./ViewMap.css";
import { Box, Input } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function ViewMap() {
  const [map, setMap] = useState(null);
  const [info, setInfo] = useState();
  const [markers, setMarkers] = useState([]);
  const [markerPosition, setMarkerPosition] = useState({});
  const [locationName, setLocationName] = useState("");
  const [listItem, setListItem] = useState([]);

  const handleSearch = () => {
    if (!map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(locationName, (data, status, _pagination) => {
      if (status === kakao.maps.services.Status.OK) {
        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        const bounds = new kakao.maps.LatLngBounds();

        // 마커에 데이터 넣는 코드
        let markers = [];
        var listEl = document.getElementById("placeList"),
          menuEl = document.getElementById("menu_wrap"),
          fragment = document.createDocumentFragment(),
          listStr = "";

        // 검색 버튼 클릭시 , 기존창 지워야 함

        for (var i = 0; i < data.length; i++) {
          // @ts-ignore
          markers.push({
            position: {
              lat: data[i].y,
              lng: data[i].x,
            },
            content: data[i].place_name,
          });
          //데이터 리스트에 집어 넣는 함수
          var itemEl = getItem(i, data[i]);

          // @ts-ignore
          bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));

          fragment.appendChild(itemEl);
          setMarkers(markers);
          // 마커 밑 info  끝

          listEl.appendChild(fragment);

          // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
          map.setBounds(bounds);
          displayPagination(_pagination);
        }
      }
    });
  };

  function getItem(index, data) {
    // 호출 되면 ,  docu 하나 만듬 li 태그 가지는
    //   거기에   li태그 만들어질 str 을 작성하고
    //    클래스 네임 주고 반환
    var el = document.createElement("li"),
      itemStr =
        '<span class="markerbg marker_' +
        (index + 1) +
        '"></span>' +
        '<div class="info">' +
        "   <h5>" +
        data.place_name +
        "</h5>";

    if (data.road_address_name) {
      itemStr +=
        "    <span>" +
        data.road_address_name +
        "</span>" +
        '   <span class="jibun gray">' +
        data.address_name +
        "</span>";
    } else {
      itemStr += "    <span>" + data.address_name + "</span>";
    }

    itemStr += '  <span class="tel">' + data.phone + "</span>" + "</div>";

    el.innerHTML = itemStr;

    return el;
  }

  const handleMapClick = (_target, mouseEvent) => {
    // mouseEvent 객체에서 latLng 가져오기
    const clickedPosition = mouseEvent.latLng;
    setMarkerPosition({
      lat: clickedPosition.getLat(),
      lng: clickedPosition.getLng(),
    });
  };

  function displayPagination(pagination) {
    var paginationEl = document.getElementById("pagination"),
      fragment = document.createDocumentFragment(),
      i;

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
      paginationEl.removeChild(paginationEl.lastChild);
    }

    for (i = 1; i <= pagination.last; i++) {
      var el = document.createElement("a");
      el.href = "#";
      el.innerHTML = i;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
  }

  return (
    <Box className={"map_wrap"}>
      <Map
        className="map"
        center={{ lat: 33.450701, lng: 126.570667 }}
        level={3}
        style={{ width: "100%", height: "800px" }}
        onCreate={setMap}
        onClick={handleMapClick}
      >
        {markers.map((marker) => (
          <MapMarker
            key={`marker-${marker.content}-${marker.position.lat},${marker.position.lng}`}
            position={marker.position}
            onClick={() => setInfo(marker)}
          >
            {info && info.content === marker.content && (
              <div style={{ color: "#5e5959" }}>{marker.content}</div>
            )}
          </MapMarker>
        ))}
        <ZoomControl />
      </Map>
      <Field>
        <Input
          value={locationName}
          onChange={(e) => {
            setLocationName(e.target.value);
          }}
        />
      </Field>

      <Button onClick={handleSearch}> 검색하기</Button>

      <ul id={"placeList"}></ul>
      <div id={"pagination"}></div>
    </Box>
  );
}

export default ViewMap;
