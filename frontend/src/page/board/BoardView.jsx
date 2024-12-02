import { Box, Input, Spinner, Stack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";

export function BoardView() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);

  useEffect(() => {
    axios.get(`api/board/view/${boardId}`).then((res) => setBoard(res.data));
  }, []);

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <h3>{boardId}게시글</h3>
      <Stack gap={5}>
        <Field label={"제목"} readOnly>
          <Input value={board.title} />
        </Field>
        <Field label={"본문"} readOnly>
          <Input value={board.content} />
        </Field>
        <Field label="작성자" readOnly>
          <Input value={board.writer} />
        </Field>
        <Field label={"카테고리"} readOnly>
          <Input value={board.category} />
        </Field>
        <Field label={"작성날짜"} readOnly>
          <Input type={"date"} value={board.createdAt} />
        </Field>
      </Stack>
    </Box>
  );
}
