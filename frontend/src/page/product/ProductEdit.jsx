import {
  Box,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { MapModal } from "../../components/map/MapModal.jsx";
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
import React, { useEffect, useState } from "react";
import axios from "axios";
import { categories } from "../../components/category/CategoryContainer.jsx";

function ImageFileView() {
  return null;
}

export function ProductEdit() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열고 닫을 상태
  const [dialogOpen, setDialogOpen] = useState(false);
  useEffect(() => {
    axios.get(`/api/product/view/${id}`).then((res) => setProduct(res.data));
  }, []);

  const handleCategoryChange = (e) =>
    setProduct({ ...product, category: e.target.value });

  const buttonClick = (buttonType) => {
    setProduct({ ...product, pay: buttonType });
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setProduct({ ...product, price: value });
  };

  const handleLocationSelect = (location) => {
    // 모달에서 선택한 위치를 product 상태에 반영
    setProduct({
      ...product,
      locationName: location.locationName,
      markerPosition: { lat: location.lat, lng: location.lng }, // 마커 위치
    });
  };

  const handleSaveClick = () => {
    setProgress(true);
    axios.putForm("/api");
  };

  if (product === null) {
    return <Spinner />;
  }

  // 버튼 활성화 여부 판단
  const disabled = !(
    product.productName.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.price > 0 &&
    product.locationName.trim().length > 0
  );

  return (
    <Box>
      <Heading>{id}번 상품 수정</Heading>
      <Stack gap={5}>
        <ImageFileView />
        <Flex gap={3}>
          <Box minWidth="100px">
            <Field label={"카테고리"}>
              <select
                value={product.category}
                onChange={handleCategoryChange}
                style={{
                  width: "100px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </Box>
          <Box flex={8}>
            <Field label={"상품명"}>
              <Input
                value={product.productName}
                onChange={(e) =>
                  setProduct({ ...product, productName: e.target.value })
                }
              />
            </Field>
          </Box>
        </Flex>
        <Field label={"거래방식"}>
          <Flex gap={4}>
            <Button
              borderRadius="10px"
              variant={product.pay === "sell" ? "solid" : "outline"} // 판매하기 버튼 스타일
              onClick={() => buttonClick("sell")} // 판매하기 버튼 클릭 시
            >
              판매하기
            </Button>
            <Button
              borderRadius="10px"
              variant={product.pay === "share" ? "solid" : "outline"} // 나눔하기 버튼 스타일
              onClick={() => buttonClick("share")} // 나눔하기 버튼 클릭 시
            >
              나눔하기
            </Button>
          </Flex>
        </Field>
        <Field label={"가격"}>
          <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
            <Input value={product.price} onChange={handlePriceChange} />
          </InputGroup>
        </Field>
        <Field label={"상품 설명"}>
          <Textarea
            h={200}
            value={product.description}
            onChange={(e) =>
              setProduct({ ...product, description: e.target.value })
            }
          />
        </Field>
        <Field label={"거래 희망 장소"}>
          <Input
            value={product.locationName}
            onClick={() => setIsModalOpen(true)} // 거래 장소 input 클릭 시 모달 열기
            readOnly
          />
        </Field>
        <MapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleLocationSelect}
        />

        <Box>
          <DialogRoot
            open={dialogOpen}
            onOpenChange={(e) => setDialogOpen(e.open)}
          >
            <DialogTrigger asChild>
              <Button disabled={disabled} colorPalette={"blue"}>
                저장
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>저장 확인</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <p>{product.productID}번 상품 수정하시겠습니까?</p>
              </DialogBody>
              <DialogFooter>
                <DialogActionTrigger>
                  <Button variant={"outline"}>취소</Button>
                </DialogActionTrigger>
                <Button
                  loading={progress}
                  colorPalette={"blue"}
                  onClick={handleSaveClick}
                >
                  저장
                </Button>
              </DialogFooter>
            </DialogContent>
          </DialogRoot>
        </Box>
      </Stack>
    </Box>
  );
}
