import {
  Badge,
  Box,
  Card,
  Heading,
  HStack,
  Image,
  Spinner,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";

export function Wishlist() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    axios
      .get("/api/myPage/like")
      .then((res) => res.data)
      .then((data) => {
        setProductList(data.list);
        setLoading(false);
      })
      .catch((error) => {
        console.log("관심 상품 정보를 가져오는 데 실패했습니다.", error);
      });
  }, []);
  console.log(productList);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <Heading size="lg" mb={4}>
        관심 목록
      </Heading>
      <Box>
        <Card.Root flexDirection="row" maxH="150px">
          <Image maxW="150px" objectFit="cover" src="/image/productItem.png" />
          <Box>
            <Card.Body>
              <Card.Title mb="2">The perfect latte</Card.Title>
              <Card.Description>
                Caffè latte is a coffee beverage of Italian origin made with
                espresso and steamed milk.
              </Card.Description>
              <HStack mt="4">
                <Badge>Hot</Badge>
                <Badge>Caffeine</Badge>
              </HStack>
            </Card.Body>
            <Card.Footer>
              <Button>Buy Latte</Button>
            </Card.Footer>
          </Box>
        </Card.Root>
      </Box>
    </Box>
  );
}
