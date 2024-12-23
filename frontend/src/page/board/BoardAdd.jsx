import {
  Box,
  Card,
  FormatNumber,
  HStack,
  Icon,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { BoardCategories } from "../../components/category/BoardCategoryContainer.jsx";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { CiFileOn } from "react-icons/ci";
import { Field } from "../../components/ui/field.jsx";

export function BoardAdd() {
  const { isAuthenticated, logout } = useContext(AuthenticationContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]); // 미리보기 저장
  const [progress, setProgress] = useState(false);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ size: ["small", "medium", "large", "huge"] }],
      ["bold", "italic", "underline"],
      [{ align: [] }],
      ["link"],
      ["blockquote"],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "size",
    "list",
    "bold",
    "italic",
    "underline",
    "align",
    "link",
    "blockquote",
    "color",
    "background",
  ];

  const editorStyles = {
    width: "100%",
    height: "400px",
    maxHeight: "auto",
    marginBottom: "20px",
    lineHeight: "1.0",
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  const handleListClick = () => {
    navigate("/board/list");
  };

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

  const disabled = !(title.trim().length > 0 && content.trim().length > 0);

  const handleFileDelete = (fileName) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.name !== fileName),
    );
  };

  const handlePreviewDelete = (fileName) => {
    setFilePreviews((prevPreviews) =>
      prevPreviews.filter((preview) => preview.name !== fileName),
    );
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const uniqueFiles = newFiles.filter(
      (newFile) =>
        !files.some((existingFile) => existingFile.name === newFile.name),
    );
    setFiles((prevFiles) => [...prevFiles, ...uniqueFiles]);

    const newPreviews = uniqueFiles.map((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreviews((prevPreviews) => [
          ...prevPreviews,
          { name: file.name, preview: reader.result },
        ]);
      };
      reader.readAsDataURL(file);
      return { name: file.name, preview: reader.result };
    });
  };

  const filesList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false;

  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    filesList.push(
      <Card.Root size={"sm"} key={file.name}>
        <Card.Body>
          <HStack>
            <Text
              color={file.size > 1024 * 1024 ? "red" : "black"}
              fontWeight={"bold"}
              me={"auto"}
              truncate
              onClick={() => handleFileDelete(file.name)}
              style={{ cursor: "pointer" }}
            >
              <Icon>
                <CiFileOn />
              </Icon>
              {file.name}
            </Text>
            <Text>
              <FormatNumber
                value={file.size}
                notation={"compact"}
                compactDisplay="short"
              />
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>,
    );
  }

  const filePreviewsList = filePreviews.map((filePreview) => (
    <Box
      key={filePreview.name}
      mb={2}
      onClick={() => handlePreviewDelete(filePreview.name)}
      display="inline-block"
      mr={4} // 이미지를 옆으로 정렬하기 위해 마진을 추가
    >
      <img
        src={filePreview.preview}
        alt={filePreview.name}
        style={{
          width: "100px",
          height: "100px",
          objectFit: "cover",
          cursor: "pointer",
        }}
      />
    </Box>
  ));

  let fileInputInvalid = false;
  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  const fileSizeMessage = fileInputInvalid
    ? "파일 크기가 너무 큽니다. 최대 10MB까지 업로드 가능합니다."
    : "최대 10MB까지 업로드 가능합니다.";

  return (
    <Box
      height="750px"
      border="1px solid #ccc"
      borderRadius="8px"
      p={10}
      mt={8}
      position="relative"
    >
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
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{
                border: "none",
                outline: "none",
                fontSize: "14px",
                height: "30px",
                padding: "0 8px",
              }}
            >
              {BoardCategories.filter((cat) => cat.value).map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </Box>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="카테고리를 선택 후 제목을 작성해 주세요."
            padding="0 8px"
            fontSize="14px"
            height="30px"
            style={{ border: "none", outline: "none", width: "100%" }}
          />
        </Box>

        <ReactQuill
          style={{ ...editorStyles, marginBottom: "50px" }}
          value={content}
          onChange={setContent}
          modules={modules}
          formats={formats}
        />

        <Box>
          <Field>
            <Input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              mt={6}
              ml={-3}
              css={{ border: "none" }}
            />
            {/* 파일 미리보기만 표시, 파일명은 표시하지 않음 */}
            <Box display="flex" flexWrap="wrap" mt={2}>
              <HStack mt={2} spacing={2} wrap="wrap">
                {filePreviewsList}
              </HStack>
              <Text color={fileInputInvalid ? "red" : "gray"} mt={2}>
                {fileSizeMessage}
              </Text>
            </Box>
          </Field>
        </Box>
      </Stack>

      <HStack
        justify="flex-end"
        spacing={4}
        position="absolute"
        bottom="20px"
        right="20px"
      >
        <Button
          colorScheme="teal"
          onClick={handleSaveClick}
          size="lg"
          disabled={disabled || progress}
        >
          저장
        </Button>
        <Button
          colorScheme="blue"
          variant="outline"
          onClick={handleListClick}
          size="lg"
        >
          취소
        </Button>
      </HStack>
    </Box>
  );
}
