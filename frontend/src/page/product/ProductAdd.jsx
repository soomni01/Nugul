import React, { useContext, useRef, useState } from "react";
import { Box, Flex, Heading, Input, Stack, Textarea } from "@chakra-ui/react";
import { Field } from "../../components/ui/field.jsx";
import { Button } from "../../components/ui/button.jsx";
import { InputGroup } from "../../components/ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { FcAddImage } from "react-icons/fc";
import { MapModal } from "../../components/map/MapModal.jsx";
import { categories } from "../../components/category/CategoryContainer.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../context/AuthenticationProvider.jsx";

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

  // 파일 이미지 클릭 시 input 클릭 트리거
  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 이미지 파일 업로드
  const imageUploadButton = (e) => {
    const files = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...files]);
    const newFiles = files.map((file) => URL.createObjectURL(file)); // 파일을 보기위한 URL
    setFilesUrl((prev) => [...prev, ...newFiles]);

    // 가장 왼쪽에 배치된 이미지를 대표 이미지로 설정 (첫 번째 파일)
    if (mainImage === null && files.length > 0) {
      setMainImage(files[0]); // 첫 번째 파일을 대표 이미지로 설정
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
    console.log(productName, category, pay, price, description, location);

    axios
      .postForm("/api/product/add", {
        productName,
        description,
        price,
        category,
        location,
        //  토큰에서 받아서 값 넣음
        writer: id,
        pay,
        latitude: location?.latitude,
        longitude: location?.longitude,
        locationName: location?.name,
        files,
        mainImage,
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
        <Flex alignItems="center">
          <Box minWidth="150px">
            <Field label={"이미지"}>
              <Box
                p="10"
                borderWidth="1px"
                borderColor="lightgray"
                borderRadius="10px"
                onClick={handleBoxClick} // Box 클릭 이벤트
                cursor="pointer"
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
                  // 클릭한 이미지를 목록에서 제거
                  setFilesUrl((prev) => prev.filter((_, i) => i !== index));
                  setFiles((prev) => prev.filter((_, i) => i !== index));

                  // 삭제한 이미지가 대표 이미지라면 mainImage 업데이트
                  if (index === 0 && files.length > 1) {
                    setMainImage(filesUrl[1]); // 다음 이미지를 대표 이미지로 설정
                  } else if (files.length === 1) {
                    setMainImage(null); // 이미지가 없으면 대표 이미지 초기화
                  }
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
