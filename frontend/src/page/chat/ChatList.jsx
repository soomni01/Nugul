import { Box, Heading, Input } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import { Button } from "../../components/ui/button.jsx";

export function ChatList() {
  // WebSocket 객체 생성 ( 서버의 Websocket) 포인트를 사용
  // 웹 소켓 연결 객체 TODO ref 찾아보기
  const stompClient = useRef(null);
  const [message, setMessage] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  useEffect(() => {
    connect();
    fetchMessages();
    return () => disconnect();
  }, []);

  const connect = () => {
    // 경로 ??
    const socket = new WebSocket("ws://api/chat");
    stompClient.current = Stomp.over(socket);
    stompClient.current.connect({}, () => {
      // 메시지 수신 (1은 roomID)
      stompClient.current.subscribe("/sub/chatroom/1", (message) => {
        // 누군가 발송했던 메시지를 리스트에 추가
        const newMessage = JSON.parse(message.body);
        setMessage((prevMessages) => [...prevMessages, newMessage]);
      });
    });
  };
  const fetchMessages = () => {
    return axios.get("http://localhost:8080/chat/1").then((res) => {
      setMessage(res.data);
    });
  };

  const disconnect = () => {
    if (stompClient.current) {
      stompClient.current.disconnect();
    }
  };
  //메세지 전송
  const sendMessage = () => {
    if (stompClient.current && inputValue) {
      //현재로서는 임의의 테스트 값을 삽입
      const body = {
        id: 1,
        name: "테스트1",
        message: inputValue,
      };
      stompClient.current.send(`/pub/message`, {}, JSON.stringify(body));
      setInputValue("");
    }
  };

  return (
    <Box my={5}>
      <Heading>채팅 리스트 화면</Heading>
      <Box>
        <ul>
          <Box>
            <Input
              type={"text"}
              value={inputValue}
              onChange={handleInputChange}
            />
            <Button onClick={sendMessage}>입력 </Button>
          </Box>
          {message.map((item, index) => (
            <div key={index} className={"list-item"}>
              {item.message}{" "}
            </div>
          ))}
        </ul>
      </Box>
    </Box>
  );
}
