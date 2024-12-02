import { Badge, Box, Card, Flex, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { categories } from "../category/CategoryContainer.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "./ProductDate.jsx";
import { ProductLike } from "./ProductLike.jsx";
import React from "react";

export function ProductItem({ product, likeCount, isLiked }) {
  const navigate = useNavigate();

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체"; // 기본값 설정

  // 날짜 차이를 계산하는 함수
  const daysAgo = getDaysAgo(product.createdAt);

  return (
    <Card.Root maxW="sm" overflow="hidden">
      <Image src="/image/productItem.png" alt={product.productName} />
      <Card.Body gap="2" p="4">
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
            <PiCurrencyKrwBold />
            {product.price}
          </HStack>
        </Card.Description>
      </Card.Body>
      <Card.Footer px="3" pb="2">
        <Flex justify="space-between" align="center" w="100%">
          <Button
            w="70%"
            onClick={() => navigate(`/product/view/${product.productId}`)}
            variant="solid"
          >
            상품보기
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
  );
}
