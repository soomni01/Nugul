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
      onConnect: () => {
        console.log("Connected to socket");
      },
      onStompError: (err) => {
        console.error(err);
      },
    });

    client.activate();
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
