import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
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
      .get(`/api/inquiry/view?inquiryId=${inquiryId}`)
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
      .get(`/api/inquiry/comments/${inquiryId}`)
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
      .delete(`/api/inquiry/delete/${inquiryId}`)
      .then((response) => {
        if (response.status === 200) {
          toaster.create({
            type: "success",
            description: `해당 문의글이 삭제되었습니다.`,
          });
          navigate("/inquiry/myList");
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
    <Box
      width="64%"
      // height="700px"
      mx="auto"
      mt="36"
      p="5"
      borderRadius="md"
      boxShadow="0px 10px 30px rgba(0, 0, 0, 0.2)"
      bg="white"
    >
      {inquiryView ? (
        <>
          {/* 제목 */}
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
            문의 상세 정보
          </Text>

          {/* 문의 상세 정보 */}
          <Box mb={4}>
            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                문의 유형
              </Text>
              <Input value={inquiryView.category} readOnly width="70%" ml={3} />
            </Flex>

            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                문의 제목
              </Text>
              <Input value={inquiryView.title} readOnly width="70%" ml={3} />
            </Flex>

            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                작성자
              </Text>
              <Input value={nickname} readOnly width="70%" ml={3} />
            </Flex>

            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                작성 일자
              </Text>
              <Input
                value={new Date(inquiryView.inserted).toLocaleDateString()}
                readOnly
                width="70%"
                ml={3}
              />
            </Flex>

            <Flex align="center">
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                문의 내용
              </Text>
              <Textarea
                value={inquiryView.content}
                readOnly
                width="70%"
                height="150px"
                ml={3}
              />
            </Flex>
          </Box>

          {/* 버튼 */}
          <Flex justify="space-between" mt={4}>
            <Button
              colorScheme="blue"
              onClick={() => navigate(`/inquiry/edit/${inquiryView.inquiryId}`)}
            >
              수정
            </Button>
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorScheme="red">삭제</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  {inquiryView && <p>해당 문의글을 삭제하시겠습니까?</p>}
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant="outline">취소</Button>
                  </DialogActionTrigger>
                  <Button colorScheme="red" onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </Flex>

          {/* 댓글 */}
          <Box mt={6}>
            {comments.length === 0 ? (
              <Text>아직 관리자가 답변하지 않았습니다.</Text>
            ) : (
              <VStack spacing={3}>
                {comments.map((comment) => (
                  <Box
                    key={comment.nickname}
                    borderWidth="1px"
                    p={3}
                    borderRadius="md"
                    width="100%"
                  >
                    <Text fontWeight="bold" fontSize="lg">
                      {comment.nickname}{" "}
                      <Text
                        as="span"
                        color="gray.500"
                        fontSize="sm"
                        fontWeight="medium"
                      >
                        {new Date(comment.inserted).toLocaleDateString()}
                      </Text>
                    </Text>
                    <Text mt={1}>{comment.comment}</Text>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </>
      ) : (
        <Text>선택된 문의 내역이 없습니다.</Text>
      )}
    </Box>
  );
};
