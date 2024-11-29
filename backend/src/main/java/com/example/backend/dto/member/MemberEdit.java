package com.example.backend.dto.member;

import lombok.Data;

@Data
public class MemberEdit {
    private String memberId;
    private String password;
    private String oldPassword;
    private String nickName;
}
