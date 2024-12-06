import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Heading,
  HStack,
  Spinner,
  Stack,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { LuFolder } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { Rating } from "../../components/ui/rating.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";

const productNameClick = (navigate, productId) => {
  if (productId != null) {
    navigate(`/product/view/${productId}`);
  } else {
    toaster.create({
      type: "error",
      description: "삭제된 상품입니다.",
    });
  }
};

const ReviewCard = ({ review, value, productNameClick }) => (
  <Card.Root height="90%" width="80%" my={4} size="sm" key={review.id}>
    <Card.Header>
      <HStack justifyContent="space-between">
        <Heading
          onClick={(e) => productNameClick(e, review.productId)}
          size="lg"
          color={review.productId ? "black" : "gray.400"}
        >
          {review.productName}
        </Heading>
        <Box>
          <Rating
            readOnly
            colorPalette="yellow"
            defaultValue={review.rating}
            size="md"
          />
        </Box>
      </HStack>
    </Card.Header>
    <Card.Body>
      <Heading size="sm" color="gray.500">
        <HStack spacing={10}>
          {value === "buy" ? (
            <>판매자: {review.sellerName || "알 수 없음"}</>
          ) : (
            <>구매자: {review.buyerId ? review.buyerName : "알 수 없음"}</>
          )}
        </HStack>
      </Heading>
    </Card.Body>
    <HStack justifyContent="space-between" mr={4}>
      <Heading size="xs" color="gray.500" ml={4} mb={3}>
        상품 후기
      </Heading>
      {review.price === 0 ? (
        <Box colorScheme="green"> 나눔</Box> // 나눔 뱃지 표시
      ) : (
        <Box> {review.price}원</Box> // 가격 표시
      )}
    </HStack>
    <Card.Footer>
      <HStack gap="10" width="full" justifyContent="space-between">
        <Box background="gray.100" padding={2} borderRadius="md">
          <Text size="sm">{review.reviewText}</Text>
        </Box>
        <Heading size="xs" color="gray.500">
          작성일: {review.createdAt.split("T")[0] || "알 수 없음"}
        </Heading>
      </HStack>
    </Card.Footer>
  </Card.Root>
);

export function Review(props) {
  const [reviewList, setReviewList] = useState([]);
  const [value, setValue] = useState("buy");
  const [loading, setLoading] = useState(false);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    axios
      .get("/api/myPage/review", {
        params: { id, role: value === "buy" ? "buyer" : "seller" },
      })
      .then((res) => {
        setReviewList(res.data);
        setLoading(false);
        console.log(reviewList);
      })
      .catch((error) => {
        console.log("후기를 가져오는 데 실패했습니다.", error);
        setLoading(false);
      });
  }, [id, value]);

  if (!id) {
    return <Spinner />;
  }

  const renderReviewList = () => {
    if (loading) return <Spinner />;
    if (!reviewList.length)
      return <Heading size="sm">후기가 없습니다.</Heading>;

    return (
      <Swiper
        direction="vertical"
        slidesPerView="auto"
        freeMode={true}
        scrollbar={{ draggable: true }}
        mousewheel={true}
        modules={[FreeMode, Scrollbar, Mousewheel]}
        style={{
          height: "80vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {reviewList.map((review) => (
          <SwiperSlide
            key={review.id}
            style={{
              height: "auto",
              width: "100%",
              justifyContent: "left",
            }}
          >
            <ReviewCard
              review={review}
              value={value}
              productNameClick={(e) =>
                productNameClick(navigate, review.productId)
              }
            />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  };

  return (
    <Tabs.Root
      value={value}
      // 객체로 전달되므로 문자열 추출해서 value 설정
      onValueChange={(newValue) => setValue(newValue?.value || newValue)}
    >
      <Tabs.List>
        <Tabs.Trigger value="buy">
          <TfiWrite />
          작성한 후기
        </Tabs.Trigger>
        <Tabs.Trigger value="sell">
          <LuFolder />
          받은 후기
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="buy">
        <Stack>{renderReviewList()}</Stack>
      </Tabs.Content>

      <Tabs.Content value="sell">
        <Stack>{renderReviewList()}</Stack>
      </Tabs.Content>
    </Tabs.Root>
  );
}
