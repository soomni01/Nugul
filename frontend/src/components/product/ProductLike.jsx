import { Box, Heading } from "@chakra-ui/react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { ToggleTip } from "../ui/toggle-tip.jsx";

export function ProductLike({
  productId,
  initialLike,
  initialCount,
  isHorizontal,
}) {
  const [like, setLike] = useState({ like: initialLike, count: initialCount });
  const [likeTooltipOpen, setLikeTooltipOpen] = useState(false);
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);

  const handleLikeClick = () => {
    if (hasAccess) {
      axios
        .post("/api/product/like", { productId })
        .then((res) => res.data)
        .then((data) => setLike(data))
        .catch((err) => console.error("관심 상품에 오류가 발생했습니다.", err));
    } else {
      setLikeTooltipOpen(!likeTooltipOpen);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection={isHorizontal ? "row" : "column"}
      alignItems="center"
      ml={isHorizontal ? "5" : "0"}
    >
      <Box onClick={handleLikeClick} cursor="pointer">
        <ToggleTip
          open={likeTooltipOpen}
          content={"로그인 후 좋아요를 클릭해주세요."}
        >
          <Heading fontSize="3xl">
            {like.like ? <GoHeartFill /> : <GoHeart />}
          </Heading>
        </ToggleTip>
      </Box>
      <Box ml={isHorizontal ? "2" : "0"} alignItems="center">
        {like.count}
      </Box>
    </Box>
  );
}
