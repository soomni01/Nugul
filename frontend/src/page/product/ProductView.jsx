import {
  Badge,
  Box,
  Heading,
  HStack,
  Image,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
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

export function ProductView() {
  //  채팅방 만들때,   토큰에서 id 가져와야 하는데 , id   겹쳐서 > productId로  , >router도 변경함
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [rating, setRating] = useState(0.0);
  const navigate = useNavigate();

  const { hasAccess, isAdmin, id } = useContext(AuthenticationContext);

  // 상품 정보, 판매자 프로필 이미지, 판매자 평점 병렬 요청
  useEffect(() => {
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
        console.log(res.data);
        const roomId = res.data;
        navigate("/chat/room/" + roomId);
      });
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
    <Box mb={10}>
      {(hasAccess(product.writer) || isAdmin) && (
        <HStack mb={5} justifyContent="flex-end">
          {hasAccess(product.writer) && (
            <Button
              colorPalette={"cyan"}
              onClick={() => navigate(`/product/edit/${product.productId}`)}
            >
              수정
            </Button>
          )}

          {(hasAccess(product.writer) || isAdmin) && (
            <DialogRoot>
              <DialogTrigger asChild>
                <Button colorPalette={"red"}>삭제</Button>
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
                    <p>등록한 {product.productId}번 상품을 삭제하시겠습니까?</p>
                  )}
                </DialogBody>
                <DialogFooter>
                  <DialogActionTrigger>
                    <Button variant={"outline"}>취소</Button>
                  </DialogActionTrigger>
                  <Button colorPalette={"red"} onClick={handleDeleteClick}>
                    삭제
                  </Button>
                </DialogFooter>
              </DialogContent>
            </DialogRoot>
          )}
        </HStack>
      )}
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="product-page-swiper"
      >
        {product.fileList.map((file) => (
          <SwiperSlide className="product-page-swiper-slide">
            <Box>
              <Image src={file.src} alt={file.name} />
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>

      <Stack>
        <HStack>
          <Avatar
            my={3}
            boxSize="80px"
            borderRadius="full"
            fit="cover"
            src={profileImageUrl}
          />
          <Heading size="md">판매자: {product.nickname}</Heading>
          <Spacer />
          <Rating readOnly value={rating} allowHalf size="md" mr={5} />
        </HStack>

        <HStack m={2} justifyContent="space-between" w="full">
          <Heading>{product.productName}</Heading>
          <Spacer />
          <Box mr={5}>
            <ProductLike
              productId={product.productId}
              initialLike={userLikes.has(product.productId)}
              initialCount={likeData[product.productId] || 0}
              isHorizontal={true}
            />
          </Box>
        </HStack>

        <HStack m={2}>
          <Box w="fit-content">
            <Badge size="md" colorScheme="red">
              {categoryLabel}
            </Badge>
          </Box>
          <Text size="xs">{daysAgo}</Text>
        </HStack>

        <HStack justifyContent="space-between">
          <Heading
            ml={2}
            color={product.pay === "sell" ? "gray.600" : undefined}
          >
            {product.pay === "sell" ? `${product.price}원` : "나눔"}
          </Heading>
          {product.writer !== id && (
            <Button onClick={createChatRoom}>채팅하기</Button>
          )}
        </HStack>

        <Textarea readOnly autoresize value={product.description} />

        <HStack mt={3} justifyContent="space-between">
          <Heading size="md">거래 희망 장소</Heading>
          <a
            href={getKakaoLink()}
            style={{
              textDecoration: "none",
            }}
            target="_blank"
            rel="noreferrer"
          >
            <HStack>
              <span>{product.locationName}</span>
              <SlArrowRight />
            </HStack>
          </a>
        </HStack>

        <Box display="flex" justifyContent="center" alignItems="center">
          <Map
            className="map"
            center={
              markerPosition || {
                lat: product.latitude,
                lng: product.longitude,
              }
            }
            level={3}
            style={{ width: "90%", height: "300px" }}
          >
            {markerPosition && <MapMarker position={markerPosition} />}
            <ZoomControl />
          </Map>
        </Box>
      </Stack>
    </Box>
  );
}
