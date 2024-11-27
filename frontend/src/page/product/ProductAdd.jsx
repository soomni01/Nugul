import React, { useState } from "react";
import {
  Box,
  createListCollection,
  Flex,
  Heading,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { FcAddImage } from "react-icons/fc";

export function ProductAdd(props) {
  const [selectedButton, setSelectedButton] = useState("sell"); // 상태를 하나로 설정
  const [price, setPrice] = useState("");

  // 버튼 클릭 시 해당 버튼을 표시
  function buttonClick(buttonType) {
    setSelectedButton(buttonType);
  }

  // 가격 입력칸에 숫자만 입력되도록 필터링
  function handlePriceChange(e) {
    const value = e.target.value;

    if (/^\d*$/.test(value)) {
      setPrice(value);
    }
  }

  // 카테고리 목록
  const categories = createListCollection({
    items: [
      { label: "전체", value: "all" },
      { label: "의류", value: "clothes" },
      { label: "잡화", value: "angular" },
      { label: "식품", value: "food" },
      { label: "뷰티", value: "beauty" },
      { label: "디지털 기기", value: "digital" },
      { label: "쿠폰", value: "coupon" },
    ],
  });

  return (
    <Box>
      <Heading>상품 등록</Heading>
      <Stack gap={5}>
        <Field label={"이미지"}>
          <Box
            p="10"
            borderWidth="1px"
            borderColor="lightgray"
            borderRadius="10px"
          >
            <FcAddImage size="30px" />
          </Box>
        </Field>
        <Flex gap={3}>
          <Box flex={2}>
            <Field label={"카테고리"}>
              <select
                style={{
                  width: "100px",
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              >
                {categories.items.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>
          </Box>
          <Box flex={8}>
            <Field label={"제목"}>
              <Input />
            </Field>
          </Box>
        </Flex>
        <Field label={"거래방식"}>
          <Flex gap={4}>
            <Button
              borderRadius="10px"
              variant={selectedButton === "sell" ? "solid" : "outline"} // 판매하기 버튼 스타일
              onClick={() => buttonClick("sell")} // 판매하기 버튼 클릭 시
            >
              판매하기
            </Button>
            <Button
              borderRadius="10px"
              variant={selectedButton === "share" ? "solid" : "outline"} // 나눔하기 버튼 스타일
              onClick={() => buttonClick("share")} // 나눔하기 버튼 클릭 시
            >
              나눔하기
            </Button>
          </Flex>
        </Field>
        <Field label={"가격"}>
          <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
            <Input
              value={price}
              onChange={handlePriceChange}
              placeholder="가격을 입력하세요"
            />
          </InputGroup>
        </Field>
        <Field label={"상품 설명"}>
          <Textarea h={200} />
        </Field>
        <Field label={"거래 희망 장소"}>
          <Input />
        </Field>
        <Button>상품 등록</Button>
      </Stack>
    </Box>
  );
}
