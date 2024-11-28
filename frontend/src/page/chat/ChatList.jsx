import { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button.jsx";
import axios from "axios";

function ChatListItem() {
  return <Box></Box>;
}

//  이 페이지에선,  페이지 들어오면 useEffect로 controller에 요청 보내서 , 회원 기준, 채팅창 목록 가져오고 ,
//  그거 state로 받아서 , map 으로 뿌려주기
export function ChatList() {
  const [chatList, setChatList] = useState([]);
  let navigate = useNavigate();

  useEffect(() => {
    axios
      .get("/api/chat/list")
      .then((res) => {
        // TODO: 얕은복사?? 깊은 복사 ? 기억은 잘 안남
        res.data.forEach((item) => {
          const a = { ...item }; // item 복사
          setChatList((prevChatList) => [...prevChatList, a]); // 상태 업데이트
        });

        setChatList(...res.data);
        console.log(chatList);
      })
      .catch();
  }, []);

  const createChatRoom = () => {
    var testId;
    var productName = "아디다스 신발";
    var writer = "작성자";
    axios
      .post("/api/chat/create", {
        productName: productName,
        writer: writer,
      })
      .then((res) => {
        console.log(res.data);
        testId = res.data;
        navigate("/chat/room/" + testId);
      });
    // 추가
  };

  return (
    <Box>
      채팅 리스트
      {/*dd  음 , list.  item에 이렇게 출력하는게 안되나?*/}
      {/*{chatList.map((item) => (*/}
      {/*  <Box key={item.roomID}>{item.roomID}</Box>*/}
      {/*))}*/}
      <Button variant={"outline"} onClick={createChatRoom}>
        버튼
      </Button>
    </Box>
  );
}
