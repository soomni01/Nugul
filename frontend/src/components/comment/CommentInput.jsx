import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import {useContext, useState} from "react";
import axios from "axios";
import {AuthenticationContext} from "../context/AuthenticationProvider.jsx";

export function CommentInput({ boardId, onSaveClick }) {
    const [comment, setComment] = useState("");
    const { isAuthenticated } = useContext(AuthenticationContext);

    return (
        <Box>
            <Group>
                <Textarea
                    value={comment}
                    disabled={!isAuthenticated}
                    placeholder={isAuthenticated ? "댓글을 작성하세요" : "로그인 후 댓글을 남겨주세요."}
                    onChange={(e) => setComment(e.target.value)}
                />
                <Button
                    disabled={!isAuthenticated || !comment.trim()}
                    onClick={() => {
                    setComment("")
                    onSaveClick(comment)}}>댓글 쓰기</Button>
            </Group>
        </Box>
    );
}
