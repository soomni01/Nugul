package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
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

    @Autowired
    private JdbcTemplate jdbcTemplate;

    final MemberMapper mapper;
    final JwtEncoder jwtEncoder;
    private final ProductMapper productMapper;

    // 회원 추가 메소드
    public boolean add(Member member) {
        int cnt = mapper.insert(member);
        return cnt == 1;
    }

    // 아이디 중복 체크 메소드
    public boolean checkId(String id) {
        return mapper.selectById(id) != null;
    }


    // 별명 중복 체크 메소드
    public boolean checkNickName(String nickname) {
        Member member = mapper.selectByNickName(nickname);
        return member != null;
    }

    // 회원 목록 조회 메소드
    public List<Member> list() {
        return mapper.selectAll();
    }

    // 특정 회원 정보 조회 메소드
    public Member get(String id) {
        return mapper.selectById(id);
    }

    // 회원 탈퇴 메소드
    public boolean remove(Member member, Authentication auth) {
        System.out.println("Attempting to remove member: " + member);

        int cnt = 0;

        // 관리자 권한 확인 후 회원 삭제
        if (isAdmin(auth)) {
            // 외래 키 체크 비활성화 (데이터 삭제 시 제약조건 무시)
            jdbcTemplate.update("SET foreign_key_checks = 0");

            // 관련된 상품 및 파일 삭제 로직 (주석처리됨)
//            System.out.println("Deleting products for member ID: " + member.getMemberId());
//            List<Integer> productIds = productMapper.selectProductIdsByMemberId(member.getMemberId());
//            for (int productId : productIds) {
//                productMapper.deleteFileByProductId(productId);
//                productMapper.deleteById(productId);
//            }

            // 회원 정보 삭제
            Member db = mapper.selectById(member.getMemberId());
            if (db != null) {
                cnt = mapper.deleteById(member.getMemberId());
            }

            // 외래 키 체크 활성화
            jdbcTemplate.update("SET foreign_key_checks = 1");
        }

        System.out.println("Remove result: " + (cnt == 1 ? "Success" : "Failure"));
        return cnt == 1;
    }

    // 회원 정보 수정 메소드
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

    // 로그인 토큰 생성 메소드
    public String token(Member member) {
        Member db = mapper.selectById(member.getMemberId());
        List<String> auths = mapper.selectAuthByMemberId(member.getMemberId());
        String authsString = auths.stream()
                .collect(Collectors.joining(" "));
        if (db != null) {
            // 비밀번호 검증 후 JWT 생성
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

    // 접근 권한 확인 메소드
    public boolean hasAccess(String memberId, Authentication auth) {
        System.out.println("Member ID: " + memberId);
        System.out.println("Authenticated name: " + auth.getName());

        if ("admin".equals(auth.getName()) || isAdmin(auth)) {
            return true;
        }

        return memberId.equals(auth.getName());
    }

    // 관리자 권한 확인 메소드
    public boolean isAdmin(Authentication auth) {
        return auth.getAuthorities()
                .stream()
                .map(a -> a.toString())
                .anyMatch(s -> s.equals("SCOPE_admin"));
    }

    // 입력된 비밀번호가 데이터베이스에 저장된 비밀번호와 일치하는지 확인하는 메소드
    public boolean isPasswordCorrect(String memberId, String password) {
        Member dbMember = mapper.selectById(memberId);
        if (dbMember != null) {
            System.out.println("Stored password: " + dbMember.getPassword());
            System.out.println("Input password: " + password);

            if (dbMember.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }
}
