import { Box, Flex } from "@chakra-ui/react";

export function CommentItem({ comment }) {
  return (
    <Box boarder={"1px solid black"} m={5}>
      <Flex justify={"space-between"}>
        <h3>{comment.memberId}</h3>
        <h4>{comment.inserted}</h4>
      </Flex>
      <p>{comment.comment}</p>
    </Box>
  );
}
