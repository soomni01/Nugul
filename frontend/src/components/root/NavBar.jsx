import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { useContext } from "react";

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

  const { id, nickname } = useContext(AuthenticationContext);

  return (
    <Flex gap={3}>
      <NavbarItem onClick={() => navigate("/main")}>HOME</NavbarItem>
      <NavbarItem onClick={() => navigate("/product/list")}>
        중고거래
      </NavbarItem>
      <NavbarItem onClick={() => navigate("/product/share/list")}>
        나눔
      </NavbarItem>
      <NavbarItem onClick={() => navigate("/board/list")}>게시판</NavbarItem>
      <NavbarItem onClick={() => navigate("/chat")}>채팅</NavbarItem>
      <NavbarItem onClick={() => navigate("/inquiry")}>문의하기</NavbarItem>
      <NavbarItem>{nickname}</NavbarItem>
      <NavbarItem onClick={() => navigate(`/myPage`)}>마이페이지</NavbarItem>
      <NavbarItem
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("activeTab");
          navigate("/");
        }}
      >
        로그아웃
      </NavbarItem>
    </Flex>
  );
}
