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


        return chatMessage;
    }

    @PostMapping("create")
    public ResponseEntity<Integer> createChatRoom(@RequestBody ChatRoom chatRoom) {

        // 방이 있는지 먼저 확인   없으면 만들기
        Integer roomId = chatService.findChatRoomId(chatRoom);

        if (roomId == null) {
            chatService.creatChatRoom(chatRoom);

            return ResponseEntity.ok().body(chatRoom.getRoomId());
        } else {
            chatRoom.setRoomId(roomId);
            return ResponseEntity.ok().body(chatRoom.getRoomId());
        }


    }

    @GetMapping("view/{roomId}")
    public ChatRoom chatRoomView(@PathVariable String roomId,
                                 @RequestParam(value = "page", defaultValue = "1") String page
    ) {

        //  chatroom 정보 조회
        ChatRoom chatRoom = chatService.chatRoomView(roomId);
        // 해당 채팅방의 메시지 정보 조회  , page
//        List<ChatMessage> message = chatService.chatMessageView(roomId);
//        chatRoom.setMessages(message);
        return chatRoom;

    }

    @GetMapping("view/{roomId}/messages")
    public List<ChatMessage> getMessage(@PathVariable String roomId,
                                        @RequestParam(value = "page", defaultValue = "1") Integer page) {
        // 메시지 페이지네이션
        return chatService.getMessageById(roomId, page);
        // a, 8개 까지 보여줄 거임

    }


    @GetMapping("list")
    public List<ChatRoom> chatRoomList(@RequestParam(value = "memberId") String memberId,
                                       @RequestParam(value = "type", defaultValue = "all") String type) {

        return chatService.chatRoomList(memberId, type);

    }


    @DeleteMapping("delete/{roomId}")
    public ResponseEntity<Map<String, Object>> deleteChatRoom(@PathVariable String roomId,
                                                              @RequestParam String memberId) {

        System.out.println("memberId = " + memberId);

        //채팅 전에 메세지를 먼저 삭제하고 > 채팅방을 삭제
        // 채팅방 삭제전 , 미리  채팅 메시지삭제 하는 코드
        boolean messageRemoved = chatService.deleteMessageAll(roomId, memberId);
        boolean chatRemoved;
        // 실행 여분데

        if (false) {
            // 채팅방 삭제시 전송
            chatRemoved = chatService.deleteChatRoom(roomId);
            if (chatRemoved) {
                return ResponseEntity.ok().body(Map.of("message", Map.of("type", "success", "content", "채팅방 삭제 완료되었습니다.")));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning", "content", "존재하지 않는 채팅방 입니다.")));
            }
        } else
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "success", "content", "뭘 삭제하려는 겁니까")));


    }

    @PutMapping("updatetime")
    public void updateChatRoomTime(@RequestBody ChatRoom chatRoom) {
        System.out.println("chatRoom = " + chatRoom);
    }

}
