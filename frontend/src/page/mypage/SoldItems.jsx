import { Box, Heading, HStack, Spinner, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { EmptyState } from "../../components/ui/empty-state.jsx";
import { BsCartX } from "react-icons/bs";

export function SoldItems() {
  const [soldList, setSoldList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);

  useEffect(() => {
    if (soldList.length > 0) return;
    setLoading(true);

    axios
      .get("/api/myPage/sold", { params: { id } })
      .then((res) => {
        setSoldList(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("판매 상품 정보를 가져오는 데 실패했습니다.", error);
        setSoldList([]); // 실패시 빈 배열 처리
        setLoading(false);
      });
  }, [id]);

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
      <HStack alignItems="center">
        <Heading size="xl" mt={2} ml={3}>
          나의 판매 상품
        </Heading>
        <Text mt={2}>총 {soldList.length}건</Text>
      </HStack>
      <Box
        height="72vh"
        overflow="hidden"
        display="flex"
        alignItems="center"
        justifyContent="center"
        mt={7}
        ml={2}
      >
        {soldList.length > 0 ? (
          <Swiper
            direction={"vertical"}
            slidesPerView={"auto"}
            freeMode={true}
            scrollbar={{ draggable: true }}
            mousewheel={true}
            modules={[FreeMode, Scrollbar, Mousewheel]}
            style={{ height: "100%", width: "100%" }}
          >
            {soldList.map((product) => (
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
                  value={"sell"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <EmptyState icon={<BsCartX />} title="판매 상품이 없습니다." />
        )}
      </Box>
    </Box>
  );
}
