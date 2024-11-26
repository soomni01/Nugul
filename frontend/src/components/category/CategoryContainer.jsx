import { Box, HStack } from "@chakra-ui/react";

export function CategoryContainer() {
  return (
    <HStack my={5} spacing={0} w="100%" justify="space-between">
      <Box flex="1" textAlign="center">
        전체
      </Box>
      <Box flex="1" textAlign="center">
        의류
      </Box>
      <Box flex="1" textAlign="center">
        잡화
      </Box>
      <Box flex="1" textAlign="center">
        식품
      </Box>
      <Box flex="1" textAlign="center">
        뷰티
      </Box>
      <Box flex="1" textAlign="center">
        디지털 기기
      </Box>
      <Box flex="1" textAlign="center">
        쿠폰
      </Box>
    </HStack>
  );
}
