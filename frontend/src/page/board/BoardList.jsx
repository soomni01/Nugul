import {Badge, Box, Flex, HStack, Input, Table} from "@chakra-ui/react";
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
import {FaCommentDots} from "react-icons/fa";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [count, setCount] = useState(0);
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
        setBoardList(data.list);
        setCount(data.count);
      });

    return () => {
      controller.abort();
    };
  }, [searchParams]);

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
    if (search.keyword.trim().length > 0) {
      // 검색
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.set("searchType", search.type);
      nextSearchParam.set("searchKeyword", search.keyword);
      nextSearchParam.set("page", 1);
      setSearchParams(nextSearchParam);
    } else {
      // 검색 안함
      const nextSearchParam = new URLSearchParams(searchParams);
      nextSearchParam.delete("searchType");
      nextSearchParam.delete("searchKeyword");
      setSearchParams(nextSearchParam);
    }
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <h3>게시물 목록</h3>
        {isAuthenticated && (
          <Button onClick={handleWriteClick}>게시물 쓰기</Button>
        )}
      </Flex>
      {boardList.length > 0 ? (
        <Table.Root interactive>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>번호</Table.ColumnHeader>
              <Table.ColumnHeader>제목</Table.ColumnHeader>
              <Table.ColumnHeader>작성자</Table.ColumnHeader>
              <Table.ColumnHeader>카테고리</Table.ColumnHeader>
              <Table.ColumnHeader>작성날짜</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {boardList.map((board) => (
              <Table.Row
                onClick={() => handleRowClick(board.boardId)}
                key={board.boardId}
              >
                <Table.Cell>{board.boardId}</Table.Cell>
                <Table.Cell>
                  {board.title}
                  {board.countComment > 0 && (
                      <Badge variant={"subtle"} colorPalette={"green"}>
                        <FaCommentDots />
                        {board.countComment}
                      </Badge>
                  )}
                </Table.Cell>
                <Table.Cell>{board.writer}</Table.Cell>
                <Table.Cell>{board.category}</Table.Cell>
                <Table.Cell>{board.createdAt}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      ) : (
        <p>조회된 결과가 없습니다.</p>
      )}

      <HStack mt={4}>
        <Box>
          <select
            value={search.type}
            onChange={(e) => setSearch({ ...search, type: e.target.value })}
          >
            <option value={"all"}>전체</option>
            <option value={"title"}>제목</option>
            <option value={"content"}>본문</option>
            <option value={"category"}>카테고리</option>
          </select>
        </Box>
        <Input
          value={search.keyword}
          placeholder="검색 하세요"
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
        />
        <Button onClick={handleSearchClick}>검색</Button>
      </HStack>

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
    </Box>
  );
}
