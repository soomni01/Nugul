package com.example.backend.dto.inquiry;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InquiryComment {
    private int id;
    private int inquiryId;
    private String memberId;
    private String comment;
    private LocalDateTime inserted;
    private String nickname;
}
