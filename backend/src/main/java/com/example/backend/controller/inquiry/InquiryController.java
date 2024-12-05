package com.example.backend.controller.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import com.example.backend.service.inquiry.InquiryService;
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
@RequestMapping("/api/inquiry")
public class InquiryController {

    final InquiryService service;

    // 문의하기 페이지에서 새로운 문의 등록
    @PostMapping("/add")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> add(@RequestBody Inquiry inquiry, Authentication auth) {
        String memberId = auth.getName(); // 현재 로그인한 사용자의 ID를 가져옴
        inquiry.setMemberId(memberId);
        if (service.validate(inquiry)) {
            if (service.add(inquiry)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                "text", "문의가 등록되었습니다.")));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "문의 등록에 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning",
                    "text", "제목 또는 본문이 비어 있습니다. 내용을 입력해 주세요.")));
        }
    }

    // 사용자가 작성한 문의 목록을 반환 (마이페이지용)
    @GetMapping("/mylist")
    @PreAuthorize("isAuthenticated()")
    public List<Inquiry> myList(Authentication auth) {
        if (auth == null) {
            throw new IllegalStateException("Authentication is null");
        }
        String memberId = auth.getName(); // 로그인한 사용자의 ID 가져오기
        return service.getInquiryByMemberId(memberId);
    }

    // 모든 문의 목록을 반환 (관리자용)
    @GetMapping("/list")
    @PreAuthorize("isAuthenticated()")
    public List<Inquiry> list() {
        return service.list();
    }

    // 특정 문의를 조회
    @GetMapping("view/{inquiryId}")
    @PreAuthorize("isAuthenticated()")
    public Inquiry view(@PathVariable int inquiryId) {
        return service.getInquiry(inquiryId);
    }

    // 문의에 댓글 추가
    @PostMapping("/comment/{memberId}")
    public ResponseEntity<Map<String, Object>> add(@RequestBody InquiryComment inquirycomment
            , Authentication auth) {
        List<InquiryComment> list = service.addComment(inquirycomment, auth);
        return ResponseEntity.ok().body(Map.of("list", list, "message",
                Map.of("type", "success", "text", "댓글이 등록되었습니다.")));
    }

    // 특정 문의의 모든 댓글을 조회
    @GetMapping("/comments/{inquiryId}")
    public List<InquiryComment> getComments(@PathVariable int inquiryId) {
        return service.getCommentByInquiryId(inquiryId);
    }

    // 댓글을 수정
    @PutMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> edit(
            @PathVariable int commentId,
            @RequestBody InquiryComment inquirycomment) {
        inquirycomment.setId(commentId);
        if (service.update(inquirycomment)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 수정되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 수정되지 않았습니다.")));
        }
    }

    // 댓글을 삭제
    @DeleteMapping("/comment/{commentId}")
    public ResponseEntity<Map<String, Object>> delete(
            @PathVariable int commentId) {
        if (service.deleteComment(commentId)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 삭제되지 않았습니다.")));
        }
    }
}
