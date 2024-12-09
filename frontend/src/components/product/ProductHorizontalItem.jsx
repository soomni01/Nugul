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
import { FaLocationDot } from "react-icons/fa6";
import { EmptyState } from "../ui/empty-state.jsx";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

const getCardStyle = (isSold) => ({
  opacity: isSold ? 0.5 : 1,
  backgroundColor: isSold ? "#f0f0f0" : "white",
  cursor: isSold ? "default" : "pointer",
});

const LikeButton = ({
  isLiked,
  hasAccess,
  handleLikeClick,
  likeTooltipOpen,
}) => (
  <Box>
    {hasAccess ? (
      <GoHeartFill color={isLiked ? "red" : "gray"} onClick={handleLikeClick} />
    ) : (
      <ToggleTip
        open={likeTooltipOpen}
        content="로그인 후 좋아요를 클릭해주세요."
      >
        <GoHeartFill color="gray" />
      </ToggleTip>
    )}
  </Box>
);

const DeleteDialog = ({ isOpen, onClose, productId, handleDeleteClick }) => (
  <DialogRoot isOpen={isOpen} onClose={onClose}>
    <DialogTrigger asChild>
      <RiDeleteBin5Fill color="gray" />
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>삭제 확인</DialogTitle>
      </DialogHeader>
      <DialogBody>
        <p>등록한 {productId}번 상품을 삭제하시겠습니까?</p>
      </DialogBody>
      <DialogFooter>
        <DialogActionTrigger>
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
        </DialogActionTrigger>
        <Button colorPalette="red" onClick={handleDeleteClick}>
          삭제
        </Button>
      </DialogFooter>
    </DialogContent>
  </DialogRoot>
);

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
  const [isProcessing, setIsProcessing] = useState(false);
  const { hasAccess } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체";
  const daysAgo = getDaysAgo(product.createdAt);
  const isSold = product.status === "Sold";
  const cardStyle = getCardStyle(isSold);

  const handleLikeClick = () => {
    if (!hasAccess || isProcessing) return setLikeTooltipOpen(true);

    setIsProcessing(true); // 요청 처리 중 상태 설정
    setIsLiked((prev) => !prev);

    axios
      .post("/api/product/like", { productId: product.productId })
      .then(() => {
        toaster.create({
          type: "warning",
          description: "관심 상품에서 삭제했습니다.",
        });
        onRemove(product.productId);
      })
      .catch(() => setIsLiked((prev) => !prev))
      .finally(() => setIsProcessing(false));
  };

  const handleDeleteClick = () => {
    if (!hasAccess) {
      toaster.create({
        type: "error",
        description: "본인 상품만 삭제 가능합니다.",
      });
      return;
    }

    axios
      .delete(`/api/product/delete/${product.productId}`)
      .then(({ data }) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        onRemove(product.productId);
        setDialogOpen(false);
      })
      .catch(({ response }) => {
        const { message } = response.data;
        toaster.create({ type: message.type, description: message.text });
      });
  };

  const productClick = (navigate, productId, status) => {
    if (productId != null && status == "For Sale") {
      navigate(`/product/view/${productId}`);
    } else if (productId != null && status == "Sold") {
      navigate(`/product/view/${productId}`);
      toaster.create({
        type: "warning",
        description: "판매 완료된 상품입니다.",
      });
    } else
      toaster.create({
        type: "error",
        description: "삭제된 상품입니다.",
      });
  };

  console.log(product);

  return (
    <Card.Root
      flexDirection="row"
      maxH="150px"
      width="80%"
      mb={4}
      cursor="pointer"
      boxShadow="sm"
      borderRadius="md"
      border="1px solid"
      borderColor="gray.200"
      position="relative"
      onClick={() => productClick(navigate, product.productId, product.status)} // Sold 상태에서 클릭 방지
      style={cardStyle}
    >
      {product.productId != null ? (
        <Image
          maxW="150px"
          objectFit="cover"
          src="/image/productItem.png"
          alt={product.productName}
          borderRadius="md"
          style={{ opacity: isSold ? 0.5 : 1 }}
        />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          maxW="150px"
          height="150px"
          borderRadius="md"
        >
          <EmptyState
            icon={<MdOutlineProductionQuantityLimits />}
            description="삭제된 상품"
          />
        </Box>
      )}

      <Box
        ml={4}
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        flex="1"
      >
        <Card.Body>
          {product.productId != null ? (
            <Badge colorScheme="teal">{categoryLabel}</Badge>
          ) : (
            <Box></Box>
          )}
          <Card.Title mb={2} fontSize="lg" fontWeight="bold">
            {product.productName}
          </Card.Title>
          <HStack spacing={10} justify="space-between">
            <Text fontSize="sm" color="gray.500">
              <HStack>
                <FaLocationDot />
                {product.locationName || "장소 정보 없음"}
              </HStack>
            </Text>
            {value === "purchased" ? (
              <Heading size="xs">
                판매자: {product.nickname || "알 수 없음"}
              </Heading>
            ) : value === "sell" && isSold ? (
              <Heading size="xs">
                구매자: {product.buyerNickname || "알 수 없음"}
              </Heading>
            ) : null}
          </HStack>
          <Card.Description mt={2}>{daysAgo}</Card.Description>
        </Card.Body>
      </Box>

      <Button
        variant="ghost"
        size="sm"
        position="absolute"
        top={2}
        right={2}
        onClick={(e) => {
          e.stopPropagation();
          if (pageType === "wish") handleLikeClick();
          else if (pageType !== "purchased") setDialogOpen(true);
        }}
      >
        {pageType === "wish" ? (
          <LikeButton
            isLiked={isLiked}
            hasAccess={hasAccess}
            handleLikeClick={handleLikeClick}
            likeTooltipOpen={likeTooltipOpen}
          />
        ) : pageType === "purchased" ? (
          <Box display="flex" alignItems="center">
            <Text fontSize="xs" color="gray.500" mr={2}>
              구매 일자: {formatDate(product.purchasedAt)}
            </Text>
            {product.reviewStatus === "completed" ? (
              <Button colorPalette="cyan" size="xs" isDisabled>
                작성 완료
              </Button>
            ) : (
              <Button onClick={() => onOpen(product.productId)} size="xs">
                후기 작성
              </Button>
            )}
          </Box>
        ) : (
          <DeleteDialog
            isOpen={dialogOpen}
            onClose={() => setDialogOpen(false)}
            productId={product.productId}
            handleDeleteClick={handleDeleteClick}
          />
        )}
      </Button>

      <Box position="absolute" bottom={2} right={2}>
        <Text fontSize="md" fontWeight="bold">
          <HStack gap={1}>
            {product.pay !== "share" && <PiCurrencyKrwBold />}
            {product.pay === "share" ? "나눔" : product.price}
          </HStack>
        </Text>
      </Box>
    </Card.Root>
  );
}
