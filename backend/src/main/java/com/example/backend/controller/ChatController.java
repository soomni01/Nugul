package com.example.backend.controller;


import com.example.backend.dto.ChatMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
//    private final ChatService chatService;

//


    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public ChatMessage handleChatMessage(@DestinationVariable String roomId, ChatMessage message) {
        System.out.println("실행 확인");
        System.out.println(message.getContent());
        System.out.println(message.getSender());
//        TODO:  chatroom 테이블 생성해야할듯 , roomId, message, sender
        return message;
    }

}
