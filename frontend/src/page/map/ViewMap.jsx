import React, { useEffect, useState } from "react";
import {
  CustomOverlayMap,
  Map,
  MapMarker,
  ZoomControl,
} from "react-kakao-maps-sdk";
import "./ViewMap.css";
import {
  Box,
  Group,
  Heading,
  Input,
  ListItem,
  ListRoot,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { IoSearchOutline } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";

function ViewMap() {
  const [map, setMap] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [customOverlay, setCustomOverlay] = useState(null);
  const [currCategory, setCurrCategory] = useState("-1"); // classname 지정할때   지정하지 않은 초기상태에서  그룹코드가 없으면 빨간색 되는거 막을려고
  const [categorySearchResultList, setCategorySearchResultList] = useState([]);
  const [categoryImageNumber, setCategoryImageNumber] = useState(0);
  const [isoverlayOpen, setIsOverlayOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [placeKeyword, setPlaceKeyword] = useState("");
  const [listItem, setListItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [sameKeyword, setSameKeyword] = useState(false);

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
      if (placeSearchResultList) {
        setPlaceSearchResultList([]);
        setPlaceKeyword("");
      }
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

      ps.keywordSearch(placeKeyword, (result, _pagination) => {
        // placekeyword로 검색하고 >  검색결과의 위치가 다 보일수 있도록 맵의 크기를 화장후  위치 변경
        setPlaceSearchResultList(result);
        const bounds = new kakao.maps.LatLngBounds();

        // 바로 setListItem에 넣으면 비동기방식이라 > 참조값이  re-render 될때  마지막 item 을 참조해 모든값이 item으로 들어갈수도 있음
        var newList = [];
        result.forEach((item, i) => {
          bounds.extend(new kakao.maps.LatLng(item.y, item.x));
          const itemEl = getItem(i, item);
          newList.push(itemEl);
        });
        setListItem(newList);

        map.setBounds(bounds);
        setPagination(_pagination);
      });
    } else {
      setPlaceSearchResultList([]);
    }
  }, [placeKeyword, sameKeyword]);

  // 같은 이름 다시 검색해도  >  맵 이동하도록 변경
  function handleSearch(locationname) {
    if (locationname === placeKeyword) {
      setSameKeyword(!sameKeyword);
    } else setPlaceKeyword(locationname);
  }

  //리스트 정보 출력부
  function getItem(index, data) {
    return (
      <>
        <div className={"listItem"}>
          <Heading>{data.place_name}</Heading>
          <span>{data.address_name}</span>
          <hr />
          <MdLocalPhone
            size={"16px"}
            style={{
              display: "inline-block",
              marginRight: "5px",
              color: "green",
            }}
          />
          <span>{data.phone}</span>
        </div>
      </>
    );
  }

  function displayPagination(pagination) {
    // pagination 객체에서 필요한 정보 추출
    const totalPages = pagination.last;

    // 페이지 버튼 클릭 핸들러
    const handlePageClick = (pageNumber) => {
      // pagination.gotoPage(pageNumber);
      setCurrentPage(pageNumber);
    };

    return (
      <div id="pagination">
        {[...Array(totalPages)].map((_, index) => {
          const pageNumber = index + 1;
          return (
            <a
              key={pageNumber}
              href="#"
              className={pageNumber === currentPage ? "on" : ""}
              onClick={() => handlePageClick(pageNumber)}
            >
              {pageNumber}
            </a>
          );
        })}
      </div>
    );
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
    // 카테고리 그룹 코드에 따라서  className 변경
    var chageClassName;
    if (currCategory) {
      chageClassName =
        currCategory === place.category_group_code ? "title" : "bluetitle";
    } else {
      chageClassName = "bluetitle";
    }

    return (
      <Box className={"placeinfo_wrap"}>
        <Box className="placeinfo">
          <a
            className={chageClassName}
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
      setIsOverlayOpen(false);
    } else {
      setCurrCategory(categoryId);
    }
  }

  return (
    <Box
      display={"flex"}
      w={"100%"}
      className={"map_wrap"}
      style={{ position: "relative" }}
    >
      <Map
        className="map"
        center={{ lat: 33.450701, lng: 126.570667 }}
        level={3}
        style={{ width: "100%", height: "100vh" }}
        onCreate={setMap}
      >
        <Box
          overflowY={"auto"}
          style={{
            position: "absolute",
            zIndex: 3,
            height: "calc(100vh - 20px)",
            background: listItem.length > 0 ? "white" : "transparent", // 검색 결과 없으면 투명 배경
            padding: listItem.length > 0 ? "10px" : "0", // 검색 결과 없으면 패딩 제거

            boxShadow:
              listItem.length > 0 ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "none", // 검색 결과 없으면 그림자 제거
          }}
        >
          <Group
            attached
            w={"90%"}
            mx={"auto"}
            bg={listItem.length > 0 ? "" : "white"}
          >
            <Field>
              <Input
                style={{
                  minWidth: "200px",
                }}
                value={locationName}
                onChange={(e) => {
                  setLocationName(e.target.value);
                }}
              />
            </Field>

            <Button onClick={() => handleSearch(locationName)}>
              <IoSearchOutline />
            </Button>
          </Group>

          {listItem.length > 0 && (
            <>
              <Heading
                style={{ borderBottom: "1px solid gray", marginTop: "10px" }}
              >
                검색결과
              </Heading>
              <ListRoot listStyle={"none"} style={{ overflowY: "auto" }}>
                {listItem.map((item, index) => (
                  <ListItem
                    key={index}
                    className={"hover-item"}
                    onClick={() =>
                      displayPlaceInfo(placeSearchResultList[index])
                    }
                  >
                    {item}
                  </ListItem>
                ))}
              </ListRoot>
              {pagination && (
                <div id={"pagination"}>{displayPagination(pagination)}</div>
              )}
            </>
          )}
        </Box>
        {/* 카테고리 마커 */}
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
        {/* 오버레이  */}
        {isoverlayOpen && selectedPlace && (
          <CustomOverlayMap
            onCreate={setCustomOverlay}
            position={{ lat: selectedPlace.y, lng: selectedPlace.x }}
          >
            {makePlaceInfo(selectedPlace)}
          </CustomOverlayMap>
        )}
        {/* 검색 마커  */}
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
      <ul id="category" style={{}}>
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
    </Box>
  );
}

export default ViewMap;
