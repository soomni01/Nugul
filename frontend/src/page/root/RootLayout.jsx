import { Box, Stack } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../components/root/Navbar.jsx";

export function RootLayout() {
  const location = useLocation();

  return (
    <Stack>
      <Box>
        {location.pathname === "/" ||
          location.pathname === "/member/signup" ||
          location.pathname === "/oauth/kakao" ||
          location.pathname === "/oauth/naver" ||
          location.pathname === "/member/social" || <Navbar />}
      </Box>
      <Box mx={{ md: 20, lg: 40 }}>
        <Outlet />
      </Box>
      {location.pathname === "chat" && (
        <Box>
          <Outlet />
        </Box>
      )}
    </Stack>
  );
}
