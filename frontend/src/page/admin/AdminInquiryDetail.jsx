import { useParams } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
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

// 특정 문의 상세 정보를 표시하고, 해당 문의의 댓글을 조회, 작성, 수정, 삭제 기능을 제공
export function AdminInquiryDetail({
  handleDeleteClick: handleDeleteClickProp,
}) {
  const { inquiryId } = useParams();
  const [inquiry, setInquiry] = useState(null);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [savedData, setSavedData] = useState(null);
  const { id, nickname } = useContext(AuthenticationContext);

  function DeleteButton({ onClick, id: memberId }) {
    const [open, setOpen] = useState(false);

    return (
      <>
        <DialogRoot open={open} onOpenChange={(e) => setOpen(e.open)}>
          <DialogTrigger asChild>
            <Button colorPalette={"red"} mt={2}>
              삭제
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>삭제 확인</DialogTitle>
            </DialogHeader>
            <DialogBody>
              <p>댓글을 삭제하시겠습니까?</p>
            </DialogBody>
            <DialogFooter>
              <DialogActionTrigger>
                <Button variant={"outline"}>취소</Button>
              </DialogActionTrigger>
              <Button colorPalette={"red"} onClick={onClick}>
                삭제
              </Button>
            </DialogFooter>
          </DialogContent>
        </DialogRoot>
      </>
    );
  }

  // inquiry가 업데이트될 때 savedData의 category를 설정
  useEffect(() => {
    if (inquiry) {
      setSavedData({
        ...savedData,
        category: inquiry.category,
      });
    }
  }, [inquiry]);

  // 게시글 정보 가져오기
  useEffect(() => {
    axios
      .get(`/api/inquiry/view/${inquiryId}`)
      .then((res) => {
        console.log("문의 데이터:", res.data);
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
          console.log("댓글 데이터:", res.data);
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
      toaster.create({
        type: "error",
        description: "댓글을 입력해 주세요.",
      });
      return;
    }

    if (editingCommentId) {
      // 수정 모드에서 댓글 업데이트
      axios
        .put(`/api/inquiry/comment/${editingCommentId}`, {
          id: editingCommentId,
          inquiryId: parseInt(inquiryId, 10),
          memberId: id,
          comment: comment,
        })
        .then((res) => {
          toaster.create({
            type: "success",
            description: "댓글이 수정되었습니다.",
          });
          setComment("");
          setEditingCommentId(null);
          setComments((prevComments) =>
            prevComments.map((c) =>
              c.id === editingCommentId ? { ...c, comment } : c,
            ),
          );
        })
        .catch((error) => {
          console.error("댓글 수정 중 오류 발생:", error);
        });
    } else {
      // 댓글 등록
      const newComment = {
        inquiryId: parseInt(inquiryId, 10),
        memberId: id,
        comment: comment,
        inserted: new Date().toISOString(),
      };
      axios
        .post(`/api/inquiry/comment/${id}`, newComment)
        .then((res) => {
          toaster.create({
            type: "success",
            description: "댓글이 등록되었습니다.",
          });
          setComment("");
          setComments(res.data.list);
        })
        .catch((error) => {
          console.error("댓글 등록 중 오류 발생:", error);
        });
    }
  };

  // 댓글 수정 처리 함수
  const handleEditClick = (commentId) => {
    const commentToEdit = comments.find((c) => c.id === commentId);
    if (commentToEdit) {
      setComment(commentToEdit.comment);
      setEditingCommentId(commentId);
    }
  };

  // 댓글 삭제 처리 함수
  const handleDeleteClick = (commentId) => {
    axios
      .delete(`/api/inquiry/comment/${commentId}`)
      .then((res) => {
        setComments((prevComments) =>
          prevComments.filter((c) => c.id !== commentId),
        );
        toaster.create({
          type: "success",
          description: "댓글이 삭제되었습니다.",
        });
      })
      .catch((error) => {
        console.error("댓글 삭제 중 오류 발생:", error);
      });
  };

  if (!inquiry) {
    return <Spinner />;
  }

  return (
    <Box
      width="64%"
      mx="auto"
      mt="36"
      p="5"
      borderWidth="1px"
      borderRadius="md"
      boxShadow="lg"
      bg="white"
    >
      <Heading fontSize="2xl" ml={3} mb={7}>
        {inquiry.inquiryId}번 문의
      </Heading>
      <Stack spacing={5}>
        <Flex align="center" gap={14} mb={3}>
          <Text fontSize="md" fontWeight="bold" ml={3}>
            문의 유형
          </Text>
          <Input
            value={inquiry ? inquiry.category : ""}
            readOnly
            width="30%"
            ml={-2} // 왼쪽 여백을 0으로 설정
          />
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize="md" fontWeight="bold" width="30%" mb={2} ml={3}>
            문의 제목
          </Text>
          <Input value={inquiry.title} readOnly mb={3} width="220%" />
        </Flex>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
            작성자
          </Text>
          <Input value={inquiry.memberId} readOnly width="220%" />
        </Flex>
        <Flex justify="space-between" align="center" mb={3}>
          <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
            작성 일자
          </Text>
          <Input
            value={new Date(inquiry.inserted).toLocaleDateString()}
            readOnly
            width="220%"
          />
        </Flex>
        <Flex justify="space-between" align="center">
          <Text fontSize="md" fontWeight="bold" width="30%" ml={3}>
            문의 내용
          </Text>
          <Textarea
            value={inquiry.content}
            width="220%"
            height="150px"
            readOnly
          />
        </Flex>

        <Heading size="xl" fontWeight="bold" mt={6} ml={3}>
          COMMENTS
        </Heading>
        <Flex>
          <Textarea
            placeholder="댓글을 입력해 주세요."
            value={editingCommentId ? "" : comment} // 수정 중일 땐 입력 영역 초기화
            onChange={(e) => setComment(e.target.value)}
            isDisabled={!!editingCommentId} // 수정 중일 때 댓글 작성 비활성화
            mt={1}
            ml={2}
            height="60px"
            resize="none"
          />
          <Button
            colorScheme="teal"
            height="57px"
            mt={1}
            ml={2}
            onClick={handleCommentSubmit}
            isDisabled={!!editingCommentId} // 수정 중일 때 버튼 비활성화
          >
            등록
          </Button>
        </Flex>
        {comments.map((c) => (
          <Box
            key={c.id}
            borderWidth="1px"
            borderRadius="md"
            p={3}
            mt={2}
            mb={1}
            ml={2}
            height="110px"
          >
            <Flex align="center" gap={2} mb={2}>
              <Text fontWeight="bold" ml={1}>
                {nickname}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {new Date(c.inserted).toLocaleDateString()}
              </Text>
            </Flex>
            {editingCommentId === c.id ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                height="45px"
                width="84%"
                resize="none"
                mt={1}
              />
            ) : (
              <Text height="5%">{c.comment}</Text>
            )}
            <Flex justify="flex-end">
              {editingCommentId === c.id ? (
                <>
                  <Box mt={-12}>
                    <Button
                      colorScheme="teal"
                      onClick={() => handleCommentSubmit()}
                      mr={2}
                    >
                      저장
                    </Button>
                    <Button
                      colorScheme="gray"
                      onClick={() => {
                        setComment("");
                        setEditingCommentId(null); // 수정 모드 종료
                      }}
                    >
                      취소
                    </Button>
                  </Box>
                </>
              ) : (
                <Button
                  colorScheme="white"
                  onClick={() => handleEditClick(c.id)}
                  mr={2}
                  mt={2}
                >
                  수정
                </Button>
              )}

              {/* 수정 모드일 때는 삭제 버튼 숨기기 */}
              {editingCommentId !== c.id && (
                <DeleteButton
                  colorScheme="red"
                  onClick={() => handleDeleteClick(c.id)}
                />
              )}
            </Flex>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
