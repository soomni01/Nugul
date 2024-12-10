import React, { useContext, useRef, useState } from "react";
import { Box, Flex, Heading, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { MapModal } from "../../components/map/MapModal.jsx";
import { categories } from "../../components/category/CategoryContainer.jsx";
import { useNavigate } from "react-router-dom";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import axios from "axios";
import { toaster } from "../../components/ui/toaster.jsx";
import { ProductImage } from "../../components/product/ProductImage.jsx";

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

  // 가격 입력 필터링
  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) setPrice(value);
  };

  // 버튼 클릭 시 해당 버튼을 표시
  const buttonClick = (buttonType) => {
    setPay(buttonType);
    if (buttonType === "share") {
      setPrice(0);
    }
  };

  // 선택된 장소 처리
  const handleSelectLocation = ({ lat, lng, locationName }) => {
    setLocation({ latitude: lat, longitude: lng, name: locationName });
  };

  // 카테고리 선택
  const handleCategoryChange = (e) => setCategory(e.target.value);

  // 상품 등록 요청
  const handleSaveClick = () => {
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

    // 메인이미지와 파일 추가
    if (mainImage) formData.append("mainImageName", mainImage.name);
    files.forEach((file) => formData.append("files[]", file));

    console.log(mainImage.name);
    axios
      .postForm("/api/product/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => res.data)
      .then((data) => {
        const message = data.message;

        toaster.create({
          description: message.text,
          type: message.type,
        });

        navigate(`/product/view/${data.data.productId}`);
      })
      .catch((e) => {
        const message = e.response.data.message;
        toaster.create({
          description: message.text,
          type: message.type,
        });
      })
      .finally(() => setProgress(false));
  };

  // 버튼 활성화 여부 판단
  const disabled = !(
    productName.trim().length > 0 &&
    description.trim().length > 0 &&
    location?.name
  );

  return (
    <Box>
      <Heading>상품 등록</Heading>
      <Stack gap={5}>
        <Field label={"이미지"}>
          <ProductImage
            files={files}
            setFiles={setFiles}
            filesUrl={filesUrl}
            setFilesUrl={setFilesUrl}
            mainImage={mainImage}
            setMainImage={setMainImage}
          />
        </Field>
        <Box>가장 처음 이미지가 대표이미지입니다.</Box>

        <Flex gap={3}>
          <Box minWidth="100px">
            <Field label={"카테고리"}>
              <select
                value={category}
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
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
              />
            </Field>
          </Box>
        </Flex>

        <Field label={"거래방식"}>
          <Flex gap={4}>
            <Button
              borderRadius="10px"
              variant={pay === "sell" ? "solid" : "outline"} // 판매하기 버튼 스타일
              onClick={() => buttonClick("sell")} // 판매하기 버튼 클릭 시
            >
              판매하기
            </Button>
            <Button
              borderRadius="10px"
              variant={pay === "share" ? "solid" : "outline"} // 나눔하기 버튼 스타일
              onClick={() => buttonClick("share")} // 나눔하기 버튼 클릭 시
            >
              나눔하기
            </Button>
          </Flex>
        </Field>
        {pay === "sell" && (
          <Field label={"가격"}>
            <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
              <Input
                value={price}
                onChange={handlePriceChange}
                placeholder="가격을 입력하세요"
              />
            </InputGroup>
          </Field>
        )}
        <Field label={"상품 설명"}>
          <Textarea
            h={200}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <Field label={"거래 희망 장소"}>
          <Input
            value={location?.name || ""}
            onClick={() => setIsModalOpen(true)} // 거래 장소 input 클릭 시 모달 열기
            placeholder="거래 희망 장소를 선택하세요"
            readOnly
          />
        </Field>
        {/* MapModal 컴포넌트 호출 */}
        <MapModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelectLocation={handleSelectLocation} // 장소 선택 시 처리
        />
        <Button
          disabled={disabled}
          loading={progress}
          onClick={handleSaveClick}
        >
          상품 등록
        </Button>
      </Stack>
    </Box>
  );
}
