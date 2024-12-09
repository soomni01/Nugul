import {Box, Button, Flex, HStack} from "@chakra-ui/react";
import { BoardCategories } from "./BoardCategories.jsx";

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
