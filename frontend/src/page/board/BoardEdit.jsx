import { Box, Input, Spinner, Stack, Textarea } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import {useContext, useEffect, useRef, useState} from "react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { id, isAuthenticated, hasAccess, nickname } = useContext(
    AuthenticationContext,
  );

  console.log("id:", id); // id 확인
  console.log("isAuthenticated:", isAuthenticated); // 로그인 상태 확인
  console.log("nickname:", nickname); // 닉네임 확인

  const { boardId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    axios
        .get(`/api/board/boardView/${boardId}`)
        .then((res) => {
          const boardData = res.data;
          setBoard(boardData);

          // 2. 작성자 확인
          const isWriter = String(boardData.writerId) === String(id);

          // 3. 작성자가 아니라면 처리
          if (!isWriter) {
            if (!isAuthenticated) {
              // 비로그인 상태
              toaster.create({
                type: "error",
                description: "로그인이 필요합니다. 로그인 후 수정할 수 있습니다.",
              });
              navigate("/"); // 로그인 페이지로 리디렉션
            } else {
              // 로그인했지만 작성자가 아닌 경우
              toaster.create({
                type: "error",
                description: "수정 권한이 없습니다. 작성자만 수정할 수 있습니다.",
              });
              navigate("/board/list"); // 목록 페이지로 리디렉션
            }
            return; // 더 이상 실행하지 않도록 종료
          }

          // 4. 작성자일 경우 정상적인 처리 추가
        })
        .catch(() => {
          console.log("게시물 조회 실패");
          navigate("/board/list"); // 오류 발생 시 목록 페이지로 리디렉션
        });
  }, [boardId, id, isAuthenticated, navigate]); // id, isAuthenticated가 변경될 때마다 실행



  const handleSaveClick = () => {
    setProgress(true);
    axios
      .put("/api/board/boardUpdate", board)
      .finally(() => {
        setProgress(true);
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate(`/board/boardView/${boardId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProgress(false);
        setDialogOpen(false);
      });
  };

  if (board === null) {
    return <Spinner />;
  }

  const disabled = !(
    board.title.trim().length > 0 && board.content.trim().length > 0
  );

  return (
    <Box>
      <h3>{boardId}번 게시물 수정</h3>
      <Stack gap={5}>
        <Field label={"제목"}>
          <Input
            value={board.title}
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Field>
        <Field label={"본문"}>
          <Textarea
            value={board.content}
            onChange={(e) => setBoard({ ...board, content: e.target.value })}
          />
        </Field>
        {hasAccess(board.writerId) && (
          <Box>
            <DialogRoot
              open={dialogOpen}
              onOpenChange={(e) => setDialogOpen(e.open)}
            >
              <DialogTrigger asChild>
                <Button
                  disabled={disabled}
                  colorPalette={"cyan"}
                  variant={"outline"}
                >
                  저장
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>저장 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{board.boardId}번 게시물을 수정하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button
                    loading={progress}
                    colorPalette={"blue"}
                    onClick={handleSaveClick}
                  >
                    저장
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
