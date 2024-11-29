import {
  Box,
  Center,
  Flex,
  Grid,
  Heading,
  HStack,
  IconButton,
  Input,
  Spinner,
} from "@chakra-ui/react";

import {
  categories,
  CategoryContainer,
} from "../../components/category/CategoryContainer.jsx";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { LuSearch } from "react-icons/lu";
import { ProductItem } from "../../components/product/ProductItem.jsx";

export function ProductList() {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [sortOption, setSortOption] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState({
    keyword: "",
  });
  const navigate = useNavigate();

  // 페이지 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  // 카테고리 변경 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 업데이트
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", category); // 카테고리 필터를 URL에 추가
    nextSearchParams.set("page", 1); // 카테고리 변경 시 페이지 1로 리셋
    setSearchParams(nextSearchParams);
  };

  // 컴포넌트 마운트 시 상품 목록 가져오기
  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/api/product/list", {
        params: { ...Object.fromEntries(searchParams), page, pay: "sell" },
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((data) => {
        setProductList(data.list);
        setCount(data.count);
        setLoading(false);
      })
      .catch((error) => {
        if (error.name !== "CanceledError") {
          console.log("상품 정보를 가져오는 데 실패했습니다.", error);
        }
      });

    return () => {
      controller.abort();
    };
  }, [searchParams, selectedCategory]);

  // 카테고리 label 찾기
  const selectedCategoryLabel = categories.find(
    (category) => category.value === selectedCategory,
  )?.label;

  // 검색 키워드 유지 또는 초기화
  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  // 페이지 이동
  const handlePageChange = (e) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  };

  // 정렬 옵션 변경
  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue); // 상태 업데이트
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", sortValue); // 쿼리 파라미터에 정렬 기준 추가
    setSearchParams(nextSearchParams); // URL 업데이트
  };

  // 클라이언트 정렬
  const sortedList = [...productList].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt); // 최신순
    } else if (sortOption === "popular") {
      return b.popularity - a.popularity; // 인기순
    } else if (sortOption === "low-to-high") {
      return a.price - b.price; // 저가순
    } else if (sortOption === "high-to-low") {
      return b.price - a.price; // 고가순
    }
    return 0;
  });

  const handleSearchClick = () => {
    if (search.keyword.trim().length > 0) {
      // 검색
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("sk", search.keyword);
      nextSearchParam.set("page", 1);
      setSearchParams(nextSearchParam);
    } else {
      // 검색 안함
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("sk");
      setSearchParams(nextSearchParam);
    }
  };

  // 엔터키를 눌렀을 때 검색 실행
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchClick();
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      <CategoryContainer onCategorySelect={handleCategorySelect} />
      <Heading textAlign="center">{selectedCategoryLabel}</Heading>
      <Box my={5} display="flex" justifyContent="center">
        <HStack w="80%">
          <Input
            value={search.keyword}
            onChange={(e) =>
              setSearch({ ...search, keyword: e.target.value.trim() })
            }
            onKeyDown={handleKeyDown}
          />
          <IconButton aria-label="Search database">
            <LuSearch onClick={handleSearchClick} />
          </IconButton>
        </HStack>
      </Box>
      <Flex justify="space-between" align="center" mb={4}>
        <Flex gap={4}>
          <select value={sortOption} onChange={handleSortChange} size="sm">
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
      {productList.length > 0 ? (
        <Grid templateColumns="repeat(4, 1fr)" gap="6">
          {sortedList?.map((product) => (
            // key prop을 추가하여 각 항목을 고유하게 지정 (각 항목을 추적하기 위해 key 사용)
            <ProductItem key={product.productId} product={product} />
          ))}
        </Grid>
      ) : (
        <p>조회된 결과가 없습니다.</p>
      )}
      <Center>
        <PaginationRoot
          onPageChange={handlePageChange}
          count={count}
          pageSize={16}
          page={page}
          variant="solid"
        >
          <HStack>
            <PaginationPrevTrigger />
            <PaginationItems />
            <PaginationNextTrigger />
          </HStack>
        </PaginationRoot>
      </Center>
    </Box>
  );
}
