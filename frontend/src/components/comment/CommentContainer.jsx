import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";
import {useEffect, useState} from "react";
import axios from "axios";
import {toaster} from "../ui/toaster.jsx";

export function CommentContainer({ boardId }) {
    const [commentList, setCommentList] = useState([]);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!processing) {
            axios
                .get(`/api/comment/commentList/${boardId}`)
                .then((res) => res.data)
                .then((data) => setCommentList(data));
        }
    }, [processing]);

    function handleSaveClick(comment) {
        setProcessing(true);
        axios
            .post("/api/comment/commentAdd", {
                boardId: boardId,
                comment: comment,
            }).then((res)=>res.data.message)
            .then((message)=>{
                toaster.create({
                    type: message.type,
                    description: message.text,
                })
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    function handleDeleteClick(commentId) {
        setProcessing(true);
        axios.delete(`/api/comment/remove/${commentId}`)
            .then((res)=> res.data.message)
            .then((message)=>{
                toaster.create({
                    type: message.type,
                    description: message.text,
                })
            })
            .finally(() => {
                setProcessing(false);
            });
    }

    function handleEditClick(commentId, comment) {
        setProcessing(true);
        axios.put(`/api/comment/commentEdit`, { commentId, comment }).finally(() => {
            setProcessing(false);
        })
            .then((res)=> res.data.message)
            .then((message)=>{
                toaster.create({
                    type: message.type,
                    description: message.text,
                })
            })
            .finally(()=>{
                setProcessing(false)
            });
    }

    return (
        <Box>
            <Stack gap={5}>
                <h3>댓글</h3>
                <CommentInput boardId={boardId} onSaveClick={handleSaveClick} />
                <Box
                    css={{
                        maxHeight: "200px",   // 원하는 최대 높이를 설정
                        overflowY: "auto",    // 세로 스크롤 활성화
                    }}>
                    <CommentList
                        boardId={boardId}
                        commentList={commentList}
                        onDeleteClick={handleDeleteClick}
                        onEditClick={handleEditClick}
                    />
                </Box>
            </Stack>
        </Box>
    );
}