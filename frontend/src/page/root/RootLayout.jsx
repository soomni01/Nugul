import { Box, Stack } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../components/root/Navbar.jsx";

export function RootLayout() {
  const location = useLocation();

  console.log(location.pathname);
  return (
    <Stack mx={{ md: 20, lg: 40 }}>
      {/* 로그인("/")과 회원가입("/member/signup")에서 네브바 숨기기 */}
      <Box>
        {location.pathname === "/" ||
          location.pathname === "/member/signup" || <Navbar />}
      </Box>
      <Box mx={{ md: 20, lg: 40 }}>
        <Outlet />
      </Box>
    </Stack>
  );
}
