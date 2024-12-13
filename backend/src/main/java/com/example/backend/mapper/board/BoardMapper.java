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
            SELECT b.board_id, b.title, b.content, b.writer AS memberId, m.nickname AS writer, b.category, b.created_at
            FROM board b
            LEFT JOIN member m ON b.writer = m.member_id
            WHERE b.board_id = #{boardId}
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
            SELECT b.board_id, b.title, b.writer AS memberId, m.nickname AS writer, b.category, b.created_at, COUNT(c.board_id) AS countComment
            FROM board b 
            LEFT JOIN comment c ON b.board_id = c.board_id
            LEFT JOIN member m ON b.writer = m.member_id
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
                    <if test="category != null and category != 'all'">
                        AND b.category = #{category}
                    </if>
                </trim>
            GROUP BY b.board_id
            ORDER BY b.board_id DESC
            LIMIT #{offset}, 10
            </script>
            """)
    List<Board> selectPage(Integer offset, String searchType, String searchKeyword, String category);

    @Select("""
            <script>
            SELECT COUNT(*)
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
                    <if test="category != null and category != 'all'">
                        AND category = #{category}
                    </if>
                </trim>
            </script>
            """)
    Integer countAll(String searchType, String searchKeyword, String category);

    @Select("""
                SELECT b.board_id, b.title, b.writer AS memberId, m.nickname AS writer,
                       b.category, b.created_at, COUNT(c.board_id) AS countComment
                FROM board b
                LEFT JOIN comment c ON b.board_id = c.board_id
                LEFT JOIN member m ON b.writer = m.member_id
                WHERE b.writer = #{memberId}
                GROUP BY b.board_id
                ORDER BY b.created_at DESC
                LIMIT #{offset}, 6
            """)
    List<Board> selectByMemberId(String memberId, Integer offset);

    @Select("""
                SELECT COUNT(*) 
                FROM board
                WHERE writer = #{memberId}
            """)
    int countBoardsByMemberId(String memberId);

    @Insert("""
            INSERT INTO board_file
                        VALUES (#{boardId}, #{fileName})
            """)
    int insertFile(Integer boardId, String fileName);

    @Select("""
            SELECT name 
            FROM board_file
            WHERE board_id = #{boardId}
            """)
    List<String> selectFilesByBoardId(int boardId);
}
