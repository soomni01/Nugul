import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function BoardAdd() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(false);

  const navigate = useNavigate();

  const handleSaveClick = () => {
    setProgress(true);
    axios
      .post("/api/board/boardAdd", {
        title,
        content,
        category,
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;

        toaster.create({
          description: message.text,
          type: message.type,
        });

        navigate(`/board/boardView/${data.data.boardId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
      })
      .finally(() => {
        setProgress(false);
      });
  };

  const disabled = !(title.trim().length > 0 && content.trim().length > 0);

  return (
    <Box>
      <h3>게시글 쓰기</h3>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </Field>

        <Field label={"카테고리"}>
          <Input
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
            }}
          />
        </Field>
        <Box>
          <Button
            disabled={disabled}
            loading={progress}
            onClick={handleSaveClick}
          >
            저장
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
