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

    public List<Comment> commentList(Integer boardId, Integer page) {
        Integer offset = (page - 1) * 10;
        return mapper.selectByBoardId(boardId,offset);
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
