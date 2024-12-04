package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    final BoardService service;

    @PutMapping("boardUpdate")
    public ResponseEntity<Map<String, Object>> boardUpdate(@RequestBody Board board) {
        if (service.validate(board)) {
            if (service.update(board)) {
                return ResponseEntity.ok().body(Map.of("message",
                        Map.of("type", "success",
                                "text", STR."\{board.getBoardId()}번 게시물이 수정되었습니다.")));
            } else {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "error",
                                "text", STR."\{board.getBoardId()}번 게시물이 수정되지 않았습니다.")));
            }
        } else {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", Map.of("type", "warning",
                            "text", "제목이나 본문이 비어있을 수 없습니다.")));
        }
    }

    @DeleteMapping("boardDelete/{boardId}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable int boardId) {
        if (service.remove(boardId)) {
            return ResponseEntity.ok()
                    .body(Map.of("message", Map.of("type", "success"
                            , "text", STR."\{boardId}번 게시글이 삭제되었습니다.")));
        } else {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", Map.of("type", "error"
                            , "text", "게시글 삭제 중 문제가 발생하였습니다.")));
        }
    }

    @GetMapping("boardView/{boardId}")
    public Board boardView(@PathVariable int boardId) {
        return service.get(boardId);
    }

    @PostMapping("boardAdd")
    public ResponseEntity<Map<String, Object>> boardAdd(@RequestBody Board board,
                                                        Authentication authentication) {
        if (service.validate(board)) {
            if (service.boardAdd(board, authentication)) {
                return ResponseEntity.ok()
                        .body(Map.of("message", Map.of("type", "success",
                                        "text", STR."\{board.getBoardId()}번 게시물이 등록되었습니다"),
                                "data", board));
            } else {
                return ResponseEntity.internalServerError()
                        .body(Map.of("message", Map.of("type", "warning",
                                "text", "게시물 등록이 실패하였습니다.")));
            }
        } else {
            return ResponseEntity.badRequest().body(Map.of("message", Map.of("type", "warning",
                    "text", "제목이나 본문이 비어있을 수 없습니다.")));
        }
    }

    @GetMapping("list")
    public Map<String, Object> list(@RequestParam(value = "page", defaultValue = "1") Integer page,
                                    @RequestParam(value = "searchType", defaultValue = "all") String searchType,
                                    @RequestParam(value = "searchKeyword", defaultValue = "") String searchKeyword) {

        return service.list(page, searchType, searchKeyword);
    }
}
