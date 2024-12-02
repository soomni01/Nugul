import { useEffect, useState } from "react";
import { Box, Button, Heading, HStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ChatListItem } from "../../components/chat/ChatListItem.jsx";
import { toaster } from "../../components/ui/toaster.jsx";

export function ChatList() {
  const [chatList, setChatList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    getChatList();
  }, []);

  function getChatList() {
    axios
      .get("/api/chat/list")
      .then((res) => {
        // TODO: 얕은복사?? 깊은 복사 ? 기억은 잘 안남

        setChatList(res.data);
      })
      .catch();
  }

  const removeChatRoom = (roomId) => {
    axios
      .delete("api/chat/delete/" + roomId)
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
        <Button>전체</Button>
        <Button>구매</Button>
        <Button>판매</Button>
      </HStack>
      {chatList.map((chat) => (
        <ChatListItem
          key={chat.roomId}
          chat={chat}
          onDelete={() => removeChatRoom(chat.roomId)}
        />
      ))}
    </Box>
  );
}
