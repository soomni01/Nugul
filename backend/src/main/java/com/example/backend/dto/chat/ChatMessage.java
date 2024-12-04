package com.example.backend.dto.chat;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ChatMessage {

    private String roomId;
    private String sender;
    private String content;
    private LocalDateTime sentAt;

}
