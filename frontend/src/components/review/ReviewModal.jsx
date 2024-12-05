import React, { useContext, useState } from "react";
import { Box, Button, Heading, HStack, Text, Textarea } from "@chakra-ui/react";
import { IoClose } from "react-icons/io5";
import { Field } from "../ui/field.jsx";
import { Rating } from "../ui/rating.jsx";
import { AuthenticationContext } from "../context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../ui/toaster.jsx";

export function ReviewModal({ isOpen, onClose, product }) {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(3);
  const [progress, setProgress] = useState(false);
  console.log(product);

  if (!isOpen) return null;
  const { id, nickname } = useContext(AuthenticationContext);

  // 별에 따라 보여줄 텍스트
  const RatingText = (rating) => {
    switch (rating) {
      case 1:
        return "별로예요";
      case 2:
        return "그저 그래요";
      case 3:
        return "괜찮아요";
      case 4:
        return "좋아요";
      case 5:
        return "최고예요";
      default:
        return "";
    }
  };

  const sendReviewClick = () => {
    setProgress(true);

    axios
      .post("/api/myPage/review/add", {
        productId: product.productId,
        productName: product.productName,
        buyerId: id,
        buyerName: nickname,
        reviewText,
        rating,
        sellerId: product.writer,
        price: product.price,
        reviewStatus: "completed",
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        setReviewText(""); // 후기 내용 초기화
        setRating(3); // 별점 초기화 (기본값 3)
        onClose();
      })
      .catch((e) => {
        toaster.create({
          description: e.response.message.text,
          type: e.response.message.type,
        });
      })
      .finally(() => setProgress(false));
  };

  return (
    <div className="background">
      <div className="modal">
        <button className="close" onClick={onClose}>
          <IoClose />
        </button>
        <div className="content">
          <Heading>{nickname}님, 거래가 어떠셨나요?</Heading>
          <HStack>
            <Rating
              m={5}
              value={rating}
              size="lg"
              cursor="pointer"
              colorPalette="yellow"
              onValueChange={(e) => setRating(e.value)}
            />
            <Text>{RatingText(rating)}</Text>
          </HStack>
          <Box>
            <HStack gap="10">
              <Text>상품명 : {product.productName}</Text>
              <HStack gap={1}>가격 : {product.price}원</HStack>
            </HStack>
          </Box>
          <HStack justify="space-between" mr={3}>
            <Text my="3">판매자 : {product.nickname}</Text>
            <Text>구매일자 : {product.purchasedAt.split("T")[0]}</Text>
          </HStack>
          <Field label={""}>
            <Textarea
              h={150}
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
            />
          </Field>
          <HStack justify="space-between" mt={5}>
            <Text color="gray" textStyle="xs">
              작성하신 후기는 판매자에게 전달됩니다.
            </Text>
            <Button loading={progress} onClick={sendReviewClick}>
              작성 완료
            </Button>
          </HStack>
        </div>
      </div>
    </div>
  );
}
