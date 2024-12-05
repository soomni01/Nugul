import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ReviewModal } from "../../components/review/ReviewModal.jsx";

export function PurchasedItems() {
  const [purchasedList, setPurchasedList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열기/닫기 상태
  const { id } = useContext(AuthenticationContext);

  useEffect(() => {
    if (purchasedList.length > 0) return;
    setLoading(true);

    axios
      .get("/api/myPage/purchased", { params: { id } })
      .then((res) => {
        setPurchasedList(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log("구매 상품 정보를 가져오는 데 실패했습니다.", error);
        setPurchasedList([]); // 실패시 빈 배열 처리
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }
  return (
    <Box>
      <Heading size="lg" mb={4}>
        내가 구매한 상품
      </Heading>
      <Box height="70vh" overflow="hidden">
        <Swiper
          direction={"vertical"}
          slidesPerView={"auto"}
          freeMode={true}
          scrollbar={{ draggable: true }}
          mousewheel={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          style={{
            height: "auto",
            width: "100%",
            justifyContent: "left",
          }}
        >
          {purchasedList.length > 0 ? (
            purchasedList.map((product) => (
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
                  pageType={"purchased"}
                  onOpen={() => setIsModalOpen(true)}
                />
              </SwiperSlide>
            ))
          ) : (
            <Text>조회된 결과가 없습니다.</Text>
          )}
        </Swiper>
      </Box>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // 모달 닫기
      />
    </Box>
  );
}
