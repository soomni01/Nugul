import {
  Badge,
  Box,
  Flex,
  HStack,
  Input,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { BoardCategoryContainer } from "../../components/category/BoardCategoryContainer.jsx";
import { FaImages } from "react-icons/fa6";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [count, setCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState({
    type: "all",
    keyword: "",
  });
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthenticationContext);

  useEffect(() => {
    const controller = new AbortController();
    axios
      .get("/api/board/list", {
        params: searchParams,
        signal: controller.signal,
      })
      .then((res) => res.data)
      .then((data) => {
        const filteredList = data.list.filter(
          (board) =>
            selectedCategory === "all" || board.category === selectedCategory,
        );
        setBoardList(filteredList);
        setCount(data.count); // 전체 게시물 수
      });

    return () => {
      controller.abort();
    };
  }, [searchParams, selectedCategory]);

  // 로그인되지 않은 경우에 게시물 리스트를 표시하지 않음
  if (!isAuthenticated) {
    return (
      <Box
        //border="1px solid red"
        borderRadius="12px"
        p={8}
        textAlign="center"
        maxWidth="450px"
        mx="auto"
        mt={16}
        boxShadow="lg"
      >
        <Box>
          <Text fontSize="3xl" color="red.600" fontWeight="bold" mb={6}>
            권한이 없습니다.
          </Text>
          <Text color="gray.700" fontSize="lg" mb={8}>
            글을 작성하려면 로그인하거나 회원가입이 필요합니다.
          </Text>
          <Stack direction="row" spacing={6} justify="center" mb={4}>
            <Button
              colorScheme="blue"
              variant="outline"
              size="lg"
              onClick={() => navigate("/member/signup")}
            >
              회원가입
            </Button>
            <Button colorScheme="teal" size="lg" onClick={() => navigate("/")}>
              로그인
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handleRowClick(boardId) {
    navigate(`/board/boardView/${boardId}`);
  }

  const handleWriteClick = () => {
    if (!isAuthenticated) {
      toaster.create({
        description: "로그인이 필요합니다.",
        type: "warning",
      });
      return;
    }
    navigate("/board/boardAdd");
  };

  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  function handleSearchClick() {
    const nextSearchParam = new URLSearchParams(searchParams);

    if (search.keyword.trim().length > 0) {
      // 검색
      nextSearchParam.set("searchType", search.type);
      nextSearchParam.set("searchKeyword", search.keyword);
    } else {
      // 검색 안함
      nextSearchParam.delete("searchType");
      nextSearchParam.delete("searchKeyword");
    }

    nextSearchParam.set("page", 1);
    setSearchParams(nextSearchParam);
  }

  function handleCategorySelect(categoryValue) {
    setSelectedCategory(categoryValue); // 선택된 카테고리 상태 갱신

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", categoryValue); // 카테고리 값 업데이트

    // 검색 조건도 포함시켜서 검색
    if (search.keyword.trim().length > 0) {
      nextSearchParams.set("searchType", search.type);
      nextSearchParams.set("searchKeyword", search.keyword);
    }

    nextSearchParams.set("page", 1); // 페이지를 1로 초기화
    setSearchParams(nextSearchParams); // searchParams 갱신
  }

  return (
    <Box width="100%">
      {/* 카테고리 선택 컴포넌트 */}
      <BoardCategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

      {/* 게시물 제목 */}
      <Flex justifyContent="space-between" alignItems="center">
        <h3>게시물 목록</h3>
        {isAuthenticated && (
          <Button onClick={handleWriteClick}>게시물 쓰기</Button>
        )}
      </Flex>

      {/* 게시물 리스트 */}
      {boardList.length > 0 ? (
        <Box>
          <hr />
          <Table.Root interactive p={"6px"}>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader textAlign="center">번호</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">제목</Table.ColumnHeader>
                <Table.ColumnHeader textAlign="center">
                  작성자
                </Table.ColumnHeader>
                <Table.ColumnHeader
                  display={{ base: "none", md: "table-cell" }}
                  textAlign="center"
                >
                  작성날짜
                </Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {boardList.map((board) => (
                <Table.Row
                  _hover={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(board.boardId)}
                  key={board.boardId}
                >
                  <Table.Cell textAlign="center">{board.boardId}</Table.Cell>
                  <Table.Cell textAlign="center">
                    {board.title}
                    {board.countFile > 0 && (
                      <Badge variant={"subtle"} colorPalette={"gray"}>
                        <FaImages />
                        {board.countFile}
                      </Badge>
                    )}
                  </Table.Cell>
                  <Table.Cell textAlign="center">{board.writer}</Table.Cell>
                  <Table.Cell
                    display={{ base: "none", md: "table-cell" }}
                    textAlign="center"
                  >
                    {board.createdAt}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>

          {/* 페이징 컴포넌트 */}
          {count > 0 && (
            <PaginationRoot
              onPageChange={handlePageChange}
              count={count}
              pageSize={10}
              page={page}
            >
              <Flex justifyContent="center" mt={4}>
                <HStack>
                  <PaginationPrevTrigger />
                  <PaginationItems />
                  <PaginationNextTrigger />
                </HStack>
              </Flex>
            </PaginationRoot>
          )}
        </Box>
      ) : (
        <p>조회된 결과가 없습니다.</p>
      )}

      {/* 검색 UI */}
      <HStack justify="center" mt={4} minHeight="50px">
        <Box>
          <select
            value={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value={"all"}>전체</option>
            <option value={"title"}>제목</option>
            <option value={"content"}>본문</option>
          </select>
        </Box>
        <Input
          value={search.keyword}
          placeholder="검색 하세요"
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
        />
        <Button onClick={handleSearchClick}>검색</Button>
      </HStack>
    </Box>
  );
}
