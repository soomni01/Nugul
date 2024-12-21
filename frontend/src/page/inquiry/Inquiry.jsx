import React, { useContext, useEffect, useState } from "react";
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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, []);

  // 문의 내역으로 이동
  const handleNavigateToList = () => {
    navigate("/inquiry/myList");
  };

  // 클릭 시 사용자 입력 데이터를 서버에 저장 요청
  const handleSaveClick = () => {
    if (!category) {
      toaster.create({
        type: "warning",
        description: "문의 유형을 선택해 주세요.",
      });
      return;
    }

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
          handleNavigateToList();
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

  const handleCancelClick = () => {
    navigate(-1);
  };

  return (
    <Box
      p="5"
      height="710px"
      width="950px"
      borderRadius="md"
      boxShadow="0px 10px 30px rgba(0, 0, 0, 0.2)"
      bg="white"
      top="50px"
      left="50%"
      position="relative"
      transform="translateX(-50%)"
    >
      <Text fontSize="2xl" fontWeight="bold" textAlign="center" mt={4} mb={14}>
        문의하기
      </Text>

      {/* 작성 화면 표시 */}
      <Field>
        <Flex align="center" gap={12} mb={6}>
          <Text fontSize="md" fontWeight="bold" ml={3}>
            문의 유형
          </Text>
          <select
            value={savedData ? savedData.category : category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              marginLeft: "-9px",
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
          <Text fontSize="sm" color="gray.500" ml={-7}>
            ※ 문의 유형을 선택 후 문의 내용을 작성해 주세요.
          </Text>
        </Flex>
      </Field>
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="md" fontWeight="bold" width="30%" mb={2} ml={3}>
          문의 제목
        </Text>
        <Input
          value={savedData ? savedData.title : title}
          onChange={(e) => setTitle(e.target.value)}
          mb={3}
          width="220%"
          readOnly={savedData !== null}
        />
      </Flex>
      <Flex justify="space-between" align="center" mb={7}>
        <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
          작성자
        </Text>
        <Input value={nickname} readOnly width="220%" />
      </Flex>
      <Flex justify="space-between" align="center" mb={7}>
        <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
          작성 일자
        </Text>
        <Input value={currentDate} readOnly width="220%" />
      </Flex>
      <Flex justify="space-between" align="center">
        <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
          문의 내용
        </Text>
        <Textarea
          value={savedData ? savedData.content : content}
          onChange={(e) => setContent(e.target.value)}
          width="220%"
          height="230px"
          readOnly={savedData !== null}
        />
      </Flex>

      {/* 저장 버튼이 savedData가 없을 때만 표시 */}
      {!savedData && (
        <Flex justify="flex-end" mt={5}>
          <Button onClick={handleSaveClick} isLoading={progress}>
            저장
          </Button>
          <Button ml={4} variant="outline" onClick={handleCancelClick}>
            취소
          </Button>
        </Flex>
      )}
    </Box>
  );
}
