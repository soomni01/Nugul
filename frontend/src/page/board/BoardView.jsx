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
import styled from "@emotion/styled";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [imageSizes, setImageSizes] = useState([]); // 이미지 크기 상태 배열 추가
  const navigate = useNavigate();
  const { hasAccess } = useContext(AuthenticationContext);
  const location = useLocation(); // URL에서 쿼리 파라미터를 읽기 위해 사용

  const StyledQuill = styled(ReactQuill)`
    .ql-container {
      border: none !important;
    }

    .ql-editor {
      border: none !important;
    }
  `;

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
      console.log("선택된 카테고리:", categoryValue); // 상태 변경 전 출력
    } else {
      console.log("선택된 카테고리:", categoryValue);
      navigate(`/board/list?category=${categoryValue}`); // 선택된 카테고리로 이동
    }
  };

  // 이미지 로딩 후 크기 설정
  const handleImageLoad = (index, e) => {
    const newImageSizes = [...imageSizes];
    newImageSizes[index] = {
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    };
    setImageSizes(newImageSizes);
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
          <StyledQuill
            value={board.content || ""}
            readOnly
            modules={{ toolbar: false }}
            style={{
              width: "100%",
              height: "auto",
              minHeight: "auto",
              maxHeight: "auto",
            }}
          />

          {/* 이미지 표시 */}
          {board.fileList && (
            <Box>
              {board.fileList.map((file, index) => (
                <Box
                  key={file.name}
                  border="1px solid black"
                  m={3}
                  overflow="hidden"
                  maxW="100%"
                  maxH="100%"
                  width={`${imageSizes[index]?.width || 500}px`} // 이미지 크기 동적으로 설정
                  height={`${imageSizes[index]?.height || 500}px`} // 이미지 크기 동적으로 설정
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <img
                    src={file.src}
                    alt={file.name}
                    onLoad={(e) => handleImageLoad(index, e)} // 이미지 로드 시 크기 계산
                    style={{
                      width: "100%", // Box에 맞게 크기 조정
                      height: "100%", // Box에 맞게 크기 조정
                      objectFit: "cover", // 비율 유지하며 꽉 채우기
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
