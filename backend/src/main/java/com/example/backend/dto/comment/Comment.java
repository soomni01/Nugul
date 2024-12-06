package com.example.backend.dto.comment;

import lombok.Data;

@Data
public class Comment {
    private Integer boardId;
    private String memberId;
    private String comment;
}
