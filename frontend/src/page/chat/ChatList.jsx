import { Box, Heading } from "@chakra-ui/react";

export function ChatList() {
  // WebSocket 객체 생성 ( 서버의 Websocket) 포인트를 사용
  const socket = new WebSocket("wss://localhost:8080/chat");

  socket.onopen = function (evnet) {
    console.log("webSocket is connect");
    socket.send(`hello , Server`);
  };

  return (
    <Box my={5}>
      <Heading>채팅 리스트 화면</Heading>
    </Box>
  );
}
