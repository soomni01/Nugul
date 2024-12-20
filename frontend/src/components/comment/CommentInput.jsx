import { Box, Group, Textarea } from "@chakra-ui/react";
import { Button } from "../ui/button.jsx";
import { useContext, useState } from "react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { IoIosSend } from "react-icons/io";

export function CommentInput({ boardId, onSaveClick }) {
  const [comment, setComment] = useState("");
  const { isAuthenticated } = useContext(AuthenticationContext);

  return (
    <Box>
      <Group attached w={"100%"}>
        <Textarea
          value={comment}
          disabled={!isAuthenticated}
          placeholder={
            isAuthenticated
              ? "댓글을 작성하세요"
              : "로그인 후 댓글을 남겨주세요."
          }
          onChange={(e) => setComment(e.target.value)}
          h="112px" // 높이 110px 설정
          border="1px solid" // 테두리 추가
          borderColor="gray.300" // 테두리 색상 설정
        />
        <Button
          h={"110px"}
          disabled={!isAuthenticated || !comment.trim()}
          onClick={() => {
            setComment("");
            onSaveClick(comment);
          }}
          variant={"surface"}
          colorPalette={"blue"}
          borderColor="gray.300" // 테두리 색상 설정
          ml={0.5}
        >
          <IoIosSend />
        </Button>
      </Group>
    </Box>
  );
}
