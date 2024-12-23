import { Badge, Box, Flex, HStack, Input, Table } from "@chakra-ui/react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

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
        setCount(data.count);
      });

    return () => {
      controller.abort();
    };
  }, [searchParams, selectedCategory]);

  useEffect(() => {
    const nextSearch = { ...search };
    if (searchParams.get("searchType")) {
      nextSearch.type = searchParams.get("searchType");
    } else {
      nextSearch.type = "all";
    }
    if (searchParams.get("searchKeyword")) {
      nextSearch.keyword = searchParams.get("searchKeyword");
    } else {
      nextSearch.keyword = "";
    }
    setSearch(nextSearch);
    const selectedCategory = searchParams.get("category");
    if (selectedCategory) {
      setSelectedCategory(selectedCategory);
    }
  }, [searchParams]);

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
      nextSearchParam.set("searchType", search.type);
      nextSearchParam.set("searchKeyword", search.keyword);
    } else {
      nextSearchParam.delete("searchType");
      nextSearchParam.delete("searchKeyword");
    }

    nextSearchParam.set("page", 1);
    setSearchParams(nextSearchParam);
  }

  function handleCategorySelect(categoryValue) {
    setSelectedCategory(categoryValue);

    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("category", categoryValue);

    if (search.keyword.trim().length > 0) {
      nextSearchParams.set("searchType", search.type);
      nextSearchParams.set("searchKeyword", search.keyword);
    }

    nextSearchParams.set("page", 1);
    setSearchParams(nextSearchParams);
  }

  return (
    <Box width="100%">
      <BoardCategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />

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
          placeholder="검색어를 입력해 주세요."
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearchClick();
            }
          }}
          width="60%"
          mt={6}
        />
        <Button mt={6} onClick={handleSearchClick}>
          검색
        </Button>
      </HStack>

      {boardList.length > 0 ? (
        <Box>
          <Flex justifyContent="flex-end" alignItems="center">
            {isAuthenticated && (
              <Button mb={4} onClick={handleWriteClick}>
                게시물 쓰기
              </Button>
            )}
          </Flex>
          <hr />
          <Table.Root>
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
                  작성 일자
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
                      <Badge variant={"subtle"} colorPalette={"gray"} ml={2}>
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

          {count > 0 && (
            <PaginationRoot
              onPageChange={handlePageChange}
              count={count}
              pageSize={10}
              page={page}
            >
              <Flex justifyContent="center" mt={10}>
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
    </Box>
  );
}
