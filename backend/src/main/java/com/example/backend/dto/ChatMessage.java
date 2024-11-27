package com.example.backend.dto;

import lombok.Data;

@Data
public class ChatMessage {

    private String content;
    private String sender;
    private String timestamp;


}
