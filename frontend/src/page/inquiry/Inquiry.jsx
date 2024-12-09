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
  const [memberId, setMemberId] = useState("");
  const [savedData, setSavedData] = useState(null);
  const [progress, setProgress] = useState(false);
  const { id } = useContext(AuthenticationContext);
  const currentDate = new Date().toLocaleDateString();
  const navigate = useNavigate();

  // 클릭 시 호출되는 함수로, 사용자 입력 데이터를 서버에 저장 요청
  const handleSaveClick = () => {
    const inquiryData = {
      title: title,
      content: content,
      category: category,
      memberId: memberId,
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
            <Field label="카테고리">
              <Input value={savedData.category} readOnly />
            </Field>
            <Field label="제목" mb={2}>
              <Input value={savedData.title} readOnly />
            </Field>
            <Field label="작성자" mb={2}>
              <Input value={savedData.memberId} readOnly />
            </Field>
            <Field label="작성일자" mb={2}>
              <Input value={savedData.inserted} readOnly />
            </Field>
            <Field label="내용" mb={2}>
              <Textarea value={savedData.content} readOnly />
            </Field>
          </>
        ) : (
          // 작성 화면 표시
          <>
            <Field>
              <Flex align="center" gap={4}>
                <Text fontSize="md" fontWeight="bold">
                  문의 유형:
                </Text>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{
                    padding: "8px",
                    borderRadius: "4px",
                    border: "1px solid #CBD5E0",
                  }}
                >
                  <option value="">문의 유형 선택</option>
                  <option value="신고">신고</option>
                  <option value="이용 안내">이용 안내</option>
                  <option value="계정 문의">계정 문의</option>
                  <option value="기타 문의">기타 문의</option>
                </select>
              </Flex>
            </Field>
            <Field label="제목" mb={2}>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </Field>
            <Field label="작성자" mb={2}>
              <Input value={id} readOnly />
            </Field>
            <Field label="작성일자" mb={2}>
              <Input value={currentDate} readOnly />
            </Field>
            <Field label="내용">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </Field>
            {/* 저장 버튼이 savedData가 없을 때만 표시 */}
            {!savedData && (
              <Button onClick={handleSaveClick} isLoading={progress}>
                저장
              </Button>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
