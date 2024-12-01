import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";

export function InquiryDetail({ handleDeleteClick }) {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Inquiry ID:", inquiryId); // 확인용 로그

    axios
      .get(`/api/inquiry/view/${inquiryId}`) // 백엔드의 경로와 일치하는지 확인
      .then((res) => {
        setInquiry(res.data);
      })
      .catch((error) => {
        console.error("문의 상세 데이터 요청 중 오류 발생:", error);
      });
  }, [inquiryId]);

  if (!inquiry) {
    return <div>로딩 중...</div>;
  }
  return (
    <Box mt="60px">
      <Text fontSize="2xl" fontWeight="bold" mb={5} m={2}>
        1:1 문의
      </Text>
      <Box
        maxW="80%" // 너비를 80%로 설정하여 약간 더 좁게
        mx="auto"
        mt="4" // 위쪽 마진 유지
        p="3" // 패딩을 줄여서 더 작은 공간 활용
        borderWidth="1px"
        borderRadius="md"
        boxShadow="lg"
        bg="white"
      >
        <Heading mb={4}>{inquiry.inquiryId}번 문의</Heading>
        <Stack spacing={5}>
          <Field label={"제목"} readOnly>
            <Input value={inquiry.title} />
          </Field>
          <Field label={"작성자"} readOnly>
            <Input value={inquiry.memberId} />
          </Field>
          <Field label={"내용"} readOnly>
            <Textarea h="25vh" value={inquiry.content} />
          </Field>
          <Field label={"작성 일자"} readOnly>
            <Input
              value={new Date(inquiry.inserted).toLocaleDateString()}
              readOnly
            />
          </Field>
          <Field label={"답변"} readOnly>
            <Textarea
              h="15vh"
              value={inquiry.answer ? inquiry.answer : "답변 대기 중"}
            />
          </Field>
          <Flex justify="space-between">
            <Button
              colorScheme="teal"
              onClick={() => navigate(`/inquiry/edit/${inquiry.inquiryId}`)}
            >
              수정
            </Button>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
}
