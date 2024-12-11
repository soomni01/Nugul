import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { useContext } from "react";
import { Avatar } from "../ui/avatar.jsx";

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

  return (
    <Flex gap={3}>
      <NavbarItem onClick={() => handleNavigation("/main")}>HOME</NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/product/list")}>
        중고거래
      </NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/product/share/list")}>
        나눔
      </NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/board/list")}>
        게시판
      </NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/map")}>지도</NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/chat")}>채팅</NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/inquiry")}>
        문의하기
      </NavbarItem>
      <NavbarItem onClick={() => handleNavigation("/myPage")} p={0} mt="10px">
        <Avatar
          size="2xl"
          src={profileImage}
          name={nickname}
          variant="outline"
        />
      </NavbarItem>
      {/*<NavbarItem onClick={() => handleNavigation(`/myPage`)}>*/}
      {/*  마이페이지*/}
      {/*</NavbarItem>*/}

      <NavbarItem
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
      >
        로그아웃
      </NavbarItem>
    </Flex>
  );
}
