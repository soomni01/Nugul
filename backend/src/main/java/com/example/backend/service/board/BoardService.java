package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
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
public class BoardService {
    final BoardMapper mapper;
    final CommentMapper commentMapper;

    public Map<String, Object> list(Integer page, String searchType, String searchKeyword, String category) {
        Integer offset = (page - 1) * 10;

        List<Board> list = mapper.selectPage(offset, searchType, searchKeyword, category);

        Integer count = mapper.countAll(searchType, searchKeyword, category);
        return Map.of("list", list, "count", count);
    }

    public boolean boardAdd(Board board, Authentication authentication) {
        board.setWriter(authentication.getName());
        int cnt = mapper.insert(board);

        return cnt == 1;
    }

    public Board get(int boardId) {
        return mapper.selectById(boardId);
    }

    public boolean validate(Board board) {
        boolean title = board.getTitle().trim().length() > 0;
        boolean content = board.getContent().trim().length() > 0;

        return title && content;
    }

    public boolean remove(int boardId) {
        // 댓글 지우기
        commentMapper.deleteByBoardId(boardId);

        int cnt = mapper.deleteById(boardId);
        return cnt == 1;
    }

    public boolean update(Board board) {
        int cnt = mapper.update(board);
        return cnt == 1;
    }

    public boolean hasAccess(int boardId, Authentication authentication) {
        Board board = mapper.selectById(boardId);
        return board.getMemberId().equals(authentication.getName());
    }

    public List<Board> getBoardsByMemberId(String memberId) {
        return mapper.findBoardsByMemberId(memberId);
    }
}
