import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { Client } from "@stomp/stompjs";
import { useEffect, useRef, useState } from "react";
import { Field } from "../../components/ui/field.jsx";

export function ChatView() {
  const [clientMessage, setClientMessage] = useState("");
  const clientRef = useRef(null);
  const [chatMessage, setChatMessage] = useState([]);
  // 처음에 채팅 메시지를 출력받아서 보여주고 ,
  useEffect(() => {
    // 클라이언트 생성

    const client = new Client({
      // WebSocket 프로토콜을 사용해야 함
      brokerURL: "ws://localhost:8080/wschat", //
      // brokerURL: "/ws-chat",
      // 연결 성공 시 콜백
      onConnect: () => {
        console.log("WebSocket 연결 성공!");
        client.send(
          "/app/chat",
          {},
          JSON.stringify({ content: "Hello, Server!" }),
        );

        // /topic 경로 구독
        client.subscribe("/topic/messages", (message) => {
          const receivedMessage = JSON.parse(message.body);
          console.log("받은 메시지:", receivedMessage);
        });
      },

      // // 디버그 메시지 출력
      // debug: (str) => {
      //   console.log("STOMP Debug:", str);
      // },

      // STOMP 프로토콜 에러 처리
      onStompError: (frame) => {
        console.log("STOMP Error:", frame.headers["message"]);
        console.log("에러 상세:", frame.body);
      },

      // WebSocket 연결 에러 처리
      onWebSocketError: (event) => {
        console.error("WebSocket 연결 에러:", event);
      },

      // 재연결 시도 간격(ms)
      reconnectDelay: 5000,

      // Heartbeat 설정
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // WebSocket 연결 활성화
    client.activate();
    clientRef.current = client;
    console.log(client);
  }, []);

  let handleSubmitClick = () => {
    //  전송 관련 함수
  };

  return (
    <Box>
      채팅 화면입니다.
      <Flex>
        <Box bg={"red.300"} h={500}>
          <h3> 클라이언트</h3>
          <Box> {clientMessage}</Box>

          <Field>
            <Input
              type={"text"}
              value={clientMessage}
              onChange={(e) => {
                setClientMessage(e.target.value);
              }}
            />
          </Field>
          <Button variant={"outline"} onClick={handleSubmitClick}>
            버튼
          </Button>
        </Box>
        <Box bg={"blue.300"}>
          <h3> 서버 </h3>
          <Field>
            <Input type={"text"} />
          </Field>
          <Button variant={"outline"} onClick={handleSubmitClick}>
            {" "}
            버튼
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
