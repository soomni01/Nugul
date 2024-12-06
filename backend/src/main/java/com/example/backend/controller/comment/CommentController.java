package com.example.backend.controller.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.service.comment.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/comment")
public class CommentController {
    final CommentService service;

    @GetMapping("commentList/{boardId}")
    public List<Comment> commentList(@PathVariable Integer boardId) {
        return service.commentList(boardId);
    }

    @PostMapping("commentAdd")
    @PreAuthorize("isAuthenticated()")
    public void commentAdd(@RequestBody Comment comment, Authentication authentication) {
        service.commentAdd(comment, authentication);
    }
}
