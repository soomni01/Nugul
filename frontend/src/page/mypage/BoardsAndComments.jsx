import React, { useEffect, useState, useContext } from "react";
import { TfiWrite } from "react-icons/tfi"; // 작성한 게시물 아이콘
import { LuFolder } from "react-icons/lu"; // 작성한 댓글 아이콘
import {Spinner, Box, Heading, VStack, Text, Flex, Badge, Tabs, HStack} from "@chakra-ui/react";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { FaCommentDots } from "react-icons/fa";
import { BoardCategories } from "../../components/board/BoardCategories.jsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {
    PaginationItems,
    PaginationNextTrigger,
    PaginationPrevTrigger,
    PaginationRoot
} from "../../components/ui/pagination.jsx";  // useNavigate 임포트

export function BoardsAndComments() {
    const { id } = useContext(AuthenticationContext); // 로그인한 사용자 ID
    const [boards, setBoards] = useState([]); // 작성한 게시물 상태
    const [comments, setComments] = useState([]); // 작성한 댓글 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const navigate = useNavigate();  // navigate 훅 사용
    const [searchParams, setSearchParams] = useSearchParams();
    const [totalBoards, setTotalBoards] = useState(0);
    const [totalComments, setTotalComments] = useState(0)

    // category 값에 해당하는 label을 반환하는 함수
    const getCategoryLabel = (value) => {
        const category = BoardCategories.find((cat) => cat.value === value);
        return category ? category.label : value; // 해당 value가 없으면 value 자체 반환
    };

    useEffect(() => {
        if (!id) return; // 로그인하지 않은 경우 데이터 요청 생략
        const controller = new AbortController();

        setLoading(true);

        axios
            .get(`/api/board/boardsAndComments/${id}`,{
                params: searchParams,
            })
            .then((response) => {
                setBoards(response.data.boards); // 게시물 데이터 설정
                setComments(response.data.comments); // 댓글 데이터 설정
                setTotalBoards(response.data.totalBoardCount); // 총 게시물 수
                setTotalComments(response.data.totalCommentCount); // 총 댓글 수
            })
            .catch((error) => {
                console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
                alert("데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            })
            .finally(() => {
                setLoading(false); // 로딩 완료
            });
        return () => {
            controller.abort();
        };
    }, [id,searchParams]);

    // page 번호
    const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
    const page = Number(pageParam);

    function handlePageChange(e) {
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set("page", e.page);
        setSearchParams(nextSearchParams);
    }

    if (!id || loading) {
        return <Spinner />;
    }

    // 게시물 클릭 시 해당 게시물 상세 페이지로 이동
    const handlePostClick = (boardId) => {
        navigate(`/board/boardView/${boardId}`);  // 게시물 상세 페이지로 이동
    };

    // 댓글 클릭 시 해당 게시물 상세 페이지로 이동
    const handleCommentClick = (boardId) => {
        navigate(`/board/boardView/${boardId}`);  // 댓글이 속한 게시물 상세 페이지로 이동
    };

    return (
        <Tabs.Root defaultValue="posts">
            {/* 탭 목록 */}
            <Tabs.List>
                <Tabs.Trigger value="posts">
                    <TfiWrite style={{ marginRight: "8px" }} />
                    작성한 게시물
                </Tabs.Trigger>
                <Tabs.Trigger value="comments">
                    <LuFolder style={{ marginRight: "8px" }} />
                    작성한 댓글
                </Tabs.Trigger>
            </Tabs.List>

            {/* 게시물 정보 */}
            <Tabs.Content value="posts">
                <Box>
                    <Heading as="h3" mb={4} fontSize="xl" color="teal.500">
                        작성한 게시물
                    </Heading>
                    <VStack spacing={4} align="start" mb={6}>
                        {boards.length > 0 ? (
                            boards.map((board) => (
                                <Box
                                    key={board.boardId}
                                    p={4}
                                    border="1px"
                                    borderRadius="md"
                                    borderColor="gray.200"
                                    w="100%"
                                    bg="gray.50"
                                    cursor="pointer"  // 클릭 가능한 영역으로 표시
                                    onClick={() => handlePostClick(board.boardId)}  // 게시물 클릭 시 이동
                                >
                                    {/* 게시물 정보 */}
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
                            ))
                        ) : (
                            <Text color="gray.500">
                                작성한 게시물이 없습니다. 첫 게시물을 작성해 보세요!
                            </Text>
                        )}
                    </VStack>
                    <PaginationRoot onPageChange={handlePageChange} count={totalBoards} pageSize={10} page={page}>
                        <HStack>
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </Box>
            </Tabs.Content>

            {/* 댓글 정보 */}
            <Tabs.Content value="comments">
                <Box>
                    <Heading as="h3" mb={4} fontSize="xl" color="teal.500">
                        작성한 댓글
                    </Heading>
                    {comments.length > 0 ? (
                        <Box as="ul" pl={0}>
                            {comments.map((comment) => {
                                // 각 댓글에 해당하는 게시물 찾기
                                const relatedBoard = boards.find(board => board.boardId === comment.boardId);
                                return (
                                    <Box
                                        as="li"
                                        key={comment.commentId}
                                        listStyleType="none"
                                        mb={4}
                                        p={4} // 댓글 외부 여백
                                        border="1px" // 테두리 설정
                                        borderRadius="md" // 둥근 모서리
                                        borderColor="gray.200" // 테두리 색상
                                        w="100%" // 너비 100%
                                        bg="gray.50" // 배경색 설정
                                        cursor="pointer"  // 클릭 가능한 영역으로 표시
                                        onClick={() => handleCommentClick(comment.boardId)}  // 댓글 클릭 시 게시물 상세 페이지로 이동
                                    >
                                        {/* 게시물 제목 한 줄 */}
                                        {relatedBoard && (
                                            <Text fontSize="sm" color="gray.500" mb={1}>
                                                <strong>{relatedBoard.title}</strong>
                                            </Text>
                                        )}

                                        {/* 게시물 카테고리와 작성일 두 줄 */}
                                        {relatedBoard && (
                                            <Text fontSize="sm" color="gray.500" mb={1}>
                                                {getCategoryLabel(relatedBoard.category)} | {relatedBoard.createdAt}
                                            </Text>
                                        )}

                                        {/* 댓글 본문 (하늘색 배경) */}
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
                    <PaginationRoot onPageChange={handlePageChange} count={totalComments} pageSize={10} page={page}>
                        <HStack>
                            <PaginationPrevTrigger />
                            <PaginationItems />
                            <PaginationNextTrigger />
                        </HStack>
                    </PaginationRoot>
                </Box>
            </Tabs.Content>

        </Tabs.Root>
    );
}
