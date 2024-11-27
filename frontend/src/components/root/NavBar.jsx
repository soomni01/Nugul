import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>HOME</Box>
      <Box onClick={() => navigate("/product/list")}>중고거래</Box>
      <Box onClick={() => navigate("/sh")}>나눔</Box>
      <Box onClick={() => navigate("/chat")}>채팅</Box>
      <Box onClick={() => navigate("/add")}>문의하기</Box>
      <Box onClick={() => navigate(`/member/${id}`)}>마이페이지</Box>

      <Box onClick={() => navigate("/member/signup")}>가입</Box>
      <Box onClick={() => navigate("/member/list")}>회원 목록</Box>
    </Flex>
  );
}
