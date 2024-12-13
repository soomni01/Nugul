package com.example.backend.dto.board;

import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class Board {
    private Integer boardId;
    private String title;
    private String content;
    private String memberId;       // 작성자 ID (member_id)
    private String writer; // 작성자 닉네임
    private String category;
    private LocalDate createdAt;

    private Integer countComment;

    private List<String> fileSrc;
    /*private List<BoardFile> fileList;*/
}
