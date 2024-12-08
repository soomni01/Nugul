import { Box, HStack } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";
import { PaginationRoot, PaginationPrevTrigger, PaginationNextTrigger, PaginationItems } from "../ui/pagination.jsx";

export function CommentList({
                                boardId,
                                commentList,
                                onDeleteClick,
                                onEditClick,
                            }) {

    return (
        <Box>
            {commentList.map((comment) => (
                <CommentItem
                    key={comment.commentId}
                    comment={comment}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                />
            ))}
        </Box>
    );
}
