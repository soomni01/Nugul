import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import React, { useEffect, useState } from "react";
import axios from "axios";

export function SoldItems() {
  const [soldList, setSoldList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (soldList.length > 0) return;
    setLoading(true);

    axios
      .get("/api/myPage/sold")
      .then((res) => {
        setSoldList(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("판매 상품 정보를 가져오는 데 실패했습니다.", error);
        setSoldList([]); // 실패시 빈 배열 처리
        setLoading(false);
      });
  }, []);

  const handleDelete = (productId) => {
    setSoldList((prevList) =>
      prevList.filter((item) => item.productId !== productId),
    );
  };

  if (loading) {
    return <Spinner />;
  }
  return (
    <Box>
      <Heading size="lg" mb={4}>
        내가 판매한 상품
      </Heading>
      <Box height="70vh" overflow="hidden">
        <Swiper
          direction={"vertical"}
          slidesPerView={"auto"}
          freeMode={true}
          scrollbar={{ draggable: true }}
          mousewheel={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          style={{ height: "100%", width: "100%" }}
        >
          {soldList.length > 0 ? (
            soldList.map((product) => (
              <SwiperSlide
                key={product.productId}
                style={{
                  height: "auto",
                  width: "100%",
                  justifyContent: "left",
                }}
              >
                <ProductHorizontalItem
                  product={product}
                  onRemove={handleDelete}
                  pageType={"sold"}
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
