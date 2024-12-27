import { Badge, Box, Flex, HStack, Input, Stack, Text } from "@chakra-ui/react";
import "./chat.css";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthenticationContext } from "../../components/context/AuthenticationProvider.jsx";
import { toaster } from "../../components/ui/toaster.jsx";
import { Button } from "../../components/ui/button.jsx";
import Payment from "../../components/chat/Payment.jsx";
import { DialogCompo } from "../../components/chat/DialogCompo.jsx";
import { Field } from "../../components/ui/field.jsx";
import { LuSend } from "react-icons/lu";
import { ReviewModal } from "../../components/review/ReviewModal.jsx";
import { Avatar } from "../../components/ui/avatar.jsx";
import { ProductDetailDrawer } from "../../components/chat/ProductDetailDrawer.jsx";
import { useTheme } from "../../components/context/ThemeProvider.jsx";

export function ChatView({ chatRoomId, onDelete, statusControl }) {
  const scrollRef = useRef(null);
  const chatBoxRef = useRef(null);
  const [message, setMessage] = useState([]);
  const [clientMessage, setClientMessage] = useState("");
  const [chatRoom, setChatRoom] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [purchased, setPurchased] = useState(false);
  const [imageSrc, setImageSrc] = useState("");
  const { id } = useContext(AuthenticationContext);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [product, setProduct] = useState({});
  const [reviewComplete, setReviewComplete] = useState(false);
  const [transactionComplete, setTransactionComplete] = useState(false);
  const { fontColor, buttonColor } = useTheme();
  const BASE_URL = import.meta.env.VITE_APP_SERVER_URL.replace(
    /^http/,
    "ws",
  ).replace(/\/+$/, "");

  // 경로에 따라서  받아줄 변수를 다르게 설정
  let realChatRoomId = chatRoomId;

  //  stomp 객체 생성 및, 연결
  useEffect(() => {
    const client = new Client({
      brokerURL: `${BASE_URL}/wschat`,
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
          // 스크롤을 하단으로 이동
          if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
          }
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
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    const initializeData = async () => {
      await loadInitialMessages();
      await handleSetData();
    };

    initializeData();
  }, []); // 초기 데이터 로드를 위한 useEffect

  useEffect(() => {
    handleSetData();
  }, [purchased]);

  async function handleSetData() {
    // 전체 데이터 가져오는 코드
    var chatPartnerId;
    const res = await axios.get(`/api/chat/view/${realChatRoomId}`, {
      params: {
        memberId: id,
      },
    });
    chatPartnerId = id === res.data.writer ? res.data.buyer : res.data.writer;
    res.data.nickname === null ? "삭제한 사용자" : res.data.nickname;
    await deletedChatPartnerId(chatPartnerId);
    setChatRoom(() => ({ ...res.data }));

    // 두 번째 요청 (채팅 상대의 이미지 가져오기)
    const imageRes = await axios.get(`/api/chat/${realChatRoomId}/image`, {
      params: {
        memberId: chatPartnerId,
      },
    });

    const productRes = await axios.get(
      `/api/product/view/${res.data.productId}`,
    );

    setProduct(productRes.data);
    const purchaseRes = await axios.get("/api/product/checkpurchase", {
      params: {
        memberId: id,
        productId: res.data.productId,
      },
    });

    setProduct((prev) => ({
      ...prev,
      expenseId: purchaseRes.data.expenseId,
      purchasedAt: purchaseRes.data.purchasedAt,
      reviewStatus: purchaseRes.data.reviewStatus,
    }));
    setImageSrc(imageRes.data);
    if (purchased === false) {
      setPurchased(id == purchaseRes.data.buyerId);
    }
    //판매자
    setTransactionComplete(productRes.data.status === "Sold");
    // 구매자
    setReviewComplete(purchaseRes.data.reviewStatus === "completed");
  }

  function deletedChatPartnerId(chatPartnerId) {
    return chatPartnerId === null ? "삭제한 사용자" : chatPartnerId;
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
    setIsLoading(true);
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
      setIsLoading(false);
      setPage(page + 1);
    }
  };

  const loadPreviousMessage = async () => {
    // 마지막 메시지의 갯수가 8개가 아니면 마지막으로 간주 해서 ,  요청을 보내지 않음
    if (!hasMore) {
      return null;
    }

    setIsLoading(true);

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

      if (newMessages.length === 8) {
        setMessage((prev) => [...newMessages, ...prev]);
      } else {
        setMessage((prev) => [...newMessages, ...prev]);
        // 더이상 불러올 메시지  x
        setHasMore(false);
      }
    } catch (error) {
      console.log("이전 메시지 로딩 중 오류 ", error, page);
    } finally {
      console.log("실행 여부");
      const chatBox = chatBoxRef.current;
      const reach = chatBox.scrollHeight - chatBox.scrollHeight * 0.2;
      chatBoxRef.current.scrollTop = reach;
      setPage((prev) => prev + 1);
      setIsLoading(false);
    }
  };

  const handleScroll = async () => {
    const chatBox = chatBoxRef.current;
    const reach = chatBox.scrollHeight - chatBox.scrollHeight * 0.9;

    if (chatBox.scrollTop < reach) {
      console.log("실행");
      // 스크롤 끝 점에서 로드
      await loadPreviousMessage();
    }
  };

  // 거래 완료
  const handleSuccessTransaction = () => {
    axios
      .post(`/api/product/transaction/${chatRoom.productId}`, {
        roomId: chatRoom.roomId, // roomId를 요청 본문에 담아서 보내기
      })
      .then((res) => res.data)
      .then((data) => {
        // 응답 데이터에 'message'가 있을 경우 처리
        if (data.message) {
          toaster.create({
            type: data.message.type,
            description: data.message.text,
          });
        } else {
          console.error("응답 데이터에 message가 없습니다:", data); // 'message'가 없을 경우 에러 처리
        }
        setTransactionComplete(true);
        statusControl();
      })
      .catch((e) => {
        // 오류가 발생했을 경우 처리
        const data = e.response?.data; // 오류 응답 데이터 가져오기
        if (data && data.message) {
          toaster.create({
            type: data.message.type,
            description: data.message.text,
          });
        } else {
          console.error("오류 응답에서 message가 없습니다:", e); // 오류 응답에 'message'가 없을 경우 에러 처리
        }
      })
      .finally(() => {}); // 상태 변경 (무조건 실행되는 부분)
  };

  //  판매자 인지 확인
  const isSeller = chatRoom.writer === id;

  const removeChatRoom = (roomId, id) => {
    axios
      .delete("/api/chat/delete/" + roomId, {
        params: {
          memberId: id,
        },
      })
      .then((res) => {
        const message = res.data.message;
        toaster.create({
          type: message.type,
          description: message.content,
        });
      })
      .catch((e) => {
        console.log(e);
      })
      .finally(() => {
        navigate("/chat");
      });
  };

  const handleOpenReviewModal = () => {
    setIsModalOpen(true);
  };

  const handleReviewComplete = (productId) => {
    setReviewComplete(true);
    setIsModalOpen(false);
  };

  // 결제 후 바로 후기로 리렌더
  const handleTransactionState = () => {
    console.log("실행");
    statusControl();
    setPurchased(true);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      var client = id;
      var message = clientMessage;
      sendMessage(client, message);
    }
  };

  // 시연을 위해 결제 완료시 localStorage에 상태 불러오기
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (
        event.key === `payment_${realChatRoomId}` &&
        event.newValue === "completed"
      ) {
        setPurchased(true);
        setTransactionComplete(true);
        statusControl();

        // 값을 초기화하여 storage 이벤트 명시적 발생
        localStorage.setItem(`payment_${realChatRoomId}`, "");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [realChatRoomId]);

  useEffect(() => {
    // 상태 변경 후 스토리지 삭제
    if (purchased) {
      localStorage.removeItem(`payment_${realChatRoomId}`);
    }
  }, [purchased]);

  // 메시지 하나씩 밀려서 덜 보이는 오류 해결
  useEffect(() => {
    if (chatBoxRef.current && message.length > 0) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [message]); // message 배열이 변경될 때마다 실행

  return (
    <Box pt={3}>
      <Flex direction="column" w={"99%"} h={"85vh"} overflow={"hidden"}>
        <Box
          display={"flex"}
          justifyContent={"space-between"}
          p={5}
          pt={0}
          borderBottom={"1px solid gray"}
        >
          <Box>
            <Text
              mb={8}
              fontSize={"2xl"}
              fontWeight={"bold"}
              whiteSpace="nowrap"
              overflow="hidden"
              textOverflow="ellipsis"
            >
              {chatRoom.productName}
            </Text>
            <Text fontSize={"xl"} fontWeight={"bold"}>
              {chatRoom.nickname || "탈퇴한 회원"}
            </Text>
          </Box>

          <Box>
            {!product.productId ? (
              <Button
                variant={"unstyled"} // 기본 스타일 제거
                cursor="default" // 커서 변경 방지
                bg="gray.200"
                w={"100%"}
                mb={5}
                mr={0}
              >
                삭제된 상품
              </Button>
            ) : (
              <ProductDetailDrawer product={product}>
                <Button w={"100%"} mb={5} mr={0} variant="subtle">
                  상품 정보 보기
                </Button>
              </ProductDetailDrawer>
            )}
            <Flex>
              {isLoading ? (
                <Button size={"xl"} isDisabled cursor="default" bg="gray.200">
                  로딩 중...
                </Button>
              ) : (
                <>
                  {/* 판매자일 때만 거래완료 버튼이 보이게 하고, 거래 완료 상태면 버튼 숨김 */}
                  {isSeller ? (
                    <Button
                      size={"xl"}
                      className={"ScrollBarContainer"}
                      colorPalette={transactionComplete && "black"}
                      bg={transactionComplete ? "#F09319" : ""} // 파스텔 노랑색 배경
                      isDisabled
                      cursor={transactionComplete && "default"}
                      onClick={
                        transactionComplete ? null : handleSuccessTransaction
                      }
                    >
                      거래완료
                    </Button>
                  ) : purchased ? (
                    <></>
                  ) : (
                    <Payment
                      chatRoom={chatRoom}
                      statusControl={statusControl}
                      onComplete={handleTransactionState}
                    />
                  )}

                  {purchased && (
                    <Button
                      size={"xl"}
                      onClick={reviewComplete ? null : handleOpenReviewModal}
                      isDisabled
                      colorPalette={reviewComplete && "cyan"}
                      cursor={reviewComplete && "default"}
                      color={fontColor}
                      fontWeight="bold"
                      bg={buttonColor}
                      _hover={{ bg: `${buttonColor}AA` }}
                    >
                      {reviewComplete ? "작성 완료" : "후기 작성"}
                    </Button>
                  )}
                </>
              )}

              <DialogCompo
                roomId={realChatRoomId}
                onDelete={onDelete || (() => removeChatRoom(roomId, id))}
              />
            </Flex>
          </Box>
        </Box>

        <Box
          flex="1"
          overflowY={"auto"}
          ref={chatBoxRef}
          onScroll={handleScroll}
        >
          <Box p={3}>
            {message.map((message, index) => (
              <Box my={10} key={index}>
                <Flex
                  justifyContent={
                    message.sender === id ? "flex-end" : "flex-start"
                  }
                >
                  <HStack h={"10%"} spacing={4}>
                    {message.sender !== id && (
                      <Avatar boxSize="60px" src={imageSrc} />
                    )}
                    <Stack
                      mx={2}
                      spacing={2}
                      align={message.sender === id ? "flex-end" : "flex-start"}
                    >
                      <Badge
                        p={2}
                        key={index}
                        fontSize="lg"
                        colorPalette={message.sender === id ? "gray" : "yellow"}
                        alignSelf={
                          message.sender === id ? "flex-end" : "flex-start"
                        }
                      >
                        {message.content}
                      </Badge>
                      <Text
                        fontSize="xs"
                        textAlign={message.sender === id ? "right" : "left"}
                        color="gray.600"
                        // mt={1}
                      >
                        {message.sentAt === null
                          ? new Date().toLocaleTimeString()
                          : new Date(message.sentAt).toLocaleTimeString()}
                      </Text>
                    </Stack>
                    <div ref={scrollRef}></div>
                  </HStack>
                </Flex>
              </Box>
            ))}
          </Box>
        </Box>

        <HStack
          p={3}
          spacing={3}
          position="sticky"
          bottom={0}
          bg="white"
          zIndex={1}
        >
          <Field>
            <Input
              size={"xl"}
              type={"text"}
              placeholder={"전송할 메시지를 입력하세요"}
              value={clientMessage}
              onKeyDown={handleKeyPress}
              onChange={(e) => {
                setClientMessage(e.target.value);
              }}
            />
          </Field>
          <Button
            size={"xl"}
            colorPalette={"orange"}
            onClick={() => {
              // 세션의 닉네임
              var client = id;
              var message = clientMessage;
              sendMessage(client, message);
            }}
            color={fontColor}
            fontWeight="bold"
            bg={buttonColor}
            _hover={{ bg: `${buttonColor}AA` }}
          >
            <LuSend />
          </Button>
        </HStack>
      </Flex>
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onComplete={() => handleReviewComplete(product.productId)}
      />
    </Box>
  );
}
