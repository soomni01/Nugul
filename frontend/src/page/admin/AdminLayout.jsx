import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  // 로그아웃 처리: 토큰을 제거하고 홈 화면으로 이동함
  function logout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <Flex direction="column" minH="100vh">
      <HStack
        w="full"
        bg="white"
        color="black"
        p={7}
        position="fixed"
        top="0"
        left="0"
        height="65px"
        justify="space-between"
        zIndex="1"
        boxShadow="0px 2px 10px rgba(0, 0, 0, 0.15)"
      >
        <Text fontSize="30px" fontWeight="bold">
          Admin
        </Text>
        <Button onClick={logout} colorScheme="red" variant="outline">
          로그아웃
        </Button>
      </HStack>
      <Box
        w="250px"
        bg="gray"
        color="white"
        p={5}
        position="fixed"
        top="0"
        left="0"
        height="100vh"
        overflowY="auto"
        zIndex="2"
      >
        <Text fontSize="30px" fontWeight="bold" mb={4}>
          Admin
        </Text>
        <VStack align="start" spacing={6}>
          <Button
            onClick={() => navigate("/admin/dashboard")}
            variant={
              location.pathname === "/admin/dashboard" ? "solid" : "ghost"
            }
            color={location.pathname === "/admin/dashboard" ? "white" : "black"} // 선택된 버튼 색상 변경
            bg={
              location.pathname === "/admin/dashboard"
                ? "#A6A6A6"
                : "transparent"
            }
            _hover={{
              bg:
                location.pathname === "/admin/dashboard"
                  ? "#A6A6A6"
                  : "#A6A6A6",
            }}
            justifyContent="flex-start"
            w="100%"
            fontSize="17px"
          >
            <Flex align="center" gap={2}>
              <Image
                src="/image/DashBoard.png"
                alt="Dashboard Icon"
                boxSize="20px"
              />
              <Text>대시보드</Text>
            </Flex>
          </Button>
          <Button
            onClick={() => navigate("/admin/members")}
            variant={location.pathname === "/admin/members" ? "solid" : "ghost"}
            color={location.pathname === "/admin/members" ? "white" : "black"}
            bg={
              location.pathname === "/admin/members" ? "#A6A6A6" : "transparent"
            }
            _hover={{
              bg:
                location.pathname === "/admin/members" ? "#A6A6A6" : "#A6A6A6",
            }}
            justifyContent="flex-start"
            w="100%"
            fontSize="17px"
          >
            <Flex align="center" gap={2}>
              <Image src="/image/Member.png" alt="Member Icon" boxSize="20px" />
              <Text>회원 관리</Text>
            </Flex>
          </Button>
          <Button
            onClick={() => navigate("/admin/reports")}
            variant={location.pathname === "/admin/reports" ? "solid" : "ghost"}
            color={location.pathname === "/admin/reports" ? "white" : "black"}
            bg={
              location.pathname === "/admin/reports" ? "#A6A6A6" : "transparent"
            }
            _hover={{
              bg:
                location.pathname === "/admin/reports" ? "#A6A6A6" : "#A6A6A6",
            }}
            justifyContent="flex-start"
            w="100%"
            fontSize="17px"
          >
            <Flex align="center" gap={2}>
              <Image src="/image/Report.png" alt="Report Icon" boxSize="20px" />
              <Text>신고 관리</Text>
            </Flex>
          </Button>
          <Button
            onClick={() => navigate("/admin/inquiries")}
            variant={
              location.pathname === "/admin/inquiries" ? "solid" : "ghost"
            }
            color={location.pathname === "/admin/inquiries" ? "white" : "black"}
            bg={
              location.pathname === "/admin/inquiries"
                ? "#A6A6A6"
                : "transparent"
            }
            _hover={{
              bg:
                location.pathname === "/admin/inquiries"
                  ? "#A6A6A6"
                  : "#A6A6A6",
            }}
            justifyContent="flex-start"
            w="100%"
            fontSize="17px"
          >
            <Flex align="center" gap={2}>
              <Image
                src="/image/Inquiry.png"
                alt="Report Icon"
                boxSize="20px"
              />
              <Text>1:1 문의</Text>
            </Flex>
          </Button>
        </VStack>
      </Box>
      <Box
        ml="250px"
        pt="64px"
        p={5}
        flex="1"
        bg="gray.50"
        height="calc(100vh - 64px)"
        overflowY="auto"
      >
        <Outlet />
      </Box>
    </Flex>
  );
}
