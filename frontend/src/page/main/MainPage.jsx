import { Box, Heading, Image, Separator } from "@chakra-ui/react";
import { CategoryContainer } from "../../components/category/CategoryContainer.jsx";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import "./MainPage.css";

export function MainPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 카테고리 변경 처리
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
  };

  return (
    <Box>
      <Image src="/image/testImage.png" w="100%" h="300px" mt="3" />
      <Separator my={10} />
      <Heading m={5}> 카테고리별 상품 찾기</Heading>
      <CategoryContainer
        selectedCategory={selectedCategory}
        onCategorySelect={handleCategorySelect}
      />
      {/* swiper : infinite loop */}
      <Swiper
        slidesPerView={3}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>Slide 1</SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
        <SwiperSlide>Slide 5</SwiperSlide>
      </Swiper>

      <Separator my={10} />
      <Heading>중고 아이템</Heading>
      <Box w="100%" h="300px" background="beige" my="3"></Box>
      <Separator my={10} />
      <Heading>나눔 아이템</Heading>
      <Box w="100%" h="300px" background="beige" my="3"></Box>
    </Box>
  );
}
