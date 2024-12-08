package com.example.backend.service.comment;

import com.example.backend.dto.comment.Comment;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {
    final CommentMapper mapper;

    public void commentAdd(Comment comment, Authentication authentication) {
        comment.setMemberId(authentication.getName());
        mapper.insert(comment);
    }

    public Map<String, Object> commentList(Integer boardId, Integer page) {
        return Map.of("list", mapper.selectCommentPage(boardId,(page - 1) * 10),
                "count", mapper.countByBoardId(boardId));
    }

    public boolean hashCode(Integer commentId, Authentication authentication) {
        Comment comment = mapper.selectById(commentId);
        return comment.getMemberId().equals(authentication.getName());
    }

    public boolean remove(Integer commentId) {
        int cnt = mapper.deleteById(commentId);
        return cnt == 1;
    }

    public boolean update(Comment comment) {
        int cnt = mapper.update(comment);
        return cnt == 1;
    }
}
