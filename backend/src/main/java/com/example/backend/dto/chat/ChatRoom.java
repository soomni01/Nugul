package com.example.backend.dto.chat;

import lombok.Data;

@Data
public class ChatRoom {
    private int roomId;
    private String writer;
    private String productName;
    private String nickname;
}
