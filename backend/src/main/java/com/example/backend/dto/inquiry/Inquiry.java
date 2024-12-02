package com.example.backend.dto.inquiry;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inquiry {
    private int inquiryId;
    private String title;
    private String content;
    private String memberId;
    private String answer;
    private LocalDateTime inserted;
    private boolean hasComments; // 새 필드 추가
}
