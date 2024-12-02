import { Badge, Box, Card, HStack, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { GoHeart } from "react-icons/go";
import { categories } from "../category/CategoryContainer.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "../product/ProductDate.jsx";
import React from "react";

export function ProductItem({ product }) {
  const navigate = useNavigate();

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체"; // 기본값 설정

  // 날짜 차이를 계산하는 함수
  const daysAgo = getDaysAgo(product.createdAt);

  return (
    <Card.Root maxW="sm" overflow="hidden">
      <Image src="/image/productItem.png" alt={product.productName} />
      <Card.Body gap="2">
        <HStack justify="space-between" w="100%">
          <Badge>{categoryLabel}</Badge>
          <Box>{daysAgo}</Box>
        </HStack>
        <Card.Title>{product.productName}</Card.Title>
        <Card.Description>
          <HStack gap="1">
            <PiCurrencyKrwBold />
            {product.price}
          </HStack>
        </Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button
          onClick={() => navigate(`/product/view/${product.productId}`)}
          variant="solid"
        >
          상품보기
        </Button>
        <Box>
          <GoHeart />
        </Box>
      </Card.Footer>
    </Card.Root>
  );
}
