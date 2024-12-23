import { Box } from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

export function CommentList({
  boardId,
  commentList,
  onDeleteClick,
  onEditClick,
}) {
  console.log(commentList);

  return (
    <Box>
      {commentList.length > 0 &&
        commentList.map((comment) => (
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
