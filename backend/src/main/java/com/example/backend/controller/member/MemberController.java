package com.example.backend.controller.member;

import com.example.backend.dto.member.Member;
import com.example.backend.service.member.MemberService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/member")
public class MemberController {

    final MemberService service;

    @GetMapping("list")
//    @PreAuthorize("hasAuthority('SCOPE_admin')")
    public List<Member> list() {
        return service.list();
    }
}
