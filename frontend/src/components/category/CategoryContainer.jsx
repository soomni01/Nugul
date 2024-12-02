import { Box, HStack } from "@chakra-ui/react";

export function CategoryContainer({ selectedCategory, onCategorySelect }) {
  return (
    <HStack my={5} spacing={0} w="100%" justify="space-between">
      {categories.map((category) => (
        <Box
          key={category.value}
          flex="1"
          textAlign="center"
          onClick={() => onCategorySelect(category.value)}
          bg={selectedCategory === category.value ? "gray.200" : "transparent"}
          _hover={{ cursor: "pointer", bg: "gray.100" }}
          p={2} // 클릭 영역을 넓히기 위한 패딩
        >
          {category.label}
        </Box>
      ))}
    </HStack>
  );
}

export const categories = [
  { label: "전체", value: "all" },
  { label: "의류", value: "clothes" },
  { label: "잡화", value: "miscellaneous" },
  { label: "식품", value: "food" },
  { label: "뷰티", value: "beauty" },
  { label: "디지털 기기", value: "digital" },
  { label: "쿠폰", value: "coupon" },
];
