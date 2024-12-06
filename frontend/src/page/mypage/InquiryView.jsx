// InquiryDetail.jsx
import React, { useEffect, useState } from "react";
import { Badge, Box, Button, Text } from "@chakra-ui/react";
import { FaCommentDots } from "react-icons/fa";
import axios from "axios";

export const InquiryView = ({ inquiryId }) => {
  const [inquiryDetail, setInquiryDetail] = useState(null);

  useEffect(() => {
    const fetchInquiryDetail = async () => {
      try {
        const response = await axios.get(
          `/api/myPage/view?inquiryId=${inquiryId}`,
        );
        if (response.status === 200) {
          setInquiryDetail(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch inquiry details", error);
      }
    };

    if (inquiryId) {
      fetchInquiryDetail();
    }
  }, [inquiryId]);

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
