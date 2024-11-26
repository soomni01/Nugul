package com.example.backend.controller;


import com.example.backend.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class chat {
    private final SimpMessageSendingOperations template;

    @GetMapping("/chat{id}")
    public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable Long id) {
        //임시로 리스트 형식으로 구현, 실제론 DB 접근 필요
        ChatMessage test = new ChatMessage(1L, "test", "test");
        return ResponseEntity.ok().body(List.of(test));
    }

    @MessageMapping("/message")
    public ResponseEntity<Void> receiveMessage(@RequestBody ChatMessage chat) {
        // 메시지를 해당 채팅방 구독자들에게 전송
        template.convertAndSend("/sub/chatroom/1", chat);
        return ResponseEntity.ok().build();
    }

}
