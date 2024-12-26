import { Box, HStack, Image, Text } from "@chakra-ui/react";
import { useTheme } from "../context/ThemeProvider.jsx";

export function CategoryContainer({ selectedCategory, onCategorySelect }) {
  const { primaryColor, secondaryColor, fontColor } = useTheme();

  return (
    <HStack my={5} spacing={0} w="100%" justifyContent="center">
      {categories.map((category) => (
        <Box
          key={category.value}
          textAlign="center"
          onClick={() => onCategorySelect(category.value)}
          bg={
            selectedCategory === category.value ? primaryColor : "transparent"
          }
          _hover={{ cursor: "pointer", bg: primaryColor }}
          p={3}
          borderRadius="full"
          justifyContent="center"
          alignItems="center"
          display="flex"
          flexDirection="column"
          width={"150px"}
          height={"150px"}
        >
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            width={"80px"}
            height={"80px"}
          >
            <Image
              src={category.imageUrl}
              alt={category.label}
              boxSize="100%" // 이미지 크기를 Box에 맞게 설정
            />
          </Box>
          <Text color={fontColor} fontWeight="bold">
            {category.label}
          </Text>
        </Box>
      ))}
    </HStack>
  );
}

export const categories = [
  {
    label: "전체",
    value: "all",
    imageUrl: "/image/category/all.png",
  },
  {
    label: "의류",
    value: "clothes",
    imageUrl: "/image/category/clothes.png",
  },
  {
    label: "잡화",
    value: "miscellaneous",
    imageUrl: "/image/category/miscellaneous.png",
  },
  {
    label: "식품",
    value: "food",
    imageUrl: "/image/category/food.png",
  },
  {
    label: "뷰티",
    value: "beauty",
    imageUrl: "/image/category/beauty.png",
  },
  {
    label: "디지털 기기",
    value: "digital",
    imageUrl: "/image/category/digital.png",
  },
  {
    label: "쿠폰",
    value: "coupon",
    imageUrl: "/image/category/coupon.png",
  },
];
