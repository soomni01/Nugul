import React, { useContext, useState } from "react";
import { Box, Button, Flex, Input, Text, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

export function Inquiry() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [progress, setProgress] = useState(false);
  const { id, nickname } = useContext(AuthenticationContext);
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();

  // 클릭 시 호출되는 함수로, 사용자 입력 데이터를 서버에 저장 요청
  const handleSaveClick = () => {
    const inquiryData = {
      title: title,
      content: content,
      category: category,
      memberId: id,
      nickname: nickname,
    };
    setProgress(true);

    // 서버에 데이터를 저장하고 성공 시 저장된 데이터를 savedData 상태로 업데이트
    axios
      .post("/api/inquiry/add", inquiryData)
      .then((res) => {
        if (res && res.data) {
          const message = res.data.message;
          toaster.create({
            type: message.type,
            description: message.text,
          });
          setSavedData({
            title: title,
            content: content,
            category: category,
            memberId: id,
            nickname: nickname,
            inserted: new Date().toLocaleDateString(),
          });
        }
      })
      .catch((e) => {
        if (e.response && e.response.data && e.response.data.message) {
          const message = e.response.data.message;
          toaster.create({
            type: message.type,
            description: message.text,
          });
        }
      })
      .finally(() => {
        setProgress(false);
      });
  };

  return (
    <Box
      p="5"
      height="700px"
      width="900px"
      borderRadius="md"
      boxShadow="0px 10px 30px rgba(0, 0, 0, 0.2)"
      bg="white"
      position="absolute"
      top="53%"
      left="50%"
      transform="translate(-50%, -50%)"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={14}>
        문의하기
      </Text>

      {/* 작성 화면 표시 */}
      <Field>
        <Flex align="center" gap={11} mb={7}>
          <Text fontSize="md" fontWeight="bold">
            문의 유형
          </Text>
          <select
            value={savedData ? savedData.category : category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #CBD5E0",
            }}
            disabled={savedData !== null}
          >
            <option value="">문의 유형 선택</option>
            <option value="신고">신고</option>
            <option value="이용 안내">이용 안내</option>
            <option value="계정 문의">계정 문의</option>
            <option value="기타 문의">기타 문의</option>
          </select>
          <Text fontSize="sm" color="gray.500" ml={-6}>
            ※ 문의 유형을 선택 후 문의 내용을 작성해 주세요.
          </Text>
        </Flex>
      </Field>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="md" fontWeight="bold" mb={2} width="30%">
          문의 제목
        </Text>
        <Input
          value={savedData ? savedData.title : title}
          onChange={(e) => setTitle(e.target.value)}
          mb={3}
          width="200%"
          readOnly={savedData !== null}
        />
      </Flex>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="md" fontWeight="bold" width="30%">
          작성자
        </Text>
        <Input value={nickname} readOnly width="200%" />
      </Flex>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="md" fontWeight="bold" width="30%">
          작성 일자
        </Text>
        <Input value={currentDate} readOnly width="200%" />
      </Flex>
      <Flex justify="space-between" align="center" mb={5}>
        <Text fontSize="md" fontWeight="bold" width="30%">
          문의 내용
        </Text>
        <Textarea
          value={savedData ? savedData.content : content}
          onChange={(e) => setContent(e.target.value)}
          width="200%"
          height="250px"
          readOnly={savedData !== null}
        />
      </Flex>

      {/* 저장 버튼이 savedData가 없을 때만 표시 */}
      {!savedData && (
        <Flex justify="flex-end" mb={5}>
          <Button onClick={handleSaveClick} isLoading={progress}>
            저장
          </Button>
        </Flex>
      )}
    </Box>
  );
}
