import { Box, Heading, HStack, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ReviewModal } from "../../components/review/ReviewModal.jsx";
import { BsCartX } from "react-icons/bs";
import { EmptyState } from "../../components/ui/empty-state.jsx";

export function PurchasedItems() {
  const [purchasedList, setPurchasedList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
        setPurchasedList([]);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  const handleOpenReviewModal = (productId) => {
    // 해당 productId에 해당하는 상품 정보를 미리 가져오기
    const selectedProduct = purchasedList.find(
      (product) => product.productId === productId,
    );
    setSelectedProduct(selectedProduct);
    setIsModalOpen(true);
  };

  // 리뷰 완료 후 상태 업데이트
  const handleReviewComplete = (productId) => {
    setPurchasedList((prevList) =>
      prevList.map((product) =>
        product.productId === productId
          ? { ...product, reviewStatus: "completed" }
          : product,
      ),
    );
  };

  return (
    <Box>
      <HStack alignItems="center">
        <Heading size="xl" mt={2} ml={3}>
          나의 구매 상품
        </Heading>
        <Text mt={2}>총 {purchasedList.length}건</Text>
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
        {purchasedList.length > 0 ? (
          <Swiper
            direction={"vertical"}
            slidesPerView={"auto"}
            freeMode={true}
            scrollbar={{ draggable: true }}
            mousewheel={true}
            modules={[FreeMode, Scrollbar, Mousewheel]}
            style={{
              height: "100%",
              width: "100%",
            }}
          >
            {purchasedList.map((product) => (
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
                  onOpen={() => handleOpenReviewModal(product.productId)} // productId만 전달
                  value={"purchased"}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        ) : (
          <EmptyState icon={<BsCartX />} title="구매 상품이 없습니다." />
        )}
      </Box>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onComplete={(productId) => handleReviewComplete(productId)}
      />
    </Box>
  );
}
