import React, { useContext, useState } from "react";
import { Box, Button, Input, Text, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { useNavigate } from "react-router-dom";

export function Inquiry() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [memberId, setMemberId] = useState("");
  const [savedData, setSavedData] = useState(null); // 저장된 데이터 상태
  const [progress, setProgress] = useState(false);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const currentDate = new Date().toLocaleDateString();

  const handleSaveClick = () => {
    const inquiryData = {
      title: title, // 적절한 값 설정
      content: content, // 적절한 값 설정
      memberId: memberId, // 적절한 값 설정
      // 다른 필드 추가
    };
    setProgress(true);
    axios
      .post("/api/inquiry/add", inquiryData)
      .then((response) => {
        if (response.data && response.data.message) {
          console.log(response.data.message.text);
        } else {
          console.error("Invalid response structure:", response.data);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .finally(() => {
        setProgress(false);
      });
  };

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        1:1 문의
      </Text>
      <Box
        maxW="80%"
        mx="auto"
        mt="4"
        p="3"
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        {savedData ? (
          // 저장된 화면 표시
          <>
            <Field label="제목">
              <Input value={savedData.title} readOnly />
            </Field>
            <Field label="작성자">
              <Input value={savedData.memberId} readOnly />
            </Field>
            <Field label="작성일자">
              <Input value={savedData.inserted} readOnly />
            </Field>
            <Field label="본문">
              <Textarea value={savedData.content} readOnly />
            </Field>
            <Button onClick={() => navigate("/inquiry/list")}>
              문의 내역 보기
            </Button>
          </>
        ) : (
          // 작성 화면 표시
          <>
            <Field label="제목">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="작성자">
              <Input value={id} readOnly />
            </Field>
            <Field label="작성일자">
              <Input value={currentDate} readOnly />
            </Field>
            <Field label="본문">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Field>
            <Button
              disabled={!title || !content}
              isLoading={progress}
              onClick={handleSaveClick}
            >
              저장
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
}
