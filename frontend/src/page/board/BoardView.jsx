import { Box, Spinner, Stack, Text } from "@chakra-ui/react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
  const location = useLocation(); // URL에서 쿼리 파라미터를 읽기 위해 사용

  // URL에서 category 쿼리 파라미터를 읽어서 selectedCategory를 설정
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get("category") || "all"; // 기본값은 "all"
    setSelectedCategory(categoryFromUrl);
  }, [location]);

  // 게시글 데이터를 불러오기
  useEffect(() => {
    axios.get(`/api/board/boardView/${boardId}`).then((res) => {
      setBoard(res.data);
      setSelectedCategory(res.data.category || "all");
    });
  }, [boardId]);

  // 게시글이 로딩 중일 때 Spinner 표시
  if (!board) {
    return <Spinner />;
  }

  // 게시글 삭제 핸들러
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

  // 카테고리 선택 핸들러
  const handleCategorySelect = (categoryValue) => {
    setSelectedCategory(categoryValue);
    if (categoryValue === "all") {
      navigate(`/board/list`); // "전체" 카테고리로 이동
    } else {
      navigate(`/board/list?category=${categoryValue}`); // 선택된 카테고리로 이동
    }
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
                  maxH="100%"
                >
                  <img
                    src={file.src}
                    alt={file.name}
                    style={{
                      width: "100%", // 이미지 너비
                      height: "100%", // 이미지 높이
                      objectFit: "cover",
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
