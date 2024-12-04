package com.example.backend.dto.inquiry;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Inquiry {
    private int inquiryId;
    private String title;
    private String content;
    private String memberId;
    private String nickname;
    private String answer;

    @JsonFormat(pattern = "yyyy.MM.dd") // 날짜 포맷 지정
    private LocalDateTime inserted;
    private boolean hasAnswer;

    // Getter 및 Setter
    public boolean isHasAnswer() {
        return hasAnswer;
    }

    public void setHasAnswer(boolean hasAnswer) {
        this.hasAnswer = hasAnswer;
    }
}
