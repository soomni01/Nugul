import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function Wishlist() {
  const [productList, setProductList] = useState([]); // 초기값 빈 배열
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);

  useEffect(() => {
    if (productList.length > 0) return; // 이미 데이터가 있으면 요청을 보내지 않음
    setLoading(true);

    axios
      .get("/api/myPage/like", { params: { id } })
      .then((res) => {
        setProductList(res.data); // 서버 응답에서 상품 목록 설정
        setLoading(false);
      })
      .catch((error) => {
        console.log("관심 상품 정보를 가져오는 데 실패했습니다.", error);
        setProductList([]); // 실패시 빈 배열 처리
        setLoading(false);
      });
  }, [productList]); // 컴포넌트가 마운트 될 때 한 번만 호출

  const handleRemove = (productId) => {
    setProductList((prevList) =>
      prevList.filter((item) => item.productId !== productId),
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        관심 목록
      </Heading>
      <Box height="70vh" overflow="hidden">
        <Swiper
          direction={"vertical"}
          slidesPerView={"auto"} // 각 상품의 높이에 맞춰 자동으로 크기를 조정
          freeMode={true} // 슬라이드를 자유롭게 이동
          scrollbar={{ draggable: true }} // 스크롤바 드래그
          mousewheel={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          style={{ height: "100%", width: "100%" }}
        >
          {productList.length > 0 ? (
            productList.map((product) => (
              <SwiperSlide
                key={product.productId}
                style={{
                  height: "100%",
                  width: "100%",
                  justifyContent: "left",
                }}
              >
                <ProductHorizontalItem
                  product={product}
                  onRemove={handleRemove}
                  pageType={"wish"}
                />
              </SwiperSlide>
            ))
          ) : (
            <Text>조회된 결과가 없습니다.</Text>
          )}
        </Swiper>
      </Box>
    </Box>
  );
}
