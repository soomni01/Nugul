import React, { useContext, useEffect, useState } from "react";
import {
  Badge,
  Box,
  Flex,
  HStack,
  Image,
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
import { FaImages } from "react-icons/fa6";

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
    return category ? category.label : "전체"; // 카테고리가 없으면 "전체" 반환
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

  function formatDate(dateString) {
    return dateString.split("T")[0]; // "T"를 기준으로 날짜만 추출
  }

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
          <Flex alignItems="center">
            <Image
              src="/image/MyBoardList.png"
              alt="게시물 아이콘"
              width={6}
              height={6}
              style={{ marginRight: "8px" }}
            />
            <Text fontWeight="bold">작성한 게시물</Text>
          </Flex>
        </Box>
        <Box
          as="button"
          onClick={() => handleTabChange("comments")}
          p={4}
          borderBottom={activeTab === "comments" ? "2px solid teal" : "none"}
          _hover={{ cursor: "pointer", color: "teal.500" }}
        >
          <Flex alignItems="center">
            <Image
              src="/image/MyCommentList.png"
              alt="게시물 아이콘"
              width={6}
              height={6}
              style={{ marginRight: "8px" }}
            />
            <Text fontWeight="bold">작성한 댓글</Text>
          </Flex>
        </Box>
      </HStack>

      {/* 게시물 정보 */}
      {activeTab === "posts" && (
        <Box>
          {boards.length > 0 ? (
            <VStack spacing={4} align="start" mb={6}>
              {boards.map((board) => (
                <Box
                  key={board.boardId}
                  p={3}
                  mb={3}
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
                        <Badge variant="subtle" colorScheme="green" ml={2}>
                          <FaCommentDots />
                          {board.countComment}
                        </Badge>
                        <Badge variant={"subtle"} colorPalette={"gray"} ml={2}>
                          <FaImages />
                          {board.countFile}
                        </Badge>
                      </Text>
                      <Text fontSize="md" color="gray.500" mt={2}>
                        {getCategoryLabel(board.category)}{" "}
                        {board.category === "all" && (
                          <Text as="span" color="teal.500" fontWeight="bold">
                            전체
                          </Text>
                        )}
                        | {board.createdAt}
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
                        {formatDate(comment.boardInserted)}
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
