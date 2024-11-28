package com.example.backend.controller;


import com.example.backend.dto.ChatMessage;
import com.example.backend.dto.ChatRoom;
import com.example.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatService chatService;

//


    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public ChatMessage handleChatMessage(@DestinationVariable String roomId, ChatMessage message) {

//        TODO:  chatroom 테이블 생성해야할듯 , roomId, message, sender , productId,
        return message;
    }

    @PostMapping("create")
    public ResponseEntity<Integer> createChatRoom(@RequestBody ChatRoom chatRoom) {
        // chatroom 에서 ,제품명,작성자 는 프론트에서 받아오고 ,생성
        // 상품에서 채팅방을 만들고 >프론트상에서 글로 이동할거면 ,roomId 반환해야함
        chatService.creatChatRoom(chatRoom);

        return ResponseEntity.ok().body(chatRoom.getRoomId());

    }

    @GetMapping("view/{roomId}")
    public ChatRoom chatRoomView(@PathVariable String roomId) {

        return chatService.chatRoomView(roomId);
    }

}
