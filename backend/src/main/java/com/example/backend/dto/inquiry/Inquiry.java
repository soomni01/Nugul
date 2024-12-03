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
    private boolean hasAnswer;

    // Getter 및 Setter
    public boolean isHasAnswer() {
        return hasAnswer;
    }

    public void setHasAnswer(boolean hasAnswer) {
        this.hasAnswer = hasAnswer;
    }
}
