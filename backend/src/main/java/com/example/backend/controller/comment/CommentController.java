package com.example.backend.controller.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    final CommentService service;

    @PutMapping("commentEdit")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Object>> edit(
            @RequestBody Comment comment, Authentication authentication) {
        if (service.hashCode(comment.getCommentId(),authentication)){
        if (service.update(comment)) {
            return ResponseEntity.ok().body(Map.of("message",
                    Map.of("type", "success",
                            "text", "댓글이 수정되었습니다.")));
        } else {
            return ResponseEntity.internalServerError().body(Map.of("message",
                    Map.of("type", "error",
                            "text", "댓글이 수정되지 않았습니다.")));
        }
        }else {
            return ResponseEntity.status(403).build();
        }
    }

    @DeleteMapping("remove/{commentId}")
    @PreAuthorize("isAuthenticated()")
    public void remove(@PathVariable Integer commentId,Authentication authentication) {
        if (service.hashCode(commentId,authentication)){
            service.remove(commentId);
        };
    }

    @GetMapping("commentList/{boardId}")
    public List<Comment> commentList(@PathVariable Integer boardId) {
        return service.commentList(boardId);
    }

    @PostMapping("commentAdd")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String,Object>> commentAdd(@RequestBody Comment comment, Authentication authentication) {
        service.commentAdd(comment, authentication);
        return ResponseEntity.ok().body(Map.of("message",
                Map.of("type", "success",
                        "text", "새 댓글이 등록되었습니다.")));
    }
}
