import { useNavigate } from "react-router-dom";
import { Badge, Box, Card, HStack, Image } from "@chakra-ui/react";
import { Button } from "../../components/ui/button.jsx";
import { useEffect, useState } from "react";
import axios from "axios";

export function ChatListItem({ chat, onDelete, onClick }) {
  const [productImage, setProductImage] = useState({ src: "", name: "" });
  const navigate = useNavigate();

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
          console.error("fileList가 존재하지 않거나 비어 있습니다.");
        }
      });
  }, []);

  const defaultsrc = "./image/testImage.png";

  return (
    <Box variant={"outline"} p={3} onClick={onClick} width={"auto"}>
      <Card.Root
        className={chat.status === "Sold" ? "overlay" : ""}
        flex
        Direction="row"
        maxH={"200px"}
        _hover={{
          borderColor: "gray",
        }}
      >
        <HStack>
          <Image
            objectFit={"cover"}
            maxW={"100px"}
            src={productImage.src || defaultsrc}
            alt={productImage.name}
          />
          <Box>
            <Card.Body>
              <Card.Title>
                <h3> 상품명: {chat.productName} </h3>
              </Card.Title>
              <HStack mt="4">
                <Badge> 닉네임 : {chat.nickname}</Badge>
              </HStack>
            </Card.Body>
            <Card.Footer>
              <Button
                variant={"outline"}
                onClick={() => {
                  navigate(`/chat/room/${chat.roomId}`);
                }}
              >
                대화하러 가기
              </Button>
            </Card.Footer>
          </Box>
        </HStack>
      </Card.Root>
    </Box>
  );
}
