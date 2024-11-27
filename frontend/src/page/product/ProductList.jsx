import { Box, Card, Flex, Grid, Heading, Image } from "@chakra-ui/react";
import { CategoryContainer } from "../../components/category/CategoryContainer.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

function ProductItem(props) {
  return (
    // <Box h="20vw" bg="gray.100" borderRadius="md" boxShadow="sm" p={4}>
    //   {/* 상품 내용 */}
    //   상품
    // </Box>
    <Card.Root maxW="sm" overflow="hidden">
      <Image src="/image/productItem.png" alt="테스트용 이미지" />
      <Card.Body gap="2">
        <Card.Title>상품 이름</Card.Title>
        <Card.Description>가격</Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button variant="solid">Buy now</Button>
        <Button variant="ghost">Add to cart</Button>
      </Card.Footer>
    </Card.Root>
  );
}

export function ProductList() {
  const navigate = useNavigate();

  return (
    <Box>
      <CategoryContainer />
      <Heading textAlign="center">카테고리</Heading>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex gap={4}>
          <select value={"최신순"} size="sm">
            <option value="newest">최신순</option>
            <option value="popular">인기순</option>
            <option value="low-to-high">저가순</option>
            <option value="high-to-low">고가순</option>
          </select>
        </Flex>

        <Button
          onClick={() => navigate("/product/add")}
          colorScheme="teal"
          size="sm"
        >
          판매하기
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
        <ProductItem />
      </Grid>
    </Box>
  );
}
