package com.example.backend.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatController {
//    private final ChatService chatService;

    private final SimpMessagingTemplate messagingTemplate;
//


    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public String handleChatMessage(@DestinationVariable String roomId, String message) {
        System.out.println(message + "테스트테스트 " + roomId);


        return message;
    }

}
