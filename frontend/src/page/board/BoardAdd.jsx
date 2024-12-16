import { Box, HStack, Input, Stack } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { BoardCategories } from "../../components/board/BoardCategoryContainer.jsx";
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

  console.log(files);

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
          <ReactQuill
            value={content}
            onChange={(content) => {
              setContent(content);
            }}
            modules={modules}
          />
        </Field>
        <Box>
          <input
            onChange={(e) => setFiles(e.target.files)}
            type={"file"}
            accept={"image/*"}
            multiple
          />
          <Box>{filesList}</Box>
        </Box>
        <Field label={"카테고리"}>
          <HStack>
            <Box border="1px solid #ccc" borderRadius="4px" padding="7px">
              <select
                value={category || "all"}
                onChange={(e) => setCategory(e.target.value)}
              >
                {BoardCategories.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    disabled={cat.value === "all"} // "전체"만 선택 못하게 비활성화
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </Box>

            {/* 카테고리 선택 후 해당 카테고리 표시 */}
            {category && category !== "all" && (
              <Box width={"auto"}>
                <Input
                  value={
                    BoardCategories.find((cat) => cat.value === category)
                      ?.label || ""
                  }
                  isReadOnly
                />
              </Box>
            )}
          </HStack>
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
