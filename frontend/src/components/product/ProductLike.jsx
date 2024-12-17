import { Box } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { ToggleTip } from "../ui/toggle-tip.jsx";
import { toaster } from "../ui/toaster.jsx";
import { FcLike } from "react-icons/fc";
import { GoHeart } from "react-icons/go";

export function ProductLike({
  productId,
  initialLike,
  initialCount,
  isHorizontal,
}) {
  const [like, setLike] = useState({ like: initialLike, count: initialCount });
  const [likeTooltipOpen, setLikeTooltipOpen] = useState(false);
  const { hasAccess, isAuthenticated } = useContext(AuthenticationContext);

  const handleLikeClick = (e) => {
    e.stopPropagation();
    if (hasAccess) {
      axios
        .post("/api/product/like", { productId })
        .then((res) => res.data)
        .then((data) => {
          setLike(data);
          toaster.create({
            type: "warning",
            description: "좋아요 버튼을 눌렀습니다.",
          });
        })
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
    >
      <Box onClick={handleLikeClick} cursor="pointer">
        <ToggleTip
          open={likeTooltipOpen}
          content={"로그인 후 좋아요를 클릭해주세요."}
        >
          <Box
            style={{
              fontSize: "2rem", // 좋아요 아이콘 크기 조정
              width: "auto", // 자동 크기 조정
              height: "auto", // 자동 크기 조정
            }}
          >
            {like.like ? <FcLike /> : <GoHeart />}
          </Box>
        </ToggleTip>
      </Box>
      <Box ml={isHorizontal ? "2" : "0"} textAlign="center">
        {like.count}
      </Box>
    </Box>
  );
}
