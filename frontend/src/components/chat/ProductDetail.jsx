import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  HStack,
  Image,
  Input,
  Separator,
  Textarea,
} from "@chakra-ui/react";
import { InputGroup } from "../ui/input-group.jsx";
import { PiCurrencyKrwBold } from "react-icons/pi";
import { Field } from "../ui/field.jsx";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export function ProductDetail({ productId }) {
  const [product, setProduct] = useState({});
  const [position, setPosition] = useState({ lat: "", lng: "" });
  useEffect(() => {
    axios.get(`/api/product/view/${productId}`).then((res) => {
      setProduct(res.data);
      setPosition((prev) => ({
        ...prev, // 이전 상태 유지
        lat: res.data.latitude, // 새로운 위도 값
        lng: res.data.longitude, // 새로운 경도 값
      }));
    });
  }, []);
  const fileName = product.fileList?.[0]?.name;
  const fileSrc = product.fileList?.[0]?.src;
  const defaultsrc = "./image/testImage.png";

  return (
    <Box w={"350px"} h={"650px"} p={3} overflow={"hidden"}>
      <Box mx={"auto"}>
        <Box mx={5}>
          <Heading> {product.productName}</Heading>
          <Separator></Separator>
        </Box>
        <Box m={5} display="flex" flexDirection="column" alignItems="center">
          <Image
            height={"200px"}
            w={"100%"}
            src={fileSrc || defaultsrc}
            alt={fileName}
          />
          <Field label={"상품 설명"} readOnly>
            <Textarea h={50} value={product.description} />
          </Field>
        </Box>
        <Box m={3}>
          <Box mx={"auto"}>
            <HStack>
              <Field label={"가격"} readOnly>
                <InputGroup startElement={<PiCurrencyKrwBold />}>
                  <Input value={product.price} />
                </InputGroup>
              </Field>

              <Field label={"작성자"} readOnly>
                <Input value={product.nickname} />
              </Field>
            </HStack>
          </Box>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Map
            center={position}
            style={{ width: "90%", height: "180px" }}
            level={3}
          >
            <MapMarker position={position} />
          </Map>
          <p>거래장소:{product.locationName}</p>
        </Box>
      </Box>
    </Box>
  );
}
