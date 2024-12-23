import { useLocation, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { useContext, useEffect, useState } from "react";
import { kakaoLogout } from "../social/KakaoLogin.jsx";
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from "../ui/menu.jsx";
import { Avatar } from "../ui/avatar.jsx";
import axios from "axios";

function NavbarItem({ children, isActive, ...rest }) {
  return (
    <Box
      css={{
        paddingX: "20px",
        paddingY: "10px",
        borderRadius: "20px",
      }}
      bgColor={isActive ? "blue.300" : "transparent"}
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
  const location = useLocation();
  const [productType, setProductType] = useState(null);

  const { id, nickname, profileImage } = useContext(AuthenticationContext);

  useEffect(() => {
    const pathParts = location.pathname.split("/");
    if (
      (pathParts[1] === "product" && pathParts[2] === "view") ||
      (pathParts[1] === "product" && pathParts[2] === "edit")
    ) {
      const productId = pathParts[3];
      axios.get(`/api/product/${productId}`).then((res) => {
        setProductType(res.data); // Assume API response has { type: "sale" | "share" }
      });
    }
  }, [location.pathname]);

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
    <Box background="gray.100" borderBottom={"1px solid"}>
      <Flex justify="space-between" align="center" width="100%">
        <Flex align="center">
          <Button
            onClick={() => handleNavigation("/main")}
            bg="transparent"
            _hover={{ bg: "gray.100" }} // 호버 효과
            p={0} // 버튼 안 여백 제거
          >
            <Image
              src="/image/MainLogo.png"
              alt="메인으로 이동"
              maxWidth="130px" // 너비 제한
              maxHeight="100px" // 높이 제한
              ml={6}
            />
          </Button>
          <NavbarItem
            ml={5}
            onClick={() => handleNavigation("/main")}
          ></NavbarItem>
        </Flex>

        {/* 가운데: 중고거래, 나눔, 게시판, 지도 */}
        <Flex justify="center" flex="1" gap={3} mr={32}>
          <NavbarItem
            onClick={() => handleNavigation("/product/list")}
            isActive={
              location.pathname.startsWith("/product/list") ||
              (location.pathname.startsWith("/product/view") &&
                productType === "sell") ||
              (location.pathname.startsWith("/product/edit") &&
                productType === "sell")
            }
          >
            <Heading
              fontFamily="Ownglyph_ParkDaHyun, sans-serif"
              fontSize="3xl"
            >
              중고거래
            </Heading>
          </NavbarItem>
          <NavbarItem
            onClick={() => handleNavigation("/product/share/list")}
            isActive={
              location.pathname.startsWith("/product/share/list") ||
              (location.pathname.startsWith("/product/view") &&
                productType === "share") ||
              (location.pathname.startsWith("/product/edit") &&
                productType === "share")
            }
          >
            <Heading
              fontFamily="Ownglyph_ParkDaHyun, sans-serif"
              fontSize="3xl"
            >
              나눔
            </Heading>
          </NavbarItem>
          <NavbarItem
            onClick={() => handleNavigation("/board/list")}
            isActive={[
              "/board/list",
              "/board/boardView",
              "/board/boardAdd",
            ].some((path) => location.pathname.startsWith(path))}
          >
            <Heading
              fontFamily="Ownglyph_ParkDaHyun, sans-serif"
              fontSize="3xl"
            >
              게시판
            </Heading>
          </NavbarItem>
          <NavbarItem
            onClick={() => handleNavigation("/chat")}
            isActive={location.pathname === "/chat"}
          >
            <Heading
              fontFamily="Ownglyph_ParkDaHyun, sans-serif"
              fontSize="3xl"
            >
              채팅
            </Heading>
          </NavbarItem>
          <NavbarItem
            onClick={() => handleNavigation("/map")}
            isActive={location.pathname === "/map"}
          >
            <Heading
              fontFamily="Ownglyph_ParkDaHyun, sans-serif"
              fontSize="3xl"
            >
              지도
            </Heading>
          </NavbarItem>
        </Flex>

        <Flex align="center" justify="center" gap={3} mr={10}>
          <NavbarItem p={0}>
            <MenuRoot>
              <MenuTrigger asChild>
                <Box>
                  <Avatar
                    boxSize="70px"
                    my={2}
                    src={profileImage || "/image/default.png"}
                    name={nickname}
                    variant="outline"
                  />
                </Box>
              </MenuTrigger>
              <MenuContent>
                <MenuItem
                  value={"myPage"}
                  onClick={() => handleNavigation("/myPage")}
                  style={{ cursor: "pointer" }}
                >
                  마이페이지
                </MenuItem>
                <MenuItem
                  value={"inquiry"}
                  onClick={() => handleNavigation("/inquiry/myList")}
                  style={{ cursor: "pointer" }}
                >
                  1:1 문의
                </MenuItem>
                <MenuItem onClick={handleLogout} style={{ cursor: "pointer" }}>
                  로그아웃
                </MenuItem>
              </MenuContent>
            </MenuRoot>
          </NavbarItem>
        </Flex>
      </Flex>
    </Box>
  );
}
