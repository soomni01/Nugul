import { useState } from "react";
import { Client } from "@stomp/stompjs";
import { Box } from "@chakra-ui/react";
import * as Json from "postcss";
import { useNavigate } from "react-router-dom";

export function ChatList() {
  const [roomId, setRoomId] = useState(1);
  let navigate = useNavigate();

  // STOMP 클라이언트 생성
  const client = new Client({
    //websocketconfig 에 ,  /wschat 으로 해놓음
    url: "ws://localhost:8080/api/wschat",
    reconnectDelay: 5000,
    heartbeatIncoming: 4000,
    heartbeatOutgoing: 4000,
  });

  // 구독 하기 ( 웹 소켓 연결)
  client.onConnect = function () {
    client.subscribe("/topic", callback);
  };

  const callback = function (message) {
    if (message.body) {
      let msg = Json.parse(message.body);
    }
  };

  console.log(client);

  // <ChatListItem></ChatListItem>

  return (
    <Box>
      채팅 리스트
      <Box
        onClick={() => {
          navigate("/chat/room/" + roomId);
        }}
        bg={"red.300"}
      >
        {" "}
        1 번 채팅방
      </Box>
    </Box>
  );
}
