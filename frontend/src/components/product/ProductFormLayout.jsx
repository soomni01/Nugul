import {
  Box,
  Flex,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { FcAddImage } from "react-icons/fc"; // ProductPaymentSection.jsx
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { IoIosArrowForward } from "react-icons/io";
import { categories } from "../category/CategoryContainer.jsx";
import { useTheme } from "../context/ThemeProvider.jsx";

export function ProductFormLayout({ children, title }) {
  return (
    <Box display="flex" p={5} width="100%">
      <Stack gap={5} width="100%">
        {title}
        {children}
      </Stack>
    </Box>
  );
}

export function ProductImageSection({
  fileInputRef,
  onFileUpload,
  filesUrl,
  onRemoveImage,
  fileInputInvalid,
}) {
  return (
    <HStack alignItems="flex-start" width="100%">
      <Text fontSize="lg" fontWeight="bold" textAlign="left" minWidth="15%">
        상품 이미지
      </Text>
      <Spacer />
      <Box width="85%">
        <Flex alignItems="center" gap={3} mb={4}>
          <Box
            p="16"
            borderWidth="1px"
            borderColor="lightgray"
            borderRadius="10px"
            onClick={() => fileInputRef.current?.click()}
            cursor="pointer"
            textAlign="center"
          >
            <input
              ref={fileInputRef}
              onChange={onFileUpload}
              type="file"
              accept="image/*"
              multiple
              style={{ display: "none" }}
            />
            <FcAddImage size="40px" />
          </Box>

          <Box display="flex" gap="10px" overflowX="auto">
            {filesUrl.map((file, index) => (
              <Box
                key={index}
                width="150px"
                height="150px"
                border="1px solid lightgray"
                borderRadius="10px"
                overflow="hidden"
                cursor="pointer"
                display="inline-block"
                flexShrink={0}
                onClick={() => onRemoveImage(index)}
              >
                <img
                  src={file}
                  alt={`파일 미리보기: ${index}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Flex>

        {fileInputInvalid && (
          <Text fontSize="sm" color="red" mb={3}>
            각 파일은 1MB 이하, 총 용량은 10MB 이하이어야 합니다.
          </Text>
        )}

        <Text fontSize="sm" color="blue.400" whiteSpace="pre-line">
          - 가장 처음 이미지가 대표이미지입니다.{"\n"}- 이미지는 상품 등록 시
          정사각형으로 짤려서 등록됩니다.{"\n"}- 이미지를 클릭하여 삭제할 수
          있습니다. {"\n"}- 큰 이미지일경우 이미지가 깨지는 경우가 발생할 수
          있습니다. {"\n"}- 각 파일은 1MB 이하, 총 용량은 10MB 이하이어야
          합니다.
        </Text>
      </Box>
    </HStack>
  );
}

export function ProductNameSection({
  category,
  onCategoryChange,
  productName,
  onProductNameChange,
}) {
  return (
    <HStack alignItems="flex-start">
      <Text fontSize="lg" fontWeight="bold" minWidth="15%">
        상품명
        <span style={{ color: "red" }}>*</span>
      </Text>
      <Flex alignItems="center" w="85%" gap={3}>
        <Box minWidth="100px">
          <select
            value={category}
            onChange={onCategoryChange}
            style={{
              width: "100px",
              padding: "11px",
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
        </Box>
        <Box width="100%">
          <Input
            size="xl"
            value={productName}
            placeholder="상품명을 입력하세요"
            onChange={onProductNameChange}
          />
        </Box>
      </Flex>
    </HStack>
  );
}

export function ProductPaymentSection({
  pay,
  onPayClick,
  price,
  onPriceChange,
}) {
  const { primaryColor, buttonColor, fontColor } = useTheme();
  return (
    <HStack alignItems="flex-start">
      <Text fontSize="lg" fontWeight="bold" minWidth="15%">
        거래 방식
        <span style={{ color: "red" }}>*</span>
      </Text>
      <Flex alignItems="flex-start" w="85%" gap={4} direction="column">
        <HStack>
          <Button
            size="lg"
            borderRadius="10px"
            variant={pay === "sell" ? "solid" : "outline"}
            onClick={() => onPayClick("sell")}
            bg={pay === "sell" ? buttonColor : "transparent"}
            _hover={{
              bg: pay === "sell" ? `${buttonColor}AA` : "gray.100",
            }}
            color={pay === "sell" ? fontColor : "gray.600"}
            fontWeight="bold"
            border={pay === "sell" ? "none" : `1px solid gray.400`}
          >
            판매하기
          </Button>
          <Button
            size="lg"
            borderRadius="10px"
            variant={pay === "share" ? "solid" : "outline"}
            onClick={() => onPayClick("share")}
            bg={pay === "share" ? buttonColor : "transparent"}
            _hover={{
              bg: pay === "share" ? `${buttonColor}AA` : "gray.100",
            }}
            color={pay === "share" ? fontColor : "gray.600"}
            fontWeight="bold"
            border={pay === "share" ? "none" : `1px solid gray.400`}
          >
            나눔하기
          </Button>
        </HStack>

        {pay === "sell" && (
          <InputGroup w={"20%"} flex="1" startElement={<PiCurrencyKrwBold />}>
            <Input
              value={price}
              onChange={onPriceChange}
              placeholder="가격을 입력하세요"
            />
          </InputGroup>
        )}
      </Flex>
    </HStack>
  );
}

export function ProductDescriptionSection({
  description,
  onDescriptionChange,
}) {
  return (
    <HStack alignItems="flex-start">
      <Text fontSize="lg" fontWeight="bold" minWidth="15%">
        상품 설명
        <span style={{ color: "red" }}>*</span>
      </Text>
      <Flex alignItems="center" w="85%">
        <Textarea
          placeholder="등록할 상품의 게시글 내용을 작성해주세요."
          fontSize="md"
          h={150}
          value={description}
          onChange={onDescriptionChange}
        />
      </Flex>
    </HStack>
  );
}

export function ProductLocationSection({ location, onModalOpen }) {
  return (
    <HStack alignItems="flex-start">
      <Text fontSize="lg" fontWeight="bold" minWidth="15%">
        거래 장소
        <span style={{ color: "red" }}>*</span>
      </Text>
      <Flex alignItems="center" minWidth="85%">
        <InputGroup flex="1" endElement={<IoIosArrowForward />}>
          <Input
            value={location?.name || ""}
            onClick={onModalOpen}
            placeholder="거래 희망 장소를 추가하세요"
            readOnly
          />
        </InputGroup>
      </Flex>
    </HStack>
  );
}
