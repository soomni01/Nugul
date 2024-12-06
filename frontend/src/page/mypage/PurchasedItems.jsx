import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { ProductHorizontalItem } from "../../components/product/ProductHorizontalItem.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ReviewModal } from "../../components/review/ReviewModal.jsx";

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
            height: "100%",
            width: "100%",
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
                  onOpen={() => handleOpenReviewModal(product.productId)} // productId만 전달
                  value={"purchased"}
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
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
      />
    </Box>
  );
}
