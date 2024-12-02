import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";

export function AdminInquiryDetail({ handleDeleteClick }) {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  // 게시글 정보 가져오기
  useEffect(() => {
    console.log("Inquiry ID:", inquiryId);
    axios
      .get(`/api/inquiry/view/${inquiryId}`)
      .then((res) => {
        console.log("Inquiry data:", res.data);
        setInquiry(res.data);
      })
      .catch((error) => {
        console.error("문의 상세 데이터 요청 중 오류 발생:", error);
      });
  }, [inquiryId]);

  // 댓글 목록 가져오기
  useEffect(() => {
    if (inquiryId) {
      axios
        .get(`/api/inquiry/comments/${inquiryId}`)
        .then((res) => {
          console.log("Comments data:", res.data);
          setComments(res.data);
        })
        .catch((error) => {
          console.error("댓글 데이터 요청 중 오류 발생:", error);
        });
    }
  }, [inquiryId]);

  // 댓글 작성 처리 함수
  const handleCommentSubmit = () => {
    if (!comment.trim()) {
      alert("댓글 내용을 입력해 주세요.");
      return;
    }

    const newComment = {
      inquiryId: parseInt(inquiryId, 10),
      memberId: "admin", // 로그인된 관리자의 ID로 설정
      comment: comment,
      inserted: new Date().toISOString(),
    };

    axios
      .post(`/api/inquiry/comment/${newComment.memberId}`, newComment)
      .then((res) => {
        alert("댓글이 등록되었습니다.");
        // 댓글 작성 후 입력 필드 초기화 및 최신 댓글 목록 가져오기
        setComment("");
        setComments((prevComments) => [...prevComments, newComment]);
      })
      .catch((error) => {
        console.error("댓글 작성 중 오류 발생:", error);
      });
  };

  if (!inquiry) {
    return <div>로딩 중...</div>;
  }

  return (
    <Box mt="60px">
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
        <Heading mb={4}>{inquiry.inquiryId}번 문의</Heading>
        <Stack spacing={5}>
          <Field label={"제목"} readOnly>
            <Input value={inquiry.title} readOnly />
          </Field>
          <Field label={"작성자"} readOnly>
            <Input value={inquiry.memberId} readOnly />
          </Field>
          <Field label={"작성 일자"} readOnly>
            <Input
              value={new Date(inquiry.inserted).toLocaleDateString()}
              readOnly
            />
          </Field>
          <Field label={"내용"} readOnly>
            <Textarea h="25vh" value={inquiry.content} readOnly />
          </Field>
          <Field>
            <Flex>
              <Textarea
                placeholder="댓글을 입력하세요."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                flex="1"
              />
              <Button
                colorScheme="teal"
                mt={2}
                ml={2}
                onClick={handleCommentSubmit}
              >
                등록
              </Button>
            </Flex>
          </Field>
          <Box mt={4}>
            <Heading size="md" mb={2}>
              COMMENTS
            </Heading>
            {comments.map((c, index) => (
              <Box key={index} borderWidth="1px" borderRadius="md" p={3} mb={2}>
                <Text fontWeight="bold">{c.memberId}</Text>
                <Text>{c.comment}</Text>
                <Text fontSize="sm" color="gray.500">
                  {new Date(c.inserted).toLocaleDateString()}
                </Text>
              </Box>
            ))}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}
