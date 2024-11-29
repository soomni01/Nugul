import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  HStack,
  Image,
  Spinner,
} from "@chakra-ui/react";

import { CategoryContainer } from "../../components/category/CategoryContainer.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { GoHeart } from "react-icons/go";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

function ProductItem({ product }) {
  const navigate = useNavigate();
  return (
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
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // 컴포넌트 마운트 시 상품 목록 가져오기
  useEffect(() => {
    axios
      .get("/api/product/list", {
        params: searchParams,
      })
      .then((res) => res.data)
      .then((data) => {
        setProductList(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("상품 정보를 가져오는 데 실패했습니다.", err);
        setLoading(false);
      });
  }, [searchParams]);

  // 페이지 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  // 페이지 이동
  const handlePageChange = (e) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  };

  // 정렬
  const handleSortChange = (e) => {};

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <CategoryContainer />
      <Heading textAlign="center">카테고리</Heading>

      <Flex justify="space-between" align="center" mb={4}>
        <Flex gap={4}>
          <select
            value={searchParams.get("sort") || "newest"}
            onChange={handleSortChange}
            size="sm"
          >
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
          // key prop을 추가하여 각 항목을 고유하게 지정 (각 항목을 추적하기 위해 key 사용)
          <ProductItem key={product.productId} product={product} />
        ))}
      </Grid>
      <PaginationRoot
        onPageChange={handlePageChange}
        count={1500}
        pageSize={10}
        page={page}
      >
        <HStack>
          <PaginationPrevTrigger />
          <PaginationItems />
          <PaginationNextTrigger />
        </HStack>
      </PaginationRoot>
    </Box>
  );
}
