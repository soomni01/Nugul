import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Input, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { Field } from "../../components/ui/field.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
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
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";

export default function InquiryEdit() {
  const [inquiry, setInquiry] = useState(null);
  const [category, setCategory] = useState("");
  const [progress, setProgress] = useState(false);
  const { inquiryId } = useParams();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);

  // 컴포넌트 마운트 시 문의 정보를 가져오는 useEffect
  useEffect(() => {
    const fetchInquiry = async () => {
      try {
        const response = await axios.get(
          `/api/myPage/view?inquiryId=${inquiryId}`,
        );
        if (response.status === 200) {
          setInquiry(response.data);
          setCategory(response.data.category);
        }
      } catch (error) {
        console.error("문의 내역을 불러오는 중 오류가 발생했습니다:", error);
      }
    };
    fetchInquiry();
  }, [inquiryId]);

  // 입력 필드 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInquiry((prevInquiry) => ({
      ...prevInquiry,
      [name]: value,
    }));
  };

  // 카테고리 선택 핸들러
  const handleCategoryChange = (e) => {
    const { value } = e.target;
    setInquiry((prevInquiry) => ({
      ...prevInquiry,
      category: value,
    }));
    setCategory(value);
  };

  // 저장 버튼 클릭 시 호출되는 함수
  const handleSaveClick = () => {
    setProgress(true); // 로딩 상태 활성화
    axios
      .put("/api/myPage/edit", inquiry) // 수정 요청
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        setInquiry(data); // 상태 업데이트
        navigate(`/myPage/${inquiry.inquiryId}`);
      })
      .catch((e) => {
        const message = e.response?.data?.message || {
          type: "error",
          text: "서버에서 오류가 발생했습니다.",
        };
        toaster.create({
          type: message.type,
          description: message.text,
        });
      })
      .finally(() => {
        setProgress(false);
      });
  };

  // 문의 정보가 없으면 로딩 중 메시지 출력
  if (!inquiry) {
    return <Text>문의 내역을 불러오는 중입니다...</Text>;
  }

  // 제목과 내용이 빈 경우 저장 버튼 비활성화
  const disabled = !(
    inquiry.title.trim().length > 0 && inquiry.content.trim().length > 0
  );

  return (
    <Box mt="20px">
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        문의 수정
      </Text>
      <Box mb={3}>
        <Field mb={2}>문의 유형</Field>
        <select
          value={category}
          onChange={handleCategoryChange}
          style={{
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #CBD5E0",
          }}
        >
          <option value="">문의 유형 선택</option>
          <option value="이용 안내">이용 안내</option>
          <option value="구매 안내">구매 안내</option>
          <option value="기타 문의">기타 문의</option>
        </select>
        <Field mb={2}>제목</Field>
        <Input name="title" value={inquiry.title} onChange={handleChange} />
        <Field mb={2}>작성자</Field>
        <Input value={inquiry.memberId} readOnly />
        <Field mb={2}>작성 일자</Field>
        <Input
          value={new Date(inquiry.inserted).toLocaleDateString()}
          readOnly
        />
        <Field mb={2}>내용</Field>
        <Textarea
          name="content"
          value={inquiry.content}
          onChange={handleChange}
        />
        {/*<Text mb={2}>상태</Text>*/}
        {/*{inquiry.hasAnswer ? (*/}
        {/*  <Badge variant="subtle" colorScheme="green">*/}
        {/*    <FaCommentDots /> 답변 완료*/}
        {/*  </Badge>*/}
        {/*) : (*/}
        {/*  <Badge variant="subtle" colorScheme="red">*/}
        {/*    <FaCommentDots /> 답변 대기*/}
        {/*  </Badge>*/}
        {/*)}*/}
      </Box>
      {/* 수정 권한이 있을 때 다이얼로그 및 저장 버튼 표시 */}
      {hasAccess(inquiry.memberId) && (
        <Box>
          <DialogRoot
            open={dialogOpen}
            onOpenChange={(e) => setDialogOpen(e.open)}
          >
            <DialogTrigger asChild>
              <Button disabled={disabled} colorPalette={"blue"}>
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>저장 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>{inquiry.inquiryId}번 문의글을 수정하시겠습니까?</p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button
                  loading={progress}
                  colorPalette={"blue"}
                  onClick={handleSaveClick}
                >
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      )}
    </Box>
  );
}
