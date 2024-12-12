import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  ZoomControl,
} from "react-kakao-maps-sdk";
import "./ViewMap.css";
import { Box, Input, ListRoot, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

function ViewMap() {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [customOverlay, setCustomOverlay] = useState(null);
  const [currCategory, setCurrCategory] = useState("");
  const [categorySearchResultList, setCategorySearchResultList] = useState([]);
  const [categoryImageNumber, setCategoryImageNumber] = useState(0);
  const [isoverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeKeyword, setPlaceKeyword] = useState("");
  const [placeSearchResultList, setPlaceSearchResultList] = useState([]);
  useEffect(() => {
    if (currCategory) {
      //  생성 객체
      const ps = new kakao.maps.services.Places(map);

      if (isoverlayOpen === true) {
        setIsOverlayOpen(false);
        customOverlay.setMap(null);
      }
      // 마커 켜져있으면 지워야하는데 ,
      // removeMarker();

      ps.categorySearch(
        currCategory,
        (result) => setCategorySearchResultList(result),
        { useMapBounds: true },
      );
    } else {
      setCategorySearchResultList([]);
    }
  }, [currCategory]);

  useEffect(() => {
    if (placeKeyword) {
      if (!map) return;

      // 검색
      const ps = new kakao.maps.services.Places(map);

      // placekeyword로 검색하고 >  검색결과의 위치가 다 보일수 있도록 맵의 크기를 화장후  위치 변경
      ps.keywordSearch(placeKeyword, (result) => {
        setPlaceSearchResultList(result);
        const bounds = new kakao.maps.LatLngBounds();
        result.forEach((item) => {
          bounds.extend(new kakao.maps.LatLng(item.y, item.x));
        });
        map.setBounds(bounds);
      });
    } else {
      setPlaceSearchResultList([]);
    }
  }, [placeKeyword]);

  function handleSearch(locationname) {
    setPlaceKeyword(locationname);
    // if (!map) return;
    //
    // const ps = new kakao.maps.services.Places(map);

    // ps.keywordSearch(locationName, (data, status, _pagination) => {
    //   if (status === kakao.maps.services.Status.OK) {
    //
    //
    //     // DOM 조작 부분
    //     const listEl = document.getElementById("placeList");
    //     const fragment = document.createDocumentFragment();
    //
    //     // 기존 리스트 초기화
    //     removeAllChildNods(listEl);
    //
    //     // 리스트 아이템 생성
    //     data.forEach((item, i) => {
    //       const itemEl = getItem(i, item);
    //       fragment.appendChild(itemEl);
    //     });
    //
    //     // 프래그먼트를 리스트에 추가
    //     listEl.appendChild(fragment);
    //
    //     // 지도 범위 재설정
    //     map.setBounds(bounds);
    //
    //     // 페이지네이션 표시
    //     displayPagination(_pagination);
    //   }
    // });
  }

  function getItem(index, data) {
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

  // 검색시 리스트 초기화 후 붙이기
  function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild);
    }
  }

  // 카테고리 검색을 요청하는 함수입니다

  // 클릭한 마커에 대한 장소 상세정보를 커스텀 오버레이로 표시하는 함수

  function displayPlaceInfo(place) {
    // 같은 장소를 다시 클릭하면 토글
    if (selectedPlace === place) {
      setSelectedPlace(null);
      setIsOverlayOpen(false);
    } else {
      setSelectedPlace(place);
      setIsOverlayOpen(true);
    }
  }

  function makePlaceInfo(place) {
    return (
      <Box className={"placeinfo_wrap"}>
        <Box className="placeinfo">
          <a
            className="title"
            href={place.place_url}
            target="_blank"
            rel="noopener noreferrer"
            title={place.place_name}
          >
            {place.place_name}
          </a>

          <span title={place.address_name}>{place.address_name}</span>

          <span className="tel">{place.phone}</span>
          <div className="after"></div>
        </Box>
      </Box>
    );
  }

  function handleCategoryListClick(categoryId, categoryImageNumber) {
    setCategoryImageNumber(categoryImageNumber);
    if (categoryId === currCategory) {
      setCurrCategory("");
    } else {
      setCurrCategory(categoryId);
    }
  }

  return (
    <Box display={"flex"} w={"100%"} className={"map_wrap"}>
      <Stack w={"20%"} className={"menu_wrap"}>
        <Field>
          <Input
            value={locationName}
            onChange={(e) => {
              setLocationName(e.target.value);
            }}
          />
        </Field>

        <Button onClick={() => handleSearch(locationName)}> 검색하기</Button>

        <ListRoot id={"placeList"} as={"ol"}></ListRoot>
        <div id={"pagination"}></div>
      </Stack>
      <Stack w={"80%"}>
        <Map
          className="map"
          center={{ lat: 33.450701, lng: 126.570667 }}
          level={3}
          style={{ width: "100%", height: "800px" }}
          onCreate={setMap}
        >
          {categorySearchResultList.map((item, index) => {
            return (
              <MapMarker
                key={index}
                position={{ lat: item.y, lng: item.x }}
                image={{
                  src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png",
                  size: { width: 27, height: 28 },
                  options: {
                    spriteSize: { width: 72, height: 208 },
                    spriteOrigin: { x: 46, y: categoryImageNumber * 36 },
                    offset: { x: 11, y: 28 },
                  },
                }}
                onClick={() => {
                  displayPlaceInfo(item);
                }}
              ></MapMarker>
            );
          })}
          {/* 마커들 */}

          {isoverlayOpen && selectedPlace && (
            <CustomOverlayMap
              onCreate={setCustomOverlay}
              position={{ lat: selectedPlace.y, lng: selectedPlace.x }}
            >
              {makePlaceInfo(selectedPlace)}
            </CustomOverlayMap>
          )}

          {placeSearchResultList.map((item, index) => {
            // 좌표 객체 생성
            return (
              <MapMarker
                key={item.id || i}
                position={{ lat: item.y, lng: item.x }}
                onClick={() => displayPlaceInfo(item)}
              ></MapMarker>
            );
          })}

          <ZoomControl />
        </Map>
        <ul id="category">
          <li
            id="BK9"
            data-order="0"
            className={currCategory === "BK9" ? "on" : ""}
            onClick={() => handleCategoryListClick("BK9", 0)}
          >
            <span className="category_bg bank"></span>
            은행
          </li>
          <li
            id="MT1"
            data-order="1"
            className={currCategory === "MT1" ? "on" : ""}
            onClick={() => handleCategoryListClick("MT1", 1)}
          >
            <span className="category_bg mart"></span>
            마트
          </li>
          <li
            id="PM9"
            data-order="2"
            className={currCategory === "PM9" ? "on" : ""}
            onClick={() => handleCategoryListClick("PM9", 2)}
          >
            <span className="category_bg pharmacy"></span>
            약국
          </li>
          <li
            id="OL7"
            data-order="3"
            className={currCategory === "OL7" ? "on" : ""}
            onClick={() => handleCategoryListClick("OL7", 3)}
          >
            <span className="category_bg oil"></span>
            주유소
          </li>
          <li
            id="CE7"
            data-order="4"
            className={currCategory === "CE7" ? "on" : ""}
            onClick={() => handleCategoryListClick("CE7", 4)}
          >
            <span className="category_bg cafe"></span>
            카페
          </li>
          <li
            id="CS2"
            data-order="5"
            className={currCategory === "CS2" ? "on" : ""}
            onClick={() => handleCategoryListClick("CS2", 5)}
          >
            <span className="category_bg store"></span>
            편의점
          </li>
        </ul>
      </Stack>
    </Box>
  );
}

export default ViewMap;
