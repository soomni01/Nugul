import { Box, Card, HStack, Image, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";

export function ChatListItem({ chat, onDelete, onClick }) {
  const [productImage, setProductImage] = useState({ src: "", name: "" });

  useEffect(() => {
    axios
      .get(`/api/product/view/${chat.productId}`)
      .then((res) => res.data)
      .then((data) => {
        const fileList = data?.fileList?.[0]; // data와 fileList가 존재하는지 확인

        if (fileList) {
          // fileList가 존재하는 경우, src와 name 속성 체크
          if (fileList.src && fileList.name) {
            setProductImage({
              src: fileList.src,
              name: fileList.name,
            });
          } else {
            console.error(
              "fileList가 있지만 'src' 또는 'name' 속성이 없습니다:",
              fileList,
            );
          }
        } else {
          // console.error("fileList가 존재하지 않거나 비어 있습니다.");
        }
      });
  }, []);

  const defaultsrc = "./image/default.png";
  const productStatus = chat.status === "Sold" ? "subtle" : "elevated";

  return (
    <Box p={3} onClick={onClick} w={"100%"}>
      <Card.Root
        variant={productStatus}
        filter={chat.status === "Sold" ? "brightness(0.8)" : "none"}
        cursor="pointer"
        width={"100%"}
      >
        <HStack spacing={0} width={"100%"}>
          <Image
            p={3}
            minWidth="120px"
            maxWidth="120px"
            display="flex"
            flexShrink={0}
            aspectRatio="1"
            src={productImage.src || defaultsrc}
            alt={productImage.name}
            filter={chat.status === "Sold" ? "brightness(0.7)" : "none"}
          />
          <Box width="calc(300px - 130px)" overflow="hidden">
            <Card.Body px={0} pt={2}>
              <Card.Title>
                <Text
                  fontSize="lg"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  isTruncated
                >
                  {chat.productName}
                </Text>
              </Card.Title>
            </Card.Body>
            <Card.Footer pl={0}>
              <Text fontSize="md" isTruncated noOfLines={1} whiteSpace="nowrap">
                {chat.nickname != null ? chat.nickname : "탈퇴한 회원"}
              </Text>
            </Card.Footer>
          </Box>
        </HStack>
      </Card.Root>
    </Box>
  );
}
