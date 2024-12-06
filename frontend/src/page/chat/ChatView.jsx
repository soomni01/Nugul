import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react";
import "./chat.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Field } from "../../components/ui/field.jsx";
import { Client } from "@stomp/stompjs";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { DialogCompo } from "../../components/chat/DialogCompo.jsx";
import { LuSend } from "react-icons/lu";

export function ChatView({ chatRoomId }) {
  const scrollRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
  const [chatRoom, setChatRoom] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const { roomId } = useParams();
  const [isloading, setIsloading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();

  let realChatRoomId = chatRoomId ? chatRoomId : roomId;

  //  상품명, 방 번호 , 작성자를 보여줄

  //  stomp 객체 생성 및, 연결
  useEffect(() => {
    const client = new Client({
      brokerURL: "ws://localhost:8080/wschat",
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      onDisconnect: () => {
        const date = new Date();

        // 한국 시간으로 변환 (UTC+9)
        const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
        // 시간 변환
        axios.put("/api/chat/updatetime", {
          roomId: realChatRoomId, // 현재 채팅방 ID
          userId: id, // 현재 사용자 ID
          leaveAt: kstDate, // 나간 시간
        });
      },

      onConnect: () => {
        client.subscribe("/room/" + realChatRoomId, function (message) {
          const a = JSON.parse(message.body);
          setMessage((prev) => [
            ...prev,
            { sender: a.sender, content: a.content, sentAt: a.sentAt },
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

  // 의존성에  message 넣어야함
  useEffect(() => {
    // 최신 메세지
    loadInitialMessages();
    // chatroom 정보
    handleSetData();
  }, []);

  function handleSetData() {
    // 전체 데이터 가져오는 코드
    axios
      .get(`/api/chat/view/${realChatRoomId}`)
      .then((res) => {
        setChatRoom(res.data);
      })
      .catch((e) => {});
  }

  function sendMessage(sender, content) {
    const date = new Date();
    // 한국 시간으로 변환 (UTC+9)
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    // 시간 변환

    const a = {
      sender: sender,
      content: content,
      sentAt: kstDate.toISOString().slice(0, 19),
    };
    if (stompClient && stompClient.connected)
      stompClient.publish({
        destination: "/send/" + realChatRoomId,
        body: JSON.stringify(a),
      });

    setClientMessage("");
    console.log(a.sentAt);
  }

  // 초기 메세지 로딩
  const loadInitialMessages = async () => {
    setIsloading(true);
    try {
      const response = await axios.get(
        `/api/chat/view/${realChatRoomId}/messages`,
        {
          params: { page },
        },
      );

      const initialMessages = response.data || [];
      setMessage(initialMessages.reverse());

      // 스크롤을 하단으로 이동
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    } catch (error) {
      console.error("메시지 로딩 중 오류:", error);
    } finally {
      setIsloading(false);
      setPage(page + 1);
    }
  };

  const loadPreviousMessage = async () => {
    if (isloading || !hasMore) return;

    setIsloading(true);

    try {
      const response = await axios.get(
        `/api/chat/view/${realChatRoomId}/messages`,
        {
          params: {
            page,
          },
        },
      );
      const newMessages = response.data || [];
      newMessages.reverse();

      if (newMessages.length === 0) {
        setMessage((prev) => [...newMessages, ...prev]);
      } else {
        setMessage((prev) => [...newMessages, ...prev]);
        // 더이상 불러올 메시기  x
        setHasMore(false);
      }
    } catch (error) {
      console.log("이전 메시지 로딩 중 오류 ", error, page);
    } finally {
      setPage((prev) => prev + 1);
      setIsloading(false);
    }
  };

  const handleScroll = async () => {
    const chatBox = chatBoxRef.current;

    if (chatBox.scrollTop === 0) {
      // 스크롤 끝 점에서 로드
      loadPreviousMessage();
    }
  };

  // 채팅방 나가기서  클라이어트 끊기
  function leaveRoom() {
    // stompClient.onDisconnect();
    // navigate("chat");
  }

  const removeChatRoom = (realChatRoomId) => {
    axios
      .delete("/api/chat/delete/" + realChatRoomId)
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.content,
        });
      })
      .catch((e) => console.log(e))
      .finally(() => {
        navigate("/chat");
      });
  };

  return (
    <Box>
      <Heading mx={"auto"}>
        {" "}
        {realChatRoomId} 번 채팅 화면입니다. <hr />
      </Heading>
      <Button onClick={leaveRoom()}>뒤로가기</Button>
      <Box mx={"auto"}>상품명: {chatRoom.productName} </Box>

      <Flex
        direction="column"
        w={600}
        h={700}
        bg={"blue.300/50"}
        overflow={"hidden"}
      >
        <Box mx={"auto"} my={3} variant={"outline"} h={"5%"} pr={2}>
          <HStack variant={"outline"}>
            <DialogCompo
              roomId={realChatRoomId}
              onDelete={() => removeChatRoom(realChatRoomId)}
            />
            {/*판매자 닉네임이 항상 */}
            판매자 닉네임: {chatRoom.nickname}
          </HStack>
        </Box>
        <Box
          h={"85%"}
          overflowY={"auto"}
          ref={chatBoxRef}
          onScroll={handleScroll}
        >
          <Box h={"100%"}>
            {message.map((message, index) => (
              <Box mx={2} my={1} key={index}>
                <Flex
                  justifyContent={
                    message.sender === id ? "flex-end" : "flex-start"
                  }
                >
                  <Stack h={"10%"}>
                    <Badge
                      p={1}
                      size={"lg"}
                      key={index}
                      colorPalette={message.sender === id ? "gray" : "yellow"}
                    >
                      {message.content}
                    </Badge>
                    <p style={{ fontSize: "12px" }}>
                      {message.sentAt === null
                        ? new Date().toLocaleTimeString()
                        : new Date(message.sentAt).toLocaleTimeString()}
                    </p>
                    <div ref={scrollRef}></div>
                  </Stack>
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>
        <HStack>
          <Field>
            <Input
              type={"text"}
              bg={"white"}
              placeholder={"전송할 메시지를 입력하세요"}
              value={clientMessage}
              onChange={(e) => {
                setClientMessage(e.target.value);
              }}
            />
          </Field>
          <Button
            colorPalette={"cyan"}
            variant={"outline"}
            onClick={() => {
              // 세션의 닉네임
              var client = id;
              var message = clientMessage;
              sendMessage(client, message);
            }}
          >
            <LuSend />
          </Button>
        </HStack>
      </Flex>
    </Box>
  );
}
