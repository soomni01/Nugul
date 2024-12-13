package com.example.backend.service.board;

import com.example.backend.dto.board.Board;
import com.example.backend.mapper.board.BoardMapper;
import com.example.backend.mapper.comment.CommentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
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

    public boolean boardAdd(Board board, MultipartFile[] files, Authentication authentication) {
        board.setWriter(authentication.getName());
        int cnt = mapper.insert(board);

        if (files != null && files.length > 0) {
            //폴더 만들기
            String directory = STR."C:/Temp/prj1126/boardFiles/\{board.getBoardId()}";
            File dir = new File(directory);
            if (!dir.exists()) {
                dir.mkdirs();
            }
            // 파일 업로드
            // TODO : local -> aws
            for (MultipartFile file : files) {

                String filePath = STR."C:/Temp/prj1126/boardFiles/\{board.getBoardId()}/\{file.getOriginalFilename()}";
                try {
                    file.transferTo(new File(filePath));
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // board_file 테이블에 파일명 입력
                mapper.insertFile(board.getBoardId(), file.getOriginalFilename());

            }

        }

        return cnt == 1;
    }

    public Board get(int boardId) {
        Board board = mapper.selectById(boardId);
        board.setFileSrc(mapper.selectFilesByBoardId(boardId));
        /*List<BoardFile> fileSrcList = fileNameList.stream()
                .map(name -> new BoardFile(name, STR."http://172.30.1.2:8080/\{boardId}/\{name}"))
                .toList();

        board.setFileList(fileSrcList);*/
        return board;
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

    public List<Board> selectByMemberId(String memberId, Integer boardPages) {
        Integer offset = (boardPages - 1) * 6;
        return mapper.selectByMemberId(memberId, offset);
    }

    public int getBoardCountByMemberId(String memberId) {
        return mapper.countBoardsByMemberId(memberId);
    }
}
