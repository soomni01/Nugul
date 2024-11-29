package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.dto.member.MemberEdit;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {
    final MemberService service;

    @PostMapping("login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Member member) {
        String token = service.token(member);
        if (token != null) {
            return ResponseEntity.ok(Map.of("token", token,
                    "message", Map.of("type", "success",
                            "text", "로그인 되었습니다.")));
        } else {
            return ResponseEntity.status(404)
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "아이디 또는 암호를 확인해주세요")));
        }
    }

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

    @DeleteMapping("remove")
    public ResponseEntity<Map<String, Object>> remove(@RequestBody Member member) {
        if (service.remove(member)) {
            return ResponseEntity.ok(Map.of("message",
                    Map.of("type", "success",
                            "text", "회원정보를 삭제하였습니다.")));
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message",
                            Map.of("type", "warning",
                                    "text", "정확한 정보를 입력해주세요.")));
        }
    }

    @GetMapping("{memberId}")
    public Member getMember(@PathVariable String memberId) {
        return service.get(memberId);
    }

    @GetMapping("list")
//    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public List<Member> list() {
        return service.list();
    }

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

    @GetMapping(value = "check", params = "nickName")
    public ResponseEntity<Map<String, Object>> checkEmail(@RequestParam String nickName) {
        if (service.checkNickName(nickName)) {
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

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody Member member) {
        try {
            if (service.add(member)) {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success", "text", "회원 가입되었습니다.")));
            } else {
                return ResponseEntity.internalServerError().body(Map.of("message",
                        Map.of("type", "error", "text", "회원 가입 중 문제가 발생하였습니다.")));
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error", "text", "회원 가입 중 문제가 발생하였습니다.")));
        }
    }
}
