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

export const categories = [
  { label: "전체", value: "all" },
  { label: "의류", value: "clothes" },
  { label: "잡화", value: "angular" },
  { label: "식품", value: "food" },
  { label: "뷰티", value: "beauty" },
  { label: "디지털 기기", value: "digital" },
  { label: "쿠폰", value: "coupon" },
];
