import { Box, Flex, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { useNavigate } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => res.data)
      .then((data) => setBoardList(data));
  }, []);

  function handleRowClick(boardId) {
    navigate(`/board/boardView/${boardId}`);
  }

  const handleWriteClick = () => {
    navigate("/board/boardAdd");
  };

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
    </Box>
  );
}
