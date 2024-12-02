package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;

import java.util.List;

@Mapper
public interface BoardMapper {
    @Select("""
            SELECT * 
            FROM board
            ORDER BY board_id DESC
            """)
    List<Board> selectAll();

    @Insert("""
            INSERT INTO board 
            (title, content, writer, category)
            VALUES (#{title}, #{content}, #{writer}, #{category})
            """)
    @Options(keyProperty = "boardId", useGeneratedKeys = true)
    int insert(Board board);

    @Select("""
            SELECT *
            FROM board
            WHERE board_id = #{boardId}
            """)
    Board selectById(int boardId);
}
