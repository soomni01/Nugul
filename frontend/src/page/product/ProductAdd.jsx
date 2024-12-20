import React, { useContext, useRef, useState } from "react";
import { Box, Separator } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import { MapModal } from "../../components/map/MapModal.jsx";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import axios from "axios";
import {
  ProductDescriptionSection,
  ProductFormLayout,
  ProductImageSection,
  ProductLocationSection,
  ProductNameSection,
  ProductPaymentSection,
} from "../../components/product/ProductFormLayout.jsx";

export function ProductAdd(props) {
  const [pay, setPay] = useState("sell"); // 상태를 하나로 설정
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]);
  const [filesUrl, setFilesUrl] = useState([]);
  const [location, setLocation] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열고 닫을 상태
  const [progress, setProgress] = useState(false);
  const fileInputRef = useRef(null); // Image Box로 파일 선택하기 위해 input 참조
  const [mainImage, setMainImage] = useState(null);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  // 이미지 업로드
  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);

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

  // 이미지 삭제
  const handleRemoveImage = (index) => {
    setFilesUrl((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setMainImage(updated.length > 0 ? updated[0] : null);
      return updated;
    });
  };

  // 카테고리 선택
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // 거래 방식 선택
  const handlePayClick = (type) => {
    setPay(type);
    if (type === "share") setPrice(0);
  };

  // 가격 입력 필터링 (숫자만 허용하고 1000만 원 이하로 제한)
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) && Number(value) <= 10000000) {
      setPrice(value);
    } else if (Number(value) > 10000000) {
      toaster.create({
        description: "가격은 10,000,000원을 초과할 수 없습니다.",
        type: "warning",
      });
    }
  };

  // 선택된 장소 처리
  const handleLocationSelect = ({ lat, lng, locationName }) => {
    setLocation({ latitude: lat, longitude: lng, name: locationName });
  };

  // 상품 등록 요청
  const handleSave = () => {
    setProgress(true);

    const formData = new FormData();
    formData.append("productName", productName);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("latitude", location?.latitude || "");
    formData.append("longitude", location?.longitude || "");
    formData.append("locationName", location?.name || "");
    formData.append("pay", pay);
    formData.append("writer", id);

    if (mainImage) formData.append("mainImageName", mainImage.name);
    files.forEach((file) => formData.append("files[]", file));

    axios
      .postForm("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data)
      .then((data) => {
        toaster.create({
          description: data.message.text,
          type: data.message.type,
        });
        navigate(`/product/view/${data.data.productId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({ description: message.text, type: message.type });
      })
      .finally(() => setProgress(false));
  };

  const disabled = !(
    productName.trim().length > 0 &&
    description.trim().length > 0 &&
    location?.name
  );

  // 파일 용량 제한
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
    <ProductFormLayout>
      <ProductImageSection
        fileInputRef={fileInputRef}
        onFileUpload={handleImageUpload}
        filesUrl={filesUrl}
        onRemoveImage={handleRemoveImage}
        fileInputInvalid={fileInputInvalid}
      />

      <Separator />
      <ProductNameSection
        category={category}
        onCategoryChange={handleCategoryChange}
        productName={productName}
        onProductNameChange={(e) => setProductName(e.target.value)}
      />

      <Separator />

      <ProductPaymentSection
        pay={pay}
        onPayClick={handlePayClick}
        price={price}
        onPriceChange={handlePriceChange}
      />

      <Separator />

      <ProductDescriptionSection
        description={description}
        onDescriptionChange={(e) => setDescription(e.target.value)}
      />

      <Separator />

      <ProductLocationSection
        location={location}
        onModalOpen={() => setIsModalOpen(true)}
      />

      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleLocationSelect}
      />

      <Box display="flex" w="100%" justifyContent="flex-end">
        <Button
          w={"10%"}
          disabled={disabled}
          loading={progress}
          onClick={handleSave}
        >
          상품 등록
        </Button>
      </Box>
    </ProductFormLayout>
  );
}
