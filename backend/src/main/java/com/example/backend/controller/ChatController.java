package com.example.backend.controller;


import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
@RequiredArgsConstructor
public class ChatController {
//    private final ChatService chatService;

    private final SimpMessagingTemplate messagingTemplate;
//


    @MessageMapping("/{roomId}") // send/{roomId} 이렇게 넘어오는거임
    @SendTo("/room/{roomId}")
    public void handleChatMessage(@PathVariable String roomId, String message) {
        System.out.println("실행 확인");

        System.out.println(message + " " + roomId);
    }

}
