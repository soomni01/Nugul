package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void commentAdd(Comment comment, Authentication authentication) {
        comment.setMemberId(authentication.getName());
        mapper.insert(comment);
    }

    public List<Comment> commentList(Integer boardId) {
        return mapper.selectByBoardId(boardId);
    }
}
