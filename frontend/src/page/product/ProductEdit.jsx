import {
  Box,
  Flex,
  Heading,
  Input,
  Spinner,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
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
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { categories } from "../../components/category/CategoryContainer.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { FcAddImage } from "react-icons/fc";

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

  useEffect(() => {
    axios.get(`/api/product/view/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  useEffect(() => {
    if (product && product.fileList) {
      // 파일 목록이 있으면 filesUrl에 해당 URL들을 추가
      const fileUrls = product.fileList.map((file) => file.src);
      setFilesUrl(fileUrls);
      setFiles(product.fileList);

      if (product.fileList && files.length > 0) {
        setMainImage(product.fileList[0]);
      }
    }
  }, [product]);

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
    setFiles((prev) => [...prev, ...newFiles]);
    // 중복 파일 체크
    const uniqueFiles = newFiles.filter((newFile) => {
      return !files.some((file) => file.name === newFile.name);
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
    <Box>
      <Heading>{id}번 상품 수정</Heading>
      <Stack gap={5}>
        <Flex alignItems="center">
          <Box minWidth="150px">
            <Field label={"이미지"}>
              <Box
                p="10"
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
                <FcAddImage size="30px" />
              </Box>
            </Field>
          </Box>

          <Box
            display="flex"
            gap="10px"
            mt={6}
            overflowX="auto"
            whiteSpace="nowrap"
            minWidth="100px"
          >
            {filesUrl.map((file, index) => (
              <Box
                key={index}
                width="100px"
                height="100px"
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
        <Text size="xs" mt={-2}>
          {!fileInputInvalid ? (
            "가장 처음 이미지가 대표이미지입니다."
          ) : (
            <span style={{ color: "red", fontSize: "12px" }}>
              각 파일은 1MB 이하, 총 용량은 10MB 이하이어야 합니다.
            </span>
          )}
        </Text>

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
              onClick={() => handleButtonClick("sell")} // 판매하기 버튼 클릭 시
            >
              판매하기
            </Button>
            <Button
              borderRadius="10px"
              variant={product.pay === "share" ? "solid" : "outline"} // 나눔하기 버튼 스타일
              onClick={() => handleButtonClick("share")} // 나눔하기 버튼 클릭 시
            >
              나눔하기
            </Button>
          </Flex>
        </Field>
        {product.pay === "sell" && (
          <Field label={"가격"}>
            <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
              <Input value={product.price} onChange={handlePriceChange} />
            </InputGroup>
          </Field>
        )}
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
        {hasAccess(product.writer) && (
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
