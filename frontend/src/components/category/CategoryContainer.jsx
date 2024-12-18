import { Box, HStack, Image, Text } from "@chakra-ui/react";

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
          p={2}
        >
          <Image
            src={category.imageUrl}
            alt={category.label}
            boxSize="50px" // 이미지 크기 설정
            objectFit="contain"
            mx="auto" // 가운데 정렬
          />
          <Text>{category.label}</Text>
        </Box>
      ))}
    </HStack>
  );
}

export const categories = [
  {
    label: "전체",
    value: "all",
    imageUrl: "../../public/image/category/all.png",
  },
  {
    label: "의류",
    value: "clothes",
    imageUrl: "../../public/image/category/clothes.png",
  },
  {
    label: "잡화",
    value: "miscellaneous",
    imageUrl: "../../public/image/category/miscellaneous.png",
  },
  {
    label: "식품",
    value: "food",
    imageUrl: "../../public/image/category/food.png",
  },
  {
    label: "뷰티",
    value: "beauty",
    imageUrl: "../../public/image/category/beauty.png",
  },
  {
    label: "디지털 기기",
    value: "digital",
    imageUrl: "../../public/image/category/digital.png",
  },
  {
    label: "쿠폰",
    value: "coupon",
    imageUrl: "../../public/image/category/coupon.png",
  },
];
