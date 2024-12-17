import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../../components/ui/button.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { CommentContainer } from "../../components/comment/CommentContainer.jsx";
import { BoardCategoryContainer } from "../../components/category/BoardCategoryContainer.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();
  const { hasAccess } = useContext(AuthenticationContext);

  useEffect(() => {
    axios.get(`/api/board/boardView/${boardId}`).then((res) => {
      setBoard(res.data);
      setSelectedCategory(res.data.category || "all");
    });
  }, [boardId]);

  if (!board) {
    return <Spinner />;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/board/boardDelete/${board.boardId}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/board/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    navigate(`/board/list?category=${categoryValue}`);
  };

  return (
    <Box mb={10}>
      {/* 카테고리 선택 */}
      <Box mb={5}>
        <BoardCategoryContainer
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />
      </Box>
      <Box p={5} border="1px solid #e2e8f0" borderRadius="lg">
        {/* 제목, 작성자, 날짜 */}
        <Box mb={5} borderBottom="1px solid #e2e8f0" pb={3}>
          <Text fontSize="2xl" fontWeight="bold" mb={2}>
            {board.title}
          </Text>
          <Text fontSize="md" color="gray.500">
            {board.writer} | {board.createdAt}
          </Text>
        </Box>

        {/* 본문 */}
        <Stack gap={5}>
          <ReactQuill
            value={board.content || ""}
            readOnly
            modules={{ toolbar: false }}
            style={{ width: "100%", height: "auto" }}
          />

          {/* 이미지 표시 */}
          {board.fileList && (
            <Box>
              {board.fileList.map((file) => (
                <Box
                  key={file.name}
                  border="1px solid black"
                  m={3}
                  overflow="hidden"
                  maxW="100%"
                  maxH="100%" // 이미지 높이를 고정
                >
                  <img
                    src={file.src}
                    alt={file.name}
                    style={{
                      width: "100%", // 너비를 100%로 설정
                      height: "100%", // 높이를 100%로 설정
                      objectFit: "cover", // 비율 유지 + 컨테이너 채우기
                      display: "block",
                    }}
                  />
                </Box>
              ))}
            </Box>
          )}

          {/* 삭제/수정 버튼 */}
          {hasAccess(board.memberId) && (
            <Box>
              <Button
                colorScheme="cyan"
                onClick={() => navigate(`/board/boardEdit/${board.boardId}`)}
                mr={3}
              >
                수정
              </Button>
              <Button colorScheme="red" onClick={handleDeleteClick}>
                삭제
              </Button>
            </Box>
          )}
        </Stack>

        {/* 댓글 컴포넌트 */}
        <hr style={{ margin: "20px 0" }} />
        <CommentContainer boardId={board.boardId} />
      </Box>
    </Box>
  );
}
