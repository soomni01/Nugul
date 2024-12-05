package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Board {
    private Integer boardId;
    private String title;
    private String content;
    private String writerId;       // 작성자 ID (member_id)
    private String writer; // 작성자 닉네임
    private String category;
    private LocalDate createdAt;
}
