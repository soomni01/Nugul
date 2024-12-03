import { Box, Heading } from "@chakra-ui/react";

export function SoldItems() {
  return (
    <Box>
      <Heading size="lg" mb={4}>
        내가 판매한 상품
      </Heading>
      <Box>여기에는 내가 판매한 상품이 표시됩니다.</Box>
    </Box>
  );
}
