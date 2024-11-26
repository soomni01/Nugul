package com.example.backend.member.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class Member {
    private String memberId;
    private String password;
    private String name;
    private String nickName;
    private LocalDate inserted;
}
