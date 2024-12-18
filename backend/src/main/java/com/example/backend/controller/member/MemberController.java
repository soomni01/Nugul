package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;

    // 로그인 요청 처리
    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member) {
        String token = service.token(member);

        if (token != null) {
            return ResponseEntity.ok(Map.of("token", token,
                    "message", Map.of("type", "success",
                            "text", "로그인에 성공하였습니다.")));
        } else {
            return ResponseEntity.status(404)
                    .body(Map.of("message", Map.of("type", "error",
                            "text", "이메일 또는 비밀번호를 확인해 주세요.")));
        }
    }

    // 회원 정보 수정 요청 처리
    @PutMapping("update")
    public ResponseEntity<Map<String, Object>> update(@RequestBody MemberEdit member) {
        if (service.update(member)) {
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success",
                            "text", "회원정보를 수정하였습니다.")));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            Map.of("type", "warning",
                                    "text", "정확한 정보를 입력해주세요.")));
        }
    }

    // 회원 탈퇴 요청 처리
    @DeleteMapping("remove")
    @PreAuthorize("isAuthenticated() or hasAuthority('SCOPE_admin')")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Member member, Authentication auth) {

        // 인증된 사용자의 이름 (사용자 ID) 가져오기
        String username = auth.getName();

        // 회원이 비밀번호를 제공했을 때, 비밀번호 검증
        if (member.getPassword() != null && !member.getPassword().isEmpty()) {
            if (!service.isPasswordCorrect(username, member.getPassword())) {
                return ResponseEntity.status(403).body(Map.of("message",
                        Map.of("type", "error", "text", "비밀번호가 일치하지 않습니다.")));
            }
        } else {
            // 카카오 로그인 사용자일 경우 이메일로 검증
            if (member.getMemberId() != null && !member.getMemberId().isEmpty()) {
                if (!service.isEmailCorrect(username, member.getMemberId())) {
                    return ResponseEntity.status(403).body(Map.of("message",
                            Map.of("type", "error", "text", "이메일이 일치하지 않습니다.")));
                }
            }
        }

        if (service.remove(member, auth)) {
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success", "text", "회원정보를 삭제하였습니다.")));
        } else {
            return ResponseEntity.badRequest().body(Map.of("message",
                    Map.of("type", "warning", "text", "정확한 정보를 입력해주세요.")));
        }
    }

    @GetMapping("{id}")
    public Member getMember(@PathVariable String id) {
        return service.get(id);
    }

    // 관리자 전용 회원 목록 요청 처리
    @GetMapping("list")
    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public List<Member> list() {
        return service.list();
    }

    // 아이디 중복 체크 요청 처리
    @GetMapping(value = "check", params = "id")
    public ResponseEntity<Map<String, Object>> check(@RequestParam String id) {
        if (service.checkId(id)) {
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "warning", "text", "이미 사용중인 아이디 입니다."),
                    "available", false)
            );
        } else {
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "info", "text", "사용 가능한 아이디 입니다."),
                    "available", true));
        }
    }

    // 별명 중복 체크 요청 처리
    @GetMapping(value = "check", params = "nickname")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String nickname) {
        if (service.checkNickName(nickname)) {
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "warning", "text", "이미 사용중인 별명 입니다."),
                    "available", false)
            );
        } else {
            return ResponseEntity.ok().body(Map.of(
                    "message", Map.of("type", "info", "text", "사용 가능한 별명 입니다."),
                    "available", true));
        }
    }

    // 회원 가입 요청 처리
    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {
        try {
            if (service.add(member)) {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success", "text", "회원 가입되었습니다.")));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message",
                        Map.of("type", "error", "text", "이미 사용 중인 이메일입니다.")));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error", "text", "회원 가입 중 문제가 발생하였습니다.")));
        }
    }

    // 카카오 로그인 시 이메일 확인
    @GetMapping("/check-email")
    public boolean emailCheck(@RequestParam String email) {
        return service.emailCheck(email);
    }

    // 네이버 로그인 요청 처리
    @PostMapping("naver/oauth")
    public ResponseEntity<Map<String, Object>> naverLogin(@RequestBody Map<String, String> request) {
        String code = request.get("code");
        String state = request.get("state");
        if (code == null || state == null) {
            System.out.println("null 존재");
        }
        try {
            // 네이버 API에서 액세스 토큰과 사용자 정보를 가져오는 서비스 호출
            Map<String, Object> result = service.handleNaverLogin(code, state);

            // 액세스 토큰과 사용자 정보 (Member) 모두 반환
            String accessToken = (String) result.get("accessToken");
            Member member = (Member) result.get("member");

            // 이메일로 기존 회원 확인
            boolean isExistingMember = service.emailCheck(member.getMemberId());

            if (isExistingMember) {
                // 이미 회원인 경우, 로그인 후 /main으로 리디렉션
                return ResponseEntity.ok(Map.of(
                        "message", "로그인 성공",
                        "naverAccessToken", accessToken,
                        "redirectUrl", "/main",
                        "member", member,
                        "platform", "naver"
                ));
            } else {
                // 회원이 아닌 경우, /member/kakao로 리디렉션
                return ResponseEntity.ok(Map.of(
                        "message", "회원가입이 필요합니다.",
                        "redirectUrl", "/member/social",
                        "member", member,
                        "platform", "naver"
                ));
            }

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "message", "네이버 로그인에 실패하였습니다."
            ));
        }
    }
}