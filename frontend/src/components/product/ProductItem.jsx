import { Badge, Box, Card, Flex, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import React, { useState } from "react";
import { categories } from "../category/CategoryContainer.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "./ProductDate.jsx";
import { ProductLike } from "./ProductLike.jsx";
import { FaLocationDot } from "react-icons/fa6";
import { MiniMapModal } from "../../components/map/MiniMapModal.jsx";

export function ProductItem({ product, likeCount, isLiked }) {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체"; // 기본값 설정

  // 날짜 차이를 계산하는 함수
  const daysAgo = getDaysAgo(product.createdAt);

  // 장소 버튼 클릭 시 모달 열기
  const openMapModal = (e) => {
    e.stopPropagation(); // 부모 클릭 이벤트 전파 방지
    setIsModalOpen(true);
  };

  // 모달 닫기
  const closeMapModal = () => {
    setIsModalOpen(false);
  };

  // 페이지 이동 처리
  const handleCardClick = () => {
    navigate(`/product/view/${product.productId}`);
  };

  return (
    <Box>
      <Card.Root
        maxW="sm"
        overflow="hidden"
        onClick={handleCardClick} // 카드 클릭 시 페이지 이동
        cursor="pointer"
      >
        <Image src="/image/productItem.png" alt={product.productName} />
        <Card.Body gap="2" px="4" py="2">
          <HStack justify="space-between" w="100%">
            <Badge>{categoryLabel}</Badge>
            <Box>{daysAgo}</Box>
          </HStack>
          <Card.Title>
            <Box isTruncated maxWidth="100%">
              {product.productName}
            </Box>
          </Card.Title>
          <Card.Description>
            <HStack gap="1">
              {product.pay !== "share" && <PiCurrencyKrwBold />}
              {product.pay === "share" ? "나눔" : product.price}
            </HStack>
          </Card.Description>
        </Card.Body>

        <Card.Footer px="4" py="0">
          <Flex justify="space-between" align="center" w="100%">
            <Button
              onClick={openMapModal} // 장소 버튼 클릭 시 모달 열기
              size="xs"
              colorPalette="gray"
              variant="outline"
            >
              <FaLocationDot /> {product.locationName}
            </Button>
            <ProductLike
              productId={product.productId}
              initialLike={isLiked}
              initialCount={likeCount}
              isHorizontal={false}
            />
          </Flex>
        </Card.Footer>
      </Card.Root>

      <MiniMapModal
        isOpen={isModalOpen}
        onClose={closeMapModal}
        product={{
          latitude: product.latitude,
          longitude: product.longitude,
          locationName: product.locationName,
        }}
      />
    </Box>
  );
}
