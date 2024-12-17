import { useNavigate } from "react-router-dom";
import { Box, Flex, Heading } from "@chakra-ui/react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { useContext } from "react";
import { Avatar } from "../ui/avatar.jsx";
import { kakaoLogout } from "../social/KakaoLogin.jsx";
import { MdLogout } from "react-icons/md";

function NavbarItem({ children, ...rest }) {
  return (
    <Box
      css={{
        paddingX: "20px",
        paddingY: "15px",
      }}
      _hover={{
        bgColor: "blue.300",
        cursor: "pointer",
      }}
      {...rest}
    >
      {children}
    </Box>
  );
}

export function Navbar() {
  const navigate = useNavigate();

  const { id, nickname, profileImage } = useContext(AuthenticationContext);

  const handleNavigation = (path) => {
    // activeTab을 삭제하여 초기화
    localStorage.removeItem("activeTab");
    // 해당 페이지로 이동
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // 사용자 토큰 삭제
      localStorage.removeItem("token");
      localStorage.removeItem("nickname");
      // 카카오 로그인 사용자는 카카오 액세스 토큰 삭제
      if (sessionStorage.getItem("kakaoAccessToken")) {
        await kakaoLogout();
      } else if (sessionStorage.getItem("naverAccessToken")) {
        sessionStorage.removeItem("naverAccessToken");
      }
      navigate("/");
    } catch (error) {
      console.error("로그아웃에 실패했습니다.", error);
    }
  };
  return (
    <Box background="gray.200">
      <Flex justify="space-between" align="center" width="100%">
        {/* 왼쪽: HOME */}
        <Flex>
          <NavbarItem onClick={() => handleNavigation("/main")}>
            <Heading size="3xl">너굴마켓</Heading>
          </NavbarItem>
        </Flex>

        {/* 가운데: 중고거래, 나눔, 게시판, 지도 */}
        <Flex justify="center" flex="1" gap={3}>
          <NavbarItem onClick={() => handleNavigation("/product/list")}>
            <Heading>중고거래</Heading>
          </NavbarItem>
          <NavbarItem onClick={() => handleNavigation("/product/share/list")}>
            <Heading>나눔</Heading>
          </NavbarItem>
          <NavbarItem onClick={() => handleNavigation("/board/list")}>
            <Heading>게시판</Heading>
          </NavbarItem>
          <NavbarItem onClick={() => handleNavigation("/map")}>
            <Heading>지도</Heading>
          </NavbarItem>
        </Flex>

        {/* 오른쪽: 문의하기, 마이페이지, 로그아웃 */}
        <Flex align="center" justify="center" gap={3}>
          <NavbarItem onClick={() => handleNavigation("/inquiry")}>
            1:1 문의
          </NavbarItem>
          <NavbarItem onClick={() => handleNavigation("/myPage")} p={0}>
            <Avatar
              boxSize="80px"
              my={3}
              src={profileImage}
              name={nickname}
              variant="outline"
            />
          </NavbarItem>
          <NavbarItem onClick={handleLogout}>
            <Box fontSize="36px">
              <MdLogout />
            </Box>
          </NavbarItem>
        </Flex>
      </Flex>
    </Box>
  );
}
