import { useEffect, useState } from "react";
import { Box, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
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

  const createChatRoom = () => {
    var testId;
    var productName = "다른 상품";
    var writer = "작성자 아님";
    axios
      .post("/api/chat/create", {
        productName: productName,
        writer: writer,
      })
      .then((res) => {
        console.log(res.data);
        testId = res.data;
        navigate("/chat/room/" + testId);
      });
    // 추가
  };

  return (
    <Box>
      <Heading> 채팅 목록</Heading>
      {chatList.map((chat) => (
        <ChatListItem
          key={chat.roomId}
          chat={chat}
          onDelete={() => removeChatRoom(chat.roomId)}
        />
      ))}

      <Button variant={"outline"} onClick={createChatRoom}>
        채팅창 생성 버튼
      </Button>
    </Box>
  );
}
