import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

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
  return (
    <Flex gap={3}>


      <NavbarItem onClick={() => navigate("/")}>HOME</NavbarItem>
      <NavbarItem onClick={() => navigate("/product/list")}>중고거래</NavbarItem>
      <NavbarItem onClick={() => navigate("/member/signup")}>가입</NavbarItem>
      <NavbarItem onClick={() => navigate("/member/login")}>로그인</NavbarItem>
      <NavbarItem
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/member/login");
        }}
      >
        로그아웃
      </NavbarItem>

      
    
      <NavbarItem onClick={() => navigate("/product/share/list")}>
        나눔
      </NavbarItem>
      <NavbarItem onClick={() => navigate("/chat")}>채팅</NavbarItem>
      <NavbarItem onClick={() => navigate("/inquiry")}>문의하기</NavbarItem>
      <NavbarItem onClick={() => navigate(`/member/${id}`)}>
        마이페이지
      </NavbarItem>

    </Flex>
  );
}
