import {
  Box,
  Center,
  Flex,
  Grid,
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
import {
  MenuContent,
  MenuRadioItem,
  MenuRadioItemGroup,
  MenuRoot,
  MenuTrigger,
} from "../../components/ui/menu.jsx";
import { HiSortAscending } from "react-icons/hi";

export function ProductListContainer({ apiEndpoint, pay, addProductRoute }) {
  const [productList, setProductList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [sortOption, setSortOption] = useState("newest");
  const [searchParams, setSearchParams] = useSearchParams("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState({ keyword: "" });
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const navigate = useNavigate();

  // 카테고리 값 가져오기
  const categoryParam = searchParams.get("category");
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam); // URL에서 가져온 카테고리로 상태 설정
    }
  }, [categoryParam]);

  // 페이지 번호
  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  // 정렬 옵션 가져오기
  useEffect(() => {
    const sortParam = searchParams.get("sort");
    if (sortParam) {
      setSortOption(sortParam); // URL에서 정렬 옵션 가져오기
    }
  }, [searchParams]);

  // 카테고리 변경 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", category);
    nextSearchParams.set("page", 1);
    setSearchParams(nextSearchParams);
  };

  // 카테고리 label 찾기
  const selectedCategoryLabel = categories.find(
    (category) => category.value === selectedCategory,
  )?.label;

  // 컴포넌트 마운트 시 상품 목록 가져오기
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

  console.log(productList);
  // 검색 키워드 유지 또는 초기화
  useEffect(() => {
    const nextSearch = { ...search };

    if (searchParams.get("sk")) {
      nextSearch.keyword = searchParams.get("sk");
    } else {
      nextSearch.keyword = "";
    }

    setSearch(nextSearch);
  }, [searchParams]);

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
        console.error("데이터를 가져오는데 실패했습니다.", error);
      }
    };

    fetchLikeData();
  }, []);

  // 페이지 이동
  const handlePageChange = (e) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  };

  // 정렬 옵션 변경
  const handleSortChange = (option) => {
    // 전달된 값이 객체인 경우, value 속성에서 값을 추출
    const sortValue = typeof option === "object" ? option.value : option;

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("sort", sortValue);
    nextSearchParams.set("page", 1);
    setSearchParams(nextSearchParams);
  };

  // 클라이언트 정렬
  const sortedList = [...productList].sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortOption === "popular") {
      const aLikes = likeData[a.productId] || 0;
      const bLikes = likeData[b.productId] || 0;
      return bLikes - aLikes; // 좋아요 수가 많은 순으로 정렬
    } else if (sortOption === "low-to-high") {
      return a.price - b.price;
    } else if (sortOption === "high-to-low") {
      return b.price - a.price;
    }
    return 0;
  });

  // 검색 기능
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

  // enter 키로도 검색 가능
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
      <CategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      <Box mt={10} mb={2} display="flex" justifyContent="center">
        <HStack w="70%">
          <Input
            size={"lg"}
            value={search.keyword}
            placeholder="검색어를 입력해주세요"
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
      <Flex justify="center" w="100%">
        <HStack
          w="90%"
          display="flex"
          justify="space-between"
          align="center"
          mb={4}
        >
          <MenuRoot size="md">
            <MenuTrigger asChild>
              <Button variant="outline" size="lg">
                <HiSortAscending />
                {sortOption === "newest" && "최신순"}
                {sortOption === "popular" && "인기순"}
                {sortOption === "low-to-high" && "저가순"}
                {sortOption === "high-to-low" && "고가순"}
              </Button>
            </MenuTrigger>
            <MenuContent minW="10rem">
              <MenuRadioItemGroup
                value={sortOption}
                onValueChange={handleSortChange}
              >
                <MenuRadioItem value="newest">최신순</MenuRadioItem>
                <MenuRadioItem value="popular">인기순</MenuRadioItem>
                {pay !== "share" && (
                  <>
                    <MenuRadioItem value="low-to-high">저가순</MenuRadioItem>
                    <MenuRadioItem value="high-to-low">고가순</MenuRadioItem>
                  </>
                )}
              </MenuRadioItemGroup>
            </MenuContent>
          </MenuRoot>
          <Button
            onClick={() => navigate(addProductRoute)}
            colorScheme="teal"
            size="xl"
          >
            판매하기
          </Button>
        </HStack>
      </Flex>

      <Box w={"100%"} display={"flex"} justifyContent={"center"}>
        {productList.length > 0 ? (
          <Grid templateColumns="repeat(4, 1fr)" rowGap="12" columnGap="16">
            {sortedList?.map((product) => (
              <ProductItem
                key={product.productId}
                product={product}
                likeCount={likeData[product.productId] || 0}
                isLiked={userLikes.has(product.productId)}
              />
            ))}
          </Grid>
        ) : (
          <p>조회된 결과가 없습니다.</p>
        )}
      </Box>

      <Box my={10}>
        <Center>
          <PaginationRoot
            onPageChange={handlePageChange}
            count={count}
            pageSize={12}
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
    </Box>
  );
}
