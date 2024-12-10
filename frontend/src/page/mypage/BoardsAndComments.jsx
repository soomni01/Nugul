import React, { useEffect, useState, useContext } from "react";
import { TfiWrite } from "react-icons/tfi"; // 작성한 게시물 아이콘
import { LuFolder } from "react-icons/lu"; // 작성한 댓글 아이콘
import {Spinner, Tabs, Box, Heading, VStack, Text, Flex, Badge} from "@chakra-ui/react";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import {FaCommentDots} from "react-icons/fa";

export function BoardsAndComments() {
    const { id } = useContext(AuthenticationContext); // 로그인한 사용자 ID
    const [boards, setBoards] = useState([]); // 작성한 게시물 상태
    const [comments, setComments] = useState([]); // 작성한 댓글 상태
    const [loading, setLoading] = useState(true); // 로딩 상태

    useEffect(() => {
        if (!id) return; // 로그인하지 않은 경우 데이터 요청 생략

        setLoading(true);

        axios
            .get(`/api/board/boardsAndComments/${id}`)
            .then((response) => {
                setBoards(response.data.boards); // 게시물 데이터 설정
                setComments(response.data.comments); // 댓글 데이터 설정
            })
            .catch((error) => {
                console.error("데이터를 불러오는 중 오류가 발생했습니다:", error);
                alert("데이터를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.");
            })
            .finally(() => {
                setLoading(false); // 로딩 완료
            });
    }, [id]);

    if (!id) {
        return <Spinner />;
    }

    return (
        <Tabs.Root defaultIndex={0}>
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

            {/* 게시물 정보와 댓글 수 표시 */}
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
                                >
                                    {/* 게시물 정보 */}
                                    <Flex justify="space-between" align="center">
                                        <Box>
                                            <Text fontWeight="bold">{board.boardId} : {board.title} <Badge variant={"subtle"} colorPalette={"green"}>
                                                <FaCommentDots />
                                                {board.countComment}
                                            </Badge></Text>
                                            <Text fontSize="sm" color="gray.500">{board.category} | {board.createdAt}</Text>
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
                </Box>
            </Tabs.Content>

            {/* 작성한 댓글 탭 */}
            <Tabs.Content value="comments">
                <Box>
                    <Heading as="h3" mb={4} fontSize="xl" color="teal.500">
                        작성한 댓글
                    </Heading>
                    <VStack spacing={4} align="start">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <Box
                                    key={comment.commentId}
                                    p={4}
                                    border="1px"
                                    borderRadius="md"
                                    borderColor="gray.200"
                                    w="100%"
                                    bg="gray.50"
                                >
                                    <Text>{comment.comment}</Text>
                                </Box>
                            ))
                        ) : (
                            <Text color="gray.500">작성한 댓글이 없습니다.</Text>
                        )}
                    </VStack>
                </Box>
            </Tabs.Content>
        </Tabs.Root>
    );
}
