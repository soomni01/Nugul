import {Box, Text} from "@chakra-ui/react";
import { CommentItem } from "./CommentItem.jsx";

// 댓글이 하나도 없으면 > 출력할게 없어서  오류 뜸
export function CommentList({
                              boardId,
                              commentList,
                              onDeleteClick,
                              onEditClick,
                            }) {
  console.log(commentList);

  return (
      <Box>
        {commentList.length === 0 ? (
            <Text>댓글이 없습니다</Text>
        ) : (
            commentList.map((comment) => (
                <CommentItem
                    key={comment.commentId}
                    comment={comment}
                    onDeleteClick={onDeleteClick}
                    onEditClick={onEditClick}
                />
            ))
        )}
      </Box>
  );
}
