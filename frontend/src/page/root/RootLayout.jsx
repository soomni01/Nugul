import { Box, Stack } from "@chakra-ui/react";
import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../../components/root/Navbar.jsx";

export function RootLayout() {
  const location = useLocation();

  return (
    <Stack mx={{ md: 20, lg: 40 }}>
      <Box>
        {location.pathname === "/" ||
          location.pathname === "/member/signup" ||
          location.pathname === "/oauth" ||
          location.pathname === "/kakao/callback" || <Navbar />}
      </Box>
      <Box mx={{ md: 20, lg: 40 }}>
        <Outlet />
      </Box>
    </Stack>
  );
}
