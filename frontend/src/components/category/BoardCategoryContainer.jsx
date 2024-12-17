import {Box, Button, Flex, HStack} from "@chakra-ui/react";

export function BoardCategoryContainer({ selectedCategory, onCategorySelect }) {
    return (
        <HStack my={5} spacing={0} w="100%" justify="space-between">
            {BoardCategories.map((category) => (
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

// boardCategories 배열을 정의하고 export
export const BoardCategories = [
    {label: "전체", value: "all"},
    {label: "맛집", value: "restaurant"},
    {label: "생활", value: "life"},
    {label: "리뷰", value: "review"},
    {label: "고민", value: "concern"},
    {label: "기타", value: "other"},
];
