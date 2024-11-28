import { Box, Button, Flex, Input } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Field } from "../../components/ui/field.jsx";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ChatView() {
  // 메시지에는 보낸사람:아이디 , 메시지 :내용이 들어가야함
  //  그거 자체를 저장하는 배열을 만들어서 ,한 번씩 보냄
  const [message, setMessage] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
  const [serverMessage, setServerMessage] = useState("");
  const [stompClient, setStompClient] = useState(null);
  const chatid = useParams();
  // 처음에 채팅 메시지를 출력받아서 보여주고 ,

  //  stomp 객체 생성 및, 연결
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      //  원래는 시작하자마자 메시지를 보낼 필요는 없음  , 인풋에 입력한걸 전송할때 보낼꺼니가

      onConnect: () => {
        client.subscribe("/room/" + chatid, function (message) {
          const a = JSON.parse(message.body);
          console.log(a);
          setMessage((prev) => [
            ...prev,
            { sender: a.sender, content: a.content },
          ]);
        });
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

  useEffect(() => {
    axios.get("/api/chat/view/" + chatid);
  }, []);

  //  TODO: dto 수정시 변경
  function sendMessage(sender, content) {
    const a = {
      sender: sender,
      content: content,
    };
    if (stompClient && stompClient.connected)
      stompClient.publish({
        destination: "/send/" + chatid,
        body: JSON.stringify(a),
      });

    setClientMessage("");
  }

  return (
    <Box>
      채팅 화면입니다.
      <Flex>
        <Box bg={"red.300"} h={500}>
          <h3> 클라이언트</h3>
          <Box>
            {message.map((item, index) => (
              <div key={index}>
                <p>Sender: {item.sender}</p>
                <p>Content: {item.content}</p>
              </div>
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
          <Button
            variant={"outline"}
            onClick={() => {
              var client = "client";
              var message = clientMessage;
              sendMessage(client, message);
            }}
          >
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

          <Button
            variant={"outline"}
            onClick={() => {
              var server = "server";
              var message = serverMessage;
              sendMessage(server, message);
            }}
          >
            {" "}
            전송
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
