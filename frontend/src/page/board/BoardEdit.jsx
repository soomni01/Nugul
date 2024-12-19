import { Box, HStack, Image, Input, Spinner, Stack } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
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
import { Switch } from "../../components/ui/switch.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function ImageView({ files, onRemoveSwitchClick }) {
  return (
    <Box>
      {files.map((file) => (
        <HStack key={file.name}>
          <Switch
            colorPalette={"red"}
            onCheckedChange={(e) => onRemoveSwitchClick(e.checked, file.name)}
          />
          <Image border={"1px solid black"} m={5} src={file.src} />
        </HStack>
      ))}
    </Box>
  );
}

export function BoardEdit() {
  const [board, setBoard] = useState(null);
  const [progress, setProgress] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [uploadFiles, setUploadFiles] = useState([]);

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["link"],
      ["image"],
      ["blockquote"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const { id, isAuthenticated, hasAccess, nickname } = useContext(
    AuthenticationContext,
  );

  const { boardId } = useParams();
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/board/boardView/${boardId}`);
  };

  useEffect(() => {
    axios
      .get(`/api/board/boardView/${boardId}`)
      .then((res) => {
        const boardData = res.data;
        setBoard(boardData);

        // 2. 작성자 확인
        const isWriter = String(boardData.memberId) === String(id);

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

  const handleRemoveSwitchClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };
  console.log("지울파일목록", removeFiles);

  const handleSaveClick = () => {
    setProgress(true);
    axios
      .putForm("/api/board/boardUpdate", {
        boardId: board.boardId,
        title: board.title,
        content: board.content,
        removeFiles,
        uploadFiles,
      })
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
    <Box border="1px solid #ccc" borderRadius="8px" p={2}>
      <h3>{boardId}번 게시물 수정</h3>
      <hr />
      <Stack gap={5}>
        <Input
          value={board.title}
          placeholder="제목을 수정하세요"
          onChange={(e) => setBoard({ ...board, title: e.target.value })}
        />
        <ReactQuill
          style={{
            width: "100%",
            height: "400px", // 자동 크기 조정
            maxHeight: "auto", // 최대 높이 설정
            marginBottom: "20px", // 여백 조정
          }}
          placeholder="본문 내용을 수정하세요"
          value={board.content} // 수정된 내용을 반영
          onChange={(content) => setBoard({ ...board, content })}
          modules={modules} // 툴바 설정
        />
        <ImageView
          files={board.fileList}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />
        <Box>
          <Box>
            <input
              onChange={(e) => setUploadFiles(e.target.files)}
              type={"file"}
              multiple
              accept={"image/*"}
            />
          </Box>
          <Box>
            {Array.from(uploadFiles).map((file) => (
              <li key={file.name}>
                {file.name} ({Math.floor(file.size / 1024)} kb)
              </li>
            ))}
          </Box>
        </Box>
        {hasAccess(board.memberId) && (
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
        <Box>
          <Button onClick={handleViewClick}>수정 취소</Button>
        </Box>
      </Stack>
    </Box>
  );
}
