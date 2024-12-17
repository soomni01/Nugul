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
        />
        <Button
          h={55}
          disabled={!isAuthenticated || !comment.trim()}
          onClick={() => {
            setComment("");
            onSaveClick(comment);
          }}
          variant={"surface"}
          colorPalette={"blue"}
        >
          <IoIosSend />
        </Button>
      </Group>
    </Box>
  );
}
