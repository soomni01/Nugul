import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Image,
  Spinner,
} from "@chakra-ui/react";
import { CategoryContainer } from "../../components/category/CategoryContainer.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoHeart } from "react-icons/go";

function ProductItem({ product }) {
  const navigate = useNavigate();
  return (
    // <Box h="20vw" bg="gray.100" borderRadius="md" boxShadow="sm" p={4}>
    //   {/* 상품 내용 */}
    //   상품
    // </Box>
    <Card.Root maxW="sm" overflow="hidden">
      <Image src="/image/productItem.png" alt={product.productName} />
      <Card.Body gap="2">
        <Card.Title>{product.productName}</Card.Title>
        <Card.Description>{product.price}</Card.Description>
      </Card.Body>
      <Card.Footer gap="2">
        <Button
          onClick={() => navigate(`/product/view/${product.productId}`)}
          variant="solid"
        >
          거래하기
        </Button>
        <Box>
          <GoHeart />
        </Box>
      </Card.Footer>
    </Card.Root>
  );
}

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 상품 목록 가져오기
  useEffect(() => {
    axios
      .get("/api/product/list")
      .then((res) => res.data)
      .then((data) => {
        setProductList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("상품 정보를 가져오는 데 실패했습니다.", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

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
          onClick={() => navigate(`/product/add`)}
          colorScheme="teal"
          size="sm"
        >
          판매하기
        </Button>
      </Flex>
      <Grid templateColumns="repeat(4, 1fr)" gap="6">
        {productList?.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))}
      </Grid>
    </Box>
  );
}
