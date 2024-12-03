import {
  Badge,
  Box,
  Button,
  Card,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { ProductLike } from "./ProductLike.jsx";
import { getDaysAgo } from "./ProductDate.jsx";
import { categories } from "../category/CategoryContainer.jsx";
import { useEffect, useState } from "react";
import axios from "axios"; // 예시로 아이콘 추가

export function ProductHorizontalItem({ product }) {
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체";
  const daysAgo = getDaysAgo(product.createdAt);

  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const [likeRes, userLikeRes] = await Promise.all([
          axios.get("/api/product/likes"),
          axios.get("/api/product/like/member"),
        ]);

        const likes = likeRes.data.reduce((acc, item) => {
          acc[item.product_id] = item.like_count;
          return acc;
        }, {});

        setLikeData(likes);
        setUserLikes(new Set(userLikeRes.data));
      } catch (error) {
        console.error("관심 상품을 가져오는데 오류가 발생했습니다.:", error);
      }
    };
    fetchLikeData();
  }, []);

  return (
    <Card.Root
      flexDirection="row"
      maxH="150px"
      width="100%"
      mb={4}
      boxShadow="sm" // 카드에 그림자 추가
      borderRadius="md" // 카드 모서리 둥글게
      border="1px solid"
      borderColor="gray.200"
      position="relative" // 부모 카드에 relative 위치를 지정
    >
      {/* 왼쪽: 이미지 */}
      <Image
        maxW="150px"
        objectFit="cover"
        src="/image/productItem.png"
        alt={product.productName}
        borderRadius="md" // 이미지의 모서리 둥글게
      />

      {/* 오른쪽: 텍스트 및 버튼 */}
      <Box
        ml={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
      >
        <Card.Body>
          {/* 카테고리 */}
          <Badge colorScheme="teal">{categoryLabel}</Badge>
          {/* 상품명 */}
          <Card.Title mb={2} fontSize="lg" fontWeight="bold">
            {product.productName}
          </Card.Title>
          {/* 장소 */}
          <Text fontSize="sm" color="gray.500">
            {product.locationName || "장소 정보 없음"}
          </Text>
          <Card.Description mt={2}>{daysAgo}</Card.Description>
        </Card.Body>
      </Box>

      {/* 우측 상단 좋아요 버튼 */}
      <Button
        variant="ghost"
        colorScheme="red"
        size="sm"
        position="absolute"
        top={2}
        right={2}
      >
        <ProductLike
          productId={product.productId}
          initialLike={userLikes.has(product.productId)}
          initialCount={likeData[product.productId] || 0}
          isHorizontal={false}
        />
      </Button>

      {/* 우측 하단 가격 */}
      <Box position="absolute" bottom={2} right={2}>
        <Text fontSize="md" fontWeight="bold">
          <HStack gap="1">
            {product.pay !== "share" && <PiCurrencyKrwBold />}
            {product.pay === "share" ? "나눔" : product.price}
          </HStack>
        </Text>
      </Box>
    </Card.Root>
  );
}
