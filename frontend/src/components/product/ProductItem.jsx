import { Badge, Box, Card, Flex, HStack, Image } from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import React, { useState } from "react";
import { categories } from "../category/CategoryContainer.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "./ProductDate.jsx";
import { ProductLike } from "./ProductLike.jsx";
import { MiniMapModal } from "../../components/map/MiniMapModal.jsx";
import { FaMapMarkerAlt } from "react-icons/fa";

export function ProductItem({ product, likeCount, isLiked }) {
  const location = useLocation();
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

  const mainImage = product.mainImageName
    ? product.mainImageName
    : "/image/productItem.png";

  const isListPage =
    location.pathname.includes("/product/list") ||
    location.pathname.includes("/product/share/list");
  const cardSize = isListPage ? "310px" : "400px";

  return (
    <Box>
      <Card.Root
        maxW={cardSize}
        overflow="hidden"
        onClick={handleCardClick}
        cursor="pointer"
      >
        <Image
          width="100%"
          height="300px"
          height={isListPage ? "300px" : "250px"}
          objectFit="cover"
          src={mainImage}
          alt={product.productName}
        />
        <Card.Body gap="2" px="3" pt="3" mb={0} pb={3}>
          <HStack justify="space-between" w="100%">
            <Badge mt="-5" size={"lg"}>
              {categoryLabel}
            </Badge>
            <ProductLike
              productId={product.productId}
              initialLike={isLiked}
              initialCount={likeCount}
              isHorizontal={false}
            />
          </HStack>
          <Card.Title>
            <Box mt="-5" ml={1} fontSize="xl" isTruncated maxWidth="100%">
              {product.productName}
            </Box>
          </Card.Title>
          <Card.Description>
            <HStack fontSize="lg" gap="0.5" ml={1}>
              {product.pay !== "share" && <PiCurrencyKrwBold />}
              {product.pay === "share" ? "나눔" : product.price}
            </HStack>
          </Card.Description>
        </Card.Body>

        <Card.Footer px="3" pb="3">
          <Flex justify="space-between" align="center" w="100%">
            <Button
              isTruncated
              onClick={openMapModal}
              size="sm"
              colorPalette="gray"
              variant="outline"
            >
              <FaMapMarkerAlt />
              {product.locationName}
            </Button>

            <Box fontSize="lg">{daysAgo}</Box>
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
