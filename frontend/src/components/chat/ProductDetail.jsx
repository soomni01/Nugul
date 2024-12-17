import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Heading,
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
  console.log(product.lat, product.lng);
  return (
    <Box mx={"auto"} w={"600px"} h={"auto"} p={6}>
      <Box m={5}>
        <Heading> {product.productName}</Heading>
        <Separator></Separator>
      </Box>
      <Box m={5}>
        <Image src={fileSrc} alt={fileName} />
        <Field label={"상품 설명"} readOnly>
          <Textarea h={50} value={product.description} />
        </Field>
      </Box>
      <Box m={3}>
        <Box mx={"auto"}>
          <Field label={"가격"} readOnly>
            <InputGroup flex="1" startElement={<PiCurrencyKrwBold />}>
              <Input value={product.price} />
            </InputGroup>
          </Field>
          <p> 닉네임 : {product.nickname} </p>
          <p> {product.description}</p>
        </Box>
      </Box>
      <Box>
        <Map
          className={"map"}
          center={position}
          style={{ width: "100%", height: "250px" }}
          level={3}
        >
          <MapMarker position={position} />
        </Map>
        <p>거래장소:{product.locationName}</p>
      </Box>
    </Box>
  );
}
