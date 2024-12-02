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
import { LuSearch } from "react-icons/lu";
import { Button } from "../../components/ui/button.jsx";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ProductItem } from "../../components/product/ProductItem.jsx";

export function ProductListContainer({ apiEndpoint, pay, addProductRoute }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [sortOption, setSortOption] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState({ keyword: "" });
  const navigate = useNavigate();

  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", category);
    nextSearchParams.set("page", 1);
    setSearchParams(nextSearchParams);
  };

  const selectedCategoryLabel = categories.find(
    (category) => category.value === selectedCategory,
  )?.label;

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);

    axios
      .get(apiEndpoint, {
        params: { ...Object.fromEntries(searchParams), page, pay },
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

  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

  const handlePageChange = (e) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  };

  const handleSortChange = (e) => {
    const sortValue = e.target.value;
    setSortOption(sortValue);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", sortValue);
    setSearchParams(nextSearchParams);
  };

  const sortedList = [...productList].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "popular") {
      return b.popularity - a.popularity;
    } else if (sortOption === "low-to-high") {
      return a.price - b.price;
    } else if (sortOption === "high-to-low") {
      return b.price - a.price;
    }
    return 0;
  });

  const handleSearchClick = () => {
    const nextSearchParam = new URLSearchParams(searchParams);
    if (search.keyword.trim().length > 0) {
      nextSearchParam.set("sk", search.keyword);
      nextSearchParam.set("page", 1);
    } else {
      nextSearchParam.delete("sk");
    }
    setSearchParams(nextSearchParam);
  };

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
          onClick={() => navigate(addProductRoute)}
          colorScheme="teal"
          size="sm"
        >
          판매하기
        </Button>
      </Flex>
      {productList.length > 0 ? (
        <Grid templateColumns="repeat(4, 1fr)" gap="6">
          {sortedList?.map((product) => (
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
