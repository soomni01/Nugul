import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import { useEffect, useState } from "react";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";
import { useSearchParams } from "react-router-dom";

export function CommentContainer({ boardId }) {
    const [commentList, setCommentList] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1); // 페이지 번호 상태

    useEffect(() => {
        // 페이지 번호를 쿼리 파라미터에서 가져옵니다
        const pageParam = searchParams.get("page") ? searchParams.get("page") : "1";
        setCurrentPage(Number(pageParam)); // 페이지 번호 업데이트

        if (!processing) {
            axios
                .get(`/api/comment/commentList/${boardId}`, {
                    params: { page: currentPage }, // 페이지 번호를 요청에 포함
                })
                .then((res) => res.data)
                .then((data) => setCommentList(data));
        }
    }, [processing, searchParams, boardId, currentPage]); // 페이지 번호, 검색 파라미터, 게시판 ID, 처리 상태가 변경될 때마다 실행

    const handlePageChange = (e) => {
        console.log(e.page); // 페이지 번호 확인
        const nextSearchParams = new URLSearchParams(searchParams);
        nextSearchParams.set("page", e.page); // URL에 페이지 번호 추가
        setSearchParams(nextSearchParams); // 검색 파라미터 업데이트
    };

    function handleSaveClick(comment) {
        setProcessing(true);
        axios
            .post("/api/comment/commentAdd", {
                boardId: boardId,
                comment: comment,
            })
            .then((res) => res.data.message)
            .then((message) => {
                toaster.create({
                    type: message.type,
                    description: message.text,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    function handleDeleteClick(commentId) {
        setProcessing(true);
        axios
            .delete(`/api/comment/remove/${commentId}`)
            .then((res) => res.data.message)
            .then((message) => {
                toaster.create({
                    type: message.type,
                    description: message.text,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    function handleEditClick(commentId, comment) {
        setProcessing(true);
        axios
            .put(`/api/comment/commentEdit`, { commentId, comment })
            .finally(() => {
                setProcessing(false);
            })
            .then((res) => res.data.message)
            .then((message) => {
                toaster.create({
                    type: message.type,
                    description: message.text,
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    return (
        <Box>
            <Stack gap={5}>
                <h3>댓글</h3>
                <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
                <CommentList
                    boardId={boardId}
                    commentList={commentList}
                    onDeleteClick={handleDeleteClick}
                    onEditClick={handleEditClick}
                    currentPage={currentPage} // 페이지 번호를 전달
                    handlePageChange={handlePageChange} // 페이지 변경 핸들러 전달
                />
            </Stack>
        </Box>
    );
}
