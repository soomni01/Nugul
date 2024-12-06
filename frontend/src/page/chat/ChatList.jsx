import { useContext, useEffect, useState } from "react";
import { Box, Button, Flex, Heading, HStack } from "@chakra-ui/react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { ChatListItem } from "../../components/chat/ChatListItem.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { ChatView } from "./ChatView.jsx";

export function ChatList() {
  const [chatList, setChatList] = useState([]);
  let navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { id } = useContext(AuthenticationContext);
  const [chatRoomId, setChatRoomId] = useState(-1);

  useEffect(() => {
    if (id) {
      fetch(id);
    }
    getChatList();
  }, [searchParams, id]);

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

  const removeChatRoom = (roomId) => {
    axios
      .delete("/api/chat/delete/" + roomId)
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
      .catch();
  };

  return (
    <Box>
      <Heading> 채팅 목록</Heading>
      <HStack>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setSearchParams({ type: "all" });
          }}
        >
          전체
        </Button>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setSearchParams({ type: "buy" });
          }}
        >
          구매
        </Button>
        <Button
          onClick={() => {
            setChatRoomId(-1);
            setSearchParams({ type: "sell" });
          }}
        >
          판매
        </Button>
      </HStack>
      <Flex>
        <Box>
          {chatList.map((chat) => (
            <ChatListItem
              key={chat.roomId}
              chat={chat}
              onDelete={() => removeChatRoom(chat.roomId)}
              onClick={() => {
                setChatRoomId(chat.roomId);
              }}
            />
          ))}
        </Box>

        {chatRoomId === -1 ? null : (
          <ChatView key={chatRoomId} chatRoomId={chatRoomId} />
        )}
        <Box>상품 정보</Box>
      </Flex>
    </Box>
  );
}
