import React, { useEffect, useState } from "react";
import { Badge, Box, Button, Spinner, Text } from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";

export const InquiryView = ({ inquiryId }) => {
  const [inquiryDetail, setInquiryDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!inquiryId) {
      return;
    }

    // 로컬 스토리지에서 이전 데이터를 불러오기
    const storedData = localStorage.getItem(`inquiryDetail-${inquiryId}`);
    if (storedData) {
      setInquiryDetail(JSON.parse(storedData));
      return;
    }

    setLoading(true);

    const fetchInquiryDetail = async () => {
      try {
        const res = await axios.get(`/api/myPage/view?inquiryId=${inquiryId}`);
        setInquiryDetail(res.data);
        // 데이터를 로컬 스토리지에 저장
        localStorage.setItem(
          `inquiryDetail-${inquiryId}`,
          JSON.stringify(res.data),
        );
      } catch (error) {
        console.error("Error fetching inquiry detail:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInquiryDetail();
  }, [inquiryId]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <Box mt="20px">
      {inquiryDetail ? (
        <>
          <Text fontSize="2xl" fontWeight="bold" mb={4}>
            문의 상세 정보
          </Text>
          <Box mb={3}>
            <Text fontSize="lg">제목: {inquiryDetail.title}</Text>
            <Text fontSize="md">작성자: {inquiryDetail.memberId}</Text>
            <Text fontSize="md">
              작성 일자: {new Date(inquiryDetail.inserted).toLocaleDateString()}
            </Text>
            <Text fontSize="md" mt={2}>
              문의 유형: {inquiryDetail.category}
            </Text>
            <Text fontSize="md" mt={2}>
              내용: {inquiryDetail.content}
            </Text>
            <Text fontSize="md" mt={2}>
              상태:{" "}
              {inquiryDetail.hasAnswer ? (
                <Badge variant={"subtle"} colorScheme="green">
                  <FaCommentDots /> 답변 완료
                </Badge>
              ) : (
                <Badge variant={"subtle"} colorScheme="red">
                  <FaCommentDots /> 답변 대기
                </Badge>
              )}
            </Text>
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
