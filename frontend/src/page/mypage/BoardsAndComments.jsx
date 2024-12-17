import React, { useContext, useEffect, useState } from "react";
import { TfiWrite } from "react-icons/tfi";
import { LuFolder } from "react-icons/lu";
import {
  Badge,
  Box,
  Flex,
  Heading,
  HStack,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { FaCommentDots } from "react-icons/fa";
import { BoardCategories } from "../../components/category/BoardCategoryContainer.jsx";
import { useNavigate } from "react-router-dom";
import {
  PaginationItems,
  PaginationNextTrigger,
  PaginationPrevTrigger,
  PaginationRoot,
} from "../../components/ui/pagination.jsx";

export function BoardsAndComments() {
  const { id } = useContext(AuthenticationContext);
  const [boards, setBoards] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [totalBoards, setTotalBoards] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [boardPage, setBoardPage] = useState(1); // 초기값은 1
  const [commentPage, setCommentPage] = useState(1); // 초기값은 1
  const [activeTab, setActiveTab] = useState("posts"); // 기본값은 'posts'

  const getCategoryLabel = (value) => {
    const category = BoardCategories.find((cat) => cat.value === value);
    return category ? category.label : value;
  };

  useEffect(() => {
    if (!id) return;
    const controller = new AbortController();

    setLoading(true);

    axios
      .get(`/api/board/boardsAndComments/${id}`, {
        params: {
          boardPages: boardPage,
          commentPages: commentPage,
          tab: activeTab,
        },
      })
      .then((response) => {
        setBoards(response.data.boards);
        setComments(response.data.comments);
        setTotalBoards(response.data.totalBoardCount);
        setTotalComments(response.data.totalCommentCount);
      })
      .catch((error) => {
        console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
        alert(
          "데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [id, boardPage, commentPage, activeTab]);

  const handlePageChange = (e, tab) => {
    if (tab === "posts") {
      setBoardPage(e.page);
    } else if (tab === "comments") {
      setCommentPage(e.page);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const handlePostClick = (boardId) => {
    navigate(`/board/boardView/${boardId}`);
  };

  const handleCommentClick = (boardId) => {
    navigate(`/board/boardView/${boardId}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box>
      {/* 탭 버튼들 */}
      <HStack spacing={6} mb={6}>
        <Box
          as="button"
          onClick={() => handleTabChange("posts")}
          p={4}
          borderBottom={activeTab === "posts" ? "2px solid teal" : "none"}
          _hover={{ cursor: "pointer", color: "teal.500" }}
        >
          <TfiWrite style={{ marginRight: "8px" }} />
          작성한 게시물
        </Box>
        <Box
          as="button"
          onClick={() => handleTabChange("comments")}
          p={4}
          borderBottom={activeTab === "comments" ? "2px solid teal" : "none"}
          _hover={{ cursor: "pointer", color: "teal.500" }}
        >
          <LuFolder style={{ marginRight: "8px" }} />
          작성한 댓글
        </Box>
      </HStack>

      {/* 게시물 정보 */}
      {activeTab === "posts" && (
        <Box>
          <Heading as="h3" mb={4} fontSize="xl" color="teal.500">
            작성한 게시물
          </Heading>
          {boards.length > 0 ? (
            <VStack spacing={4} align="start" mb={6}>
              {boards.map((board) => (
                <Box
                  key={board.boardId}
                  p={4}
                  border="1px"
                  borderRadius="md"
                  borderColor="gray.200"
                  w="100%"
                  bg="gray.50"
                  cursor="pointer"
                  onClick={() => handlePostClick(board.boardId)}
                >
                  <Flex justify="space-between" align="center">
                    <Box>
                      <Text fontWeight="bold">
                        {board.title}
                        <Badge variant="subtle" colorScheme="green">
                          <FaCommentDots />
                          {board.countComment}
                        </Badge>
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {getCategoryLabel(board.category)} | {board.createdAt}
                      </Text>
                    </Box>
                  </Flex>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text color="gray.500">
              작성한 게시물이 없습니다. 첫 게시물을 작성해 보세요!
            </Text>
          )}
          {boards.length > 0 && (
            <PaginationRoot
              onPageChange={(e) => handlePageChange(e, "posts")}
              count={totalBoards}
              pageSize={6}
              page={boardPage}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          )}
        </Box>
      )}

      {/* 댓글 정보 */}
      {activeTab === "comments" && (
        <Box>
          <Heading as="h3" mb={4} fontSize="xl" color="teal.500">
            작성한 댓글
          </Heading>
          {comments.length > 0 ? (
            <Box as="ul" pl={0}>
              {comments.map((comment) => {
                const relatedBoard = boards.find(
                  (board) => board.boardId === comment.boardId,
                );
                return (
                  <Box
                    as="li"
                    key={comment.commentId}
                    listStyleType="none"
                    mb={4}
                    p={4}
                    border="1px"
                    borderRadius="md"
                    borderColor="gray.200"
                    w="100%"
                    bg="gray.50"
                    cursor="pointer"
                    onClick={() => handleCommentClick(comment.boardId)}
                  >
                    <Box>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        <strong>{comment.boardTitle}</strong>
                      </Text>
                      <Text fontSize="sm" color="gray.500" mb={1}>
                        {getCategoryLabel(comment.boardCategory)} |{" "}
                        {comment.boardInserted}
                      </Text>
                    </Box>
                    <Text bg="skyblue" p={2} borderRadius="md" fontSize="sm">
                      {comment.comment}
                    </Text>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Text color="gray.500">작성한 댓글이 없습니다.</Text>
          )}
          {comments.length > 0 && (
            <PaginationRoot
              onPageChange={(e) => handlePageChange(e, "comments")}
              count={totalComments}
              pageSize={6}
              page={commentPage}
            >
              <HStack>
                <PaginationPrevTrigger />
                <PaginationItems />
                <PaginationNextTrigger />
              </HStack>
            </PaginationRoot>
          )}
        </Box>
      )}
    </Box>
  );
}
