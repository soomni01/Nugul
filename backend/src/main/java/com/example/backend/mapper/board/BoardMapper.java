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
            <script>
            SELECT board_id, title, writer, category,created_at
            FROM board
            WHERE 
                <trim prefixOverrides="OR">
                    <if test="searchType == 'all' or searchType == 'title'">
                        title LIKE CONCAT('%', #{searchKeyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'content'">
                        OR content LIKE CONCAT('%', #{searchKeyword}, '%')
                    </if>
                    <if test="searchType == 'all' or searchType == 'category'">
                        OR category LIKE CONCAT('%', #{searchKeyword}, '%')
                    </if>
                </trim>
            ORDER BY board_id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectPage(int offset, String searchType, String searchKeyword);

    @Select("""
            SELECT COUNT(*) FROM board
            """)
    Integer countAll();
}
