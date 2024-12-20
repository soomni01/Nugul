import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  Separator,
  Spacer,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { categories } from "../../components/category/CategoryContainer.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { FcAddImage } from "react-icons/fc";
import { IoIosArrowForward } from "react-icons/io";

export function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasAccess } = useContext(AuthenticationContext);
  const fileInputRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [progress, setProgress] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [filesUrl, setFilesUrl] = useState([]);
  const [mainImage, setMainImage] = useState(null);
  const [removeFiles, setRemoveFiles] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    axios.get(`/api/product/view/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (product && product.fileList && !initialized) {
      // 최초 한 번만 파일 목록을 초기화
      const fileUrls = product.fileList.map((file) => file.src);
      setFilesUrl(fileUrls);
      setFiles(product.fileList);

      if (!mainImage && product.fileList.length > 0) {
        setMainImage(product.fileList[0]);
      }
      setInitialized(true);
    }
  }, [product, initialized]);

  useEffect(() => {
    if (files.length === 0) {
      setMainImage(null);
    } else if (files.length > 0) {
      setMainImage(files[0]);
    }
  }, [files]);

  const handleCategoryChange = (e) =>
    setProduct({ ...product, category: e.target.value });

  const handleButtonClick = (payType) =>
    setProduct({ ...product, pay: payType });

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setProduct({ ...product, price: value });
  };

  const handleLocationSelect = (location) => {
    setProduct({
      ...product,
      locationName: location.locationName,
      markerPosition: { lat: location.lat, lng: location.lng }, // 마커 위치
    });
  };

  const handleSaveClick = () => {
    setProgress(true);

    const formData = new FormData();
    formData.append("productId", product.productId);
    formData.append("productName", product.productName);
    formData.append("description", product.description);
    formData.append("price", product.pay === "share" ? 0 : product.price);
    formData.append("category", product.category);
    formData.append("pay", product.pay);
    formData.append("latitude", product.latitude);
    formData.append("longitude", product.longitude);
    formData.append("locationName", product.locationName);

    if (mainImage) formData.append("mainImageName", mainImage.name);
    files.forEach((file) => formData.append("uploadFiles[]", file));
    removeFiles.forEach((fileName) =>
      formData.append("removeFiles[]", fileName),
    );

    axios
      .putForm("/api/product/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        const { type, text } = res.data.message;
        toaster.create({ type, description: text });
      })
      .catch((e) => {
        const { type, text } = e.response.data.message;
        toaster.create({ type, description: text });
      })
      .finally(() => {
        setProgress(false);
        setDialogOpen(false);
        navigate(`/product/view/${product.productId}`);
      });
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);

    // setFiles((prev) => [...prev, ...newFiles]);
    // 중복 파일 체크
    const uniqueFiles = newFiles.filter((newFile) => {
      return (
        !files.some((file) => file.name === newFile.name) ||
        (file.src && file.src.includes(newFile.name))
      );
    });

    if (uniqueFiles.length > 0) {
      setFiles((prev) => [...prev, ...uniqueFiles]);
      setFilesUrl((prev) => [
        ...prev,
        ...uniqueFiles.map((file) => URL.createObjectURL(file)),
      ]);
      if (!mainImage && uniqueFiles.length > 0) setMainImage(uniqueFiles[0]);
    } else {
      toaster.create({
        description: "중복된 파일이 있습니다.",
        type: "warning",
      });
    }
  };

  const handleRemoveClick = (index) => {
    // 클릭한 이미지를 목록에서 제거
    setFilesUrl((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setRemoveFiles((prev) => [...prev, files[index]?.name]);

    // 삭제한 이미지가 대표 이미지라면 mainImage 업데이트
    if (index === 0 && files.length > 1) {
      setMainImage(files[1]);
    } else if (files.length === 1) {
      setMainImage(null);
    }
  };

  if (!product) {
    return <Spinner />;
  }

  // 버튼 활성화 여부 판단
  const disabled = !(
    product.productName.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.locationName.trim().length > 0
  );

  let fileInputInvalid = false;
  let sumOfFileSize = 0;
  let invalidOneFileSize = false;

  for (const file of files) {
    sumOfFileSize += file.size;
    if (file.size > 1024 * 1024) {
      invalidOneFileSize = true;
    }
  }
  if (sumOfFileSize > 10 * 1024 * 1024 || invalidOneFileSize) {
    fileInputInvalid = true;
  }

  return (
    <Box display="flex" p={5} width="100%">
      <Stack gap={5} width="100%">
        <Heading mb={3}>{id}번 상품 수정</Heading>
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
                  ref={fileInputRef} // input 참조
                  onChange={handleFileUpload}
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
                    flexShrink={0} // 이미지가 축소되지 않도록 설정s
                    onClick={() => {
                      handleRemoveClick(index, files[index]);
                    }}
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
              - 가장 처음 이미지가 대표이미지입니다.{"\n"}- 이미지는 상품 등록
              시 정사각형으로 짤려서 등록됩니다.{"\n"}- 이미지를 클릭하여 삭제할
              수 있습니다. {"\n"}- 큰 이미지일경우 이미지가 깨지는 경우가 발생할
              수 있습니다. {"\n"}- 각 파일은 1MB 이하, 총 용량은 10MB 이하이어야
              합니다.
            </Text>
          </Box>
        </HStack>

        <Separator />

        <HStack alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" minWidth="15%">
            상품명
            <span style={{ color: "red" }}>*</span>
          </Text>
          <Flex alignItems="center" w="85%" gap={3}>
            <Box minWidth="100px">
              <select
                value={product.category}
                onChange={handleCategoryChange}
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
                value={product.productName}
                placeholder="상품명을 입력하세요"
                onChange={(e) =>
                  setProduct({ ...product, productName: e.target.value })
                }
              />
            </Box>
          </Flex>
        </HStack>

        <Separator />

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
                variant={product.pay === "sell" ? "solid" : "outline"}
                onClick={() => handleButtonClick("sell")}
              >
                판매하기
              </Button>
              <Button
                borderRadius="10px"
                variant={product.pay === "share" ? "solid" : "outline"}
                onClick={() => handleButtonClick("share")}
              >
                나눔하기
              </Button>
            </HStack>

            {product.pay === "sell" && (
              <InputGroup
                w={"20%"}
                flex="1"
                startElement={<PiCurrencyKrwBold />}
              >
                <Input
                  value={product.price}
                  onChange={handlePriceChange}
                  placeholder="가격을 입력하세요"
                />
              </InputGroup>
            )}
          </Flex>
        </HStack>

        <Separator />

        <HStack alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" minWidth="15%">
            상품 설명
            <span style={{ color: "red" }}>*</span>
          </Text>
          <Flex alignItems="center" w="85%">
            <Textarea
              placeholder="등록할 상품의 게시글 내용을 작성해주세요."
              h={150}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </Flex>
        </HStack>

        <Separator />

        <HStack alignItems="flex-start">
          <Text fontSize="lg" fontWeight="bold" minWidth="15%">
            거래 장소
            <span style={{ color: "red" }}>*</span>
          </Text>
          <Flex alignItems="center" minWidth="85%">
            <InputGroup flex="1" endElement={<IoIosArrowForward />}>
              <Input
                value={product.locationName}
                onClick={() => setIsModalOpen(true)}
                readOnly
              />
            </InputGroup>
          </Flex>
        </HStack>

        <MapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleLocationSelect}
        />

        {hasAccess(product.writer) && (
          <Box display="flex" w="100%" justifyContent="flex-end">
            <DialogRoot
              open={dialogOpen}
              onOpenChange={(e) => setDialogOpen(e.open)}
            >
              <DialogTrigger asChild>
                <Button
                  w="10%"
                  size="lg"
                  disabled={disabled}
                  colorPalette={"blue"}
                >
                  저장
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>저장 확인</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p>{product.productId}번 상품 수정하시겠습니까?</p>
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
        )}
      </Stack>
    </Box>
  );
}
