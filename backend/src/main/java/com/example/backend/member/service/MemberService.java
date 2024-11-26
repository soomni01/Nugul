package com.example.backend.member.service;

import com.example.backend.member.dto.Member;
import com.example.backend.member.mapper.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;

    public boolean add(Member member) {
        int cnt = mapper.insert(member);
        return cnt == 1;
    }
}
