package com.example.backend.dto.inquiry;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inquiry {
    private int inquiryId;
    private String title;
    private String content;
    private String category;
    private String memberId;
    private String nickname;
    private String answer;

    @JsonFormat(pattern = "yyyy.MM.dd")
    private LocalDateTime inserted;
    private boolean hasAnswer;
}
