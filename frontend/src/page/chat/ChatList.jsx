import { useState } from "react";
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
  const [roomId, setRoomId] = useState(1);
  const [chatList, setChatList] = useState([]);
  let navigate = useNavigate();

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
      <Box
        onClick={() => {
          navigate("/chat/room/" + roomId);
        }}
        bg={"red.300"}
      >
        {" "}
        1 번 채팅방
      </Box>
      <Button variant={"outline"} onClick={createChatRoom}>
        버튼
      </Button>
    </Box>
  );
}
