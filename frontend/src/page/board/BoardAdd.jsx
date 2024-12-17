import { Box, HStack, Input, Stack } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { BoardCategories } from "../../components/category/BoardCategoryContainer.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export function BoardAdd() {
  const { isAuthenticated, logout } = useContext(AuthenticationContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState(false);

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

  const navigate = useNavigate();

  //console.log(files);

  const handleListClick = () => {
    navigate("/board/list");
  };

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
      .postForm("/api/board/boardAdd", {
        title,
        content,
        category,
        files,
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
        if (e.response && e.response.status === 403) {
          const message = e.response.data.message;
          toaster.create({
            description: message.text,
            type: message.type,
          });
        } else {
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

  const disabled = !(
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    category.trim().length > 0
  );

  // files 의 파일명을 component 리스트로 만들기
  const filesList = [];
  for (const file of files) {
    filesList.push(
      <li>
        {file.name} ({Math.floor(file.size / 1024)} kb)
      </li>,
    );
  }

  return (
    <Box border="1px solid #ccc" borderRadius="8px" p={2}>
      <h3>게시글 쓰기</h3>
      <Stack gap={4}>
        <Box
          border="1px solid #ccc"
          borderRadius="4px"
          display="flex"
          alignItems="center"
          p={1}
        >
          <Box borderRight="1px solid #ccc" padding="2px">
            <select
              value={category || "all"}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                height: "30px", // 높이 조정
                padding: "0 8px", // 패딩 조정
              }}
            >
              {BoardCategories.map((cat) => (
                <option
                  key={cat.value}
                  value={cat.value}
                  disabled={cat.value === "all"}
                >
                  {cat.label}
                </option>
              ))}
            </select>
          </Box>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="카테고리 고르고 후 제목을 입력하세요"
            padding="0 8px" // 패딩을 줄여서 높이 조정
            fontSize="14px" // 폰트 크기 조정
            height="30px" // 높이 조정
            style={{ border: "none" }}
          />
        </Box>

        <Box mt={2}>
          {" "}
          {/* 마진 값 조정 */}
          <input
            onChange={(e) => setFiles(e.target.files)}
            type="file"
            accept="image/*"
            multiple
            style={{
              fontSize: "14px",
              height: "30px", // 파일 입력의 높이 조정
              marginTop: "10px", // 상단 여백 조정
            }}
          />
          <Box>{filesList}</Box>
        </Box>

        <ReactQuill
          style={{
            width: "100%",
            height: "auto", // 자동 크기 조정
            maxHeight: "600px", // 최대 높이 설정
            overflowY: "auto", // 내용이 많으면 세로 스크롤
            marginBottom: "10px", // 여백 조정
          }}
          value={content}
          onChange={(content) => setContent(content)}
          disabled={disabled}
          modules={modules}
          placeholder="본문 내용을 입력하세요"
        />

        <Box mt={4}>
          <HStack justify="flex-end" spacing={4}>
            <Button
              disabled={disabled}
              loading={progress}
              onClick={handleSaveClick}
            >
              저장
            </Button>
            <Button onClick={handleListClick}>글쓰기 취소</Button>
          </HStack>
        </Box>
      </Stack>
    </Box>
  );
}
