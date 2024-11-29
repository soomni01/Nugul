import { Box, HStack } from "@chakra-ui/react";
import { useState } from "react";

export function CategoryContainer({ onCategorySelect }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    onCategorySelect(category);
  };

  return (
    <HStack my={5} spacing={0} w="100%" justify="space-between">
      {categories.map((category) => (
        <Box
          key={category.value}
          flex="1"
          textAlign="center"
          onClick={() => handleCategoryClick(category.value)} // 카테고리 클릭 시 선택 처리
          bg={selectedCategory === category.value ? "gray.200" : "transparent"} // 선택된 카테고리 배경 색상 설정
          _hover={{ cursor: "pointer", bg: "gray.100" }} // 마우스 올릴 때 배경 색상 변화
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
