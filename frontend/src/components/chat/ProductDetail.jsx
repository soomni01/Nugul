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

export function ProductDetail({ productId }) {
  const [product, setProduct] = useState({});
  useEffect(() => {
    // id >productId
    axios.get(`/api/product/view/${productId}`).then((res) => {
      setProduct(res.data);
    });
  }, []);
  const fileName = product.fileList?.[0]?.name;
  const fileSrc = product.fileList?.[0]?.src;
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
    </Box>
  );
}
