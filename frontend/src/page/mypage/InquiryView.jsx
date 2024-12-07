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
import { useNavigate } from "react-router-dom";

export const InquiryView = () => {
  const [inquiryView, setInquiryView] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 문의 상세 정보를 불러오는 함수
  const fetchInquiryView = async () => {
    // 로컬 스토리지에서 inquiryId 가져오기
    const inquiryId = localStorage.getItem("selectedInquiryId");
    // inquiryId가 없으면 에러 메시지 출력 후 종료
    if (!inquiryId) {
      console.error("로컬 스토리지에 selectedInquiryId가 없습니다.");
      return;
    }

    setLoading(true);
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

  // 컴포넌트가 처음 마운트될 때 실행
  useEffect(() => {
    fetchInquiryView();
  }, []);

  // 로컬 스토리지가 변경될 때 데이터를 다시 불러오는 이벤트 리스너 설정
  useEffect(() => {
    const handleStorageChange = () => {
      fetchInquiryView(); // 로컬 스토리지가 변경될 때 데이터 다시 불러오기
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (loading) return <Spinner />;

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
              <Badge
                variant="subtle"
                colorScheme={inquiryView.hasAnswer ? "green" : "red"}
              >
                <FaCommentDots />{" "}
                {inquiryView.hasAnswer ? "답변 완료" : "답변 대기"}
              </Badge>
            </Field>
          </Box>
          <Button
            onClick={() => navigate(`/myPage/${inquiryView.inquiryId}/edit`)}
          >
            수정
          </Button>
        </>
      ) : (
        <Text>선택된 문의 내역이 없습니다.</Text>
      )}
    </Box>
  );
};
