import {
  Box,
  Flex,
  HStack,
  Image,
  Input,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
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
import { BoardCategories } from "../../components/category/BoardCategoryContainer.jsx";

// 미리보기 이미지 생성 함수
const generatePreviewFiles = (files) => {
  const previewList = files.map((file) => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = () => resolve({ name: file.name, src: reader.result });
      reader.readAsDataURL(file);
    });
  });

  return Promise.all(previewList);
};

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
  const [previewFiles, setPreviewFiles] = useState([]);
  const [fileInputInvalid, setFileInputInvalid] = useState(false);

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

  const { id, isAuthenticated, hasAccess } = useContext(AuthenticationContext);

  const { boardId } = useParams();
  const navigate = useNavigate();

  const handleViewClick = () => {
    navigate(`/board/boardView/${boardId}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    // id가 존재하지 않으면 액세스를 체크하지 않도록 설정
    if (!id) {
      return; // id가 없으면 게시물 조회를 하지 않음
    }
    axios
      .get(`/api/board/boardView/${boardId}`)
      .then((res) => {
        const boardData = res.data;
        setBoard(boardData);
        console.log(boardData);

        if (!hasAccess(boardData.memberId)) {
          navigate("/board/list"); // 작성자가 아니라면 목록 페이지로 리디렉션
          return;
        }
      })
      .catch(() => {
        console.log("게시물 조회 실패");
        navigate("/board/list");
      });
  }, [boardId, id, navigate]);

  const handleRemoveSwitchClick = (checked, fileName) => {
    if (checked) {
      setRemoveFiles([...removeFiles, fileName]);
    } else {
      setRemoveFiles(removeFiles.filter((f) => f !== fileName));
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);

    // 기존 업로드 파일과 통합
    const filteredFiles = files.filter(
      (file) =>
        !uploadFiles.some((uploadedFile) => uploadedFile.name === file.name),
    );

    // 파일 크기 체크 (10MB 초과 체크)
    const invalidFiles = filteredFiles.filter(
      (file) => file.size > 10 * 1024 * 1024,
    ); // 10MB 초과

    if (filteredFiles.length < files.length) {
      toaster.create({
        type: "warning",
        description: "중복된 파일은 제외되었습니다.",
      });
    }

    // 파일 크기 제한 초과 여부 설정
    setFileInputInvalid(invalidFiles.length > 0);

    setUploadFiles((prev) => [...prev, ...filteredFiles]);

    // 미리보기 이미지 생성
    generatePreviewFiles(filteredFiles).then((previews) => {
      setPreviewFiles((prev) => [...prev, ...previews]);
    });
  };

  const handlePreviewImageClick = (index) => {
    setPreviewFiles(previewFiles.filter((_, i) => i !== index));
    setUploadFiles(uploadFiles.filter((_, i) => i !== index));
  };

  const handleSaveClick = () => {
    setProgress(true);

    // 기존 파일과 삭제할 파일 업데이트
    const remainingFiles = board.fileList.filter(
      (file) => !removeFiles.includes(file.name),
    );

    axios
      .putForm("/api/board/boardUpdate", {
        boardId: board.boardId,
        title: board.title,
        content: board.content,
        category: board.category,
        removeFiles,
        uploadFiles,
        remainingFiles,
      })
      .finally(() => {
        setProgress(false);
        setDialogOpen(false);
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        console.log(board);
        navigate(`/board/boardView/${boardId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          type: message.type,
          description: message.text,
        });
      });
  };

  if (board === null) {
    return <Spinner />;
  }

  const disabled = !(
    board.title.trim().length > 0 && board.content.trim().length > 0
  );

  return (
    <Box border="1px solid #ccc" borderRadius="8px" p={2} m={2}>
      <h3>{boardId}번 게시물 수정</h3>
      <hr />
      <Stack gap={5}>
        <Box
          border="1px solid #ccc"
          borderRadius="4px"
          display="flex"
          alignItems="center"
          p={1}
        >
          <Box borderRight="1px solid #ccc" padding="2px">
            <select
              value={board.category} // board.category로 수정
              onChange={(e) => setBoard({ ...board, category: e.target.value })}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                height: "30px",
                padding: "0 8px",
              }}
            >
              {BoardCategories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Box>
          <Input
            value={board.title}
            placeholder="제목을 수정하세요"
            onChange={(e) => setBoard({ ...board, title: e.target.value })}
          />
        </Box>
        <ReactQuill
          style={{
            width: "100%",
            height: "400px",
            maxHeight: "auto",
            marginBottom: "40px",
            fontSize: "16px",
          }}
          placeholder="본문 내용을 수정하세요"
          value={board.content}
          onChange={(content) => setBoard({ ...board, content })}
          modules={modules}
        />
        <ImageView
          files={board.fileList}
          onRemoveSwitchClick={handleRemoveSwitchClick}
        />
        <Box>
          <input
            onChange={handleFileInputChange}
            type={"file"}
            multiple
            accept={"image/*"}
          />
          <Text color="gray" mt={"4px"}>
            최대 10MB 까지 업로드할 수 있습니다.
          </Text>
          {fileInputInvalid && (
            <Text color="red" mt={2}>
              파일 크기가 너무 큽니다. 최대 10MB 까지 업로드할 수 있습니다.
            </Text>
          )}
        </Box>

        <Box>
          <Flex wrap="wrap" gap={4}>
            {previewFiles.map((preview, index) => (
              <Box
                key={preview.name}
                border="1px solid #ccc"
                borderRadius="8px"
                p={2}
                cursor="pointer"
                onClick={() => handlePreviewImageClick(index)}
              >
                <Image
                  src={preview.src}
                  alt={preview.name}
                  boxSize="100px"
                  objectFit="cover"
                />
                <Text isTruncated>{preview.name}</Text>
              </Box>
            ))}
          </Flex>
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
