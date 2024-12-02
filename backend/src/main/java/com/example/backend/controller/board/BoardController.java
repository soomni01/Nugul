package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    final BoardService service;

    @GetMapping("boardView/{boardId}")
    public Board boardView(@PathVariable int boardId) {
        return service.get(boardId);
    }

    @PostMapping("boardAdd")
    public ResponseEntity<Map<String, Object>> boardAdd(@RequestBody Board board) {
        if (service.boardAdd(board)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "success",
                                    "text", STR."\{board.getBoardId()}번 게시물이 등록되었습니다"),
                            "data", board));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "게시물 등록이 실패하였습니다.")));
        }
    }

    @GetMapping("list")
    public List<Board> list() {
        return service.list();
    }
}
