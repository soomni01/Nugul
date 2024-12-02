package com.example.backend.controller.inquiry;

import com.example.backend.dto.inquiry.Inquiry;
import com.example.backend.dto.inquiry.InquiryComment;
import com.example.backend.service.inquiry.InquiryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/list")
    public List<Inquiry> list() {
        return service.list();
    }

    @GetMapping("view/{inquiryId}")
    public Inquiry view(@PathVariable int inquiryId) {
        return service.getInquiry(inquiryId);
    }

    @PostMapping("/comment/{memberId}")
    public ResponseEntity<Map<String, Object>> add(@RequestBody InquiryComment inquirycomment
            , Authentication auth) {
        service.addComment(inquirycomment, auth);
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success", "text", "댓글이 등록되었습니다.")));
    }

    @GetMapping("/comments/{inquiryId}")
    public List<InquiryComment> getComments(@PathVariable int inquiryId) {
        return service.getCommentByInquiryId(inquiryId);
    }

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
