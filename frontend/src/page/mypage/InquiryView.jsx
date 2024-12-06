import React, { useEffect, useState } from "react";
import {
  Badge,
  Box,
  Button,
  Input,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";

export const InquiryView = ({ inquiryId }) => {
  const [inquiryView, setInquiryView] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // inquiryId가 없으면 데이터 로딩을 중단
    if (!inquiryId) return;

    // 로컬 스토리지에서 데이터 가져오기
    const storedData = localStorage.getItem(`inquiryDetail-${inquiryId}`);
    if (storedData) {
      console.log(
        "로컬 스토리지에서 문의 상세를 불러왔습니다:",
        JSON.parse(storedData),
      );
      setInquiryView(JSON.parse(storedData));
      return;
    } else {
      console.log(
        "로컬 스토리지에서 inquiryId에 대한 데이터를 찾을 수 없습니다:",
        inquiryId,
      );
    }

    // 데이터 로딩 시작
    setLoading(true);

    // 서버에서 문의 상세 정보를 가져오는 함수
    const fetchInquiryDetail = async () => {
      try {
        const res = await axios.get(`/api/myPage/view?inquiryId=${inquiryId}`);
        setInquiryView(res.data);

        // 가져온 데이터를 로컬 스토리지에 저장
        localStorage.setItem(
          `inquiryDetail-${inquiryId}`,
          JSON.stringify(res.data),
        );
      } catch (error) {
        console.error("문의 상세 정보를 가져오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryDetail();
  }, [inquiryId]);

  // 로딩 중일 때 스피너 표시
  if (loading) return <Spinner />;

  // 문의 상세 정보 렌더링
  return (
    <Box mt="20px">
      {inquiryView ? (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            문의 상세 정보
          </Text>
          <Box mb={3}>
            <Field label="문의 유형" mb={2}>
              <Input value={inquiryView.category} readOnly />
            </Field>
            <Field label="제목" mb={2}>
              <Input value={inquiryView.title} readOnly />
            </Field>
            <Field label="작성자" mb={2}>
              <Input value={inquiryView.memberId} readOnly />
            </Field>
            <Field label="작성 일자" mb={2}>
              <Input
                value={new Date(inquiryView.inserted).toLocaleDateString()}
                readOnly
              />
            </Field>
            <Field label="내용" mb={2}>
              <Textarea value={inquiryView.content} readOnly />
            </Field>
            <Field label="상태" mb={2}>
              {inquiryView.hasAnswer ? (
                <Badge variant="subtle" colorScheme="green">
                  <FaCommentDots /> 답변 완료
                </Badge>
              ) : (
                <Badge variant="subtle" colorScheme="red">
                  <FaCommentDots /> 답변 대기
                </Badge>
              )}
            </Field>
          </Box>
          <Button colorScheme="teal" mt={4}>
            수정
          </Button>
        </>
      ) : (
        <Text>선택된 문의 내역이 없습니다.</Text>
      )}
    </Box>
  );
};
