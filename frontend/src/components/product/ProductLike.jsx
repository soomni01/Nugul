import { Box, Heading } from "@chakra-ui/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import React, { useState } from "react";
import axios from "axios";

export function ProductLike({
  productId,
  initialLike,
  initialCount,
  isHorizontal,
}) {
  const [like, setLike] = useState({ like: initialLike, count: initialCount });

  const handleLikeClick = () => {
    axios
      .post("/api/product/like", { productId })
      .then((res) => res.data)
      .then((data) => setLike(data))
      .catch((err) => console.error("Error liking product:", err));
  };

  return (
    <Box
      display="flex"
      flexDirection={isHorizontal ? "row" : "column"}
      alignItems="center"
      ml={isHorizontal ? "5" : "0"}
    >
      <Box onClick={handleLikeClick} cursor="pointer">
        <Heading fontSize="3xl">
          {like.like ? <GoHeartFill /> : <GoHeart />}
        </Heading>
      </Box>
      <Box ml={isHorizontal ? "2" : "0"} alignItems="center">
        {like.count}
      </Box>
    </Box>
  );
}
