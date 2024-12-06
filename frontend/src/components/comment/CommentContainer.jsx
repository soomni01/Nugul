import { Box, Stack } from "@chakra-ui/react";
import { CommentInput } from "./CommentInput.jsx";
import { CommentList } from "./CommentList.jsx";

export function CommentContainer({ boardId }) {
  return (
    <Box>
      <Stack gap={5}>
        <h3>댓글</h3>
        <CommentInput boardId={boardId} />
        <CommentList boardId={boardId} />
      </Stack>
    </Box>
  );
}
