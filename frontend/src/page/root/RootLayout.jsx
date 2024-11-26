import { useState } from "react";
import { Box, Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../../components/root/Navbar.jsx";
import AdminLayout from "../../page/admin/AdminLayout.jsx"; // AdminLayout import

export function RootLayout() {
  const [userRole, setUserRole] = useState("admin"); // 관리자 상태

  return (
    <Stack mx={{ md: 20, lg: 40 }}>
      {/* 관리자가 아닐 때만 Navbar 표시 */}
      {userRole !== "admin" && (
        <Box>
          <Navbar />
        </Box>
      )}

      {/* 관리자가 아닐 때는 RootLayout을 표시하고, 관리자는 AdminLayout을 표시 */}
      {userRole === "admin" ? (
        <AdminLayout /> // AdminLayout을 보여줍니다.
      ) : (
        <Box mx={{ md: 20, lg: 40 }}>
          <Outlet />
        </Box>
      )}
    </Stack>
  );
}
