package com.example.backend.member.dto;

import lombok.Data;

@Data
public class MemberEdit {
    private String memberId;
    private String password;
    private String oldPassword;
    private String nickName;
}
