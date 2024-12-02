package com.example.backend.mapper.board;

import com.example.backend.dto.board.Board;
import org.apache.ibatis.annotations.*;

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


    @Delete("""
            DELETE FROM board
            WHERE board_id = #{boardId}
            """)
    int deleteById(int boardId);

    @Update("""
            UPDATE board
            SET title=#{title}, 
                content=#{content}
            WHERE board_id = #{boardId}
            """)
    int update(Board board);

    @Select("""
            SELECT board_id, title, writer, category,created_at
            FROM board
            ORDER BY board_id DESC
            LIMIT #{offset}, 10
            """)
    List<Board> selectPage(int offset);

    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();
}
