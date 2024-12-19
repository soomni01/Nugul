import { useContext, useEffect, useState } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ChatListItem } from "../../components/chat/ChatListItem.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ChatView } from "./ChatView.jsx";
import { ProductDetail } from "../../components/chat/ProductDetail.jsx";

export function ChatList() {
  const queryLocation = useLocation();
  const [chatList, setChatList] = useState([]);
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useContext(AuthenticationContext);
  const [chatRoomId, setChatRoomId] = useState(
    queryLocation.state?.roomId || -1,
  );
  const [status, setStatus] = useState("For Sale");
  const [productId, setProductId] = useState(
    queryLocation.state?.productId || -1,
  );
  const token = localStorage.getItem("token");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      // 토큰이 없으면 로그인 페이지로 리다이렉트
      navigate("/");
    }

    if (id) {
      fetch(id);
    }
    getChatList();
  }, [searchParams, id, status, navigate]);

  function getChatList() {
    axios
      .get("/api/chat/list", {
        params: {
          memberId: id,
          type: searchParams.get("type"),
        },
      })
      .then((res) => {
        setChatList(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  const removeChatRoom = (roomId, id) => {
    axios
      .delete("/api/chat/delete/" + roomId, {
        params: {
          memberId: id,
        },
      })
      .then(
        setChatList((prev) => prev.filter((chat) => chat.roomId !== roomId)),
      )
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.content,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        setChatRoomId(-1);
        setProductId(-1);
      });
  };

  return (
    <Box>
      <Heading> 채팅 목록</Heading>
      <HStack>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setProductId(-1);
            setSearchParams({ type: "all" });
          }}
        >
          전체
        </Button>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setProductId(-1);
            setSearchParams({ type: "buy" });
          }}
        >
          구매
        </Button>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setProductId(-1);
            setSearchParams({ type: "sell" });
          }}
        >
          판매
        </Button>
      </HStack>
      <Box
        display={"flex"}
        borderRadius={"lg"}
        border={"1px solid"}
        maxHeight={"650px"}
        borderColor={"gray.300"}
        w={"auto"}
      >
        <Box overflowY={"scroll"}>
          {chatList.map((chat) => (
            <ChatListItem
              key={chat.roomId}
              chat={chat}
              onDelete={() => removeChatRoom(chat.roomId, id)}
              onClick={() => {
                setProductId(chat.productId);
                setChatRoomId(chat.roomId);
              }}
            />
          ))}
        </Box>

        {chatRoomId === -1 ? null : (
          <ChatView
            z-index={1}
            statusControl={() => {
              setStatus("Sold");
            }}
            key={chatRoomId}
            chatRoomId={chatRoomId}
            onDelete={() => removeChatRoom(chatRoomId, id)}
          />
        )}
        {productId === -1 ? null : (
          <ProductDetail key={productId} productId={productId} />
        )}
      </Box>
    </Box>
  );
}
