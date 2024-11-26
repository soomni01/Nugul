import { Box, Flex, Link, Text, VStack } from "@chakra-ui/react";
import { Link as RouterLink, Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <Flex minH="100vh">
      {/* 사이드바 */}
      <Box
        w="250px"
        bg="gray.800"
        color="white"
        p={5}
        position="fixed"
        height="100vh"
      >
        <VStack align="start" spacing={4}>
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            ADMIN
          </Text>
          <Link
            as={RouterLink}
            to="/admin/dashboard"
            _hover={{ textDecoration: "none" }}
          >
            대시보드
          </Link>
          <Link
            as={RouterLink}
            to="/admin/members"
            _hover={{ textDecoration: "none" }}
          >
            사용자 관리
          </Link>
          <Link
            as={RouterLink}
            to="/admin/reports"
            _hover={{ textDecoration: "none" }}
          >
            신고 관리
          </Link>
          <Link
            as={RouterLink}
            to="/admin/settings"
            _hover={{ textDecoration: "none" }}
          >
            설정
          </Link>
        </VStack>
      </Box>

      {/* 메인 콘텐츠 */}
      <Box
        ml="250px" // 사이드바 너비만큼 마진을 줌
        p={5}
        flex="1"
        bg="gray.50"
      >
        <Outlet /> {/* 자식 페이지를 렌더링 */}
      </Box>
    </Flex>
  );
}
