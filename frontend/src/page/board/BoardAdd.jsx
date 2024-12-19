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
import { useContext, useState } from "react";
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
  const [progress, setProgress] = useState(false);

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

  // CSS로 기본 글씨 크기 고정
  const editorStyles = {
    width: "100%",
    height: "400px", // 자동 크기 조정
    maxHeight: "auto", // 최대 높이 설정
    marginBottom: "20px", // 여백 조정
    lineHeight: "1.0", // 줄 간격 설정
  };

  const navigate = useNavigate();

  // 권한 없을 떄
  if (!isAuthenticated) {
    return (
      <Box
        border="1px solid red"
        borderRadius="12px"
        p={8}
        textAlign="center"
        maxWidth="550px"
        mx="auto"
        mt={16}
        boxShadow="lg"
      >
        <Box>
          <Text fontSize="3xl" color="red.600" fontWeight="bold" mb={6}>
            권한이 없습니다.
          </Text>
          <Text color="gray.700" fontSize="lg" mb={8}>
            글을 작성하려면 로그인하거나 회원가입이 필요합니다.
          </Text>
          <Stack direction="row" spacing={6} justify="center" mb={4}>
            <Button
              colorScheme="blue"
              variant="outline"
              size="lg"
              onClick={() => navigate("/member/signup")}
            >
              회원가입
            </Button>
            <Button
              colorScheme="teal"
              size="lg"
              onClick={() => navigate("/")} // 로그인 페이지로 이동
            >
              로그인
            </Button>
          </Stack>
        </Box>
      </Box>
    );
  }

  //console.log(files);

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

  const disabled = !(
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    category.trim().length > 0
  );

  // files 의 파일명을 component 리스트로 만들기
  const filesList = [];
  let sumOfFileSize = 0;
  let invalidOneFileSize = false; // 한 파일이라도 1MB을 넘는지?
  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
    filesList.push(
      <Card.Root size={"sm"}>
        <Card.Body>
          <HStack>
            <Text
              css={{ color: file.size > 1024 * 1024 ? "red" : "black" }}
              fontWeight={"bold"}
              me={"auto"}
              truncate
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
              ></FormatNumber>
            </Text>
          </HStack>
        </Card.Body>
      </Card.Root>,
    );
  }

  let fileInputInvalid = false;

  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  return (
    <Box border="1px solid #ccc" borderRadius="8px" p={2}>
      <h3>게시글 쓰기</h3>
      <hr />
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

        <ReactQuill
          style={{
            ...editorStyles,
            fontSize: "18px",
          }} // 기본 스타일 적용
          value={content}
          onChange={(content) => setContent(content)}
          disabled={disabled}
          modules={modules} // 툴바 및 모듈 설정
          formats={formats} // 사용 가능한 서식 제한
          placeholder="본문 내용을 입력하세요"
        />

        <Box mt={2}>
          {" "}
          {/* 마진 값 조정 */}
          <Field
            helperText={"총 10MB, 한 파일은 1MB 이내로 선택하세요."}
            invalid={fileInputInvalid}
            errorText={"선택된 파일의 용량이 초과되었습니다."}
          >
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
          </Field>
        </Box>

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
