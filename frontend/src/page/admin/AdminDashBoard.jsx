import React from "react";
import { Box, Flex, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { Checkbox } from "../../components/ui/checkbox.jsx";

function AdminDashBoard() {
  const boxWidth = useBreakpointValue({
    base: "100%",
    sm: "80%",
    md: "60%",
    lg: "40%",
    xl: "25%",
  });

  const boxHeight = useBreakpointValue({
    base: "auto",
    lg: "150%",
  });

  return (
    <Flex
      direction="column"
      gap={8}
      h="100vh"
      mt="5%" // 네브바와의 여백 설정
      ml="2%" // 사이드바와의 여백 설정
    >
      {/* 1, 2번째 박스는 가로로 정렬 */}
      <Flex direction={{ base: "column", lg: "row" }} gap={8}>
        <Box
          w={boxWidth}
          h={boxHeight}
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1)"
        >
          <VStack spacing={4} align="start">
            <Text fontSize="xl" fontWeight="bold" p={2}>
              기본 설정
            </Text>
            <Checkbox>디자인 편집하기</Checkbox>
            <Checkbox>도메인 연결하기</Checkbox>
          </VStack>
        </Box>
        <Box
          w={boxWidth}
          h={boxHeight}
          p={4}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1)"
        >
          <VStack spacing={4} align="start">
            <Text fontSize="xl" fontWeight="bold" p={2}>
              성장하기
            </Text>
            <Checkbox>소셜 로그인 추가하기</Checkbox>
            <Checkbox>비밀번호 찾기 추가하기</Checkbox>
            <Checkbox>카카오페이 기능 추가하기</Checkbox>
            <Checkbox>알림톡 설정하기</Checkbox>
            <Checkbox>방문자 분석하기</Checkbox>
          </VStack>
        </Box>
      </Flex>

      {/* 3번째 박스는 아래로 위치 */}
      <Box
        w="55%"
        h="45%"
        p={2}
        mt="7%"
        border="1px"
        borderColor="gray.200"
        borderRadius="md"
        boxShadow="0px 4px 10px rgba(0, 0, 0, 0.1), 0px -4px 10px rgba(0, 0, 0, 0.1)"
      >
        <Flex align="center" gap={2} mb={4}>
          <Text fontSize="xl" fontWeight="bold" p={3}>
            방문자 현황
          </Text>
          <Box w="18px" h="18px" bg="#F15F5F" borderRadius="full"></Box>
          <Text fontSize="ml" fontWeight="bold" color="gray.700">
            방문자
          </Text>
        </Flex>
        {/* 그래프나 통계를 추가할 영역 */}
        <Box
          w="100%"
          h="80%"
          bg="gray.50"
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          d="flex"
          alignItems="center"
          justifyContent="center"
        >
          {/* 내용 추가 가능 */}
        </Box>
      </Box>
    </Flex>
  );
}

export default AdminDashBoard;
