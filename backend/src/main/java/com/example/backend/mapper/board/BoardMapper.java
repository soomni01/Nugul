package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("""
                        SELECT * FROM
                         prj1126.board
                        ORDER BY board_id DESC
            """)
    List<Board> selectAll();
}
