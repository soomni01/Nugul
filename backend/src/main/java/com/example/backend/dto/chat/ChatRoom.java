package com.example.backend.dto.chat;

import lombok.Data;

import java.util.List;

@Data
public class ChatRoom {
    private int roomId;
    private String writer;
    private String productName;
    private String nickname;
    // dto용
    private List<ChatMessage> messages;
}
