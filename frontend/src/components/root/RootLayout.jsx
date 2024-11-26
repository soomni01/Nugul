import { Box, Stack } from "@chakra-ui/react";
import { Navbar } from "../../page/root/Navbar.jsx";

export function RootLayout() {
  return (
    <Stack>
      <Box>
        <Navbar />
      </Box>
    </Stack>
  );
}
