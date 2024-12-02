package com.example.backend.controller.board;

import com.example.backend.dto.board.Board;
import com.example.backend.service.board.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/board")
@RequiredArgsConstructor
public class BoardController {
    final BoardService service;

    @PostMapping("boardAdd")
    public void boardAdd(@RequestBody Board board) {
        service.boardAdd(board);
    }

    @GetMapping("list")
    public List<Board> list() {
        return service.list();
    }
}
