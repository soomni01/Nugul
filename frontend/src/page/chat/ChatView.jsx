import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Field } from "../../components/ui/field.jsx";
import { Client } from "@stomp/stompjs";

export function ChatView() {
  // 메시지에는 보낸사람:아이디 , 메시지 :내용이 들어가야함
  //  그거 자체를 저장하는 배열을 만들어서 ,한 번씩 보냄
  const [message, setMessage] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
  const clientRef = useRef(null);
  const [stompClient, setStompClient] = useState(null);
  // 처음에 채팅 메시지를 출력받아서 보여주고 ,

  useEffect(() => {
    // 클라이언트 생성
    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      //  원래는 시작하자마자 메시지를 보낼 필요는 없음  , 인풋에 입력한걸 전송할때 보낼꺼니가
      // TODO  > 1 대신 > 뭐 채팅 번호 받아와서 변경

      onConnect: () => {
        console.log("Connected to socket");
        client.subscribe("/room/1", function (message) {
          const a = JSON.parse(message.body);
          console.log(a);
          setMessage((prev) => [
            ...prev,
            { sender: a.sender, content: a.content },
          ]);
          // setResponseMessage(clientMessage);
        });
        //  연결 될때 메시지를 보낼 필요는 없음
        // client.publish({
        //   destination: "/send/1",
        //   body: JSON.stringify(clientMessage),
        // });
      },
      onStompError: (err) => {
        console.error(err);
      },
      heartbeatIncoming: 5000,
      heartbeatOutgoing: 5000,
      reconnectDelay: 1000,
    });
    setStompClient(client);
    client.activate();
  }, []);

  //  TODO: dto 수정시 변경

  const sendMessage = () => {
    const a = {
      sender: "test1",
      content: "내용",
    };

    if (stompClient && stompClient.connected)
      stompClient.publish({
        destination: "/send/1",
        body: JSON.stringify(a),
      });

    setClientMessage("");
  };

  return (
    <Box>
      채팅 화면입니다.
      <Flex>
        <Box bg={"red.300"} h={500}>
          <h3> 클라이언트</h3>
          <Box>
            {message.map((item) => (
              <Field key={item}>
                <Input
                  w={"70%"}
                  type={"text"}
                  value={item.content}
                  onChange={(e) => {
                    setClientMessage(e.target.value);
                  }}
                />
              </Field>
            ))}
          </Box>

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
          {message.map((item, index) => (
            <div key={index}>
              <p>Sender: {item.sender}</p>
              <p>Content: {item.content}</p>
            </div>
          ))}
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
            {" "}
            전송
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
