package com.example.backend.controller.chat;


import com.example.backend.dto.chat.ChatMessage;
import com.example.backend.dto.chat.ChatRoom;
import com.example.backend.service.chat.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

//

    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public ChatMessage handleChatMessage(@DestinationVariable String roomId, ChatMessage chatMessage) {


        // 보낸 메시지 저장시킬 방 번호 입력
        chatMessage.setRoomId(roomId);

        chatService.insertMessage(chatMessage);
        System.out.println("chatMessage = " + chatMessage);


        return chatMessage;
    }

    @PostMapping("create")
    public ResponseEntity<Integer> createChatRoom(@RequestBody ChatRoom chatRoom) {
        // chatroom 에서 ,제품명,작성자(id 는 프론트에서 받아오고 ,생성
        // 상품에서 채팅방을 만들고 >프론트상에서 글로 이동할거면 ,roomId 반환해야함
        // id 로 받아와서 ,, 닉네임 집어 넣고 싶기때문에 ,  member에서 요청 보내야  할듯

        System.out.println("chatRoom = " + chatRoom);

        chatService.creatChatRoom(chatRoom);

        return ResponseEntity.ok().body(chatRoom.getRoomId());

    }

    @GetMapping("view/{roomId}")
    public ChatRoom chatRoomView(@PathVariable String roomId) {

        ChatRoom chatRoom = chatService.chatRoomView(roomId);

        System.out.println("chatRoom = " + chatRoom);

        return chatRoom;


    }

    // 원래는, 로그인 기준으로 판매중? 인것들만

    @GetMapping("list")
    public List<ChatRoom> chatRoomList(@RequestParam String memberId) {

        System.out.println("memberId = " + memberId);
        return chatService.chatRoomList(memberId);
    }


    @DeleteMapping("delete/{roomId}")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(@PathVariable String roomId) {

        boolean run = chatService.deleteChatRoom(roomId);
        if (run) {
            return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "content", "채팅방 삭제 완료되었습니다.")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "success", "content", "존재하지 않는 채팅방 입니다.")));
        }


    }
}
