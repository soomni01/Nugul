import { Box, Flex, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [boardId, setBoardID] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const [category, setCategory] = useState("");
  const [creatAt, setCreatAt] = useState("");

  useEffect(() => {
    axios
      .get("/api/board/list")
      .then((res) => res.data)
      .then((data) => setBoardList(data))
      .catch((error) => {
        console.error("게시물 목록을 가져오는 중 에러가 발생했습니다.", error);
        alert("게시물 목록을 불러오지 못했습니다.");
      });
  }, []);

  const handleWriteClick = () => {
    axios.post("/api/boardAdd", {
      boardId,
      title,
      content,
      writer,
      category,
      creatAt,
    });
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
              <Table.Row key={board.boardId}>
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
