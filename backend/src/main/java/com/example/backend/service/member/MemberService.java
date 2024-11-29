package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    final MemberMapper mapper;

    public List<Member> list() {
        return mapper.selectAll();
    }

    public boolean delete(String id) {
        Member member = mapper.selectById(id);
        if (member != null) {
            // 비밀번호 확인 로직을 추가할 수 있습니다.
            // 예: 관리자 비밀번호 확인 코드

            // 회원 삭제
            int deletedCount = mapper.deleteById(id);
            return deletedCount == 1;
        } else {
            return false;
        }
    }
}
