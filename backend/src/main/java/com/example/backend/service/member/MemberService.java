package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {
    final MemberMapper mapper;
    final JwtEncoder jwtEncoder;


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

    public boolean add(Member member) {
        int cnt = mapper.insert(member);
        return cnt == 1;
    }

    public boolean checkId(String id) {
        return mapper.selectById(id) != null;
    }

    public boolean checkNickName(String nickName) {
        Member member = mapper.selectByNickName(nickName);
        return member != null;
    }

    public List<Member> list() {
        return mapper.selectAll();
    }

    public Member get(String id) {
        return mapper.selectById(id);
    }

    public boolean remove(Member member) {
        int cnt = 0;
        Member db = mapper.selectById(member.getMemberId());

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                cnt = mapper.deleteById(member.getMemberId());
            }
        }
        return cnt == 1;
    }

    public boolean update(MemberEdit member) {
        int cnt = 0;
        Member db = mapper.selectById(member.getMemberId());
        if (db != null) {
            if (db.getPassword().equals(member.getOldPassword())) {
                cnt = mapper.update(member);
            }
        }
        return cnt == 1;
    }

    public String token(Member member) {
        Member db = mapper.selectById(member.getMemberId());
        System.out.println();
        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getMemberId())
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(3600))
                        .claim("nickname", db.getNickname())
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }
        return null;
    }
}
