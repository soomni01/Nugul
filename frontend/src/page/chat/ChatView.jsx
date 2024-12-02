import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Field } from "../../components/ui/field.jsx";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import { useParams } from "react-router-dom";

export function ChatView() {
  // 메시지에는 보낸사람:아이디 , 메시지 :내용이 들어가야함 (stomp 에 보낼 내용)
  const [message, setMessage] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
  //  서버 메세지는 필요 없음
  const [serverMessage, setServerMessage] = useState("");
  const [chatRoom, setChatRoom] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const { id } = useParams();

  //  상품명, 방 번호 , 작성자를 보여줄

  //  stomp 객체 생성 및, 연결
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },

      onConnect: () => {
        client.subscribe("/room/" + id, function (message) {
          const a = JSON.parse(message.body);
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
    axios
      .get(`/api/chat/view/${id}`)
      .then((res) => {
        setChatRoom(res.data);
        // chatRoom = {
        //   roomId: res.data.roomId,
        //   productName: res.data.productName,
        //   writer: res.data.writer,
        // };
      })
      .catch((e) => {});
  }, []);

  //  TODO: dto 수정시 변경
  function sendMessage(sender, content) {
    const a = {
      sender: sender,
      content: content,
    };
    if (stompClient && stompClient.connected)
      stompClient.publish({
        destination: "/send/" + id,
        body: JSON.stringify(a),
      });

    setClientMessage("");
  }

  return (
    <Box>
      {id} 번 채팅 화면입니다.
      <Box> 상품명: {chatRoom.productName} </Box>
      <Flex>
        <Flex direction="column" bg={"red.300"} h={500} w={800}>
          <Box mx={"auto"} my={3} variant={"outline"}>
            닉네임: {chatRoom.nickname}
          </Box>
          <Box h={"70%"}>
            {message.map((item, index) => (
              <Box key={index}>
                <p>Sender: {item.sender}</p>
                <Badge size="lg">Content: {item.content}</Badge>
              </Box>
            ))}
          </Box>

          <HStack>
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
          </HStack>
        </Flex>

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
              value={serverMessage}
              onChange={(e) => {
                setServerMessage(e.target.value);
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
      <Box>
        <Heading> ui 변경 테스트 </Heading>
        <Box>
          <Box></Box>
          <Box></Box>
          <Input />
        </Box>
      </Box>
    </Box>
  );
}
