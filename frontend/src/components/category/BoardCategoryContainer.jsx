import { Button, HStack } from "@chakra-ui/react";

export function BoardCategoryContainer({ selectedCategory, onCategorySelect }) {
  return (
    <HStack my={5} w="70%" justify="center" mx="auto">
      {BoardCategories.map((category) => (
        <Button
          key={category.value}
          flex="1"
          variant="outline"
          colorScheme="blue"
          onClick={() => onCategorySelect(category.value)}
          bg={selectedCategory === category.value ? "blue.100" : "transparent"}
          _hover={{ bg: "blue.50" }}
          _active={{ bg: "blue.200" }}
          _focus={{ boxShadow: "none" }}
          borderRadius="full"
          fontSize="lg"
          h="50px"
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
