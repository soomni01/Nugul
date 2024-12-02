import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  HStack,
  Image,
  VStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button.jsx";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { categories } from "../category/CategoryContainer.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "./ProductDate.jsx";
import React, { useState } from "react";
import axios from "axios";

export function ProductItem({ product, likeCount }) {
  const [like, setLike] = useState({ like: false, count: likeCount });
  const navigate = useNavigate();

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체"; // 기본값 설정

  // 날짜 차이를 계산하는 함수
  const daysAgo = getDaysAgo(product.createdAt);

  const handleLikeClick = () => {
    axios
      .post("/api/product/like", {
        productId: product.productId,
      })
      .then((res) => res.data)
      .then((data) => setLike(data))
      .catch()
      .finally();
  };

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
      <Card.Footer justify="space-between" px={3} pb={1}>
        <Flex justify="space-between" align="center" w="100%">
          <Button
            w="70%"
            onClick={() => navigate(`/product/view/${product.productId}`)}
            variant="solid"
          >
            상품보기
          </Button>
          <VStack gap={1} mt={3}>
            <Box onClick={handleLikeClick} cursor="pointer">
              <Heading fontSize="3xl">
                {like.like ? <GoHeartFill /> : <GoHeart />}
              </Heading>
            </Box>
            <Box>{like.count}</Box>
          </VStack>
        </Flex>
      </Card.Footer>
    </Card.Root>
  );
}
