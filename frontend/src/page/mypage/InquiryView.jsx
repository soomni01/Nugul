import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export const InquiryView = () => {
  const [inquiryView, setInquiryView] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const { nickname } = useContext(AuthenticationContext);
  const { inquiryId } = useParams();
  const navigate = useNavigate();

  // 문의 상세 정보를 불러오는 함수
  const fetchInquiryView = () => {
    setLoading(true);
    axios
      .get(`/api/myPage/view?inquiryId=${inquiryId}`)
      .then((res) => {
        setInquiryView(res.data);
        fetchComments(); // 댓글도 불러오기
      })
      .catch((error) => {
        console.error("문의 상세 정보를 가져오는 중 오류 발생:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // 댓글을 가져오는 함수
  const fetchComments = () => {
    axios
      .get(`/api/myPage/comments/${inquiryId}`)
      .then((response) => {
        if (Array.isArray(response.data)) {
          setComments(response.data);
        }
      })
      .catch((error) => {
        console.error("댓글을 가져오는 중 오류가 발생했습니다:", error);
      });
  };

  // 삭제 클릭 시 호출되는 함수
  const handleDeleteClick = () => {
    axios
      .delete(`/api/myPage/delete/${inquiryId}`)
      .then((response) => {
        if (response.status === 200) {
          toaster.create({
            type: "success",
            description: `${inquiryView.inquiryId}번 문의글이 삭제되었습니다.`,
          });
          navigate("/myPage");
        }
      })
      .catch((error) => {
        toaster.create({
          type: "error",
          description: "문의글 삭제에 실패했습니다.",
        });
      });
  };

  useEffect(() => {
    fetchInquiryView(); // 문의 정보와 댓글을 불러옴
  }, [inquiryId]);

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
              <Input value={nickname} readOnly />
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
          </Box>
          <Button
            onClick={() => navigate(`/myPage/${inquiryView.inquiryId}/edit`)}
          >
            수정
          </Button>
          <DialogRoot>
            <DialogTrigger asChild>
              <Button colorPalette={"red"}>삭제</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>삭제 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                {inquiryView && (
                  <p>{inquiryView.inquiryId}번 문의글을 삭제하시겠습니까?</p>
                )}
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button colorPalette={"red"} onClick={handleDeleteClick}>
                  삭제
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
          <Box mt={4}>
            {comments.length === 0 ? (
              <Text mt={4}>아직 관리자가 답변하지 않았습니다.</Text>
            ) : (
              <Box mt={4}>
                <VStack spacing={3}>
                  {comments.map((comment) => (
                    <Box
                      key={comment.id}
                      borderWidth="1px"
                      p={3}
                      borderRadius="md"
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        {comment.memberId}{" "}
                        <Text
                          as="span"
                          color="gray.500"
                          fontSize="sm"
                          fontWeight="medium"
                        >
                          {new Date(comment.inserted).toLocaleDateString()}
                        </Text>
                      </Text>
                      <Text>{comment.comment}</Text>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </Box>
        </>
      ) : (
        <Text>선택된 문의 내역이 없습니다.</Text>
      )}
    </Box>
  );
};
