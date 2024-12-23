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
  VStack,
} from "@chakra-ui/react";
import { LuFolder, LuMailX } from "react-icons/lu";
import { TfiWrite } from "react-icons/tfi";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel, Scrollbar } from "swiper/modules";
import { Rating } from "../../components/ui/rating.jsx";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { EmptyState } from "../../components/ui/empty-state.jsx";

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
  <Card.Root
    maxH="150px"
    width="80%"
    mt={3}
    mb={5}
    ml={3}
    size="sm"
    key={review.id}
    display="flex"
    justifyContent="center"
  >
    <Card.Header>
      <HStack justifyContent="space-between">
        <Heading
          onClick={(e) => productNameClick(e, review.productId)}
          size="lg"
          color={review.productId ? "black" : "gray.400"}
          cursor="pointer"
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
        <HStack>
          {value === "buy" ? (
            <>판매자 : {review.sellerName || "탈퇴한 회원"}</>
          ) : (
            <>구매자 : {review.buyerId ? review.buyerName : "탈퇴한 회원"}</>
          )}
        </HStack>
      </Heading>
    </Card.Body>

    <Card.Footer>
      {/* HStack으로 좌우 배치, 리뷰 텍스트는 왼쪽, 가격과 작성일자는 오른쪽 */}
      <HStack width="full" justify="space-between">
        <Box width="70%">
          <Box background="gray.200" padding={2} borderRadius="md">
            <Text size="sm">{review.reviewText}</Text>
          </Box>
        </Box>

        {/* 오른쪽은 가격과 작성 일자, Vstack으로 세로로 배치 */}
        <VStack align="end" spacing={1}>
          <Box>
            {review.price === 0 ? (
              <Text color="gray.500" fontSize="sm">
                나눔
              </Text> // 나눔 뱃지 표시
            ) : (
              <Text color="gray.500" fontSize="sm" fontWeight="semibold">
                {review.price}원
              </Text> // 가격 표시
            )}
          </Box>
          <Heading size="sm" color="gray.500">
            작성 일자 : {review.createdAt.split("T")[0] || "알 수 없음"}
          </Heading>
        </VStack>
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
        params: { memberId: id, role: value === "buy" ? "buyer" : "seller" },
      })
      .then((res) => {
        setReviewList(res.data);
        setLoading(false);
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
      return <EmptyState icon={<LuMailX />} title="후기가 없습니다." />;

    return (
      <Box>
        {/*<Text ml={4} mt={-1} mb={2}>*/}
        {/*  총 {reviewList.length}건*/}
        {/*</Text>*/}
        <Swiper
          direction="vertical"
          slidesPerView="auto"
          freeMode={true}
          scrollbar={{ draggable: true }}
          mousewheel={true}
          modules={[FreeMode, Scrollbar, Mousewheel]}
          style={{
            height: "78vh",
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
      </Box>
    );
  };

  return (
    <Tabs.Root
      value={value}
      // 객체로 전달되므로 문자열 추출해서 value 설정
      onValueChange={(newValue) => setValue(newValue?.value || newValue)}
    >
      <Tabs.List>
        <HStack w="100%" justify="space-between" align="center">
          <HStack>
            <Tabs.Trigger value="buy">
              <TfiWrite />
              <Text fontSize="md" fontWeight="bold" ml={1}>
                작성한 후기
              </Text>
            </Tabs.Trigger>
            <Tabs.Trigger value="sell">
              <LuFolder />
              <Text fontSize="md" fontWeight="bold" ml={1}>
                받은 후기
              </Text>
            </Tabs.Trigger>
          </HStack>
          <Text ml="auto">총 {reviewList.length}건</Text>
        </HStack>
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
