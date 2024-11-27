import React, { useRef, useState } from "react";
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
  const fileInputRef = useRef(null); // Image Box로 파일 선택하기 위해 input 참조
  const [fileUrls, setFileUrls] = useState([]); // 파일 URL 목록

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

  // 파일 이미지 클릭 시 input 클릭 트리거
  function handleBoxClick() {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }

  function imageUploadButton(e) {
    const files = Array.from(e.target.files);
    const newUrls = files.map((file) => URL.createObjectURL(file)); // 파일 URL 생성
    setFileUrls((prev) => [...prev, ...newUrls]); // 기존 URL에 추가
  }

  return (
    <Box>
      <Heading>상품 등록</Heading>
      <Stack gap={5}>
        <Flex alignItems="center">
          <Box minWidth="150px">
            <Field label={"이미지"}>
              <Box
                p="10"
                borderWidth="1px"
                borderColor="lightgray"
                borderRadius="10px"
                onClick={handleBoxClick} // Box 클릭 이벤트
                cursor="pointer" // 마우스 커서를 포인터로 설정
                textAlign="center"
              >
                <input
                  ref={fileInputRef} // input 참조
                  onChange={imageUploadButton}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                />
                <FcAddImage size="30px" />
              </Box>
            </Field>
          </Box>
          <Box
            display="flex"
            gap="10px"
            mt={6}
            overflowX="auto"
            whiteSpace="nowrap" // 이미지들이 한 줄로 나열되도록
            minWidth="100px"
          >
            {fileUrls.map((url, index) => (
              <Box
                key={index}
                width="100px"
                height="100px"
                border="1px solid lightgray"
                borderRadius="10px"
                overflow="hidden"
                display="inline-block" // 각 이미지를 한 줄로 배치
                flexShrink={0} // 이미지가 축소되지 않도록 설정s
              >
                <img
                  src={url}
                  alt={`파일 미리보기: ${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>
            ))}
          </Box>
        </Flex>
        <Flex gap={3}>
          <Box minWidth="100px">
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
