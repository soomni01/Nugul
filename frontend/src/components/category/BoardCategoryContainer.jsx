import { Button, HStack } from "@chakra-ui/react";
import { useTheme } from "../context/ThemeProvider.jsx";

export function BoardCategoryContainer({ selectedCategory, onCategorySelect }) {
  const { primaryColor, secondaryColor, fontColor } = useTheme();

  return (
    <HStack my={5} w="70%" justify="center" mx="auto">
      {BoardCategories.map((category) => (
        <Button
          key={category.value}
          flex="1"
          variant="outline"
          colorScheme={primaryColor}
          onClick={() => onCategorySelect(category.value)}
          bg={
            selectedCategory === category.value ? primaryColor : "transparent"
          }
          _hover={{ bg: primaryColor }}
          borderRadius="full"
          fontSize="lg"
          h="45px"
          mx={1.5}
          fontWeight="bold"
          color={fontColor}
        >
          {category.label}
        </Button>
      ))}
    </HStack>
  );
}

// boardCategories 배열을 정의하고 export
export const BoardCategories = [
  { label: "전체", value: "all" },
  { label: "맛집", value: "restaurant" },
  { label: "생활", value: "life" },
  { label: "리뷰", value: "review" },
  { label: "고민", value: "concern" },
  { label: "기타", value: "other" },
];
