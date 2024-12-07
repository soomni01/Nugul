import {Box, Flex, HStack} from "@chakra-ui/react";
import {Button} from "../ui/button.jsx";

export function CommentItem({ comment,onDeleteClick }) {
  return (
    <HStack boarder={"1px solid black"} m={5}>
        <Box flex={1}>
      <Flex justify={"space-between"}>
        <h3>{comment.memberId}</h3>
        <h4>{comment.inserted}</h4>
      </Flex>
      <p>{comment.comment}</p>
        </Box>
        <Box>
            <Button colorPalette={"purple"}>수정</Button>
            <Button colorPalette={"red"} onClick={() => onDeleteClick(comment.commentId)}>
                삭제
            </Button>
        </Box>
    </HStack>
  );
}
