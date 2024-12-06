import {
  Badge,
  Box,
  Button,
  Card,
  Heading,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { getDaysAgo } from "./ProductDate.jsx";
import { categories } from "../category/CategoryContainer.jsx";
import React, { useContext, useState } from "react";
import { GoHeartFill } from "react-icons/go";
import axios from "axios";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import { ToggleTip } from "../ui/toggle-tip.jsx";
import { toaster } from "../ui/toaster.jsx";
import { useNavigate } from "react-router-dom";
import { RiDeleteBin5Fill } from "react-icons/ri";

import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog.jsx";

export function ProductHorizontalItem({
  product,
  onRemove,
  pageType,
  onOpen,
  value,
}) {
  const [isLiked, setIsLiked] = useState(product.isLiked || false);
  const [likeTooltipOpen, setLikeTooltipOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체";
  const daysAgo = getDaysAgo(product.createdAt);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  // Sold 상태에 따라 스타일을 어두워지게 설정
  const isSold = product.status === "Sold";
  const cardStyle = {
    opacity: isSold ? 0.5 : 1, // 'Sold' 상태일 때 투명도를 낮춰 어두운 느낌 추가
    backgroundColor: isSold ? "#f0f0f0" : "white", // 'Sold' 상태일 때 배경색을 회색으로 변경
    cursor: product.status === "Sold" ? "default" : "pointer",
  };

  const handleLikeClick = () => {
    if (hasAccess) {
      setIsLiked((prev) => !prev);

      axios
        .post("/api/product/like", { productId: product.productId })
        .then(() => {
          onRemove(product.productId); // 부모 컴포넌트로 제거 요청
          toaster.create({
            type: "warning",
            description: "관심 상품에서 삭제했습니다.",
          });
        })
        .catch((err) => {
          console.error("관심 상품에 오류가 발생했습니다.", err);

          // 요청 실패 시 상태 복구
          setIsLiked((prev) => !prev);
        });
    } else {
      setLikeTooltipOpen((prev) => !prev);
    }
  };

  const handleDeleteClick = () => {
    if (hasAccess) {
      axios
        .delete(`/api/product/delete/${product.productId}`)
        .then((res) => res.data)
        .then((data) => {
          toaster.create({
            type: data.message.type,
            description: data.message.text,
          });
          onRemove(product.productId);
        })
        .catch((e) => {
          const data = e.response.data;
          toaster.create({
            type: data.message.type,
            description: data.message.text,
          });
        });
    } else {
      toaster.create({
        type: "success",
        description: "본인 상품만 삭제 가능합니다.",
      });
    }
  };

  const handleCancelClick = () => {
    setDialogOpen(false); // 다이얼로그 닫기
  };

  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (pageType === "wish") {
      handleLikeClick();
    } else if (pageType !== "purchased") {
      setDialogOpen(true);
    }
  };

  console.log(product);

  return (
    <Card.Root
      flexDirection="row"
      maxH="150px"
      width="80%"
      mb={4}
      cursor="pointer"
      boxShadow="sm" // 카드에 그림자 추가
      borderRadius="md" // 카드 모서리 둥글게
      border="1px solid"
      borderColor="gray.200"
      position="relative" // 부모 카드에 relative 위치를 지정
      onClick={() =>
        isSold ? null : navigate(`/product/view/${product.productId}`)
      } // Sold 상태에서 클릭 방지
      style={cardStyle}
    >
      {/* 왼쪽: 이미지 */}
      <Image
        maxW="150px"
        objectFit="cover"
        src="/image/productItem.png"
        alt={product.productName}
        borderRadius="md"
        style={{
          opacity: product.status === "Sold" ? 0.5 : 1, // 이미지에도 어두운 효과 적용
        }}
      />

      {/* 오른쪽: 텍스트 및 버튼 */}
      <Box
        ml={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
      >
        <Card.Body>
          {/* 카테고리 */}
          <Badge colorScheme="teal">{categoryLabel}</Badge>
          {/* 상품명 */}
          <Card.Title mb={2} fontSize="lg" fontWeight="bold">
            {product.productName}
          </Card.Title>
          {/* 장소 */}
          <HStack spacing={10} justify="space-between">
            <Text fontSize="sm" color="gray.500">
              {product.locationName || "장소 정보 없음"}
            </Text>
            {value === "purchased" ? (
              <Heading size="xs">
                판매자:{" "}
                {product.nickname != null ? product.nickname : "알 수 없음"}
              </Heading>
            ) : value === "sell" && isSold ? (
              <Heading size="xs">
                구매자:{" "}
                {product.buyerNickname != null
                  ? product.buyerNickname
                  : " 알 수 없음"}
              </Heading>
            ) : null}
          </HStack>
          <Card.Description mt={2}>{daysAgo}</Card.Description>
        </Card.Body>
      </Box>

      {/* 우측 상단 좋아요 버튼 */}
      <Button
        variant="ghost"
        size="sm"
        position="absolute"
        top={2}
        right={2}
        onClick={(e) => {
          handleButtonClick(e);
        }}
      >
        {pageType === "wish" ? (
          <Box>
            <ToggleTip
              open={likeTooltipOpen}
              content={"로그인 후 좋아요를 클릭해주세요."}
            >
              <GoHeartFill color={isLiked ? "red" : "gray"} />
            </ToggleTip>
          </Box>
        ) : pageType === "purchased" ? (
          <Box display="flex" alignItems="center">
            {/* 구매 날짜 표시 */}
            <Text fontSize="xs" color="gray.500" mr={2}>
              구매 일자: {formatDate(product.purchasedAt)}
            </Text>
            {product.reviewStatus === "completed" ? (
              <Button colorPalette={"cyan"} size="xs" isDisabled>
                작성 완료
              </Button>
            ) : (
              <Button onClick={() => onOpen(product.productId)} size="xs">
                후기 작성
              </Button>
            )}
          </Box>
        ) : (
          <HStack>
            {/* 판매 날짜 표시 */}
            {product.purchasedAt && (
              <Text fontSize="xs" color="gray.500">
                판매 일자: {formatDate(product.purchasedAt)}
              </Text>
            )}
            {/* 삭제 버튼 */}
            <DialogRoot
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
            >
              <DialogTrigger asChild>
                <RiDeleteBin5Fill color="gray" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>삭제 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>등록한 {product.productId}번 상품을 삭제하시겠습니까?</p>
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button
                      variant={"outline"}
                      onClick={handleCancelClick} // 취소 버튼 클릭 시 다이얼로그 닫기
                    >
                      취소
                    </Button>
                  </DialogActionTrigger>
                  <Button
                    colorPalette={"red"}
                    onClick={(e) => {
                      handleDeleteClick();
                      setDialogOpen(false); // 삭제 후 다이얼로그 닫기
                    }}
                  >
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          </HStack>
        )}
      </Button>

      {/* 우측 하단 가격 */}
      <Box position="absolute" bottom={2} right={2}>
        <Text fontSize="md" fontWeight="bold">
          <HStack gap="1">
            {product.pay !== "share" && <PiCurrencyKrwBold />}
            {product.pay === "share" ? "나눔" : product.price}
          </HStack>
        </Text>
      </Box>
    </Card.Root>
  );
}
