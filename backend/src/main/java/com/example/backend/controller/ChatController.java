package com.example.backend.controller;


import com.example.backend.dto.ChatInfo;
import com.example.backend.dto.ChatMessage;
import com.example.backend.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public void createChatRoom(@RequestBody ChatInfo chatInfo) {
        // chatroom 에서 ,제품명,작성자 는 프론트에서 받아오고 ,생성
        System.out.println("chatInfo = " + chatInfo);
        String productName = chatInfo.getProductName();
        String writer = chatInfo.getWriter();
        System.out.println("productName = " + productName);
        System.out.println("writer = " + writer);
        chatService.creatChatRoom(productName, writer);


    }

}
