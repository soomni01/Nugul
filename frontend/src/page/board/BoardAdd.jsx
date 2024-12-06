import { Box, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function BoardAdd() {
  const { isAuthenticated, logout } = useContext(AuthenticationContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" }); // 메시지 상태 관리
  const [progress, setProgress] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      logout(); // 자동 로그아웃 처리
      toaster.create({
        description: "글쓰기 권한이 없습니다. 로그인 하셔야 합니다.",
        type: "error", // "error" type 설정
      });
      navigate("/"); // 로그인 페이지로 리디렉션
    }
  }, [isAuthenticated, logout, navigate]);

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
          // 403 오류 처리
          if (e.response && e.response.status === 403) {
            const message = e.response.data.message; // 서버에서 보낸 메시지
            toaster.create({
              description: message.text, // 서버에서 보낸 오류 메시지
              type: message.type, // 오류 타입
            });
          } else {
            // 다른 오류 처리
            toaster.create({
              description: "오류가 발생했습니다. 다시 시도해 주세요.",
              type: "error",
            });
          }
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
