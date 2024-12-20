import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Image,
  Input,
  Spinner,
  Text,
  Textarea,
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
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";

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
        console.log("댓글 데이터:", response.data);
        setComments(response.data);
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
    fetchInquiryView();
  }, [inquiryId]);

  if (loading) return <Spinner />;

  return (
    <Box
      p="5"
      height="710px"
      width="950px"
      borderRadius="md"
      boxShadow="0px 10px 30px rgba(0, 0, 0, 0.2)"
      bg="white"
      top="50px"
      left="50%"
      position="relative"
      transform="translateX(-50%)"
    >
      {inquiryView ? (
        <>
          <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={6}>
            문의 상세 보기
          </Text>
          {/* 버튼 */}
          <Flex justify="end" mt={4}>
            <Box
              onClick={() => navigate(`/inquiry/edit/${inquiryView.inquiryId}`)}
              cursor="pointer"
              mb={4}
              ml={2}
            >
              <Image src="/image/InquiryEdit.png" width="30px" height="30px" />
            </Box>
            <DialogRoot>
              <DialogTrigger asChild>
                <Box ml={2} cursor="pointer">
                  <Image
                    src="/image/InquiryDelete.png"
                    width="30px"
                    height="30px"
                  />
                </Box>
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

          {/* 문의 상세 정보 */}
          <Box mb={4}>
            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="20%" ml={3}>
                문의 유형
              </Text>
              <Input
                value={inquiryView.category}
                readOnly
                flex="0 0 17%"
                ml={-20}
              />
            </Flex>
            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="10%" ml={3}>
                문의 제목
              </Text>
              <Input value={inquiryView.title} readOnly flex="1" ml={3} />
            </Flex>
            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="10%" ml={3}>
                작성자
              </Text>
              <Input value={nickname} readOnly flex="1" ml={3} />
            </Flex>
            <Flex align="center" mb={3}>
              <Text fontSize="md" fontWeight="bold" width="10%" ml={3}>
                작성 일자
              </Text>
              <Input
                value={new Date(inquiryView.inserted).toLocaleDateString()}
                readOnly
                flex="1"
                ml={3}
              />
            </Flex>
            <Flex align="center">
              <Text fontSize="md" fontWeight="bold" width="10%" ml={3}>
                문의 내용
              </Text>
              <Textarea
                value={inquiryView.content}
                readOnly
                flex="1"
                height="150px"
                ml={3}
              />
            </Flex>
          </Box>

          {/* 댓글 */}
          <Box mt={6}>
            {comments.length === 0 ? (
              <Flex align="center" justify="center">
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  color="gray.700"
                  mt={16}
                  mr={2}
                >
                  아직 관리자가 답변하지 않았습니다.
                </Text>
              </Flex>
            ) : (
              <Swiper
                direction="vertical"
                slidesPerView="auto"
                freeMode={true}
                scrollbar={{ draggable: true }}
                mousewheel={true}
                modules={[FreeMode, Scrollbar, Mousewheel]}
                style={{
                  maxHeight: "175px",
                  width: "100%",
                  overflow: "hidden",
                }}
              >
                {comments.map((comment) => (
                  <SwiperSlide
                    key={comment.nickname}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Box
                      borderWidth="1px"
                      p={3}
                      borderRadius="md"
                      width="100%"
                      bg="white"
                      mb={3}
                    >
                      <Text fontWeight="bold" fontSize="lg">
                        {comment.nickname}
                        <Text
                          as="span"
                          color="gray.500"
                          fontSize="sm"
                          fontWeight="medium"
                          ml={2}
                        >
                          {new Date(comment.inserted).toLocaleDateString()}
                        </Text>
                      </Text>
                      <Text mt={1}>{comment.comment}</Text>
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </Box>
        </>
      ) : (
        <Text>선택된 문의 내역이 없습니다.</Text>
      )}
    </Box>
  );
};
