import React from "react";
import {
  DrawerActionTrigger,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerRoot,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer.jsx";
import {
  Badge,
  Box,
  Button,
  HStack,
  Image,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { SlArrowRight } from "react-icons/sl";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { categories } from "../category/CategoryContainer.jsx";

export const ProductDetailDrawer = ({ product, children }) => {
  const fileName = product.fileList?.[0]?.name;
  const fileSrc = product.fileList?.[0]?.src;
  const defaultsrc = "./image/default.png";

  const markerPosition = {
    lat: product.latitude,
    lng: product.longitude,
  };

  // 카카오 맵 길찾기 링크 생성 함수
  const getKakaoLink = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(
      product.locationName,
    )},${product.latitude},${product.longitude}`;
  };

  if (!product) {
    return <Spinner />;
  }

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체";

  return (
    <DrawerRoot size={"lg"}>
      <DrawerBackdrop />
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent offset="4" rounded="md">
        <DrawerHeader>
          <DrawerTitle>
            <HStack>
              <Badge size="lg">{categoryLabel}</Badge>
              <Text fontSize={"2xl"} ml={"-1"}>
                {product.productName}
              </Text>
            </HStack>
            <Text mt={1} fontSize={"xl"}>
              {product.nickname}
            </Text>
          </DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Swiper
              slidesPerView={1}
              loop={true}
              pagination={{
                clickable: true,
              }}
              navigation={true}
              modules={[Pagination, Navigation]}
              className="product-detail-swiper"
            >
              {product.fileList.length > 0 ? (
                product.fileList.map((file) => (
                  <SwiperSlide className="product-detail-swiper-slide">
                    <Box>
                      <Image src={file.src} alt={file.name} />
                    </Box>
                  </SwiperSlide>
                ))
              ) : (
                <Box>
                  <Image src="/image/default.png" alt="기본 이미지" />
                </Box>
              )}
            </Swiper>
          </Box>
          <Text my={3} fontSize={"2xl"} fontWeight={"bold"}>
            {product.price === 0 ? "나눔" : `${product.price}원`}
          </Text>
          <HStack alignItems="flex-start" my={3}>
            <Text
              fontSize={"md"}
              fontWeight={"bold"}
              justifyContent={"flex-start"}
              whiteSpace={"nowrap"}
            >
              상품 설명
            </Text>
            <Textarea
              h={180}
              value={product.description}
              readOnly
              cursor="default"
            />
          </HStack>
          <Box my={3} display="flex" justifyContent="space-between">
            <Text fontSize={"md"} fontWeight={"bold"}>
              거래장소
            </Text>
            <a
              href={getKakaoLink()}
              style={{
                textDecoration: "none",
              }}
              target="_blank"
              rel="noreferrer"
            >
              <HStack>
                <Text fontSize="lg" fontWeight={"bold"}>
                  {product.locationName}
                </Text>
                <SlArrowRight />
              </HStack>
            </a>
          </Box>
          <Map
            center={
              markerPosition || {
                lat: product.latitude,
                lng: product.longitude,
              }
            }
            style={{ width: "100%", height: "200px" }}
            level={3}
          >
            {markerPosition && (
              <MapMarker
                position={markerPosition}
                image={{
                  src: "/image/MapMarker2.png",
                  size: {
                    width: 33,
                    height: 36,
                  },
                }}
              />
            )}
            <ZoomControl />
          </Map>
        </DrawerBody>
        <DrawerFooter>
          <DrawerActionTrigger asChild>
            <Button>닫기</Button>
          </DrawerActionTrigger>
        </DrawerFooter>
        <DrawerCloseTrigger />
      </DrawerContent>
    </DrawerRoot>
  );
};
