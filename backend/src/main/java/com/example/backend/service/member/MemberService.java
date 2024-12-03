package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    final MemberMapper mapper;
    final JwtEncoder jwtEncoder;
    private final ProductMapper productMapper;

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

        // 기존 암호와 비교
        Member db = mapper.selectById(member.getMemberId());

        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                cnt = mapper.deleteById(member.getMemberId());
            }
        }
        return cnt == 1;
    }

//    public boolean adminRemove(Member member) {
//        int cnt = 0;
//        // 기존 암호와 비교
//        Member db = mapper.selectById(member.getMemberId());
//
//        if (db != null) {
//            if (db.getPassword().equals(member.getPassword())) {
//                cnt = mapper.deleteByAdminId(member.getMemberId());
//                // 댓글 지우기
////                commentMapper.deleteByMemberId(member.getId());
//                // 쓴 게시물 목록 얻기
////                List<Integer> boards = boardMapper.selectByWriter(member.getId());
//                // 각 게시물 지우기
////                for (Integer boardId : boards) {
////                    boardService.remove(boardId);
////                List<Integer> products = productMapper.se
//            }
//        }
//        return cnt == 1;
//    }

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
        List<String> auths = mapper.selectAuthByMemberId(member.getMemberId());
        String authsString = auths.stream()
                .collect(Collectors.joining(" "));
        if (db != null) {
            if (db.getPassword().equals(member.getPassword())) {
                JwtClaimsSet claims = JwtClaimsSet.builder()
                        .issuer("self")
                        .subject(member.getMemberId())
                        .issuedAt(Instant.now())
                        .expiresAt(Instant.now().plusSeconds(3600))
                        .claim("nickname", db.getNickname())
                        .claim("scope", authsString)
                        .build();

                return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
            }
        }
        return null;
    }

    public boolean hasAccess(String memberId, Authentication auth) {
        System.out.println("Member ID: " + memberId);
        System.out.println("Authenticated name: " + auth.getName());

        // 인증된 사용자가 관리자 권한을 가지고 있는지 확인
        if ("admin".equals(auth.getName()) || isAdmin(auth)) {
            return true;
        }

        // 인증된 사용자 이름이 요청된 memberId와 일치하는지 확인
        return memberId.equals(auth.getName());
    }

    public boolean isAdmin(Authentication auth) {
        return auth.getAuthorities()
                .stream()
                .map(a -> a.toString())
                .anyMatch(s -> s.equals("SCOPE_admin"));
    }
}
