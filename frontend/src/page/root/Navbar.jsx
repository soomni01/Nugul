import { useNavigate } from "react-router-dom";
import { Box, Flex } from "@chakra-ui/react";

function NavbarItem() {
  return <Box> </Box>;
}

export function Navbar() {
  let navigate = useNavigate();

  return (
    <Flex>
      <NavbarItem>1</NavbarItem>
      <NavbarItem>2</NavbarItem>
      <NavbarItem>3</NavbarItem>
      <NavbarItem>4</NavbarItem>
    </Flex>
  );
}
