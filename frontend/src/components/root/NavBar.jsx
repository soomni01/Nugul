import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <Flex gap={3}>
      <Box onClick={() => navigate("/")}>HOME</Box>
      <Box onClick={() => navigate("/product/list")}>중고 거래</Box>
      <Box onClick={() => navigate("/sh")}>무료 나눔</Box>
      <Box onClick={() => navigate("/chat")}>채팅</Box>
      <Box onClick={() => navigate("/add")}>문의</Box>
      <Box onClick={() => navigate(`/member/${id}`)}>마이페이지</Box>
    </Flex>
  );
}
