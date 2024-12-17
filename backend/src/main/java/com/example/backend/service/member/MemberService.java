package com.example.backend.service.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.mapper.member.MemberMapper;
import com.example.backend.mapper.product.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
public class MemberService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    final MemberMapper mapper;
    private final ProductMapper productMapper;
    final JwtEncoder jwtEncoder;

    @Value("${naver.client.id}")
    private String clientId;

    @Value("${naver.client.secret}")
    private String clientSecret;

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

        int cnt = 0;

        // 회원 정보 삭제
        Member db = mapper.selectById(member.getMemberId());
        if (db != null) {

            // 쓴 상품 목록 얻기
            List<Integer> products = productMapper.getProductId(member.getMemberId());

            // 각 상품 지우기
            for (Integer productId : products) {
                productMapper.deleteById(productId);
            }

            // 좋아요 목록 지우기
            List<Integer> likes = productMapper.likedProductByMemberId(member.getMemberId());
            for (Integer productId : likes) {
                productMapper.deleteLike(productId);
            }

//            // 구매 목록 지우기
//            List<Integer> purchased = mypageMapper.purchasedProductByMemberId(member.getMemberId());
//            for (Integer productId : purchased) {
//                mypageMapper.deletePurchased(productId);
//            }
            cnt = mapper.deleteById(member.getMemberId());
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
        // 1. 일반 사용자 로직
        Member db = mapper.selectById(member.getMemberId());
        if (db != null && member.getPassword() != null) {
            // 비밀번호 검증 후 JWT 생성
            if (db.getPassword().equals(member.getPassword())) {
                return generateJwtToken(db.getMemberId(), db.getNickname(), mapper.selectAuthByMemberId(db.getMemberId()));
            }
        }

        // 2. 카카오 로그인 사용자 처리
        if (member.getPassword() == null) { // 비밀번호 없이 로그인 요청한 경우
            db = mapper.selectById(member.getMemberId());
            if (db != null) {
                return generateJwtToken(db.getMemberId(), db.getNickname(), mapper.selectAuthByMemberId(db.getMemberId()));
            }
        }

        // 3. 인증 실패 시
        return null;
    }

    // JWT 토큰 생성 로직 분리
    private String generateJwtToken(String memberId, String nickname, List<String> auths) {
        String authsString = auths.stream().collect(Collectors.joining(" "));
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("self")
                .subject(memberId)
                .issuedAt(Instant.now())
                .expiresAt(Instant.now().plusSeconds(3600))
                .claim("nickname", nickname)
                .claim("scope", authsString)
                .build();

        return jwtEncoder.encode(JwtEncoderParameters.from(claims)).getTokenValue();
    }

    // 입력된 비밀번호가 데이터베이스에 저장된 비밀번호와 일치하는지 확인하는 메소드
    public boolean isPasswordCorrect(String memberId, String password) {
        Member dbMember = mapper.selectById(memberId);
        if (dbMember != null) {
            if (dbMember.getPassword().equals(password)) {
                return true;
            }
        }
        return false;
    }

    // 입력된 카카오 이메일이 데이터베이스에 저장된 이메일과 일치하는지 확인하는 메소드
    public boolean isEmailCorrect(String memberId, String email) {
        Member dbMember = mapper.selectById(memberId);
        if (dbMember != null) {
            if (dbMember.getMemberId().equals(email)) {
                return true;
            }
        }
        return false;
    }

    // 카카오 로그인 시 이메일 확인
    public boolean emailCheck(String email) {
        int cnt = mapper.emailCheck(email);

        return cnt == 1;
    }

    // 네이버 로그인
    public Member handleNaverLogin(String code, String state) {
        RestTemplate restTemplate = new RestTemplate();

        // 1. 네이버로부터 액세스 토큰 요청
        String tokenUrl = "https://nid.naver.com/oauth2.0/token?grant_type=authorization_code"
                + "&client_id=" + clientId
                + "&client_secret=" + clientSecret
                + "&code=" + code
                + "&state=" + state;

        Map<String, Object> tokenResponse = restTemplate.getForObject(tokenUrl, Map.class);

        if (tokenResponse == null || !tokenResponse.containsKey("access_token")) {
            throw new RuntimeException("네이버 액세스 토큰 발급 실패");
        }

        String accessToken = (String) tokenResponse.get("access_token");

        // 2. 액세스 토큰으로 사용자 정보 요청
        String profileUrl = "https://openapi.naver.com/v1/nid/me";

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + accessToken);
        HttpEntity<String> entity = new HttpEntity<>("", headers);

        ResponseEntity<Map> responseEntity = restTemplate.exchange(
                profileUrl,
                HttpMethod.GET,
                entity,
                Map.class
        );

        Map<String, Object> profileResponse = responseEntity.getBody();
        System.out.println("Profile Response: " + profileResponse);

        if (profileResponse == null || !"00".equals(profileResponse.get("resultcode"))) {
            throw new RuntimeException("네이버 사용자 정보 요청 실패");
        }

        Map<String, Object> userProfile = (Map<String, Object>) profileResponse.get("response");

        if (userProfile == null) {
            throw new RuntimeException("네이버 사용자 정보가 없습니다.");
        }

        // 사용자 정보 매핑
        Member member = new Member();
        member.setMemberId((String) userProfile.get("email"));
        member.setNickname((String) userProfile.get("name"));
        member.setProfileImage((String) userProfile.get("profile_image"));

        return member;
    }
}

