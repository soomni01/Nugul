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

  return (
    <Flex direction="column" minH="100vh">
      {/* 네브바 */}
      <HStack
        w="full"
        bg="white"
        color="black"
        p={7}
        position="fixed"
        top="0"
        left="0"
        justify="space-between"
        zIndex="1"
        boxShadow="0px 2px 10px rgba(0, 0, 0, 0.15)"
      ></HStack>

      {/* 사이드바 */}
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
          {" "}
          Admin
        </Text>
        <VStack align="start" spacing={6}>
          {" "}
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

      {/* 메인 콘텐츠 */}
      <Box
        ml="250px" // 사이드바 너비만큼 마진을 주어 메인 콘텐츠를 이동
        pt="64px" // 네브바 높이만큼 패딩을 줘서 네브바 아래로 콘텐츠가 위치하도록 설정
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
