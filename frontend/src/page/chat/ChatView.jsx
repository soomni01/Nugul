import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Field } from "../../components/ui/field.jsx";
import { Client } from "@stomp/stompjs";

export function ChatView() {
  const [clientMessage, setClientMessage] = useState("");
  const clientRef = useRef(null);
  const [chatMessage, setChatMessage] = useState([]);
  // 처음에 채팅 메시지를 출력받아서 보여주고 ,
  useEffect(() => {
    // 클라이언트 생성

    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      //  원래는 시작하자마자 메시지를 보낼 필요는 없음  , 인풋에 입력한걸 전송할때 보낼꺼니가
      // TODO 실행확인용으로  남겨두었고 나중에 변경해야함
      onConnect: () => {
        console.log("Connected to socket");

        client.subscribe("/topic/messages", function (messageOutput) {
          // 발행된 메시지 출력
          console.log("Received message: ", messageOutput.body);
        });
      },
      onStompError: (err) => {
        console.error(err);
      },
    });

    client.activate();
  }, []);

  function connect() {
    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      //  원래는 시작하자마자 메시지를 보낼 필요는 없음  , 인풋에 입력한걸 전송할때 보낼꺼니가
      // TODO 실행확인용으로  남겨두었고 나중에 변경해야함
      onConnect: () => {
        console.log("Connected to socket");
        client.subscribe("/room/1", function (messageOutput) {
          // 발행된 메시지 출력
          console.log("Received message: ", messageOutput.body);
        });
      },
      onStompError: (err) => {
        console.error(err);
      },
    });
  }

  const sendMessage = () => {
    if (clientMessage.trim()) {
      // 메시지 비어있으면 보내지 않음
    }
    const stompClient = new Client();
    stompClient.send("/send/1",{},JSON.stringify({
      ''
    }))

    stompClient.setClientMessage("");
  };

  return (
    <Box>
      채팅 화면입니다.
      <Flex>
        <Box bg={"red.300"} h={500}>
          <h3> 클라이언트</h3>

          <Field>
            <Input
              type={"text"}
              value={clientMessage}
              onChange={(e) => {
                setClientMessage(e.target.value);
              }}
            />
          </Field>
          <Button variant={"outline"} onClick={sendMessage}>
            전송
          </Button>
        </Box>
        <Box bg={"blue.300"}>
          <h3> 서버에서 보내준 내용 </h3>
          <Field>
            <Input type={"text"} />
          </Field>

          <Button variant={"outline"}> 전송</Button>
        </Box>
      </Flex>
    </Box>
  );
}
