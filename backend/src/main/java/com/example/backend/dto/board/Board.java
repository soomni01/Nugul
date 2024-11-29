package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Board {
    private Integer boardId;
    private String title;
    private String content;
    private String writer;
    private String category;
    private LocalDate createdAt;
}
