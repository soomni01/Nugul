import { Box, Heading, Separator, Spinner } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
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
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import {
  ProductDescriptionSection,
  ProductFormLayout,
  ProductImageSection,
  ProductLocationSection,
  ProductNameSection,
  ProductPaymentSection,
} from "../../components/product/ProductFormLayout.jsx";

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

  // 상품 정보 가져오기
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }

    axios.get(`/api/product/view/${id}`).then((res) => {
      setProduct(res.data);
    });
  }, [id]);

  // 파일 정보 가져오기
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

  // 이미지 추가
  const handleImageUpload = (e) => {
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

  // 이미지 삭제
  const handleRemoveImage = (index) => {
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

  // 카테고리
  const handleCategoryChange = (e) =>
    setProduct({ ...product, category: e.target.value });

  // 상품명
  const handleProductNameChange = (e) =>
    setProduct({ ...product, productName: e.target.value });

  // 거래방식
  const handlePaymentClick = (payType) => {
    if (payType === "share") {
      setProduct((prevProduct) => ({ ...prevProduct, pay: payType, price: 0 }));
    } else {
      setProduct((prevProduct) => ({ ...prevProduct, pay: payType }));
    }
  };

  // 가격
  const handlePriceChange = (e) => {
    const value = e.target.value;

    // 숫자만 허용 및 1000만 원 이하 제한
    if (/^\d*$/.test(value)) {
      if (Number(value) <= 10000000) {
        setProduct((prevProduct) => ({ ...prevProduct, price: value }));
      } else {
        toaster.create({
          description: "가격은 10,000,000원을 초과할 수 없습니다.",
          type: "warning",
        });
      }
    }
  };

  // 상품 설명
  const handleDescriptionChange = (e) =>
    setProduct({ ...product, description: e.target.value });

  // 거래 장소
  const handleLocationSelect = (location) => {
    setProduct({
      ...product,
      locationName: location.locationName,
      markerPosition: { lat: location.lat, lng: location.lng }, // 마커 위치
    });
  };

  const handleSaveClick = () => {
    setProgress(true);
    const payType = product.price === 0 ? "share" : "sell";

    const formData = new FormData();
    formData.append("productId", product.productId);
    formData.append("productName", product.productName);
    formData.append("description", product.description);
    formData.append("price", payType === "share" ? 0 : product.price);
    formData.append("category", product.category);
    formData.append("pay", payType); // pay 동적 설정
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

  if (!product) {
    return <Spinner />;
  }

  // 버튼 활성화 여부 판단
  const disabled = !(
    product.productName.trim().length > 0 &&
    product.description.trim().length > 0 &&
    product.locationName.trim().length > 0
  );

  // 파일 크기 제한
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
    <ProductFormLayout title={<Heading mb={3}>{id}번 상품 수정</Heading>}>
      <ProductImageSection
        fileInputRef={fileInputRef}
        onFileUpload={handleImageUpload}
        filesUrl={filesUrl}
        onRemoveImage={handleRemoveImage}
        fileInputInvalid={fileInputInvalid}
      />

      <Separator />

      <ProductNameSection
        category={product.category}
        onCategoryChange={handleCategoryChange}
        productName={product.productName}
        onProductNameChange={handleProductNameChange}
      />

      <Separator />

      <ProductPaymentSection
        pay={product.pay}
        onPayClick={handlePaymentClick}
        price={product.price}
        onPriceChange={handlePriceChange}
      />

      <Separator />

      <ProductDescriptionSection
        description={product.description}
        onDescriptionChange={handleDescriptionChange}
      />

      <Separator />

      <ProductLocationSection
        location={{ name: product.locationName }}
        onModalOpen={() => setIsModalOpen(true)}
      />

      <MapModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectLocation={handleLocationSelect}
        prevLocationName={product.locationName}
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
    </ProductFormLayout>
  );
}
