import {
  Box,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import React, { useEffect, useState } from "react";
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
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { categories } from "../../components/category/CategoryContainer.jsx";

function ImageFileView() {
  return null;
}

export function ProductView() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열고 닫을 상태
  const [markerPosition, setMarkerPosition] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`/api/product/view/${id}`).then((res) => setProduct(res.data));
  }, []);

  useEffect(() => {
    if (product && product.latitude && product.longitude) {
      setMarkerPosition({
        lat: product.latitude,
        lng: product.longitude,
      });
    }
  }, [product]);

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

  return (
    <Box>
      <Heading>
        {id}번 상품 이름: {product.nickname}
      </Heading>
      <Stack gap={5}>
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
        <Field label={"가격"} readOnly>
          <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
            <Input value={product.price} />
          </InputGroup>
        </Field>
        <Field label={"상품 설명"} readOnly>
          <Textarea h={200} value={product.description} />
        </Field>
        <Field label={"거래 희망 장소"} readOnly>
          <Input
            value={product.locationName}
            onClick={() => setIsModalOpen(true)} // 거래 장소 input 클릭 시 모달 열기
            readOnly
          />
        </Field>
        <Box>
          <Map
            className="map"
            center={markerPosition || { lat: 33.450701, lng: 126.570667 }}
            level={3}
            style={{ width: "100%", height: "400px" }}
          >
            {markerPosition && <MapMarker position={markerPosition} />}
          </Map>
        </Box>
        <Button
          colorPalette={"cyan"}
          onClick={() => navigate(`/product/edit/${product.productId}`)}
        >
          수정
        </Button>
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
      </Stack>
    </Box>
  );
}
