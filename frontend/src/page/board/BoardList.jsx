import { Box, Flex, HStack, Input, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";
import {
  NativeSelectField,
  NativeSelectRoot,
} from "../../components/ui/native-select.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState({ type: "all", keyword: "" });
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
  const page = Number(pageParam);

  function handleRowClick(boardId) {
    navigate(`/board/boardView/${boardId}`);
  }

  const handleWriteClick = () => {
    navigate("/board/boardAdd");
  };

  function handlePageChange(e) {
    const nextSearchParams = new URLSearchParams(searchParams);
    nextSearchParams.set("page", e.page);
    setSearchParams(nextSearchParams);
  }

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" mb={4}>
        <h3>게시물 목록</h3>
        <Button onClick={handleWriteClick}>게시물 쓰기</Button>
      </Flex>
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
          {boardList.length === 0 ? (
            <Table.Row>
              <Table.Cell colSpan={5} style={{ textAlign: "center" }}>
                게시물이 없습니다.
              </Table.Cell>
            </Table.Row>
          ) : (
            boardList.map((board) => (
              <Table.Row
                onClick={() => handleRowClick(board.boardId)}
                key={board.boardId}
              >
                <Table.Cell>{board.boardId}</Table.Cell>
                <Table.Cell>{board.title}</Table.Cell>
                <Table.Cell>{board.writer}</Table.Cell>
                <Table.Cell>{board.category}</Table.Cell>
                <Table.Cell>{board.createdAt}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table.Root>

      <HStack mt={4}>
        <NativeSelectRoot
          onChange={(e) => setSearch({ ...search, type: e.target.value })}
        >
          <NativeSelectField
            items={[
              { label: "전체", value: "all" },
              { label: "제목", value: "title" },
              { label: "본문", value: "content" },
              { label: "카테고리", value: "category" },
            ]}
          />
        </NativeSelectRoot>
        <Input
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
        />
        <Button>검색</Button>
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
