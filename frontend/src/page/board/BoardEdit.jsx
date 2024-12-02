import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export function BoardEdit() {
  const { boardId } = useParams();
  return (
    <Box>
      <h3>{boardId}번 게시물 수정</h3>
    </Box>
  );
}
