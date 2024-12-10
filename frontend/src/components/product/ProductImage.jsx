import React, { useRef } from "react";
import { Box, Flex } from "@chakra-ui/react";
import { FcAddImage } from "react-icons/fc";
import { Field } from "../ui/field.jsx";

export function ProductImage({
  files,
  setFiles,
  filesUrl,
  setFilesUrl,
  mainImage,
  setMainImage,
}) {
  const fileInputRef = useRef(null);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...files]);
    const newFiles = files.map((file) => URL.createObjectURL(file)); // 파일을 보기위한 URL
    setFilesUrl((prev) => [...prev, ...newFiles]);

    // 가장 왼쪽에 배치된 이미지를 대표 이미지로 설정 (첫 번째 파일)
    if (newFiles.length > 0) {
      setMainImage(newFiles[0]); // 첫 번째 파일을 대표 이미지로 설정
    }
  };

  const handleRemoveFile = (index) => {
    // 클릭한 이미지를 목록에서 제거
    setFilesUrl((prev) => prev.filter((_, i) => i !== index));
    setFiles((prev) => prev.filter((_, i) => i !== index));

    // 삭제한 이미지가 대표 이미지라면 mainImage 업데이트
    if (index === 0 && files.length > 1) {
      setMainImage(filesUrl[1]); // 다음 이미지를 대표 이미지로 설정
    } else if (files.length < 1) {
      setMainImage(null); // 이미지가 없으면 대표 이미지 초기화
    }
  };

  return (
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
              onChange={handleFileChange}
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
              handleRemoveFile(index);
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
  );
}
