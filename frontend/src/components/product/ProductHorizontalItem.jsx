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
import debounce from "lodash.debounce";
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
import { FcLike } from "react-icons/fc";

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

const LikeButton = ({ hasAccess, handleLikeClick, likeTooltipOpen }) => (
  <Box>
    {hasAccess ? (
      <FcLike onClick={handleLikeClick} />
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

  const handleLikeClick = debounce(() => {
    // 로그인 여부와 처리 중인지 확인하여 요청을 차단
    if (!hasAccess || isProcessing) {
      setLikeTooltipOpen(true);
      return;
    }

    // 요청 중 상태 설정
    setIsProcessing(true);
    setLikeTooltipOpen(false);

    // 상태 변경을 UI에 즉시 반영 (서버 요청이 완료되기 전에 반영)
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);

    axios
      .post("/api/product/like", { productId: product.productId })
      .then(() => {
        toaster.create({
          type: "warning",
          description: newLikedState
            ? "관심 상품에서 삭제했습니다."
            : "관심 상품에 추가했습니다.",
        });
        console.log(product.productId);
        onRemove(product.productId); // 관심 목록에서 제거 또는 추가
      })
      .catch((error) => {
        // 요청 실패 시 상태 원복
        setIsLiked(isLiked);
        toaster.create({
          type: "error",
          description: "좋아요 처리 중 오류가 발생했습니다.",
        });
      })
      .finally(() => {
        // 요청 처리 후 상태 초기화
        setIsProcessing(false);
      });
  }, 200); // 200ms 후에 호출

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

  const handleReviewClick = (productId) => {
    if (!product.nickname) {
      toaster.create({
        type: "error",
        description: "이미 탈퇴한 회원입니다.",
      });
    } else {
      onOpen(productId);
    }
  };

  const mainImage = product.mainImageName
    ? product.mainImageName
    : "/image/productItem.png";

  console.log(product);
  return (
    <Card.Root
      flexDirection="row"
      maxH="150px"
      width="80%"
      mb={5}
      cursor="pointer"
      boxShadow="md"
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
          width="150px"
          objectFit="cover"
          src={mainImage}
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
        <Card.Body p={3}>
          {product.productId != null ? (
            <Box w="fit-content">
              <Badge colorScheme="teal">{categoryLabel}</Badge>
            </Box>
          ) : (
            <Box>
              <Badge>없음</Badge>
            </Box>
          )}
          <Card.Title mb={2} fontSize="lg" fontWeight="bold">
            {product.productName}
          </Card.Title>
          <HStack justify="space-between">
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
        position="absolute"
        top={2}
        right={1}
        onClick={(e) => {
          e.stopPropagation();
          if (pageType === "wish") handleLikeClick();
          else if (pageType !== "purchased") setDialogOpen(true);
        }}
      >
        {pageType === "wish" ? (
          <LikeButton
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
              <Button colorPalette="cyan" size="xs" isDisabled cursor="default">
                작성 완료
              </Button>
            ) : (
              <Button
                onClick={() => handleReviewClick(product.productId)}
                size="xs"
              >
                후기 작성
              </Button>
            )}
          </Box>
        ) : (
          <Box display="flex" alignItems="center">
            {product.purchasedAt && (
              <Text fontSize="xs" color="gray.500" mr={2}>
                판매 일자: {product.purchasedAt.split("T")[0]}
              </Text>
            )}
            <DeleteDialog
              isOpen={dialogOpen}
              onClose={() => setDialogOpen(false)}
              productId={product.productId}
              handleDeleteClick={handleDeleteClick}
            />
          </Box>
        )}
      </Button>

      <Box position="absolute" bottom={2} right={2}>
        <Text fontSize="md" fontWeight="bold">
          <HStack gap={1}>
            {/* 결제 상태 추가 */}
            {product.paymentStatus === "결제완료" && (
              <Image
                src="/image/Kakaopay.png"
                alt="Kakaopay Icon"
                width="60px"
                height="auto"
              />
            )}
            {product.pay !== "share" && <PiCurrencyKrwBold />}
            {product.pay === "share" ? "나눔" : product.price}
          </HStack>
        </Text>
      </Box>
    </Card.Root>
  );
}
