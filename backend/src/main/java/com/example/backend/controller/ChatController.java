package com.example.backend.controller;


import com.example.backend.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
//    private final ChatService chatService;


    @MessageMapping("/app/chat")
    @SendTo("/topic/messages")
    public ChatMessage handleChatMessage(ChatMessage message) {
        message.setContent("Server response: " + message.getContent());

        System.out.println("실행확인");
        System.out.println("message = " + message);
        return message;
    }

}
