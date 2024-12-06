import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
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
import { ProductLike } from "../../components/product/ProductLike.jsx";

function ImageFileView() {
  return null;
}

export function ProductView() {
  //  채팅방 만들때,   토큰에서 id 가져와야 하는데 , id   겹쳐서 > productId로  , >router도 변경함
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [likeData, setLikeData] = useState({});
  const [userLikes, setUserLikes] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { hasAccess, isAuthenticated, isAdmin ,id } = useContext(
    AuthenticationContext,
  );


  useEffect(() => {
    // id >productId
    axios
      .get(`/api/product/view/${productId}`)
      .then((res) => setProduct(res.data));
  }, []);

  useEffect(() => {
    if (product && product.latitude && product.longitude) {
      setMarkerPosition({
        lat: product.latitude,
        lng: product.longitude,
      });
    }
  }, [product]);
  // 상품과 좋아요 정보 동시에 로드
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, likeRes, userLikeRes] = await Promise.all([
          axios.get(`/api/product/view/${id}`),
          axios.get("/api/product/likes"),
          axios.get("/api/product/like/member"),
        ]);

        setProduct(productRes.data);

        const likes = likeRes.data.reduce((acc, item) => {
          acc[item.product_id] = item.like_count;
          return acc;
        }, {});

        setLikeData(likes);
        setUserLikes(new Set(userLikeRes.data)); // 사용자 좋아요 정보

        setLoading(false);
      } catch (error) {
        console.error("상품 정보를 가져오는데 오류가 발생했습니다.:", error);
      }
    };

    fetchData();
  }, [id]);

  if (product === null) {
    return <Spinner />;
  }

  const handleDeleteClick = () => {
    axios
      .delete(`/api/product/delete/${product.productId}`)
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
        navigate("/product/list");
      })
      .catch((e) => {
        const data = e.response.data;
        toaster.create({
          type: data.message.type,
          description: data.message.text,
        });
      });
  };

  if (product === null) {
    return <Spinner />;
  }

  const categoryLabel =
    categories.find((category) => category.value === product.category)?.label ||
    "전체"; // 기본값 설정

  if (!product && !likeData && !userLikes) {
    return <Spinner />;
  }

  // 챗 방 만들기
  const createChatRoom = () => {
    var testId;
    var productName = product.productName;
    var writer = product.writer;
    var nickname = "";
    var buyer = id;
    axios
      .post("/api/chat/create", {
        productName: productName,
        writer: writer,
        nickname: nickname,
        buyer: buyer,
      })
      .then((res) => {
        console.log(res.data);
        const roomId = res.data;
        navigate("/chat/room/" + roomId);
      });
    // 추가
  };

  return (
    <Box>
      <HStack>
        <Heading>{productId}번 상품 이름</Heading>
        <Box display="flex" justifyContent="center" alignItems="center">
          <ProductLike
            productId={product.productId}
            initialLike={userLikes.has(product.productId)}
            initialCount={likeData[product.productId] || 0}
            isHorizontal={true} // 수평으로 하트와 숫자 배치
          />
        </Box>
      </HStack>
      <Stack gap={5}>
        <Box>판매자: {product.nickname}</Box>
        <ImageFileView />
        <Flex gap={3}>
          <Box minWidth="100px">
            <Field label={"카테고리"} readOnly>
              <Input value={categoryLabel} />
            </Field>
          </Box>
          <Box flex={8}>
            <Field label={"상품명"} readOnly>
              <Input value={product.productName} />
            </Field>
          </Box>
        </Flex>
        <Field label={"거래방식"} readOnly>
          <Flex gap={4}>
            <Button borderRadius="10px">
              {product.pay == "sell" ? "판매하기" : "나눔하기"}
            </Button>
          </Flex>
        </Field>
        {product.pay === "sell" && (
          <Field label={"가격"} readOnly>
            <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
              <Input value={product.price} />
            </InputGroup>
          </Field>
        )}
        <Field label={"상품 설명"} readOnly>
          <Textarea h={200} value={product.description} />
        </Field>
        <Field label={"거래 희망 장소"} readOnly>
          <Input value={product.locationName} readOnly />
        </Field>
        <Box>
          <Map
            className="map"
            center={
              markerPosition || {
                lat: product.latitude,
                lng: product.longitude,
              }
            }
            level={3}
            style={{ width: "100%", height: "400px" }}
          >
            {markerPosition && <MapMarker position={markerPosition} />}
            <ZoomControl />
          </Map>
        </Box>

        <Button onClick={createChatRoom} disabled={id === product.writer}>
          거래하기
        </Button>
        {(hasAccess(product.writer) || isAdmin) && (
          <Box>
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
                    <p>등록한 {product.productId}번 상품을 삭제하시겠습니까?</p>
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
          </Box>
        )}
      </Stack>
    </Box>
  );
}
