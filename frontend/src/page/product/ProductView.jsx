import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Spacer,
  Spinner,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { Map, MapMarker, ZoomControl } from "react-kakao-maps-sdk";
import { categories } from "../../components/category/CategoryContainer.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { Avatar } from "../../components/ui/avatar.jsx";
import { Rating } from "../../components/ui/rating.jsx";
import { ProductLike } from "../../components/product/ProductLike.jsx";
import { SlArrowRight } from "react-icons/sl";
import { getDaysAgo } from "../../components/product/ProductDate.jsx";
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
import {
  BreadcrumbCurrentLink,
  BreadcrumbLink,
  BreadcrumbRoot,
} from "../../components/ui/breadcrumb.jsx";
import { useTheme } from "../../components/context/ThemeProvider.jsx";

export function ProductView() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [rating, setRating] = useState(0.0);
  const navigate = useNavigate();
  const { primaryColor, buttonColor, fontColor, loginColor } = useTheme();

  const { hasAccess, isAdmin, id } = useContext(AuthenticationContext);

  // 상품 정보, 판매자 프로필 이미지, 판매자 평점 병렬 요청
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    const fetchProduct = async () => {
      setLoading(true); // 로딩 시작
      try {
        // 상품 정보 요청
        const productRes = await axios.get(`/api/product/view/${productId}`);
        const productData = productRes.data;
        setProduct(productData);

        // 상품 데이터를 기반으로 추가 데이터 요청
        const [profileImageRes, profileRatingRes] = await Promise.all([
          axios.get("/api/myPage/image", {
            params: { memberId: productData.writer },
          }),
          axios.get("/api/myPage/rating", {
            params: { memberId: productData.writer },
          }),
        ]);

        setProfileImageUrl(profileImageRes.data);
        setRating(profileRatingRes.data);

        // 위치 마커 설정
        if (productData.latitude && productData.longitude) {
          setMarkerPosition({
            lat: productData.latitude,
            lng: productData.longitude,
          });
        }
      } catch (error) {
        console.error("데이터를 가져오는 데 실패했습니다:", error);
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    fetchProduct();
  }, [productId]);

  // 상품과 좋아요 정보 동시에 로드
  useEffect(() => {
    const fetchLikeData = async () => {
      try {
        const [likeRes, userLikeRes] = await Promise.all([
          axios.get("/api/product/likes"),
          axios.get("/api/product/like/member"),
        ]);

        const likes = likeRes.data.reduce((acc, item) => {
          acc[item.product_id] = item.like_count;
          return acc;
        }, {});

        setLikeData(likes);
        setUserLikes(new Set(userLikeRes.data));
        setLoading(false);
      } catch (error) {
        console.error("상품 정보를 가져오는데 오류가 발생했습니다.", error);
        setLoading(false);
      }
    };

    fetchLikeData();
  }, [productId, id]);

  const handleDeleteClick = () => {
    axios
      .delete(`/api/product/delete/${productId}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });

        if (isAdmin) {
          navigate(`/admin/members/${product.writer}/detail`);
        } else {
          navigate("/product/list");
        }
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  // 챗 방 만들기
  const createChatRoom = () => {
    const productName = product.productName;
    const writer = product.writer;
    const nickname = "";
    const buyer = id;
    axios
      .post("/api/chat/create", {
        productName: productName,
        productId: productId,
        writer: writer,
        nickname: nickname,
        buyer: buyer,
      })
      .then((res) => {
        const roomId = res.data;
        localStorage.setItem("LocalChatRoomId", roomId);
        navigate("/chat", {
          state: { productId: product.productId },
        });
      })
      .catch((e) => {
        console.log(e);
        toaster.create({
          type: "error",
          description: "오류 발생",
        });
      })
      .finally(() => {});
  };

  // 카카오 맵 길찾기 링크 생성 함수
  const getKakaoLink = () => {
    return `https://map.kakao.com/link/to/${encodeURIComponent(
      product.locationName,
    )},${product.latitude},${product.longitude}`;
  };

  // 로딩 상태일 때 스피너를 표시
  if (loading && !product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner />
      </Box>
    );
  }

  // product가 null일 경우 데이터를 가져오지 못한 상황 처리
  if (!product) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Text>상품 정보를 가져올 수 없습니다.</Text>
      </Box>
    );
  }
  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체";

  const daysAgo = getDaysAgo(product.createdAt);

  return (
    <Box
      mt="5%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="70vh"
      minWidth="50%"
    >
      <HStack
        width="100%"
        height="90%"
        flexDirection={{ base: "column", md: "row" }} // 반응형으로 방향 변경
        alignItems="center" // 작은 화면에서 콘텐츠를 중앙 정렬
        spacing={{ base: 6, md: 0 }} // 수직 간격 추가"
      >
        <VStack width={{ base: "100%", md: "45%" }}>
          <Box w="100%" ml={{ base: 0, md: "25%" }} minWidth="50%">
            <BreadcrumbRoot size="lg">
              <BreadcrumbLink
                href={
                  product.pay === "sell"
                    ? "/product/list"
                    : "/product/share/list"
                }
              >
                {product.pay === "sell" ? "중고거래" : "나눔"}
              </BreadcrumbLink>
              <BreadcrumbLink
                href={
                  product.pay === "sell"
                    ? `/product/list?category=${product.category}&page=1`
                    : `/product/share/list?category=${product.category}&page=1`
                }
              >
                {categoryLabel}
              </BreadcrumbLink>

              {/* 상품명 Bread */}
              <BreadcrumbCurrentLink>
                {product.productName}
              </BreadcrumbCurrentLink>
            </BreadcrumbRoot>
          </Box>
          <Swiper
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="product-page-swiper"
          >
            {product.fileList.length > 0 ? (
              product.fileList.map((file) => (
                <SwiperSlide className="product-page-swiper-slide">
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

          <HStack width={{ base: "100%", md: "75%" }}>
            <Avatar
              my={3}
              boxSize="100px"
              borderRadius="full"
              fit="cover"
              src={profileImageUrl || "/image/default.png"}
            />
            <Heading size="xl">{product.nickname}</Heading>
            <Spacer />
            <Rating
              colorPalette="yellow"
              readOnly
              value={rating}
              allowHalf
              size="lg"
            />
          </HStack>
        </VStack>

        <VStack
          align="flex-start"
          width={{ base: "100%", md: "50%" }}
          spacing={4} // 수직 간격 추가}
        >
          <HStack justifyContent="space-between" w="100%">
            <Badge
              size="lg"
              style={{
                backgroundColor: primaryColor,
                filter: "brightness(90%)",
              }}
            >
              {categoryLabel}
            </Badge>
            <Heading
              size="3xl"
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {product.productName}
            </Heading>
            <Spacer />

            {(hasAccess(product.writer) || isAdmin) && (
              <HStack>
                {hasAccess(product.writer) && (
                  <Button
                    size="lg"
                    colorPalette={"cyan"}
                    onClick={() =>
                      navigate(`/product/edit/${product.productId}`)
                    }
                    color={fontColor}
                    fontWeight="bold"
                    bg={`${buttonColor}AA`}
                    style={{ filter: "brightness(120%)" }}
                    _hover={{ bg: `${buttonColor}AA` }}
                  >
                    수정
                  </Button>
                )}

                {(hasAccess(product.writer) || isAdmin) && (
                  <DialogRoot>
                    <DialogTrigger asChild>
                      <Button
                        colorPalette={"red"}
                        size={"lg"}
                        color={fontColor}
                        fontWeight="bold"
                        bg={buttonColor}
                        style={{ filter: "brightness(85%)" }}
                      >
                        삭제
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>삭제 확인</DialogTitle>
                      </DialogHeader>
                      <DialogBody>
                        {isAdmin && (
                          <Box color="red.500" fontSize="sm" mb={2}>
                            관리자 권한으로 삭제하시겠습니까?
                          </Box>
                        )}
                        {!isAdmin && (
                          <p>{product.productName} 상품을 삭제하시겠습니까?</p>
                        )}
                      </DialogBody>
                      <DialogFooter>
                        <DialogActionTrigger>
                          <Button variant={"outline"}>취소</Button>
                        </DialogActionTrigger>
                        <Button
                          onClick={handleDeleteClick}
                          color={fontColor}
                          fontWeight="bold"
                          bg={buttonColor}
                        >
                          삭제
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </DialogRoot>
                )}
              </HStack>
            )}
          </HStack>

          <Text fontSize="md">{daysAgo}</Text>

          <HStack my={0} w="100%" justifyContent="space-between">
            <Heading
              size={{ base: "xl", md: "2xl" }}
              color={product.pay === "sell" ? "gray.600" : undefined}
            >
              {product.pay === "sell" ? `${product.price}원` : "나눔"}
            </Heading>
            <HStack mt={{ base: 0, md: 0 }} justifyContent="center">
              <Spacer display={{ base: "none", md: "block" }} />
              <ProductLike
                productId={product.productId}
                initialLike={userLikes.has(product.productId)}
                initialCount={likeData[product.productId] || 0}
                isHorizontal={true}
              />
              {product.writer !== id && (
                <Button
                  size={{ base: "sm", md: "lg" }}
                  onClick={createChatRoom}
                  color={fontColor}
                  fontWeight="bold"
                  bg={buttonColor}
                  _hover={{ bg: `${buttonColor}AA` }}
                >
                  채팅하기
                </Button>
              )}
            </HStack>
          </HStack>

          <Textarea
            readOnly
            autoresize
            value={product.description}
            minHeight="200px"
            fontSize={{ base: "md", md: "lg" }}
            mt={{ base: 4, md: 6 }}
          />

          <HStack display="flex" w="100%" mt="4" justifyContent="space-between">
            <Heading size={{ base: "sm", md: "md" }}>거래 희망 장소</Heading>
            <a
              href={getKakaoLink()}
              style={{
                textDecoration: "none",
              }}
              target="_blank"
              rel="noreferrer"
            >
              <HStack>
                <Text fontSize={{ base: "sm", md: "lg" }}>
                  {product.locationName}
                </Text>
                <SlArrowRight />
              </HStack>
            </a>
          </HStack>

          <Map
            className="map"
            center={
              markerPosition || {
                lat: product.latitude,
                lng: product.longitude,
              }
            }
            level={3}
            style={{
              width: "100%",
              height: "240px",
              marginTop: "-2px",
            }}
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
        </VStack>
      </HStack>
    </Box>
  );
}
