package com.example.backend.dto.comment;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class Comment {
    private Integer commentId;
    private Integer boardId;
    private String memberId;
    private String comment;
    private LocalDateTime inserted;
    private String nickname;
    private String boardTitle;
    private String boardCategory;
    private LocalDateTime boardInserted;
    private LocalDate boardCreatedAt;
}
